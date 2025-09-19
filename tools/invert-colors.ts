import { tool } from 'ai';
import { z } from 'zod';
import Jimp from 'jimp';
import path from 'path';

export const invertColors = tool({
  description: 'Inverts the colors of an image, creating a negative effect.',
  parameters: z.object({
    imageUrl: z.string().describe('The URL or file path of the image to invert.'),
  }),
  execute: async (params: any) => {
    const { imageUrl } = params;
    try {
      const image = await Jimp.read(imageUrl);
      image.invert();
      
      const timestamp = Date.now();
      const originalName = path.basename(imageUrl, path.extname(imageUrl));
      const invertedImagePath = `./inverted-${originalName}-${timestamp}.png`;
      
      await image.writeAsync(invertedImagePath);
      
      return { 
        newImageUrl: invertedImagePath,
        operation: 'color_inversion',
        originalImage: imageUrl
      };
    } catch (error) {
      return { error: `Failed to invert image colors: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },
});