import { tool } from 'ai';
import { z } from 'zod';
import Jimp from 'jimp';

// Enhanced character sets for different purposes
const characterSets = {
  minimal: ' .-#',
  standard: ' .:-=+*#%@',
  dense: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  artistic: ' ░▒▓█',
  blocks: ' ▁▂▃▄▅▆▇█',
  dots: ' ·∵∴∷⁖⁘⁙⁛⁜',
  custom: ' .,:;irsXA253hMHGS#9B&@'
};

function addArtisticFraming(asciiArt: string, style: 'simple' | 'double' | 'artistic' = 'simple'): string {
  const lines = asciiArt.split('\n');
  const maxWidth = Math.max(...lines.map(line => line.length));
  
  if (style === 'double') {
    const border = '═'.repeat(maxWidth + 4);
    return `╔${border}╗\n${lines.map(line => `║  ${line.padEnd(maxWidth)}  ║`).join('\n')}\n╚${border}╝`;
  } else if (style === 'artistic') {
    const border = '─'.repeat(maxWidth + 4);
    return `┌${border}┐\n${lines.map(line => `│  ${line.padEnd(maxWidth)}  │`).join('\n')}\n└${border}┘`;
  } else {
    const border = '-'.repeat(maxWidth + 2);
    return `+${border}+\n${lines.map(line => `|${line.padEnd(maxWidth + 2)}|`).join('\n')}\n+${border}+`;
  }
}

export const imageToAscii = tool({
  description: 'Converts an image to ASCII art using character density mapping with multiple character set options.',
  inputSchema: z.object({
    imageUrl: z.string().describe('The URL or file path of the image to convert.'),
    width: z.number().optional().describe('Width of the ASCII output (default: 80)'),
    height: z.number().optional().describe('Height of the ASCII output (default: auto)'),
    characterSet: z.enum(['minimal', 'standard', 'dense', 'artistic', 'blocks', 'dots', 'custom']).optional().describe('Character set style (default: standard)'),
    customChars: z.string().optional().describe('Custom character set if characterSet is "custom"'),
    framing: z.enum(['none', 'simple', 'double', 'artistic']).optional().describe('ASCII art framing style (default: none)'),
    invert: z.boolean().optional().describe('Invert the ASCII art (default: false)')
  }),
  execute: async ({ imageUrl, width = 80, height, characterSet = 'standard', customChars, framing = 'none', invert = false }) => {
    try {
      const image = await Jimp.read(imageUrl);
      
      // Calculate aspect ratio
      const aspectRatio = image.bitmap.width / image.bitmap.height;
      const outputHeight = height || Math.floor(width / aspectRatio / 2); // Divide by 2 for character aspect ratio
      
      // Resize image
      image.resize(width, outputHeight);
      
      // Convert to grayscale
      image.greyscale();
      
      // Get character set
      let chars: string;
      if (characterSet === 'custom' && customChars) {
        chars = customChars;
      } else {
        chars = characterSets[characterSet] || characterSets.standard;
      }
      
      let asciiArt = '';
      const charArray = chars.split('');
      const charCount = charArray.length - 1;
      
      for (let y = 0; y < outputHeight; y++) {
        for (let x = 0; x < width; x++) {
          const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
          let brightness = pixel.r; // Already grayscale, so r = g = b
          
          // Apply inversion if requested
          if (invert) {
            brightness = 255 - brightness;
          }
          
          const charIndex = Math.floor((brightness / 255) * charCount);
          asciiArt += charArray[charIndex];
        }
        asciiArt += '\n';
      }
      
      // Apply framing if requested
      if (framing !== 'none') {
        asciiArt = addArtisticFraming(asciiArt, framing as 'simple' | 'double' | 'artistic');
      }
      
      return { 
        asciiArt: asciiArt,
        dimensions: `${width}x${outputHeight}`,
        characterSet: characterSet,
        charactersUsed: chars.length,
        framing: framing,
        inverted: invert,
        settings: {
          width,
          height: outputHeight,
          aspectRatio: Math.round(aspectRatio * 100) / 100,
          characterSet,
          chars: chars.length > 20 ? `${chars.substring(0, 20)}...` : chars
        }
      };
    } catch (error) {
      return { error: `Failed to convert image to ASCII: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },
});