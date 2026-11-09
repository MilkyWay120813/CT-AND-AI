import React, { useState, useRef } from 'react';
import {
  Camera,
  Calculator,
  ArrowRight,
  Loader2,
  X,
  Delete,
} from 'lucide-react';
import { MathHomeworkSolution } from '../types/math';

interface HomeworkInputBarProps {
  presets: MathHomeworkSolution[];
  activeSolutionId: string;
  onSelectPreset: (solution: MathHomeworkSolution) => void;
  onSolveCustom: (params: {
    problemText: string;
    imageBase64?: string;
    imageMimeType?: string;
    explanationStyle: 'balanced' | 'arcade' | 'visual';
  }) => Promise<void>;
  isSolving: boolean;
  errorMsg: string | null;
}

const MATH_SYMBOLS = [
  { label: 'x²', insert: 'x^2' },
  { label: 'x³', insert: 'x^3' },
  { label: '√x', insert: 'sqrt(x)' },
  { label: 'π', insert: 'pi' },
  { label: 'sin(x)', insert: 'sin(x)' },
  { label: 'cos(x)', insert: 'cos(x)' },
  { label: '(a/b)', insert: '( / )' },
  { label: 'd/dx', insert: 'Find the derivative of ' },
];

export const HomeworkInputBar: React.FC<HomeworkInputBarProps> = ({
  presets,
  activeSolutionId,
  onSelectPreset,
  onSolveCustom,
  isSolving,
  errorMsg,
}) => {
  const [problemInput, setProblemInput] = useState<string>('');
  const [explanationStyle, setExplanationStyle] = useState<'balanced' | 'arcade' | 'visual'>('balanced');
  const [showKeypad, setShowKeypad] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<{
    previewUrl: string;
    base64: string;
    mimeType: string;
    name: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);

  const handleInsertSymbol = (snippet: string) => {
    setProblemInput((prev) => `${prev}${snippet}`);
    textInputRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Part = dataUrl.split(',')[1] || '';
      setUploadedImage({
        previewUrl: dataUrl,
        base64: base64Part,
        mimeType: file.type || 'image/png',
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemInput.trim() && !uploadedImage) return;
    await onSolveCustom({
      problemText: problemInput.trim(),
      imageBase64: uploadedImage?.base64,
      imageMimeType: uploadedImage?.mimeType,
      explanationStyle,
    });
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight text-balance">
            Turn Tough Math Homework Into Visual Step-by-Step Intuition
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Enter any algebra, calculus, trig, or word problem—or snap a photo of your worksheet—to unlock live interactive graphs and playful explanations.
          </p>
        </div>

        {/* Explanation Style Segmented Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setExplanationStyle('balanced')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              explanationStyle === 'balanced'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clear & Balanced
          </button>
          <button
            type="button"
            onClick={() => setExplanationStyle('arcade')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              explanationStyle === 'arcade'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fun Analogies
          </button>
          <button
            type="button"
            onClick={() => setExplanationStyle('visual')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              explanationStyle === 'visual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visual Geometry
          </button>
        </div>
      </div>

      {/* Main Problem Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 flex items-center">
            <input
              ref={textInputRef}
              type="text"
              value={problemInput}
              onChange={(e) => setProblemInput(e.target.value)}
              placeholder="Type your math problem (e.g., Solve x^2 - 6x + 5 = 0 or Find where y = 2x + 1 meets y = -x + 7)..."
              className="w-full pl-4 pr-24 py-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-sky-600 transition-colors"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {problemInput && (
                <button
                  type="button"
                  onClick={() => setProblemInput('')}
                  title="Clear input"
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                >
                  <Delete className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowKeypad((v) => !v)}
                title="Toggle Math Symbol Keypad"
                className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  showKeypad
                    ? 'bg-sky-50 border-sky-200 text-sky-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Photo of Homework Problem"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSolving || (!problemInput.trim() && !uploadedImage)}
            className="px-5 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isSolving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Solving & Graphing...</span>
              </>
            ) : (
              <>
                <span>Solve Step-by-Step</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Uploaded Homework Image Preview */}
        {uploadedImage && (
          <div className="flex items-center justify-between gap-3 bg-sky-50/70 border border-sky-200 rounded-xl p-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={uploadedImage.previewUrl}
                alt="Uploaded homework problem preview"
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-cover rounded-lg border border-sky-200 bg-white shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  Homework Image Attached: {uploadedImage.name}
                </p>
                <p className="text-xs text-slate-600">
                  Click &ldquo;Solve Step-by-Step&rdquo; to extract the equation and plot its graph
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setUploadedImage(null)}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Math Symbol Keypad */}
        {showKeypad && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-500 mr-1">Insert symbol:</span>
            {MATH_SYMBOLS.map((sym) => (
              <button
                key={sym.label}
                type="button"
                onClick={() => handleInsertSymbol(sym.insert)}
                className="px-2.5 py-1 text-xs font-mono font-medium bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 hover:border-sky-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {sym.label}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 px-4 py-2.5 rounded-xl text-xs sm:text-sm">
          {errorMsg}
        </div>
      )}

      {/* Curated Interactive Homework Presets Strip */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 mr-1 whitespace-nowrap">
            Interactive Lab Presets:
          </span>
          {presets.map((preset) => {
            const isSelected = preset.id === activeSolutionId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {preset.topic}: {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
