import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { solveMathProblem } from '@/services/mathService';
import { Loader } from 'lucide-react';

interface MathToolProps {
  toolId: string;
}

export function MathTool({ toolId }: MathToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!input.trim()) {
      alert('Please type your math problem or question');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const response = await solveMathProblem(input.trim());
      if (response.success) {
        setResult(response.result);
      } else {
        setResult(`Error: ${response.error}`);
      }
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-0">
      {/* Input Section */}
      <div className="w-full bg-slate-800/30 border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <div className="w-full space-y-3 sm:space-y-4">
          <div className="w-full">
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Math Solver - Tell AI What You Need
            </label>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Ask any math question, solve problems, explain concepts. Type in English or Bangla for Bangla solutions.
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: Solve 2x + 5 = 15 or Explain Pythagorean theorem or Find derivative of x²..."
              rows={4}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-vertical"
              style={{ minHeight: '100px' }}
            />
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleSolve}
              disabled={loading || !input.trim()}
              className="w-full sm:flex-1 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Solving...
                </>
              ) : (
                'Get Answer'
              )}
            </Button>
            <Button
              onClick={handleClear}
              disabled={loading}
              className="w-full sm:flex-1 py-2.5 sm:py-3 text-sm sm:text-base bg-slate-700/50 hover:bg-slate-600/50 text-slate-300"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="w-full bg-slate-800/30 border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">Solution</h3>
          <div className="overflow-x-auto">
            <ResultBox content={result} />
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-slate-400">Working on your problem...</p>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
            <span className="text-xs text-slate-400">💡 How to use: </span>
            Just tell the AI what you need! Ask to solve, explain, derive, simplify, or anything math-related. Type in English for English solutions, Bangla for Bangla solutions.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            ℹ️ Note: Generation may cause ad to display occasionally
          </p>
        </div>
      )}
    </div>
  );
}

export function MathToolWrapper({ toolId }: MathToolProps) {
  return <MathTool toolId={toolId} />;
}
