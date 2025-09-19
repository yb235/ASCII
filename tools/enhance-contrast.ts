import { tool } from 'ai';
import { z } from 'zod';
import Jimp from 'jimp';
import path from 'path';

export const enhanceContrast = tool({
  description: 'Enhances the contrast of an image to make ASCII conversion more dramatic.',
  parameters: z.object({
    imageUrl: z.string().describe('The URL or file path of the image to enhance.'),
    level: z.number().min(0).max(1).optional().describe('Contrast level (0-1, default: 0.5)'),
  }),
  execute: async (params: any) => {
    const { imageUrl, level = 0.5 } = params;
    try {
      const image = await Jimp.read(imageUrl);
      image.contrast(level);
      
      const timestamp = Date.now();
      const originalName = path.basename(imageUrl, path.extname(imageUrl));
      const enhancedImagePath = `./enhanced-${originalName}-${timestamp}.png`;
      
      await image.writeAsync(enhancedImagePath);
      
      return { 
        newImageUrl: enhancedImagePath,
        operation: 'contrast_enhancement',
        level: level,
        originalImage: imageUrl
      };
    } catch (error) {
      return { error: `Failed to enhance contrast: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },
});