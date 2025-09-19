import { Experimental_Agent as Agent } from 'ai';
import 'dotenv/config';
declare const agent: Agent<{
    imageToAscii: import("ai").Tool<any, {
        asciiArt: string;
        dimensions: string;
        characters: any;
        error?: undefined;
    } | {
        error: string;
        asciiArt?: undefined;
        dimensions?: undefined;
        characters?: undefined;
    }>;
    invertColors: import("ai").Tool<any, {
        newImageUrl: string;
        operation: string;
        originalImage: any;
        error?: undefined;
    } | {
        error: string;
        newImageUrl?: undefined;
        operation?: undefined;
        originalImage?: undefined;
    }>;
    enhanceContrast: import("ai").Tool<any, {
        newImageUrl: string;
        operation: string;
        level: any;
        originalImage: any;
        error?: undefined;
    } | {
        error: string;
        newImageUrl?: undefined;
        operation?: undefined;
        level?: undefined;
        originalImage?: undefined;
    }>;
    addNoise: import("ai").Tool<any, {
        newImageUrl: string;
        operation: string;
        intensity: any;
        originalImage: any;
        error?: undefined;
    } | {
        error: string;
        newImageUrl?: undefined;
        operation?: undefined;
        intensity?: undefined;
        originalImage?: undefined;
    }>;
    adjustBrightness: import("ai").Tool<any, {
        newImageUrl: string;
        operation: string;
        level: any;
        originalImage: any;
        error?: undefined;
    } | {
        error: string;
        newImageUrl?: undefined;
        operation?: undefined;
        level?: undefined;
        originalImage?: undefined;
    }>;
}, never, never>;
declare function runAgent(imageUrl: string): Promise<void>;
export { runAgent, agent };
//# sourceMappingURL=agent.d.ts.map