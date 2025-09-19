import Jimp from 'jimp';
import * as fs from 'fs';
import * as path from 'path';

interface ASCII4KOptions {
  width?: number;
  height?: number;
  chars?: string;
  useAdvancedMapping?: boolean;
  useEdgeDetection?: boolean;
  useAntiAliasing?: boolean;
  outputFile?: string;
  terminalWidth?: number;
}

// Ultra-dense character sets optimized for 4K ASCII
const CHARACTER_SETS = {
  minimal: ' .-#',
  standard: ' .:-=+*#%@',
  dense: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  ultradense: ' .",:;iI!<>~+_-?]{}()|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$▁▂▃▄▅▆▇█░▒▓',
  artistic: ' ░▒▓█',
  blocks: ' ▁▂▃▄▅▆▇█',
  gradient: ' .:░▒▓██',
  unicode: ' ·∵∴∷⁖⁘⁙⁛⁜‖‗\'\'""…‰‱‴‵‶‷‸‹›※‼‽‾‿⁀⁁⁂⁃⁄⁅⁆⁇⁈⁉⁊⁋⁌⁍⁎⁏⁐⁑⁒⁓⁔⁕⁰ⁱ⁲⁳⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿ',
  professional: ' .,:;irsXA253hMHGS#9B&@'
};

export class ASCII4KConverter {
  private chars: string;
  
  constructor(chars: string = CHARACTER_SETS.ultradense) {
    this.chars = chars;
  }

  /**
   * Advanced brightness calculation with gamma correction
   */
  private calculateBrightness(r: number, g: number, b: number): number {
    // Use luminance formula with gamma correction for better perceptual accuracy
    const gamma = 2.2;
    const rLinear = Math.pow(r / 255, gamma);
    const gLinear = Math.pow(g / 255, gamma);
    const bLinear = Math.pow(b / 255, gamma);
    
    // ITU-R BT.709 luminance weights
    const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    return Math.pow(luminance, 1/gamma) * 255;
  }

