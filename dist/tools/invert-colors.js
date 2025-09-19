"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invertColors = void 0;
const ai_1 = require("ai");
const zod_1 = require("zod");
const jimp_1 = __importDefault(require("jimp"));
const path_1 = __importDefault(require("path"));
exports.invertColors = (0, ai_1.tool)({
    description: 'Inverts the colors of an image, creating a negative effect.',
    parameters: zod_1.z.object({
        imageUrl: zod_1.z.string().describe('The URL or file path of the image to invert.'),
    }),
    execute: async (params) => {
        const { imageUrl } = params;
        try {
            const image = await jimp_1.default.read(imageUrl);
            image.invert();
            const timestamp = Date.now();
            const originalName = path_1.default.basename(imageUrl, path_1.default.extname(imageUrl));
            const invertedImagePath = `./inverted-${originalName}-${timestamp}.png`;
            await image.writeAsync(invertedImagePath);
            return {
                newImageUrl: invertedImagePath,
                operation: 'color_inversion',
                originalImage: imageUrl
            };
        }
        catch (error) {
            return { error: `Failed to invert image colors: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    },
});
//# sourceMappingURL=invert-colors.js.map