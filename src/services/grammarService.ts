// Grammar Service for Students - Using Bytez SDK with GPT-4o
import Bytez from "bytez.js";
import { checkAndUpdateAdCounter, openAdInNewTab } from "./adService";

const GRAMMAR_API_KEY = "d18c78dd59f68c4e5234388d87a82264";

// Initialize Bytez SDK
const grammarSdk = new Bytez(GRAMMAR_API_KEY);

// Types
export interface GrammarResponse {
  success: boolean;
  result: string;
  error?: string;
}

// Safe output extraction from any response format
function extractOutput(response: any): string {
  if (!response) return '';
  
  // If output is a string directly
  if (typeof response === 'string') {
    return response;
  }
  
  // If it's an object with output property
  if (response.output) {
    const output = response.output;
    
    // If output is a string
    if (typeof output === 'string') {
      return output;
    }
    
    // If output is an object with text
    if (typeof output === 'object' && output.text) {
      return output.text;
    }
    
    // If output is an array, get first element
    if (Array.isArray(output) && output.length > 0) {
      return typeof output[0] === 'string' ? output[0] : JSON.stringify(output[0]);
    }
    
    // Fallback: stringify
    return JSON.stringify(output);
  }
  
  return '';
}

// Format grammar response
function formatGrammarText(text: string): string {
  if (!text) return 'No response received';
  return text.trim();
}

// Explain grammar rule with optional Bangla translation examples
export async function explainGrammarRule(ruleName: string, includeBangla: boolean = false): Promise<GrammarResponse> {
  try {
    const { shouldShowAd } = checkAndUpdateAdCounter();
    if (shouldShowAd) {
      openAdInNewTab();
    }

    const model = grammarSdk.model("openai/gpt-4o");
    
    let banglaInstruction = '';
    if (includeBangla) {
      banglaInstruction = `
Also provide Bangla meanings in parentheses for key terms.
Example: "Present Perfect (বর্তমান পূর্ণ) is used when..."
Example: "as soon as এর সংক্ষিপ্ত রূপ = ASAP"
Keep explanation in English, add Bangla for understanding only.`;
    }
    
    const prompt = `As a professional English grammar teacher, explain the grammar rule: "${ruleName}"
    
    Please provide:
    1. Definition of the rule
    2. 4-5 detailed examples showing correct usage
    3. Common mistakes to avoid
    4. Tips for remembering the rule
    
    Format clearly with sections.${banglaInstruction}`;

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
      result: formatGrammarText(output),
      error: undefined
    };
  } catch (err) {
    console.error('Grammar service error:', err);
    return {
      success: false,
      result: '',
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}

// General grammar question handler - user tells AI what they want
export async function askGrammarQuestion(question: string, includeBangla: boolean = false): Promise<GrammarResponse> {
  try {
    const { shouldShowAd } = checkAndUpdateAdCounter();
    if (shouldShowAd) {
      openAdInNewTab();
    }

    const model = grammarSdk.model("openai/gpt-4o");
    
    let banglaInstruction = '';
    if (includeBangla) {
      banglaInstruction = `
For Bangla understanding: Include relevant Bangla meanings in parentheses.
Example: "Present Perfect (বর্তমান পূর্ণ) is used for..."
Keep explanation clear for learners.`;
    }
    
    const prompt = `As a professional English grammar expert, answer this grammar question:

Question: "${question}"

Provide clear, detailed explanation with examples.${banglaInstruction}`;

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
      result: formatGrammarText(output),
      error: undefined
    };
  } catch (err) {
    console.error('Grammar service error:', err);
    return {
      success: false,
      result: '',
      error: `Service error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}
