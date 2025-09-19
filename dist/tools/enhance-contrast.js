"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhanceContrast = void 0;
const ai_1 = require("ai");
const zod_1 = require("zod");
const jimp_1 = __importDefault(require("jimp"));
const path_1 = __importDefault(require("path"));
exports.enhanceContrast = (0, ai_1.tool)({
    description: 'Enhances the contrast of an image to make ASCII conversion more dramatic.',
    parameters: zod_1.z.object({
        imageUrl: zod_1.z.string().describe('The URL or file path of the image to enhance.'),
        level: zod_1.z.number().min(0).max(1).optional().describe('Contrast level (0-1, default: 0.5)'),
    }),
    execute: async (params) => {
        const { imageUrl, level = 0.5 } = params;
        try {
            const image = await jimp_1.default.read(imageUrl);
            image.contrast(level);
            const timestamp = Date.now();
            const originalName = path_1.default.basename(imageUrl, path_1.default.extname(imageUrl));
            const enhancedImagePath = `./enhanced-${originalName}-${timestamp}.png`;
            await image.writeAsync(enhancedImagePath);
            return {
                newImageUrl: enhancedImagePath,
                operation: 'contrast_enhancement',
                level: level,
                originalImage: imageUrl
            };
        }
        catch (error) {
            return { error: `Failed to enhance contrast: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    },
});
//# sourceMappingURL=enhance-contrast.js.map