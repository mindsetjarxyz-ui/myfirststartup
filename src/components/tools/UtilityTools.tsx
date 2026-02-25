import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { generateMusic } from '@/services/ai';
import { Loader } from 'lucide-react';

interface UtilityToolWrapperProps {
  toolId: string;
}

export function UtilityToolWrapper({ toolId }: UtilityToolWrapperProps) {
  switch (toolId) {
    case 'text-to-music':
      return <TextToMusicTool />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}

function TextToMusicTool() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) {
      setError('Please enter a music description');
      return;
    }

    setLoading(true);
    setError('');
    setAudioUrl('');
    setShowPlayer(false);

    try {
      const result = await generateMusic(prompt.trim());

      if (result.error) {
        setError(result.error);
        setAudioUrl('');
        setShowPlayer(false);
      } else {
        setAudioUrl(result.output);
        setShowPlayer(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate music. Please try again.');
      setAudioUrl('');
      setShowPlayer(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Music Description
          </label>
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the music you want to generate... (e.g., 'Moody jazz music with saxophones', 'Upbeat electronic dance music', 'Calm meditation music')"
            rows={4}
            disabled={loading}
          />
          <p className="text-xs text-slate-400 mt-2">
            Be descriptive! Include tempo, mood, instruments, and style for better results.
          </p>
        </div>

        <Button
          onClick={handleGenerateMusic}
          disabled={loading || !prompt.trim()}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating Music...
            </>
          ) : (
            'Generate Music'
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {showPlayer && audioUrl && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-slate-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-slate-200 font-semibold mb-4 text-lg">✨ Your Generated Music</h3>
          <audio
            controls
            className="w-full mb-4 rounded-lg"
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>
          <p className="text-xs text-slate-400">
            💾 You can download this audio file using your browser's download button on the player.
          </p>
        </div>
      )}
    </div>
  );
}