  /**
   * Edge detection using Sobel operator
   */
  private detectEdges(image: Jimp, x: number, y: number): number {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Sobel kernels
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    
    let gx = 0, gy = 0;
    
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const px = Math.max(0, Math.min(width - 1, x + dx));
        const py = Math.max(0, Math.min(height - 1, y + dy));
        
        const pixel = Jimp.intToRGBA(image.getPixelColor(px, py));
        const brightness = this.calculateBrightness(pixel.r, pixel.g, pixel.b);
        
        gx += brightness * sobelX[dy + 1][dx + 1];
        gy += brightness * sobelY[dy + 1][dx + 1];
      }
    }
    
    return Math.sqrt(gx * gx + gy * gy);
  }

  /**
   * Advanced character mapping with edge detection and pattern recognition
   */
  private mapToCharacter(image: Jimp, x: number, y: number, useEdgeDetection: boolean = false): string {
    const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
    let brightness = this.calculateBrightness(pixel.r, pixel.g, pixel.b);
    
    // Apply edge detection if enabled
    if (useEdgeDetection) {
      const edgeStrength = this.detectEdges(image, x, y);
      // Boost brightness for edges to make them more prominent
      if (edgeStrength > 30) {
        brightness = Math.min(255, brightness + edgeStrength * 0.5);
      }
    }
    
    const charArray = this.chars.split('');
    const charCount = charArray.length - 1;
    const charIndex = Math.floor((brightness / 255) * charCount);
    
    return charArray[charIndex];
  }

  /**
   * Anti-aliasing using bilinear interpolation
   */
  private getAntiAliasedBrightness(image: Jimp, x: number, y: number): number {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Get fractional parts
    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    
    // Get integer coordinates
    const x1 = Math.floor(x);
    const y1 = Math.floor(y);
    const x2 = Math.min(x1 + 1, width - 1);
    const y2 = Math.min(y1 + 1, height - 1);
    
    // Get pixels at corners
    const p11 = Jimp.intToRGBA(image.getPixelColor(x1, y1));
    const p12 = Jimp.intToRGBA(image.getPixelColor(x1, y2));
    const p21 = Jimp.intToRGBA(image.getPixelColor(x2, y1));
    const p22 = Jimp.intToRGBA(image.getPixelColor(x2, y2));
    
    // Calculate brightness for each pixel
    const b11 = this.calculateBrightness(p11.r, p11.g, p11.b);
    const b12 = this.calculateBrightness(p12.r, p12.g, p12.b);
    const b21 = this.calculateBrightness(p21.r, p21.g, p21.b);
    const b22 = this.calculateBrightness(p22.r, p22.g, p22.b);
    
    // Bilinear interpolation
    const b1 = b11 * (1 - fx) + b21 * fx;
    const b2 = b12 * (1 - fx) + b22 * fx;
    return b1 * (1 - fy) + b2 * fy;
  }

  /**
   * Convert image to 4K resolution ASCII art
   */
  async convert4KImageToAscii(imagePath: string, options: ASCII4KOptions = {}): Promise<{
    ascii: string;
    dimensions: string;
    outputFile?: string;
    stats: {
      processingTime: number;
      memoryUsage: number;
      characterCount: number;
      compressionRatio: number;
    }
  }> {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();

    const {
      width = 2000, // 4K-scale width
      height,
      chars = this.chars,
      useAdvancedMapping = true,
      useEdgeDetection = true,
      useAntiAliasing = true,
      outputFile,
      terminalWidth = 200 // Fallback for terminal display
    } = options;

    try {
      console.log(`🚀 Starting 4K ASCII conversion (target width: ${width})`);
      const image = await Jimp.read(imagePath);
      
      console.log(`📐 Original image: ${image.bitmap.width}x${image.bitmap.height}`);
      
      // Calculate aspect ratio and output dimensions
      const aspectRatio = image.bitmap.width / image.bitmap.height;
      const outputHeight = height || Math.floor(width / aspectRatio / 2); // Character aspect ratio correction
      
      console.log(`🎯 Target ASCII: ${width}x${outputHeight} characters`);
      
      // For very high resolutions, we'll use the original image size and sample directly
      // This preserves maximum detail instead of resizing first
      let workingImage = image.clone();
      
      // Convert to grayscale with enhanced contrast
      workingImage.greyscale().contrast(0.1);
      
      let asciiArt = '';
      const charArray = chars.split('');
      const charCount = charArray.length - 1;
      
      // Calculate sampling ratios
      const xRatio = workingImage.bitmap.width / width;
      const yRatio = workingImage.bitmap.height / outputHeight;
      
      console.log(`🔍 Sampling ratios: x=${xRatio.toFixed(2)}, y=${yRatio.toFixed(2)}`);
      
      // Progress tracking for large conversions
      const progressInterval = Math.max(1, Math.floor(outputHeight / 20));
      
      for (let y = 0; y < outputHeight; y++) {
        if (y % progressInterval === 0) {
          const progress = ((y / outputHeight) * 100).toFixed(1);
          console.log(`📊 Progress: ${progress}% (${y}/${outputHeight} rows)`);
        }
        
        for (let x = 0; x < width; x++) {
          // Calculate source coordinates
          const srcX = x * xRatio;
          const srcY = y * yRatio;
          
          let brightness: number;
          
          if (useAntiAliasing && (xRatio > 1 || yRatio > 1)) {
            // Use anti-aliasing for downsampling
            brightness = this.getAntiAliasedBrightness(workingImage, srcX, srcY);
          } else {
            // Direct sampling
            const pixelX = Math.floor(srcX);
            const pixelY = Math.floor(srcY);
            const pixel = Jimp.intToRGBA(workingImage.getPixelColor(pixelX, pixelY));
            brightness = this.calculateBrightness(pixel.r, pixel.g, pixel.b);
          }
          
          // Apply edge detection if enabled
          if (useEdgeDetection && useAdvancedMapping) {
            const pixelX = Math.floor(srcX);
            const pixelY = Math.floor(srcY);
            const edgeStrength = this.detectEdges(workingImage, pixelX, pixelY);
            
            if (edgeStrength > 20) {
              brightness = Math.min(255, brightness + edgeStrength * 0.3);
            }
          }
          
          // Map to character
          const charIndex = Math.floor((brightness / 255) * charCount);
          asciiArt += charArray[charIndex];
        }
        asciiArt += '\n';
      }
      
      // Calculate statistics
      const endTime = Date.now();
      const endMemory = process.memoryUsage();
      const processingTime = endTime - startTime;
      const memoryUsage = endMemory.heapUsed - startMemory.heapUsed;
      const characterCount = asciiArt.length;
      const compressionRatio = characterCount / (image.bitmap.width * image.bitmap.height);
      
      // Save to file if requested
      let savedFile: string | undefined;
      if (outputFile) {
        const outputPath = outputFile.endsWith('.txt') ? outputFile : `${outputFile}.txt`;
        await fs.promises.writeFile(outputPath, asciiArt, 'utf8');
        savedFile = outputPath;
        console.log(`💾 Saved 4K ASCII to: ${savedFile}`);
      }
      
      // Create terminal-friendly version if the output is too wide
      let terminalAscii = asciiArt;
      if (width > terminalWidth) {
        console.log(`📱 Creating terminal-friendly version (width: ${terminalWidth})`);
        const terminalHeight = Math.floor(outputHeight * (terminalWidth / width));
        terminalAscii = await this.createResizedVersion(asciiArt, width, outputHeight, terminalWidth, terminalHeight);
      }
      
      const stats = {
        processingTime,
        memoryUsage: Math.round(memoryUsage / 1024 / 1024 * 100) / 100, // MB
        characterCount,
        compressionRatio: Math.round(compressionRatio * 10000) / 10000
      };
      
      console.log(`✅ 4K ASCII conversion complete!`);
      console.log(`📊 Stats: ${processingTime}ms, ${stats.memoryUsage}MB, ${characterCount} chars`);
      
      return {
        ascii: width > terminalWidth ? terminalAscii : asciiArt,
        dimensions: `${width}x${outputHeight}`,
        outputFile: savedFile,
        stats
      };
      
    } catch (error) {
      throw new Error(`Failed to convert image to 4K ASCII: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a resized version of ASCII art for terminal display
   */
  private async createResizedVersion(ascii: string, srcWidth: number, srcHeight: number, targetWidth: number, targetHeight: number): Promise<string> {
    const lines = ascii.split('\n').filter(line => line.length > 0);
    const result: string[] = [];
    
    const xRatio = srcWidth / targetWidth;
    const yRatio = srcHeight / targetHeight;
    
    for (let y = 0; y < targetHeight; y++) {
      let line = '';
      for (let x = 0; x < targetWidth; x++) {
        const srcX = Math.floor(x * xRatio);
        const srcY = Math.floor(y * yRatio);
        
        if (srcY < lines.length && srcX < lines[srcY].length) {
          line += lines[srcY][srcX];
        } else {
          line += ' ';
        }
      }
      result.push(line);
    }
    
    return result.join('\n');
  }

  /**
   * Create multiple resolution variants
   */
  async createMultiResolutionOutput(imagePath: string, outputDir: string = './ascii_output'): Promise<{
    variants: Array<{
      resolution: string;
      width: number;
      height: number;
      file: string;
      stats: any;
    }>;
    summary: string;
  }> {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const baseName = path.basename(imagePath, path.extname(imagePath));
    const variants = [];
    
    // Different resolution targets
    const resolutions = [
      { name: '4K Ultra', width: 2000 },
      { name: '4K High', width: 1600 },
      { name: '2K', width: 1200 },
      { name: 'HD', width: 800 },
      { name: 'Standard', width: 400 },
      { name: 'Terminal', width: 120 }
    ];
    
    console.log(`🎨 Creating multi-resolution ASCII variants for ${baseName}`);
    
    for (const res of resolutions) {
      console.log(`\n📐 Processing ${res.name} (${res.width} chars wide)...`);
      
      const outputFile = path.join(outputDir, `${baseName}_${res.name.replace(' ', '_').toLowerCase()}.txt`);
      
      const result = await this.convert4KImageToAscii(imagePath, {
        width: res.width,
        outputFile,
        useAdvancedMapping: true,
        useEdgeDetection: true,
        useAntiAliasing: true
      });
      
      variants.push({
        resolution: res.name,
        width: res.width,
        height: parseInt(result.dimensions.split('x')[1]),
        file: outputFile,
        stats: result.stats
      });
    }
    
    // Create summary
    const summary = `Multi-Resolution ASCII Art Gallery\n${'='.repeat(50)}\n` +
      variants.map(v => 
        `${v.resolution.padEnd(12)} | ${v.width}x${v.height} | ${v.stats.processingTime}ms | ${v.file}`
      ).join('\n');
    
    const summaryFile = path.join(outputDir, `${baseName}_summary.txt`);
    await fs.promises.writeFile(summaryFile, summary, 'utf8');
    
    console.log(`\n✅ Multi-resolution conversion complete! Files saved to: ${outputDir}`);
    
    return { variants, summary };
  }
}

// Test function for 4K ASCII conversion
async function test4KConversion() {
  const converter = new ASCII4KConverter();
  const imagePath = './WIN_20250919_19_52_29_Pro.jpg';
  
  console.log('🎨 4K ASCII Art Conversion Test');
  console.log('='.repeat(60));
  
  try {
    // Test standard 4K conversion
    console.log('\n🚀 Testing 4K ASCII conversion...');
    const result = await converter.convert4KImageToAscii(imagePath, {
      width: 2000,
      useAdvancedMapping: true,
      useEdgeDetection: true,
      useAntiAliasing: true,
      outputFile: './4k_ascii_output.txt',
      terminalWidth: 150
    });
    
    console.log(`\n✨ 4K ASCII Preview (terminal-friendly ${150} chars wide):`);
    console.log(result.ascii.split('\n').slice(0, 30).join('\n')); // Show first 30 lines
    console.log('\n... (output continues in file) ...');
    
    console.log(`\n📊 Performance Stats:`);
    console.log(`- Processing Time: ${result.stats.processingTime}ms`);
    console.log(`- Memory Usage: ${result.stats.memoryUsage}MB`);
    console.log(`- Character Count: ${result.stats.characterCount.toLocaleString()}`);
    console.log(`- Compression Ratio: ${result.stats.compressionRatio}`);
    
    // Test multi-resolution output
    console.log('\n🎭 Creating multi-resolution gallery...');
    const gallery = await converter.createMultiResolutionOutput(imagePath);
    
    console.log('\n📁 Gallery Summary:');
    console.log(gallery.summary);
    
  } catch (error) {
    console.error('❌ Error during 4K conversion:', error);
  }
}

// Export for testing
export { test4KConversion, CHARACTER_SETS };

// Run test if this file is executed directly
if (require.main === module) {
  test4KConversion();
}