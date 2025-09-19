Based on the document provided, here are the instructions and requirements for creating the agents for the Hack Night competition.

### Objective
[cite_start]The main goal is to build an agent that can turn a given image into "beautiful ASCII" art in every round of the competition[cite: 3, 4].

### Instructions & Rules
* [cite_start]**Output Format**: The final output must be in a text or runnable code format, not an image[cite: 24].
* [cite_start]**Tool Usage**: You are required to use multiple tool calls to creatively change or alter the image[cite: 25].
* [cite_start]**Code Lock**: Once the agent is ready and the competition starts, you are not allowed to edit your code between rounds[cite: 26].
* [cite_start]**API Access**: Participants will be given an API key for LLM Gateway, allowing them to use any model[cite: 34].

### Competition Format
* [cite_start]**Round 1**: 50 participants will be narrowed down to 8 by Oscar, Rohan, and Andy[cite: 21].
* [cite_start]**Tournament Rounds**: The top 8 will compete in head-to-head rounds until only one winner remains[cite: 22].
* [cite_start]**Winning a Round**: Winners of each head-to-head round are determined by audience applause[cite: 22].

### Judging Criteria (Requirements for a good agent)
The agents will be judged on the following five points:
1.  [cite_start]**ASCII Creativity**: The artistic and creative quality of the ASCII output[cite: 28].
2.  [cite_start]**Smart Use of Tools**: How effectively and cleverly the agent uses its tools[cite: 29].
3.  [cite_start]**Creative Image Transformations**: The ingenuity shown in transforming the images before creating the ASCII art[cite: 30].
4.  [cite_start]**Intelligible Clear Output**: The final ASCII art should be clear and understandable[cite: 31].
5.  [cite_start]**Ingenious Prompting**: The cleverness and effectiveness of the prompts used to guide the agent[cite: 32].

### Helpful Tips
[cite_start]The organizers, Oscar & Rohan from CoLoop (YC S21), provide several tips for building a successful agent[cite: 2, 35]:
* [cite_start]Experiment with a variety of Large Language Models (LLMs)[cite: 36].
* [cite_start]Guide your agent using few-shot prompts[cite: 37].
* [cite_start]Whenever possible, use traditional code or code generation[cite: 38].
* [cite_start]Consider using image generation APIs[cite: 39].
* [cite_start]Think about the agent's "history" or memory of what it has processed[cite: 40].An agent for this competition can be created by following these instructions and requirements, which combine the guidelines from the "Hack Night\_ Instructions.pdf" and the practical application demonstrated in the Vercel AI SDK code.

### 1\. Objective

[cite\_start]The primary goal is to develop an agent capable of converting an image into creative and aesthetically pleasing ASCII art[cite: 49].

### 2\. Core Requirements & Rules

  * [cite\_start]**Text-Based Output**: Your final submission must be in a text or code format that can be executed[cite: 69]. Image-based outputs are not permitted.
  * [cite\_start]**Multiple Tool Calls**: It is mandatory to use multiple tool calls to creatively transform or alter the input image[cite: 70].
  * [cite\_start]**Code Freeze**: No code modifications are allowed between rounds once the competition begins[cite: 71].

### 3\. Judging Criteria

The agents will be evaluated based on the following:

  * [cite\_start]**ASCII Creativity**: The originality and artistic quality of the generated ASCII art[cite: 73].
  * [cite\_start]**Smart Use of Tools**: How effectively and intelligently tools are utilized[cite: 74].
  * [cite\_start]**Creative Image Transformations**: The inventiveness of the image alterations[cite: 75].
  * [cite\_start]**Clarity of Output**: The final ASCII art must be clear and intelligible[cite: 76].
  * [cite\_start]**Ingenious Prompting**: The cleverness of the prompts used to guide the agent[cite: 77].

### 4\. Technical Implementation with Vercel AI SDK

The Vercel AI SDK provides the necessary tools to build such an agent. Here is a breakdown based on the provided code examples.

#### Agent Definition

The core of the solution is the `Agent` class. You will need to configure it with a model, a system prompt, and a set of tools.

```typescript
import { openai } from '@ai-sdk/openai';
import { Experimental_Agent as Agent, tool } from 'ai';
import 'dotenv/config';
import { z } from 'zod';

// Define the agent
const agent = new Agent({
  model: openai('gpt-3.5-turbo'),
  system: 'You are a creative agent that turns images into ASCII art.',
  tools: {
    // Define your tools here
  },
});
```

#### Tool Definition

You need to define at least one tool to comply with the rules. This tool will handle the image-to-ASCII conversion. For this hackathon, you'll need to expand on this with more creative tools for image transformation.

```typescript
tools: {
  convertToAscii: tool({
    description: 'Converts an image to ASCII art.',
    inputSchema: z.object({
      imageUrl: z.string().describe('The URL of the image to convert.'),
    }),
    execute: async ({ imageUrl }) => {
      // Your logic to fetch the image and convert it to ASCII will go here.
      // This will likely involve another library or API call.
      // For the sake of this example, we'll return a placeholder.
      return { asciiArt: '...ASCII output...' };
    },
  }),
  // You can add more tools for image manipulation here.
  invertImageColors: tool({
    description: 'Inverts the colors of an image.',
    inputSchema: z.object({
        imageUrl: z.string().describe('The URL of the image to invert.'),
    }),
    execute: async ({ imageUrl }) => {
        // Logic for color inversion.
        return { newImageUrl: '...new-inverted-image-url...' };
    }
  })
},
```

