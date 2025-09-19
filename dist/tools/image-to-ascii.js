"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToAscii = void 0;
const ai_1 = require("ai");
const zod_1 = require("zod");
const jimp_1 = __importDefault(require("jimp"));
exports.imageToAscii = (0, ai_1.tool)({
    description: 'Converts an image to ASCII art using character density mapping.',
    parameters: zod_1.z.object({
        imageUrl: zod_1.z.string().describe('The URL or file path of the image to convert.'),
        width: zod_1.z.number().optional().describe('Width of the ASCII output (default: 80)'),
        height: zod_1.z.number().optional().describe('Height of the ASCII output (default: auto)'),
        chars: zod_1.z.string().optional().describe('Characters to use for ASCII art (default: gradient)')
    }),
    execute: async (params) => {
        const { imageUrl, width = 80, height, chars = ' .:-=+*#%@' } = params;
        try {
            const image = await jimp_1.default.read(imageUrl);
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
                    const pixel = jimp_1.default.intToRGBA(image.getPixelColor(x, y));
                    const brightness = pixel.r; // Already grayscale, so r = g = b
                    const charIndex = Math.floor((brightness / 255) * charCount);
                    asciiArt += charArray[charIndex];
                }
                asciiArt += '\n';
            }
            return {
                asciiArt: asciiArt,
                dimensions: `${width}x${outputHeight}`,
                characters: chars.length
            };
        }
        catch (error) {
            return { error: `Failed to convert image to ASCII: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    },
});
//# sourceMappingURL=image-to-ascii.js.map