import { tool } from 'ai';
import { z } from 'zod';
import Jimp from 'jimp';

export const imageToAscii = tool({
  description: 'Converts an image to ASCII art using character density mapping.',
  parameters: z.object({
    imageUrl: z.string().describe('The URL or file path of the image to convert.'),
    width: z.number().optional().describe('Width of the ASCII output (default: 80)'),
    height: z.number().optional().describe('Height of the ASCII output (default: auto)'),
    chars: z.string().optional().describe('Characters to use for ASCII art (default: gradient)')
  }),
  execute: async (params: any) => {
    const { imageUrl, width = 80, height, chars = ' .:-=+*#%@' } = params;
    try {
      const image = await Jimp.read(imageUrl);
      
      // Calculate aspect ratio
      const aspectRatio = image.bitmap.width / image.bitmap.height;
      const outputHeight = height || Math.floor(width / aspectRatio / 2); // Divide by 2 for character aspect ratio
      
      // Resize image
      image.resize(width, outputHeight);
      
      // Convert to grayscale
      image.greyscale();
      
      let asciiArt = '';
      const charArray = chars.split('');
      const charCount = charArray.length - 1;
      
      for (let y = 0; y < outputHeight; y++) {
        for (let x = 0; x < width; x++) {
          const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
          const brightness = pixel.r; // Already grayscale, so r = g = b
          const charIndex = Math.floor((brightness / 255) * charCount);
          asciiArt += charArray[charIndex];
        }
        asciiArt += '\n';
      }
      
      return { 
        asciiArt: asciiArt,
        dimensions: `${width}x${outputHeight}`,
        characters: chars.length
      };
    } catch (error) {
      return { error: `Failed to convert image to ASCII: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },
});