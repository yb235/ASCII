"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = void 0;
exports.runAgent = runAgent;
const openai_1 = require("@ai-sdk/openai");
const ai_1 = require("ai");
require("dotenv/config");
const image_to_ascii_1 = require("./tools/image-to-ascii");
const invert_colors_1 = require("./tools/invert-colors");
const enhance_contrast_1 = require("./tools/enhance-contrast");
const add_noise_1 = require("./tools/add-noise");
const adjust_brightness_1 = require("./tools/adjust-brightness");
const agent = new ai_1.Experimental_Agent({
    model: (0, openai_1.openai)('gpt-4-turbo'),
    system: `You are a creative ASCII art agent that transforms images into beautiful, artistic ASCII representations. 

Your process should be:
1. Analyze the input image characteristics
2. Apply creative transformations to enhance the image for ASCII conversion
3. Convert the processed image to ASCII art
4. Present the final result with artistic flair

Be creative with your transformations - use multiple tools to create unique effects. Consider:
- Enhancing contrast for better definition
- Adjusting brightness for optimal visibility
- Adding artistic noise for texture
- Inverting colors for dramatic effect

Your goal is to create ASCII art that is both visually striking and clearly recognizable.`,
    tools: {
        imageToAscii: image_to_ascii_1.imageToAscii,
        invertColors: invert_colors_1.invertColors,
        enhanceContrast: enhance_contrast_1.enhanceContrast,
        addNoise: add_noise_1.addNoise,
        adjustBrightness: adjust_brightness_1.adjustBrightness,
    },
});
exports.agent = agent;
async function runAgent(imageUrl) {
    console.log(`🎨 Starting ASCII art conversion for: ${imageUrl}`);
    console.log('='.repeat(60));
    const result = agent.stream({
        prompt: `Create beautiful ASCII art from this image: ${imageUrl}
    
Please be creative with your approach:
1. First analyze the image characteristics
2. Apply 2-3 creative transformations to enhance it for ASCII conversion
3. Convert to ASCII art with appropriate character density
4. Present the final ASCII artwork
    
Make it artistic and visually striking!`,
    });
    for await (const part of result.fullStream) {
        if (part.type === 'text-delta') {
            process.stdout.write(part.text);
        }
        if (part.type === 'tool-result') {
            console.log(`\n📐 Tool: ${part.toolName} - ${JSON.stringify(part.output, null, 2)}`);
        }
    }
    console.log('\n' + '='.repeat(60));
    console.log('🎭 ASCII art conversion completed!');
}
async function main() {
    const imageUrl = process.argv[2] || './WIN_20250919_19_52_29_Pro.jpg';
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ Please set OPENAI_API_KEY in your .env file');
        process.exit(1);
    }
    await runAgent(imageUrl);
}
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=agent.js.map