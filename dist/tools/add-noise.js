"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNoise = void 0;
const ai_1 = require("ai");
const zod_1 = require("zod");
const jimp_1 = __importDefault(require("jimp"));
const path_1 = __importDefault(require("path"));
exports.addNoise = (0, ai_1.tool)({
    description: 'Adds artistic noise to an image for creative ASCII effects.',
    parameters: zod_1.z.object({
        imageUrl: zod_1.z.string().describe('The URL or file path of the image to process.'),
        intensity: zod_1.z.number().min(0).max(100).optional().describe('Noise intensity (0-100, default: 20)'),
    }),
    execute: async (params) => {
        const { imageUrl, intensity = 20 } = params;
        try {
            const image = await jimp_1.default.read(imageUrl);
            // Add random noise to each pixel
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                const noise = (Math.random() - 0.5) * (intensity * 2.55); // Scale to 0-255 range
                this.bitmap.data[idx] = Math.max(0, Math.min(255, this.bitmap.data[idx] + noise)); // red
                this.bitmap.data[idx + 1] = Math.max(0, Math.min(255, this.bitmap.data[idx + 1] + noise)); // green
                this.bitmap.data[idx + 2] = Math.max(0, Math.min(255, this.bitmap.data[idx + 2] + noise)); // blue
            });
            const timestamp = Date.now();
            const originalName = path_1.default.basename(imageUrl, path_1.default.extname(imageUrl));
            const noisyImagePath = `./noisy-${originalName}-${timestamp}.png`;
            await image.writeAsync(noisyImagePath);
            return {
                newImageUrl: noisyImagePath,
                operation: 'noise_addition',
                intensity: intensity,
                originalImage: imageUrl
            };
        }
        catch (error) {
            return { error: `Failed to add noise: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    },
});
//# sourceMappingURL=add-noise.js.map