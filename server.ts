import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedAiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!cachedAiClient) {
    cachedAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'missing-api-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedAiClient;
}

const mathSolutionSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Concise descriptive title of the math problem.',
    },
    topic: {
      type: Type.STRING,
      description: 'Math category such as Quadratics, Linear Algebra, Calculus, Trigonometry, or Word Problems.',
    },
    difficulty: {
      type: Type.STRING,
      description: 'Foundational, Intermediate, or Advanced.',
    },
    estimatedMinutes: {
      type: Type.INTEGER,
      description: 'Estimated minutes to review (e.g. 3, 4, 5).',
    },
    originalProblem: {
      type: Type.STRING,
      description: 'Cleanly formatted statement of the user problem.',
    },
    finalAnswer: {
      type: Type.STRING,
      description: 'Clear final answer expression (e.g. "x = -1, x = 3 (Vertex at (1, -4))").',
    },
    funAnalogy: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Catchy title for the real-world analogy.' },
        story: {
          type: Type.STRING,
          description: '2-3 sentence playful, vivid real-world story explaining the intuition behind this problem without heavy jargon.',
        },
        punchline: {
          type: Type.STRING,
          description: 'A memorable one-liner takeaway rule of thumb.',
        },
        realWorldVariableMap: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              meaning: { type: Type.STRING },
            },
            required: ['symbol', 'meaning'],
          },
        },
      },
      required: ['title', 'story', 'punchline', 'realWorldVariableMap'],
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          ruleUsed: { type: Type.STRING, description: 'Short name of algebraic or geometric operation.' },
          mathBefore: { type: Type.STRING, description: 'Equation state entering this step.' },
          mathAfter: { type: Type.STRING, description: 'Equation state after applying this step.' },
          explanation: { type: Type.STRING, description: 'Simple, encouraging 1-2 sentence explanation.' },
          funTip: { type: Type.STRING, description: 'Memorable trick or common pitfall to avoid.' },
          checkQuestion: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING, description: 'Quick multiple-choice question about this step.' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER, description: '0-based index of the correct option.' },
              hint: { type: Type.STRING },
            },
            required: ['prompt', 'options', 'correctIndex', 'hint'],
          },
          graphHighlight: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              label: { type: Type.STRING },
              kind: {
                type: Type.STRING,
                description: 'One of: root, vertex, intercept, intersection, tangent',
              },
            },
            required: ['x', 'y', 'label', 'kind'],
          },
        },
        required: [
          'stepNumber',
          'title',
          'ruleUsed',
          'mathBefore',
          'mathAfter',
          'explanation',
          'funTip',
          'checkQuestion',
        ],
      },
    },
    graphConfig: {
      type: Type.OBJECT,
      properties: {
        primaryExpression: {
          type: Type.STRING,
          description:
            'Valid mathjs expression in terms of variable x and any slider parameter symbols (e.g. "a * x^2 + b * x + c" or "a * sin(b * x) + c"). Use standard operators *, +, -, /, ^, sin(), cos(), sqrt(), exp(), abs().',
        },
        primaryLabel: {
          type: Type.STRING,
          description: 'Display label for primary curve, e.g. "f(x) = a·x² + b·x + c"',
        },
        secondaryExpression: {
          type: Type.STRING,
          description: 'Optional second curve expression in terms of x (e.g. "0" or a linear line "m * x + d"). Leave empty string if not needed.',
        },
        secondaryLabel: {
          type: Type.STRING,
          description: 'Display label for secondary curve if present.',
        },
        xDomain: {
          type: Type.ARRAY,
          items: { type: Type.NUMBER },
          description: 'Two numbers [xMin, xMax], e.g. [-8, 8].',
        },
        yDomain: {
          type: Type.ARRAY,
          items: { type: Type.NUMBER },
          description: 'Two numbers [yMin, yMax], e.g. [-8, 8].',
        },
        parameters: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING, description: 'Single letter parameter used in primaryExpression, e.g. a, b, c.' },
              label: { type: Type.STRING, description: 'Human-readable parameter role, e.g. "Curvature (a)"' },
              value: { type: Type.NUMBER, description: 'Initial value matching the homework problem.' },
              min: { type: Type.NUMBER },
              max: { type: Type.NUMBER },
              step: { type: Type.NUMBER },
              unit: { type: Type.STRING, description: 'Unit label or scale descriptor, e.g. "scale", "units", "rad/s".' },
              description: { type: Type.STRING, description: 'How dragging this slider changes the graph.' },
            },
            required: ['symbol', 'label', 'value', 'min', 'max', 'step', 'unit', 'description'],
          },
        },
        keyPoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              label: { type: Type.STRING },
              kind: { type: Type.STRING, description: 'One of: root, vertex, intercept, intersection, tangent' },
            },
            required: ['x', 'y', 'label', 'kind'],
          },
        },
      },
      required: ['primaryExpression', 'primaryLabel', 'xDomain', 'yDomain', 'parameters', 'keyPoints'],
    },
    practiceTwin: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: 'A similar follow-up practice problem to cement learning.' },
        equation: { type: Type.STRING, description: 'The math equation for the practice problem.' },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '4 possible answers.',
        },
        correctIndex: { type: Type.INTEGER, description: '0-based index of the correct option.' },
        explanation: { type: Type.STRING, description: 'Clear explanation of how to get the twin problem answer.' },
        funRewardMessage: { type: Type.STRING, description: 'Upbeat congratulatory message.' },
      },
      required: ['question', 'equation', 'options', 'correctIndex', 'explanation', 'funRewardMessage'],
    },
  },
  required: [
    'title',
    'topic',
    'difficulty',
    'estimatedMinutes',
    'originalProblem',
    'finalAnswer',
    'funAnalogy',
    'steps',
    'graphConfig',
    'practiceTwin',
  ],
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '12mb' }));

  app.post('/api/solve', async (req, res) => {
    try {
      const { problemText, imageBase64, imageMimeType, explanationStyle, chapterContext } = req.body || {};

      if (!problemText && !imageBase64) {
        res.status(400).json({ error: 'Please enter a math problem or upload a homework image.' });
        return;
      }

      const styleNote =
        explanationStyle === 'arcade'
          ? 'Use extra playful metaphors (video games, sports physics, skateboarding, pizza slicing) while keeping the math 100% rigorous.'
          : explanationStyle === 'visual'
          ? 'Focus heavily on geometric intuition, symmetry, slopes, and how the curve behaves on a coordinate plane.'
          : 'Balance crystal-clear algebraic steps with a fun, memorable real-world analogy.';

      const curriculumNote = chapterContext
        ? `Curriculum Context: The student is studying NCERT Ganita Prakash Class 8 (${chapterContext}). Connect the explanation, analogy, and visual graph to this Class 8 chapter's core concepts where relevant.`
        : '';

      const promptText = `Solve the following student math homework problem with crystal-clear step-by-step explanations, a fun real-world analogy, and an interactive graphing configuration.
${styleNote}
${curriculumNote}

Requirements:
1. Provide 3 to 5 clear, bite-sized steps. Each step must show mathBefore and mathAfter, a friendly explanation, a funTip, a multiple-choice checkQuestion (with 3 or 4 options), and a graphHighlight coordinate point on the curve.
2. CRITICAL FORMATTING RULE: NEVER output raw LaTeX code or backslash commands (like \\frac, \\sqrt, \\text, \\angle, \\triangle, \\implies, \\times, ^\\circ) or JavaScript code (like Math.sqrt or Math.pow) in finalAnswer, mathBefore, mathAfter, explanation, or quiz options. Always write clean, human-readable Unicode classroom math symbols: use √(...) for square roots, ² and ³ for powers, × and ÷ for multiplication/division, ∠ for angles, Δ for triangles, ° for degrees, and ⇒ for arrows.
3. In graphConfig, write primaryExpression as a valid mathjs expression in terms of 'x' AND parameter letters (such as 'a * x^2 + b * x + c' or 'm * x + b') where the parameter values in the parameters array equal the exact coefficients of the student's problem. Always use explicit multiplication '*' and '^' or 'sqrt()' for mathjs (never Math.pow or Math.sqrt).
4. If the problem is a system of two equations or compares two expressions (like left side = right side), put the second expression in secondaryExpression so both curves and their intersection appear on the graph.
5. Make sure xDomain and yDomain comfortably frame all keyPoints (roots, vertex, intercepts, intersections).

Student Problem: ${problemText || 'Read the math problem from the attached homework image and solve it completely.'}`;

      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
      if (imageBase64 && imageMimeType) {
        parts.push({
          inlineData: {
            mimeType: imageMimeType,
            data: imageBase64,
          },
        });
      }
      parts.push({ text: promptText });

      const response = await getAiClient().models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction:
            'You are Parabola Studio, an enthusiastic, crystal-clear math tutor and visual graphing architect. You turn intimidating homework problems into simple, joyful step-by-step journeys backed by interactive coordinate graphs. Never use raw LaTeX backslashes in display text—always write clean, human-readable math notation (√, ², ³, ×, ÷, ∠, Δ, °, ⇒).',
          responseMimeType: 'application/json',
          responseSchema: mathSolutionSchema,
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);

      res.json({
        id: `custom-${Date.now()}`,
        ...parsed,
      });
    } catch (error: unknown) {
      console.error('Error in /api/solve:', error);
      const errMessage = error instanceof Error ? error.message : 'Unknown error occurred while solving.';
      res.status(500).json({
        error: errMessage,
      });
    }
  });

  // In-memory cache for generated AI voiceover clips
  const voiceoverCache = new Map<string, { audioDataUrl: string; audioChunks: string[] }>();

  // Convert math symbols into natural spoken words for human-sounding narration
  function formatMathForSpeech(raw: string): string {
    return raw
      .replace(/√\(([^)]+)\)/g, ' the square root of $1 ')
      .replace(/∛\(([^)]+)\)/g, ' the cube root of $1 ')
      .replace(/√(\d+)/g, ' the square root of $1 ')
      .replace(/∛(\d+)/g, ' the cube root of $1 ')
      .replace(/([a-zA-Z0-9)+-]+)²/g, '$1 squared')
      .replace(/([a-zA-Z0-9)+-]+)³/g, '$1 cubed')
      .replace(/10⁻(\d+)/g, '10 to the negative $1 power')
      .replace(/(\d+)\^(\d+)/g, '$1 to the power of $2')
      .replace(/½/g, ' one half ')
      .replace(/₁/g, ' 1 ')
      .replace(/₂/g, ' 2 ')
      .replace(/₃/g, ' 3 ')
      .replace(/[{}]/g, ' ')
      .replace(/—|–|·/g, ', ')
      .replace(/×/g, ' times ')
      .replace(/÷/g, ' divided by ')
      .replace(/≠/g, ' is not equal to ')
      .replace(/≈/g, ' is approximately ')
      .replace(/≤/g, ' is less than or equal to ')
      .replace(/≥/g, ' is greater than or equal to ')
      .replace(/⇒|→/g, ' which gives ')
      .replace(/∠/g, ' angle ')
      .replace(/Δ/g, ' triangle ')
      .replace(/°/g, ' degrees ')
      .replace(/±/g, ' plus or minus ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Split text into natural sentence chunks <= 165 chars for neural TTS
  function splitTextIntoSpeechChunks(text: string): string[] {
    const cleaned = formatMathForSpeech(text);
    const rawSentences = cleaned.split(/(?<=[.?!;])\s+/).filter(Boolean);
    const chunks: string[] = [];

    for (const sentence of rawSentences) {
      if (sentence.length <= 165) {
        chunks.push(sentence);
      } else {
        const words = sentence.split(/\s+/);
        let current = '';
        for (const w of words) {
          if ((current + ' ' + w).trim().length > 160) {
            if (current.trim()) chunks.push(current.trim());
            current = w;
          } else {
            current = (current + ' ' + w).trim();
          }
        }
        if (current.trim()) chunks.push(current.trim());
      }
    }
    return chunks.slice(0, 14);
  }

  // Server-side Human Neural Voiceover endpoint (returns individual MP3 chunks + combined MP3)
  app.post('/api/lesson-voiceover', async (req, res) => {
    try {
      const { text, voiceName = 'Kore' } = req.body || {};
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Narration text is required.' });
        return;
      }

      const trimmedText = text.trim().slice(0, 1500);
      const cacheKey = `${voiceName}:${trimmedText}`;
      const cachedAudio = voiceoverCache.get(cacheKey);
      if (cachedAudio) {
        res.json({
          audioDataUrl: cachedAudio.audioDataUrl,
          audioChunks: cachedAudio.audioChunks,
          cached: true,
        });
        return;
      }

      // 1. Synthesize natural human neural MP3 audio across sentence chunks
      const langCode = voiceName === 'Puck' ? 'en-US' : 'en-GB';
      const chunks = splitTextIntoSpeechChunks(trimmedText);

      if (chunks.length > 0) {
        try {
          const validBuffers: Buffer[] = [];
          const chunkDataUrls: string[] = [];

          for (const chunk of chunks) {
            try {
              const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodeURIComponent(
                chunk
              )}`;
              const response = await fetch(ttsUrl, {
                headers: {
                  'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
              });
              if (response.ok) {
                const buf = Buffer.from(await response.arrayBuffer());
                if (buf.length > 256) {
                  validBuffers.push(buf);
                  chunkDataUrls.push(`data:audio/mpeg;base64,${buf.toString('base64')}`);
                }
              }
            } catch {
              // Skip failed individual chunk and continue remaining chunks
            }
          }

          if (chunkDataUrls.length > 0) {
            const combinedMp3 = Buffer.concat(validBuffers);
            const dataUrl = `data:audio/mpeg;base64,${combinedMp3.toString('base64')}`;
            if (voiceoverCache.size > 150) {
              const firstKey = voiceoverCache.keys().next().value;
              if (firstKey) voiceoverCache.delete(firstKey);
            }
            const payload = { audioDataUrl: dataUrl, audioChunks: chunkDataUrls };
            voiceoverCache.set(cacheKey, payload);
            res.json({ ...payload, cached: false });
            return;
          }
        } catch {
          // Fall through to Gemini TTS if available
        }
      }

      // 2. Fallback to Gemini TTS if API key is configured
      if (process.env.GEMINI_API_KEY) {
        try {
          const interaction = await getAiClient().interactions.create({
            model: 'gemini-3.8-flash-lite-tts',
            input: formatMathForSpeech(trimmedText),
            response_format: { type: 'audio' },
          });
          if (interaction.output_audio?.data) {
            const mime = interaction.output_audio.mime_type || 'audio/wav';
            const dataUrl = `data:${mime};base64,${interaction.output_audio.data}`;
            const payload = { audioDataUrl: dataUrl, audioChunks: [dataUrl] };
            voiceoverCache.set(cacheKey, payload);
            res.json({ ...payload, cached: false });
            return;
          }
        } catch {
          // Ignore and return browser fallback
        }
      }

      res.json({ audioDataUrl: null, audioChunks: [], useBrowserSpeech: true });
    } catch {
      res.json({ audioDataUrl: null, audioChunks: [], useBrowserSpeech: true });
    }
  });

  // Server-side AI Multi-Clip Video Lesson Generator (2:45 - 3:00 duration)
  app.post('/api/generate-lesson-video', async (req, res) => {
    try {
      const { moduleCode, moduleTitle, chapterTitle, customTopicPrompt } = req.body || {};
      const prompt = `Create a complete 2-minute 45-second (6-clip) educational mathematics documentary video script and visual storyboard for Class 8 NCERT Ganita Prakash:
Chapter: ${chapterTitle || 'Ganita Prakash Class 8'}
Module: ${moduleCode || 'Module 1.1'} - ${moduleTitle || 'Core Mathematical Concept'}
${customTopicPrompt ? `Special Student Focus: ${customTopicPrompt}` : ''}

Requirements:
1. Create exactly 6 sequential video clips spanning 0:00 to 2:45 (0:00-0:25, 0:25-0:55, 0:55-1:25, 1:25-1:55, 1:55-2:25, 2:25-2:45).
2. Each clip must have:
   - sceneNumber (1 to 6)
   - timeRange (e.g. "0:00 - 0:25")
   - title (engaging clip title)
   - narration (3 to 4 rich, natural spoken sentences for the voiceover narrator explaining the exact mathematical concept, real-world story, and proof)
   - boardFormula (clean human-readable Unicode formula shown on screen, e.g. "1 + 3 + 5 + ... + (2n - 1) = n²" — NEVER use raw LaTeX backslashes)
   - visualCaption (short description of what the animated video clip shows on screen)
3. Also provide 3 concise keyTakeaways and a workedExample (problem, 3 steps, answer) using clean Unicode math.`;

      const response = await getAiClient().models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an award-winning educational math video director for NCERT Class 8 Ganita Prakash. Never use raw LaTeX backslashes (no \\frac, \\sqrt, \\times); always use clean Unicode symbols (√, ², ³, ×, ÷, ∠, Δ, °, ⇒).',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              duration: { type: Type.STRING },
              durationSeconds: { type: Type.INTEGER },
              summary: { type: Type.STRING },
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sceneNumber: { type: Type.INTEGER },
                    timeRange: { type: Type.STRING },
                    title: { type: Type.STRING },
                    narration: { type: Type.STRING },
                    boardFormula: { type: Type.STRING },
                    visualCaption: { type: Type.STRING },
                  },
                  required: [
                    'sceneNumber',
                    'timeRange',
                    'title',
                    'narration',
                    'boardFormula',
                    'visualCaption',
                  ],
                },
              },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              workedExample: {
                type: Type.OBJECT,
                properties: {
                  problem: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  answer: { type: Type.STRING },
                },
                required: ['problem', 'steps', 'answer'],
              },
            },
            required: ['title', 'duration', 'durationSeconds', 'summary', 'scenes', 'keyTakeaways', 'workedExample'],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error: unknown) {
      console.error('Error in /api/generate-lesson-video:', error);
      const errMessage =
        error instanceof Error ? error.message : 'Failed to generate AI video script.';
      res.status(500).json({ error: errMessage });
    }
  });

  // In-memory cache for fast repeat Genius Bar answers
  const geniusBarCache = new Map<
    string,
    { answer: string; steps: string[]; formula: string; example: string; diagramSvg: string }
  >();

  // Deterministic blueprint SVG diagram generator if a geometry/diagrammatic question lacks an AI SVG
  function generateFallbackGeometrySvg(questionText: string, answerText = ''): string {
    const combined = `${questionText} ${answerText}`.toLowerCase();
    const isDiagramQuestion =
      /\b(geometry|geometric|diagram|draw|sketch|illustrate|shape|triangle|hypotenuse|pythagor|right-angled|equilateral|isosceles|scalene|trapezium|trapezoid|parallelogram|rhombus|kite|quadrilateral|polygon|hexagon|pentagon|rectangle|rectangular|square|circle|radius|diameter|chord|tangent|circumference|angle|transversal|parallel|perpendicular|bisector|perimeter|area|diagonal|vertex|vertices|coordinate|parabola|graph|slope|vector|pendulum|lagrangian|force|free body)\b/i.test(
        combined
      );

    if (!isDiagramQuestion) return '';

    if (/\b(pythagor|hypotenuse|right\s+triangle|right-angled)\b/i.test(combined)) {
      return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="14" fill="#0F172A"/>
        <polygon points="95,185 95,55 295,185" fill="rgba(45,212,191,0.14)" stroke="#2DD4BF" stroke-width="3"/>
        <polyline points="95,165 115,165 115,185" fill="none" stroke="#FDE047" stroke-width="2.5"/>
        <text x="80" y="50" fill="#F8FAFC" font-size="14" font-weight="bold" font-family="sans-serif">A</text>
        <text x="78" y="195" fill="#F8FAFC" font-size="14" font-weight="bold" font-family="sans-serif">B (90°)</text>
        <text x="305" y="192" fill="#F8FAFC" font-size="14" font-weight="bold" font-family="sans-serif">C</text>
        <text x="48" y="125" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">Height (a)</text>
        <text x="170" y="212" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">Base (b)</text>
        <text x="205" y="110" fill="#FDE047" font-size="13" font-weight="bold" font-family="monospace">Hypotenuse (c)</text>
        <text x="115" y="32" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">Right Triangle: a² + b² = c²</text>
      </svg>`;
    }

    if (/\b(trapezium|trapezoid)\b/i.test(combined)) {
      return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="14" fill="#0F172A"/>
        <polygon points="125,65 275,65 330,185 70,185" fill="rgba(45,212,191,0.14)" stroke="#2DD4BF" stroke-width="3"/>
        <line x1="125" y1="65" x2="125" y2="185" stroke="#FDE047" stroke-width="2.5" stroke-dasharray="5,5"/>
        <polyline points="125,170 140,170 140,185" fill="none" stroke="#FDE047" stroke-width="2"/>
        <text x="180" y="52" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">Parallel side (a)</text>
        <text x="165" y="210" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">Parallel side (b)</text>
        <text x="133" y="132" fill="#FDE047" font-size="13" font-weight="bold" font-family="monospace">h</text>
        <text x="105" y="28" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">Trapezium: Area = ½ × (a + b) × h</text>
      </svg>`;
    }

    if (/\b(parallelogram)\b/i.test(combined)) {
      return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="14" fill="#0F172A"/>
        <polygon points="115,65 325,65 280,185 70,185" fill="rgba(45,212,191,0.14)" stroke="#2DD4BF" stroke-width="3"/>
        <line x1="115" y1="65" x2="115" y2="185" stroke="#FDE047" stroke-width="2.5" stroke-dasharray="5,5"/>
        <polyline points="115,170 130,170 130,185" fill="none" stroke="#FDE047" stroke-width="2"/>
        <text x="155" y="210" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">Base (b)</text>
        <text x="124" y="132" fill="#FDE047" font-size="13" font-weight="bold" font-family="monospace">Height (h)</text>
        <text x="100" y="32" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">Parallelogram: Area = b × h</text>
      </svg>`;
    }

    if (/\b(rhombus|kite)\b/i.test(combined)) {
      return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="14" fill="#0F172A"/>
        <polygon points="200,45 315,125 200,205 85,125" fill="rgba(45,212,191,0.14)" stroke="#2DD4BF" stroke-width="3"/>
        <line x1="85" y1="125" x2="315" y2="125" stroke="#FDE047" stroke-width="2.5" stroke-dasharray="5,5"/>
        <line x1="200" y1="45" x2="200" y2="205" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="5,5"/>
        <text x="235" y="118" fill="#FDE047" font-size="13" font-weight="bold" font-family="monospace">d₁</text>
        <text x="208" y="88" fill="#38BDF8" font-size="13" font-weight="bold" font-family="monospace">d₂</text>
        <text x="105" y="28" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">Rhombus: Area = ½ × d₁ × d₂</text>
      </svg>`;
    }

    if (/\b(circle|radius|diameter|circumference|chord|tangent)\b/i.test(combined)) {
      return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="14" fill="#0F172A"/>
        <circle cx="200" cy="130" r="72" fill="rgba(45,212,191,0.14)" stroke="#2DD4BF" stroke-width="3"/>
        <circle cx="200" cy="130" r="4" fill="#FDE047"/>
        <line x1="200" y1="130" x2="272" y2="130" stroke="#FDE047" stroke-width="3"/>
        <text x="218" y="122" fill="#FDE047" font-size="13" font-weight="bold" font-family="monospace">r (radius)</text>
        <text x="188" y="148" fill="#F8FAFC" font-size="12" font-weight="bold" font-family="sans-serif">O</text>
        <text x="90" y="34" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">Circle: Area = πr² · C = 2πr</text>
      </svg>`;
    }

    if (/\b(triangle|equilateral|isosceles|scalene|heron)\b/i.test(combined)) {
      return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="14" fill="#0F172A"/>
        <polygon points="200,52 315,188 85,188" fill="rgba(45,212,191,0.14)" stroke="#2DD4BF" stroke-width="3"/>
        <line x1="200" y1="52" x2="200" y2="188" stroke="#FDE047" stroke-width="2.5" stroke-dasharray="5,5"/>
        <polyline points="200,173 215,173 215,188" fill="none" stroke="#FDE047" stroke-width="2"/>
        <text x="195" y="42" fill="#F8FAFC" font-size="14" font-weight="bold" font-family="sans-serif">A</text>
        <text x="68" y="194" fill="#F8FAFC" font-size="14" font-weight="bold" font-family="sans-serif">B</text>
        <text x="323" y="194" fill="#F8FAFC" font-size="14" font-weight="bold" font-family="sans-serif">C</text>
        <text x="208" y="132" fill="#FDE047" font-size="13" font-weight="bold" font-family="monospace">h</text>
        <text x="172" y="212" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">Base (b)</text>
      </svg>`;
    }

    if (/\b(rectangle|rectangular|square)\b/i.test(combined)) {
      return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="14" fill="#0F172A"/>
        <rect x="95" y="62" width="210" height="120" fill="rgba(45,212,191,0.14)" stroke="#2DD4BF" stroke-width="3"/>
        <line x1="95" y1="62" x2="305" y2="182" stroke="#FDE047" stroke-width="2" stroke-dasharray="5,5"/>
        <text x="165" y="206" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">Length (l)</text>
        <text x="315" y="128" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">Width (w)</text>
        <text x="195" y="115" fill="#FDE047" font-size="12" font-weight="bold" font-family="monospace">d = √(l² + w²)</text>
      </svg>`;
    }

    if (/\b(angle|transversal|parallel|supplementary|complementary|bisector)\b/i.test(combined)) {
      return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="14" fill="#0F172A"/>
        <line x1="60" y1="85" x2="340" y2="85" stroke="#2DD4BF" stroke-width="3"/>
        <line x1="60" y1="165" x2="340" y2="165" stroke="#2DD4BF" stroke-width="3"/>
        <line x1="135" y1="35" x2="265" y2="215" stroke="#FDE047" stroke-width="3"/>
        <path d="M 192 85 A 24 24 0 0 0 180 65" fill="none" stroke="#F8FAFC" stroke-width="2.5"/>
        <path d="M 248 165 A 24 24 0 0 0 236 145" fill="none" stroke="#F8FAFC" stroke-width="2.5"/>
        <text x="196" y="75" fill="#FDE047" font-size="13" font-weight="bold" font-family="monospace">θ</text>
        <text x="252" y="155" fill="#FDE047" font-size="13" font-weight="bold" font-family="monospace">θ</text>
        <text x="95" y="28" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">Parallel Lines &amp; Transversal Angles</text>
      </svg>`;
    }

    return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" rx="14" fill="#0F172A"/>
      <line x1="50" y1="190" x2="355" y2="190" stroke="#475569" stroke-width="2"/>
      <line x1="80" y1="215" x2="80" y2="30" stroke="#475569" stroke-width="2"/>
      <polygon points="110,170 210,60 310,170" fill="rgba(45,212,191,0.15)" stroke="#2DD4BF" stroke-width="3"/>
      <line x1="210" y1="60" x2="210" y2="170" stroke="#FDE047" stroke-width="2.5" stroke-dasharray="5,5"/>
      <circle cx="210" cy="60" r="4.5" fill="#FDE047"/>
      <circle cx="110" cy="170" r="4.5" fill="#2DD4BF"/>
      <circle cx="310" cy="170" r="4.5" fill="#2DD4BF"/>
      <text x="204" y="48" fill="#F8FAFC" font-size="13" font-weight="bold" font-family="sans-serif">A</text>
      <text x="95" y="185" fill="#F8FAFC" font-size="13" font-weight="bold" font-family="sans-serif">B</text>
      <text x="318" y="185" fill="#F8FAFC" font-size="13" font-weight="bold" font-family="sans-serif">C</text>
      <text x="218" y="122" fill="#FDE047" font-size="13" font-weight="bold" font-family="monospace">h</text>
    </svg>`;
  }

  // Server-side Genius Bar Universal Q&A & Camera Photo Scanner Endpoint (100% Independent of Chapters)
  app.post('/api/genius-bar', async (req, res) => {
    const { question, imageBase64, imageMimeType } = req.body || {};
    const cleanQuestion = typeof question === 'string' ? question.trim() : '';
    const hasImage = Boolean(imageBase64 && imageMimeType);

    if (!cleanQuestion && !hasImage) {
      res.json({
        answer: 'Welcome to the Genius Bar! Ask any question or scan a photo of a question to get an answer.',
        steps: [],
        formula: '',
        example: '',
        diagramSvg: '',
      });
      return;
    }

    const cacheKey = hasImage ? '' : cleanQuestion.toLowerCase();
    if (cacheKey) {
      const cached = geniusBarCache.get(cacheKey);
      if (cached) {
        res.json(cached);
        return;
      }
    }

    // Tier 1: Gemini AI (supports both text questions and Camera Scanner photo inputs, 100% chapter-independent)
    if (process.env.GEMINI_API_KEY) {
      try {
        const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
        if (hasImage) {
          parts.push({
            inlineData: {
              mimeType: String(imageMimeType),
              data: String(imageBase64),
            },
          });
        }
        parts.push({
          text: hasImage
            ? `Read the question or problem shown in this photo and solve/answer it completely. If the problem involves geometry, shapes, angles, graphs, forces, or any diagrammatic concept, also generate a clear, labeled SVG diagram in diagramSvg. ${
                cleanQuestion ? `Additional user note: ${cleanQuestion}` : ''
              }`
            : cleanQuestion,
        });

        const geminiPromise = getAiClient().models.generateContent({
          model: hasImage ? 'gemini-3.8-flash' : 'gemini-3.1-flash-lite',
          contents: { parts },
          config: {
            systemInstruction:
              'You are the Genius Bar Universal AI Mentor. You are completely independent of any school chapter. Answer ANY question the user asks or scans (geometry, advanced physics like the Lagrangian L = T - V, calculus, chemistry, biology, history, coding, general knowledge, or mathematics) accurately, directly, and concisely. Never use raw LaTeX backslashes (no \\frac, \\sqrt, \\partial); always use clean Unicode symbols (√, ², ³, ×, ÷, ½, ∂, ∫, ∑, Δ, ∠, °, ⇒). DIAGRAM RULE: Whenever the question involves geometry, 2D/3D shapes, triangles, quadrilaterals, circles, angles, area/perimeter, trigonometry, coordinate graphs, vectors, physics free-body/pendulum systems, or whenever the user asks for a diagram/sketch, you MUST populate `diagramSvg` with a valid, self-contained `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">...</svg>` string using a dark blueprint background (`<rect width="400" height="240" rx="14" fill="#0F172A"/>`), bright teal (`#2DD4BF`) and amber (`#FDE047`) strokes, and white/teal (`#F8FAFC`, `#5EEAD4`) `<text>` labels showing the exact vertices, angles, or dimensions of the problem. For purely non-visual text topics where a diagram is unnecessary, return an empty string `""` for `diagramSvg`.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                answer: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                formula: { type: Type.STRING },
                example: { type: Type.STRING },
                diagramSvg: {
                  type: Type.STRING,
                  description:
                    'Complete <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">...</svg> diagram for geometry, coordinate graph, physics, or diagrammatic questions; empty string "" if no diagram is needed.',
                },
              },
              required: ['answer', 'steps', 'formula', 'example', 'diagramSvg'],
            },
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 7500)
        );

        const response = await Promise.race([geminiPromise, timeoutPromise]);
        const rawText = (response.text ?? '{}').trim();
        const parsed = JSON.parse(rawText);
        if (parsed.answer) {
          const rawSvg =
            typeof parsed.diagramSvg === 'string' && parsed.diagramSvg.includes('<svg')
              ? parsed.diagramSvg.trim()
              : generateFallbackGeometrySvg(cleanQuestion, String(parsed.answer));
          const result = {
            answer: String(parsed.answer),
            steps: Array.isArray(parsed.steps) ? parsed.steps.map(String) : [],
            formula: parsed.formula ? String(parsed.formula) : '',
            example: parsed.example ? String(parsed.example) : '',
            diagramSvg: rawSvg,
          };
          if (cacheKey) geniusBarCache.set(cacheKey, result);
          res.json(result);
          return;
        }
      } catch {
        // Proceed to Tier 2 universal lookup
      }
    }

    // Tier 2: Fast Typo-Tolerant Universal Encyclopedia Lookup (Handles "langrangian" -> "Lagrangian mechanics", etc.)
    if (!hasImage) {
      try {
        const searchTopic = cleanQuestion
          .replace(
            /^(can you|could you|please|what is a|what is an|what is the|what is|what are|who is|who was|where is|when was|how do|how does|how is|why is|why do|why does|explain|tell me about|define|describe|draw|sketch)\s+/i,
            ''
          )
          .replace(/\?+$/, '')
          .trim()
          .replace(/langrangian/gi, 'Lagrangian mechanics');

        if (searchTopic.length >= 2) {
          // Step A: Search with spellcheck suggestion support
          const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            searchTopic
          )}&srinfo=suggestion&srlimit=1&format=json`;
          const sRes = await fetch(searchUrl);
          if (sRes.ok) {
            const sData = await sRes.json();
            let bestTitle: string | undefined = sData?.query?.search?.[0]?.title;
            const suggestion: string | undefined = sData?.query?.searchinfo?.suggestion;

            if (!bestTitle && suggestion) {
              const retryRes = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
                  suggestion
                )}&srlimit=1&format=json`
              );
              if (retryRes.ok) {
                const retryData = await retryRes.json();
                bestTitle = retryData?.query?.search?.[0]?.title;
              }
            }

            if (bestTitle) {
              const sumRes = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`
              );
              if (sumRes.ok) {
                const sumData = await sumRes.json();
                const extractText = String(sumData?.extract || '').trim();
                if (extractText.length > 20) {
                  const sentences = extractText.split(/(?<=[.?!])\s+/).filter(Boolean);
                  const answerStr = sentences.slice(0, 2).join(' ');
                  const result = {
                    answer: answerStr,
                    steps: sentences.slice(2, 5),
                    formula:
                      bestTitle.toLowerCase().includes('lagrang')
                        ? 'L = T − V  (Lagrangian = Kinetic Energy T − Potential Energy V)'
                        : '',
                    example: `Encyclopedia Reference: ${bestTitle}`,
                    diagramSvg: generateFallbackGeometrySvg(cleanQuestion, answerStr),
                  };
                  if (cacheKey) geniusBarCache.set(cacheKey, result);
                  res.json(result);
                  return;
                }
              }
            }
          }
        }
      } catch {
        // Proceed to Tier 3 AI fallback
      }
    }

    // Tier 3: Universal AI Fallback for open-ended or conversational prompts
    try {
      const aiResponse = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai-fast',
          messages: [
            {
              role: 'system',
              content:
                'You are the Genius Bar AI Mentor. Give a concise, accurate, direct 2-4 sentence answer to the user question.',
            },
            {
              role: 'user',
              content: cleanQuestion || 'Solve the scanned question.',
            },
          ],
        }),
      });
      if (aiResponse.ok) {
        const text = (await aiResponse.text()).trim();
        if (text) {
          res.json({
            answer: text,
            steps: [],
            formula: '',
            example: '',
            diagramSvg: generateFallbackGeometrySvg(cleanQuestion, text),
          });
          return;
        }
      }
    } catch {
      // Ignore
    }

    res.json({
      answer: `Could not reach the AI solver for "${cleanQuestion}". Please check your connection or try phrasing the question again.`,
      steps: [],
      formula: '',
      example: '',
      diagramSvg: generateFallbackGeometrySvg(cleanQuestion),
    });
  });

  // Health check endpoint for instant readiness verification
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', port: PORT });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vitePromise = createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? undefined : false,
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const startListening = (retriesLeft = 5) => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Parabola Studio server running on http://0.0.0.0:${PORT}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && retriesLeft > 0) {
        console.warn(`Port ${PORT} in use, retrying in 400ms... (${retriesLeft} retries left)`);
        setTimeout(() => {
          server.close();
          startListening(retriesLeft - 1);
        }, 400);
      } else {
        console.error('Server failed to start:', err);
      }
    });

    const shutdown = () => {
      server.close(() => {
        process.exit(0);
      });
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  };

  startListening();
}

startServer();
