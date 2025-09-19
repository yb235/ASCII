import { openai } from '@ai-sdk/openai';
import { Experimental_Agent as Agent } from 'ai';
import 'dotenv/config';
import { imageToAscii } from './tools/image-to-ascii';
import { invertColors } from './tools/invert-colors';
import { enhanceContrast } from './tools/enhance-contrast';
import { addNoise } from './tools/add-noise';
import { adjustBrightness } from './tools/adjust-brightness';

const agent = new Agent({
  model: openai('gpt-4-turbo'),
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
  
  console.log('\n' + '=' .repeat(60));
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

export { runAgent, agent };