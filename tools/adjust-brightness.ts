import { tool } from 'ai';
import { z } from 'zod';
import Jimp from 'jimp';
import path from 'path';

export const adjustBrightness = tool({
  description: 'Adjusts the brightness of an image to optimize ASCII art visibility.',
  parameters: z.object({
    imageUrl: z.string().describe('The URL or file path of the image to adjust.'),
    level: z.number().min(-1).max(1).optional().describe('Brightness level (-1 to 1, default: 0.2)'),
  }),
  execute: async (params: any) => {
    const { imageUrl, level = 0.2 } = params;
    try {
      const image = await Jimp.read(imageUrl);
      image.brightness(level);
      
      const timestamp = Date.now();
      const originalName = path.basename(imageUrl, path.extname(imageUrl));
      const brightImagePath = `./bright-${originalName}-${timestamp}.png`;
      
      await image.writeAsync(brightImagePath);
      
      return { 
        newImageUrl: brightImagePath,
        operation: 'brightness_adjustment',
        level: level,
        originalImage: imageUrl
      };
    } catch (error) {
      return { error: `Failed to adjust brightness: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },
});