// Image Generation Service - Using Bytez SDK with Stable Diffusion
import Bytez from "bytez.js";
import { checkAndUpdateAdCounter, openAdInNewTab } from "./adService";

const IMAGE_API_KEY = "d0e4373977ea72a1f1ddab86ec827d17";

// Initialize Bytez SDK
const imageSdk = new Bytez(IMAGE_API_KEY);

// Types
export interface ImageResponse {
  success: boolean;
  result: string;
  imageUrl?: string;
  error?: string;
}

// Safe output extraction
function extractOutput(response: any): string {
  if (!response) return '';
  
  if (typeof response === 'string') {
    return response;
  }
  
  if (response.output) {
    const output = response.output;
    
    if (typeof output === 'string') {
      return output;
    }
    
    if (typeof output === 'object' && output.url) {
      return output.url;
    }
    
    if (typeof output === 'object' && output.image) {
      return output.image;
    }
    
    if (Array.isArray(output) && output.length > 0) {
      return typeof output[0] === 'string' ? output[0] : JSON.stringify(output[0]);
    }
    
    return JSON.stringify(output);
  }
  
  return '';
}

// Generate image from text prompt
export async function generateImage(prompt: string): Promise<ImageResponse> {
  try {
    const { shouldShowAd, adUrl } = checkAndUpdateAdCounter();
    if (shouldShowAd) {
      openAdInNewTab(adUrl);
    }

    const model = imageSdk.model("stabilityai/stable-diffusion-xl-base-1.0");
    
    // Enhance prompt for better results
    const enhancedPrompt = `${prompt}, high quality, detailed, professional, 8k`;
    
    const response = await model.run(enhancedPrompt);

    if (response.error) {
      return {
        success: false,
        result: '',
        error: `API Error: ${response.error}`
      };
    }

    const output = extractOutput(response);
    
    if (!output) {
      return {
        success: false,
        result: '',
        error: 'No image generated'
      };
    }

    return {
      success: true,
      result: 'Image generated successfully',
      imageUrl: output,
      error: undefined
    };
  } catch (err) {
    console.error('Image generation error:', err);
    return {
      success: false,
      result: '',
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}
