// Math Solver Service - Using Bytez SDK with GPT-4o
// User tells AI what to do (explain, solve, etc.)
import Bytez from "bytez.js";
import { checkAndUpdateAdCounter, openAdInNewTab } from "./adService";

const MATH_API_KEY = "d18c78dd59f68c4e5234388d87a82264";

// Initialize Bytez SDK
const mathSdk = new Bytez(MATH_API_KEY);

// Types
export interface MathResponse {
  success: boolean;
  result: string;
  error?: string;
}

// Detect language
function detectLanguage(text: string): string {
  const banglaRegex = /[\u0980-\u09FF]/;
  return banglaRegex.test(text) ? 'bangla' : 'english';
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
    
    if (typeof output === 'object' && output.text) {
      return output.text;
    }
    
    if (Array.isArray(output) && output.length > 0) {
      return typeof output[0] === 'string' ? output[0] : JSON.stringify(output[0]);
    }
    
    return JSON.stringify(output);
  }
  
  return '';
}

// Format math response
function formatMathText(text: string): string {
  if (!text) return 'No response received';
  return text.trim();
}

// Main math handler - user tells AI what to do
export async function solveMathProblem(userInput: string): Promise<MathResponse> {
  try {
    const { shouldShowAd } = checkAndUpdateAdCounter();
    if (shouldShowAd) {
      openAdInNewTab();
    }

    const model = mathSdk.model("openai/gpt-4o");
    
    // Detect if user wants response in Bangla
    const detectedLang = detectLanguage(userInput);
    let langInstruction = '';
    
    if (detectedLang === 'bangla') {
      langInstruction = 'Please respond in Bangla language. Keep math symbols and numbers as they are.';
    } else {
      langInstruction = 'Please respond in English.';
    }
    
    const prompt = `You are a professional mathematics tutor and expert. Help the user with their math-related request.

User's request: "${userInput}"

${langInstruction}

Provide clear, step-by-step explanations with detailed working where applicable. Be helpful and educational.`;

    const response = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

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
        error: 'No response from API'
      };
    }

    return {
      success: true,
      result: formatMathText(output),
      error: undefined
    };
  } catch (err) {
    console.error('Math service error:', err);
    return {
      success: false,
      result: '',
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}
