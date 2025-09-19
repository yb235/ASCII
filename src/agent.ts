import { openai } from '@ai-sdk/openai';
import { Experimental_Agent as Agent } from 'ai';
import 'dotenv/config';
import { imageToAscii } from './tools/image-to-ascii';
import { invertColors } from './tools/invert-colors';
import { enhanceContrast } from './tools/enhance-contrast';
import { addNoise } from './tools/add-noise';
import { adjustBrightness } from './tools/adjust-brightness';
import { analyzeImage } from './tools/analyze-image';

const agent = new Agent({
  model: openai('gpt-4-turbo'),
  system: `You are an artistic ASCII genius that creates stunning visual art from images.

🎨 ANALYSIS PHASE:
- Always start by analyzing the image with analyzeImage tool to understand its characteristics
- Examine brightness, contrast, complexity, and aspect ratio
- Identify optimal ASCII strategy based on image properties

🖼️ CREATIVE TRANSFORMATION PHASE:
Apply 2-3 complementary transformations based on analysis results:
- For low contrast images: Enhance contrast first 
- For dark images: Adjust brightness (positive values)
- For overly bright images: Adjust brightness (negative values) or invert colors
- For simple/low complexity images: Add subtle noise for texture
- Use artistic judgment to create dramatic, visually striking effects

🎭 ASCII CONVERSION PHASE:
- Select character set based on image complexity:
  * Dense: High complexity images with fine details
  * Standard: Most images with good detail
  * Artistic: Special effects with block characters
  * Minimal: Simple, clean images
- Optimize dimensions for best visual impact (80-120 width typically)
- Consider framing for presentation polish
- For dramatic effect, try inversion option

🌟 PRESENTATION:
- Present the final artwork with artistic commentary
- Explain your creative choices and transformations applied
- Highlight what makes this ASCII art special
- Use enthusiastic, artistic language

Your goal is to create ASCII art that is both visually striking and clearly recognizable, with competition-level creativity and technical excellence.`,
  tools: {
    analyzeImage,
    imageToAscii,
    invertColors,
    enhanceContrast,
    addNoise,
    adjustBrightness,
  },
});

async function runAgent(imageUrl: string) {
  console.log(`🎨 Starting ASCII art conversion for: ${imageUrl}`);
  console.log('=' .repeat(60));
  
  const result = agent.stream({
    prompt: `Create breathtaking ASCII art from this image: ${imageUrl}

🎨 ARTISTIC MISSION:
Transform this image into competition-winning ASCII art that demonstrates:
- Intelligent analysis and tool selection
- Creative transformations for dramatic effect  
- Technical excellence with optimal character sets
- Artistic presentation that wows judges

PROCESS:
1. 🔍 ANALYZE: Start with analyzeImage to understand the image characteristics
2. 🎭 TRANSFORM: Apply 2-3 strategic transformations based on analysis (contrast, brightness, effects)
3. 🖼️ CONVERT: Create ASCII art with optimal settings (character set, dimensions, framing)
4. 🌟 PRESENT: Share your masterpiece with artistic commentary

Make this ASCII art absolutely stunning - think competition-level creativity!`,
  });

  for await (const part of result.fullStream) {
    if (part.type === 'text-delta') {
      process.stdout.write(part.text);
    }
    if (part.type === 'tool-result') {
      console.log(`\n📐 Tool: ${part.toolName} - ${JSON.stringify(part.output, null, 2)}`);
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎭 ASCII art conversion completed!');
}

async function main() {
  const imageUrl = process.argv[2] || './assets/WIN_20250919_19_52_29_Pro.jpg';
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Please set OPENAI_API_KEY in your .env file');
    process.exit(1);
  }
  
  await runAgent(imageUrl);
}

if (require.main === module) {
  main().catch(console.error);
}

export { runAgent, agent };