import Jimp from 'jimp';
import path from 'path';

interface AsciiOptions {
  width?: number;
  height?: number;
  chars?: string;
}

export class ASCIIConverter {
  private chars: string;
  
  constructor(chars: string = ' .:-=+*#%@') {
    this.chars = chars;
  }

  async convertImageToAscii(imagePath: string, options: AsciiOptions = {}): Promise<string> {
    const { width = 80, height, chars = this.chars } = options;
    
    try {
      const image = await Jimp.read(imagePath);
      
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
      
      return asciiArt;
    } catch (error) {
      throw new Error(`Failed to convert image to ASCII: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async invertColors(imagePath: string): Promise<string> {
    try {
      const image = await Jimp.read(imagePath);
      image.invert();
      
      const timestamp = Date.now();
      const originalName = path.basename(imagePath, path.extname(imagePath));
      const invertedImagePath = `./inverted-${originalName}-${timestamp}.png`;
      
      await image.writeAsync(invertedImagePath);
      return invertedImagePath;
    } catch (error) {
      throw new Error(`Failed to invert image colors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async enhanceContrast(imagePath: string, level: number = 0.5): Promise<string> {
    try {
      const image = await Jimp.read(imagePath);
      image.contrast(level);
      
      const timestamp = Date.now();
      const originalName = path.basename(imagePath, path.extname(imagePath));
      const enhancedImagePath = `./enhanced-${originalName}-${timestamp}.png`;
      
      await image.writeAsync(enhancedImagePath);
      return enhancedImagePath;
    } catch (error) {
      throw new Error(`Failed to enhance contrast: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async adjustBrightness(imagePath: string, level: number = 0.2): Promise<string> {
    try {
      const image = await Jimp.read(imagePath);
      image.brightness(level);
      
      const timestamp = Date.now();
      const originalName = path.basename(imagePath, path.extname(imagePath));
      const brightImagePath = `./bright-${originalName}-${timestamp}.png`;
      
      await image.writeAsync(brightImagePath);
      return brightImagePath;
    } catch (error) {
      throw new Error(`Failed to adjust brightness: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Simple standalone function to test the image conversion
async function testASCIIConversion() {
  const converter = new ASCIIConverter();
  const imagePath = './assets/WIN_20250919_19_52_29_Pro.jpg';
  
  console.log('🎨 ASCII Art Conversion Test');
  console.log('=' .repeat(60));
  
  try {
    // Test basic conversion
    console.log('\n📸 Converting original image...');
    const originalAscii = await converter.convertImageToAscii(imagePath, { width: 120 });
    console.log('\n✨ Original Image ASCII Art:');
    console.log(originalAscii);
    
    // Test with enhanced contrast
    console.log('\n🔧 Enhancing contrast...');
    const enhancedPath = await converter.enhanceContrast(imagePath, 0.7);
    const enhancedAscii = await converter.convertImageToAscii(enhancedPath, { width: 120 });
    console.log('\n🎯 Enhanced Contrast ASCII Art:');
    console.log(enhancedAscii);
    
    // Test with inverted colors
    console.log('\n🔄 Inverting colors...');
    const invertedPath = await converter.invertColors(imagePath);
    const invertedAscii = await converter.convertImageToAscii(invertedPath, { width: 120 });
    console.log('\n🎭 Inverted Colors ASCII Art:');
    console.log(invertedAscii);
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ ASCII art conversion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during conversion:', error);
  }
}

if (require.main === module) {
  testASCIIConversion();
}

export { testASCIIConversion };