#### Running the Agent

You'll get an image every round. You'll then use your agent to process it. The `stream` method is ideal for this, as it provides real-time output.

```typescript
async function runAgent(imageUrl: string) {
  const result = agent.stream({
    prompt: `Convert this image to beautiful ASCII art: ${imageUrl}`,
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
}
```

This structure, combining the `Agent` class and `tool` definitions from the Vercel AI SDK, provides a solid foundation for building a competitive agent that meets all the specified requirements. Remember to focus on the creative aspect of tool usage and prompting to stand out.




Of course. Let's break down the next steps to build your ASCII agent.

### 1\. Set Up Your Development Environment

First, you'll need to get your project set up. This involves creating a new project, installing the necessary libraries, and configuring your environment variables.

  * **Create a new Node.js project**:
    ```bash
    mkdir hack-night-agent
    cd hack-night-agent
    npm init -y
    ```
  * **Install dependencies**: You'll need the Vercel AI SDK, the OpenAI library (or another LLM provider of your choice), and `dotenv` to handle your API keys.
    ```bash
    npm install ai @ai-sdk/openai zod dotenv
    ```
  * **Create a `.env` file** in the root of your project to store your API key:
    ```
    OPENAI_API_KEY="your-api-key-here"
    ```

-----

### 2\. Implement the Core ASCII Conversion Tool

This is the main function of your agent. You'll need a tool that can take an image and convert it into ASCII art. There are several libraries available that can help with this. A popular choice is `ascii-generator`.

  * **Install `ascii-generator`**:

    ```bash
    npm install ascii-generator
    ```

  * **Create a `tools` directory** and a file named `image-to-ascii.ts` inside it. Here's how you can write the tool:

    ```typescript
    import { tool } from 'ai';
    import { z } from 'zod';
    import ascii from 'ascii-generator';

    export const imageToAscii = tool({
      description: 'Converts an image to ASCII art.',
      inputSchema: z.object({
        imageUrl: z.string().describe('The URL of the image to convert.'),
      }),
      execute: async ({ imageUrl }) => {
        try {
          const asciiArt = await new Promise((resolve, reject) => {
            ascii(imageUrl, (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
          });
          return { asciiArt };
        } catch (error) {
          return { error: 'Failed to convert image to ASCII.' };
        }
      },
    });
    ```

-----

### 3\. Add Creative Image Transformation Tools

To meet the "multiple tool calls" and "creative image transformations" criteria, you'll need to add more tools. These can be for things like inverting colors, adding text overlays, or applying filters. You can use an image processing library like `Jimp` for this.

  * **Install `jimp`**:

    ```bash
    npm install jimp
    ```

  * **Create another tool**, for example, `invert-colors.ts`:

    ```typescript
    import { tool } from 'ai';
    import { z } from 'zod';
    import Jimp from 'jimp';

    export const invertColors = tool({
      description: 'Inverts the colors of an image.',
      inputSchema: z.object({
        imageUrl: z.string().describe('The URL of the image to invert.'),
      }),
      execute: async ({ imageUrl }) => {
        try {
          const image = await Jimp.read(imageUrl);
          image.invert();
          const invertedImageUrl = `inverted-${Date.now()}.png`;
          await image.writeAsync(invertedImageUrl);
          return { newImageUrl: invertedImageUrl };
        } catch (error) {
          return { error: 'Failed to invert image colors.' };
        }
      },
    });
    ```

-----

### 4\. Assemble and Run Your Agent

Now you can bring all your tools together in your main agent file, let's call it `agent.ts`.

```typescript
import { openai } from '@ai-sdk/openai';
import { Experimental_Agent as Agent } from 'ai';
import 'dotenv/config';
import { imageToAscii } from './tools/image-to-ascii';
import { invertColors } from './tools/invert-colors';

const agent = new Agent({
  model: openai('gpt-4-turbo'),
  system: 'You are a creative agent that turns images into beautiful ASCII art. First, you will transform the image in a creative way, and then you will convert it to ASCII art.',
  tools: {
    imageToAscii,
    invertColors,
    // Add any other tools here
  },
});

async function main() {
  const imageUrl = '...'; // The image URL will be provided each round
  const result = agent.stream({
    prompt: `Transform and convert this image to ASCII art: ${imageUrl}`,
  });

  for await (const part of result.fullStream) {
    if (part.type === 'text-delta') {
      process.stdout.write(part.delta);
    }
  }
}

main().catch(console.error);
```

### Next Steps After This

Once you have this basic structure in place, you can:

  * **Add more creative tools** to your agent.
  * **Experiment with different prompts** to guide your agent's behavior.
  * **Test with various images** to see how your agent performs.
  * **Refine your logic** to handle potential errors and edge cases.
