"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustBrightness = void 0;
const ai_1 = require("ai");
const zod_1 = require("zod");
const jimp_1 = __importDefault(require("jimp"));
const path_1 = __importDefault(require("path"));
exports.adjustBrightness = (0, ai_1.tool)({
    description: 'Adjusts the brightness of an image to optimize ASCII art visibility.',
    parameters: zod_1.z.object({
        imageUrl: zod_1.z.string().describe('The URL or file path of the image to adjust.'),
        level: zod_1.z.number().min(-1).max(1).optional().describe('Brightness level (-1 to 1, default: 0.2)'),
    }),
    execute: async (params) => {
        const { imageUrl, level = 0.2 } = params;
        try {
            const image = await jimp_1.default.read(imageUrl);
            image.brightness(level);
            const timestamp = Date.now();
            const originalName = path_1.default.basename(imageUrl, path_1.default.extname(imageUrl));
            const brightImagePath = `./bright-${originalName}-${timestamp}.png`;
            await image.writeAsync(brightImagePath);
            return {
                newImageUrl: brightImagePath,
                operation: 'brightness_adjustment',
                level: level,
                originalImage: imageUrl
            };
        }
        catch (error) {
            return { error: `Failed to adjust brightness: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    },
});
//# sourceMappingURL=adjust-brightness.js.map