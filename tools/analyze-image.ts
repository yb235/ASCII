import { tool } from 'ai';
import { z } from 'zod';
import Jimp from 'jimp';

export const analyzeImage = tool({
  description: 'Analyzes image characteristics to recommend optimal ASCII conversion strategy.',
  inputSchema: z.object({
    imageUrl: z.string().describe('The URL or file path of the image to analyze.'),
  }),
  execute: async ({ imageUrl }) => {
    try {
      const image = await Jimp.read(imageUrl);
      
      // Calculate average brightness
      let totalBrightness = 0;
      let pixelCount = 0;
      
      // Sample brightness and calculate contrast
      let minBrightness = 255;
      let maxBrightness = 0;
      
      // Detect dominant colors
      const colorHistogram = new Map();
      
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // Calculate brightness (luminance)
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        totalBrightness += brightness;
        pixelCount++;
        
        minBrightness = Math.min(minBrightness, brightness);
        maxBrightness = Math.max(maxBrightness, brightness);
        
        // Color frequency (simplified to reduce memory usage)
        if (x % 4 === 0 && y % 4 === 0) {
          const colorKey = `${Math.floor(r/32)}-${Math.floor(g/32)}-${Math.floor(b/32)}`;
          colorHistogram.set(colorKey, (colorHistogram.get(colorKey) || 0) + 1);
        }
      });
      
      const avgBrightness = totalBrightness / pixelCount;
      const contrast = (maxBrightness - minBrightness) / 255;
      const aspectRatio = image.bitmap.width / image.bitmap.height;
      
      // Calculate complexity (estimate detail level)
      const complexity = contrast > 0.7 ? 'high' : contrast > 0.4 ? 'medium' : 'low';
      
      // Determine dominant color tendency
      const isLowKey = avgBrightness < 85;  // Dark image
      const isHighKey = avgBrightness > 170; // Bright image
      
      // Generate recommendations
      const recommendations = {
        characterSet: complexity === 'high' ? 'dense' : complexity === 'medium' ? 'standard' : 'minimal',
        shouldEnhanceContrast: contrast < 0.5,
        shouldAdjustBrightness: isLowKey || isHighKey,
        brightnessAdjustment: isLowKey ? 0.3 : isHighKey ? -0.2 : 0,
        shouldInvert: isLowKey && contrast > 0.3,
        shouldAddNoise: complexity === 'low' && contrast < 0.3,
        optimalWidth: aspectRatio > 1.5 ? 120 : aspectRatio > 1 ? 100 : 80
      };
      
      return {
        analysis: {
          brightness: Math.round(avgBrightness),
          contrast: Math.round(contrast * 100) / 100,
          aspectRatio: Math.round(aspectRatio * 100) / 100,
          complexity,
          isLowKey,
          isHighKey,
          dimensions: `${image.bitmap.width}x${image.bitmap.height}`
        },
        recommendations,
        strategy: `Image is ${complexity} complexity, ${isLowKey ? 'dark' : isHighKey ? 'bright' : 'balanced'} with ${contrast > 0.5 ? 'good' : 'low'} contrast. Recommend ${recommendations.characterSet} character set.`
      };
    } catch (error) {
      return { error: `Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },
});