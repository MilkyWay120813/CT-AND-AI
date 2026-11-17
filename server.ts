import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import * as math from 'mathjs';
import { solveGeniusMath } from './src/utils/geniusMathSolver';
import { searchBookKnowledge } from './src/utils/bookKnowledgeSearch';
import { formatMathText } from './src/utils/formatMath';

dotenv.config({ quiet: true });

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
  const PORT = Number(process.env.PORT) || 8080;

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
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
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
          const ttsResponse = await getAiClient().models.generateContent({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: formatMathForSpeech(trimmedText),
                  },
                ],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: voiceName === 'Puck' ? 'Puck' : 'Kore',
                  },
                },
              },
            },
          });
          const base64Audio =
            ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            const mime =
              ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType ||
              'audio/wav';
            const dataUrl = `data:${mime};base64,${base64Audio}`;
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
        model: 'gemini-4-hydrogen',
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

  // Clean raw encyclopedia snippets into short, simple student-friendly language
  function cleanSimpleEncyclopediaText(raw: string): string {
    return raw
      .replace(/\[[^\]]*\]/g, '')
      .replace(/\s*\([^)]*(?:listen|pronounced|\/[^/]+\/|Latin:|Greek:|from Greek|from Latin|literally)[^)]*\)/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Real Encyclopedic Knowledge Lookup (prefers Simple English Wikipedia first for crisp, easy answers)
  async function lookupEncyclopediaKnowledge(rawQuestion: string): Promise<{
    answer: string;
    steps: string[];
    formula: string;
    example: string;
    diagramSvg: string;
  } | null> {
    const trimmed = rawQuestion.trim().replace(/[?!.]+$/, '').trim();
    const isCausalQuestion = /^(?:why|how)\b/i.test(trimmed);
    const strippedTopic = trimmed
      .replace(
        /^(?:please\s+|can\s+you\s+|could\s+you\s+)?(?:tell\s+me\s+(?:about\s+)?|explain\s+(?:what\s+(?:is|are)\s+)?|define\s+|describe\s+|what\s+(?:is|are|was|were)\s+(?:a\s+|an\s+|the\s+)?|who\s+(?:is|are|was|were|invented|discovered|wrote|founded)\s+|why\s+(?:is|are|do|does|did)\s+|how\s+(?:do|does|did|is|are)\s+)/i,
        ''
      )
      .trim();
    const searchTopic = isCausalQuestion ? trimmed : strippedTopic || trimmed;

    if (!searchTopic || searchTopic.length < 2) return null;

    const queryTokens = strippedTopic
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !['the', 'and', 'for', 'with', 'that', 'this', 'from'].includes(w));

    const searchOnDomain = async (host: string, qStr: string, ctrl: AbortController) => {
      const searchUrl =
        `https://${host}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          qStr
        )}&srlimit=4&format=json&origin=*`;
      const sRes = await fetch(searchUrl, {
        signal: ctrl.signal,
        headers: { 'User-Agent': 'ParabolaStudio/1.0' },
      });
      if (!sRes.ok) return null;
      const sData = (await sRes.json()) as {
        query?: { search?: Array<{ title?: string }> };
      };
      const candidates = (sData.query?.search || [])
        .map((item) => item.title)
        .filter((t): t is string => Boolean(t && !/^(list of|outline of)/i.test(t)));

      let fallbackMatch: {
        answer: string;
        steps: string[];
        formula: string;
        example: string;
        diagramSvg: string;
      } | null = null;

      for (const title of candidates) {
        const sumUrl = `https://${host}/api/rest_v1/page/summary/${encodeURIComponent(
          title.replace(/ /g, '_')
        )}`;
        const sumRes = await fetch(sumUrl, {
          signal: ctrl.signal,
          headers: { 'User-Agent': 'ParabolaStudio/1.0' },
        });
        if (!sumRes.ok) continue;
        const sumData = (await sumRes.json()) as {
          type?: string;
          title?: string;
          description?: string;
          extract?: string;
        };
        if (sumData.type === 'disambiguation' || !sumData.extract) continue;

        const cleanedExtract = cleanSimpleEncyclopediaText(sumData.extract);
        const descAndExtract = `${sumData.description || ''} ${cleanedExtract}`;
        const lowerCheck = `${sumData.title || ''} ${descAndExtract}`.toLowerCase();
        // Skip unrelated matches
        if (queryTokens.length > 0 && !queryTokens.some((tok) => lowerCheck.includes(tok))) {
          continue;
        }
        const hasCausalMechanism =
          /\b(scatter(?:ing|ed)?|rayleigh|wavelength|atmosphere|because|due to|caused by|phenomenon|process|mechanism)\b/i.test(
            descAndExtract
          );
        const isSwatchOrShallowColor = /\b(color|colour|shade of|cool color|warm color|tint of|pigment|attestation)\b/i.test(
          descAndExtract
        );
        if (isCausalQuestion && isSwatchOrShallowColor && !hasCausalMechanism) {
          continue;
        }

        const sentences = cleanedExtract
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter((s) => s.length >= 12);
        const primaryAnswer = sentences.slice(0, 2).join(' ') || cleanedExtract;
        const extraPoints = sentences.slice(2, 4);

        const built = {
          answer: primaryAnswer,
          steps: extraPoints,
          formula: sumData.title
            ? `${sumData.title}${sumData.description ? ` — ${sumData.description}` : ''}`
            : '',
          example: '',
          diagramSvg: generateFallbackGeometrySvg(rawQuestion, primaryAnswer),
        };

        if (isCausalQuestion && !hasCausalMechanism) {
          if (!fallbackMatch) fallbackMatch = built;
          continue;
        }
        return built;
      }
      return fallbackMatch;
    };

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4500);
    try {
      // 1. Prefer Simple English Wikipedia for clear, easy-to-understand explanations
      const simpleHit = await searchOnDomain(
        'simple.wikipedia.org',
        isCausalQuestion ? searchTopic : strippedTopic || searchTopic,
        ctrl
      );
      if (simpleHit) {
        return simpleHit;
      }
      // 2. Fallback to standard English Wikipedia (with causal query preserved and simplified sentences)
      const enHit = await searchOnDomain('en.wikipedia.org', searchTopic, ctrl);
      if (enHit) {
        return enHit;
      }
    } catch {
      // Fall through cleanly if network lookup fails
    } finally {
      clearTimeout(timer);
    }
    return null;
  }

  // Server-side Genius Bar Universal Q&A & Camera Photo Scanner Endpoint (Answers ALL Questions)
  app.post('/api/genius-bar', async (req, res) => {
    const { question, imageBase64, imageMimeType } = req.body || {};
    const cleanQuestion = typeof question === 'string' ? question.trim() : '';
    const hasImage = Boolean(imageBase64 && imageMimeType);

    if (!cleanQuestion && !hasImage) {
      res.json({
        answer:
          'Welcome to the Genius Bar! Ask any question — calculus, algebra, geometry, textbook terms, science, or general knowledge — or scan a photo of your problem.',
        steps: [],
        formula: '',
        example: '',
        diagramSvg: '',
      });
      return;
    }

    // Fast Path 1: Instant deterministic symbolic calculus, algebra, trig, number theory & geometry solver
    if (!hasImage && cleanQuestion) {
      const mathResult = solveGeniusMath(cleanQuestion);
      if (mathResult) {
        res.json({
          ...mathResult,
          diagramSvg:
            mathResult.diagramSvg || generateFallbackGeometrySvg(cleanQuestion, mathResult.answer),
        });
        return;
      }

      // Fast Path 2: Exact Ganita Prakash Class 8 textbook glossary & 112-module curriculum lookup
      const bookResult = searchBookKnowledge(cleanQuestion);
      if (bookResult) {
        res.json({
          ...bookResult,
          diagramSvg:
            bookResult.diagramSvg || generateFallbackGeometrySvg(cleanQuestion, bookResult.answer),
        });
        return;
      }
    }

    const cacheKey = hasImage ? '' : cleanQuestion.toLowerCase();
    if (cacheKey) {
      const cached = geniusBarCache.get(cacheKey);
      if (cached) {
        res.json(cached);
        return;
      }
    }

    let geminiErrorMsg = '';
    let geminiErrorStatus = 0;

    // Tier 1: Fast Universal Gemini AI (gemini-4-hydrogen with ThinkingLevel.MINIMAL for rapid text Q&A)
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (apiKey && apiKey !== 'missing-api-key') {
      for (let attempt = 0; attempt < 2; attempt++) {
        const controller = new AbortController();
        const timeoutMs = attempt === 0 ? 15000 : 12000;
        const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);
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
              ? `Read the problem shown in this image and explain the complete answer clearly in 3-5 concise steps. ${
                  cleanQuestion ? `Student note: ${cleanQuestion}` : ''
                }`
              : `Answer this question clearly and concisely (include 2-4 crisp bullet steps if helpful): ${cleanQuestion}`,
          });

          const geminiPromise = getAiClient().models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: { parts },
            config: {
              abortSignal: controller.signal,
              thinkingConfig: {
                thinkingLevel: hasImage ? ThinkingLevel.LOW : ThinkingLevel.MINIMAL,
              },
              systemInstruction:
                'You are the Genius Bar friendly Class 8 AI Tutor. Answer ANY student question factually and in VERY SIMPLE, clear, easy-to-understand everyday language (short direct sentences, intuitive examples, zero unnecessary college jargon). Never reject a valid question as off-topic. Never use raw LaTeX backslashes (no \\frac, \\sqrt, \\times); always use clean Unicode symbols (√, ², ³, ×, ÷, ½, ∠, °, π, ∫, Δ).',
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
                },
                required: ['answer', 'steps', 'formula', 'example'],
              },
            },
          });

          const response = await geminiPromise;
          clearTimeout(timeoutHandle);
          const rawText = (response.text ?? '{}').trim();
          const parsed = JSON.parse(rawText);
          if (parsed.answer) {
            const answerClean = formatMathText(String(parsed.answer));
            const result = {
              answer: answerClean,
              steps: Array.isArray(parsed.steps) ? parsed.steps.map((s: unknown) => formatMathText(String(s))) : [],
              formula: parsed.formula ? formatMathText(String(parsed.formula)) : '',
              example: parsed.example ? formatMathText(String(parsed.example)) : '',
              diagramSvg: generateFallbackGeometrySvg(cleanQuestion, answerClean),
            };
            if (cacheKey) geniusBarCache.set(cacheKey, result);
            res.json(result);
            return;
          }
        } catch (err: unknown) {
          clearTimeout(timeoutHandle);
          const errObj = err as { status?: number; message?: string; name?: string };
          geminiErrorStatus = typeof errObj?.status === 'number' ? errObj.status : 0;
          const isAbort =
            errObj?.name === 'AbortError' || /abort|timeout/i.test(String(errObj?.message || ''));
          geminiErrorMsg = isAbort
            ? 'Gemini response timed out'
            : errObj?.message || 'Gemini request failed';

          const isRetryable =
            attempt === 0 && (geminiErrorStatus === 429 || geminiErrorStatus >= 500);
          if (isRetryable) {
            await new Promise((r) => setTimeout(r, 350));
            continue;
          }
          break;
        }
      }
    }

    // Tier 2: Real Encyclopedic Knowledge Lookup for general/science/history/math-concept questions
    if (!hasImage && cleanQuestion) {
      const wikiResult = await lookupEncyclopediaKnowledge(cleanQuestion);
      if (wikiResult) {
        if (cacheKey) geniusBarCache.set(cacheKey, wikiResult);
        res.json(wikiResult);
        return;
      }
    }

    // Tier 3: Honest, helpful error response (never falsely rejecting questions as "not math")
    if (!apiKey || apiKey === 'missing-api-key') {
      res.status(503).json({
        error: hasImage
          ? 'Scanning photos requires a GEMINI_API_KEY configured in Settings > Secrets. Typed math, calculus, equations, and encyclopedic topic questions work right away.'
          : 'Open-ended conversational questions require a GEMINI_API_KEY in Settings > Secrets. All typed math, calculus (e.g. "derivative of 3x^2"), equations, and factual topic lookups remain available.',
        needsApiKey: true,
      });
      return;
    }

    if (geminiErrorStatus === 429) {
      res.status(429).json({
        error: 'The AI tutor quota/rate limit was temporarily exceeded. Please wait a moment and ask again, or verify your Gemini API key tier in Settings > Secrets.',
      });
      return;
    }

    if (geminiErrorStatus === 400 || geminiErrorStatus === 401 || geminiErrorStatus === 403) {
      res.status(geminiErrorStatus).json({
        error: 'The configured Gemini API key could not be authenticated. Please check GEMINI_API_KEY in Settings > Secrets.',
        needsApiKey: true,
      });
      return;
    }

    res.status(502).json({
      error: hasImage
        ? 'Could not read the scanned photo cleanly. Please try a sharper, well-lit image or type the question below.'
        : `Could not reach the AI service for this prompt (${geminiErrorMsg || 'upstream unavailable'}). Please try rephrasing or try again shortly.`,
    });
  });

  // ==========================================================================
  // LENIENT LONG-ANSWER SOLUTION GRADING (TYPED OR SCANNED HANDWRITING)
  // ==========================================================================
  app.post('/api/grade-solution', async (req, res) => {
    try {
      const {
        questionPrompt,
        expectedAnswer,
        expectedExplanation,
        typedSolution,
        imageBase64,
        imageMimeType,
      } = req.body || {};

      const cleanTyped = typeof typedSolution === 'string' ? typedSolution.trim() : '';
      const hasImg = Boolean(imageBase64 && imageMimeType);

      if (!cleanTyped && !hasImg) {
        res.status(400).json({ error: 'Please type your solution or upload/scan a photo of your work.' });
        return;
      }

      // Deterministic lenient check for typed text if it clearly includes final answer + reasoning
      const normalizeTok = (s: string) =>
        s
          .toLowerCase()
          .replace(/,/g, '')
          .replace(/\b(cm²|cm³|cm|sq cm|m²|m|kg|rs\.?|₹|°|degrees|%)\b/g, '')
          .replace(/\s+/g, '')
          .trim();

      const expNorm = normalizeTok(String(expectedAnswer || ''));
      const typedNorm = normalizeTok(cleanTyped);
      const numMatches = expectedAnswer
        ? String(expectedAnswer).match(/-?\d+(?:\.\d+)?/g) || []
        : [];
      const hasExpectedNum =
        numMatches.length > 0 &&
        numMatches.every((n) => cleanTyped.replace(/,/g, '').includes(n));

      if (!hasImg && (typedNorm === expNorm || (cleanTyped.length >= 12 && hasExpectedNum))) {
        res.json({
          isCorrect: true,
          creditScore: cleanTyped.length >= 20 ? 10 : 8,
          detectedFinalAnswer: String(expectedAnswer || ''),
          feedback:
            'Well done! Your working includes the key step/value and reaches the correct conclusion.',
        });
        return;
      }

      if (process.env.GEMINI_API_KEY) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        try {
          const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
          if (hasImg) {
            parts.push({
              inlineData: {
                mimeType: String(imageMimeType),
                data: String(imageBase64),
              },
            });
          }
          parts.push({
            text: `Grade a Class 8 student's Long Answer math solution LENIENTLY.
Question: ${questionPrompt}
Reference Answer: ${expectedAnswer}
Reference Solution: ${expectedExplanation}
${cleanTyped ? `Student Typed Solution:\n${cleanTyped}` : 'Read the handwritten/scanned solution from the attached photo carefully.'}

LENIENT GRADING RUBRIC:
- Award credit (isCorrect = true, creditScore >= 6 out of 10) if the student demonstrates sound mathematical method/formula OR arrives at an equivalent final value, EVEN IF there is a minor arithmetic slip, skipped trivial algebra line, missing units, or messy handwriting.
- Only mark isCorrect = false (creditScore <= 5) if the work is mostly unrelated, blank, or applies a completely wrong concept.`,
          });

          const resp = await getAiClient().models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: { parts },
            config: {
              abortSignal: controller.signal,
              thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
              systemInstruction:
                'You are an encouraging, slightly lenient Class 8 mathematics examiner. Focus on understanding and method. Output concise plain-text feedback with Unicode math symbols.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  isCorrect: { type: Type.BOOLEAN },
                  creditScore: { type: Type.INTEGER },
                  detectedFinalAnswer: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                },
                required: ['isCorrect', 'creditScore', 'detectedFinalAnswer', 'feedback'],
              },
            },
          });
          clearTimeout(timer);
          const parsed = JSON.parse((resp.text ?? '{}').trim());
          const score = Math.max(0, Math.min(10, Number(parsed.creditScore) || 0));
          res.json({
            isCorrect: Boolean(parsed.isCorrect) || score >= 6,
            creditScore: score,
            detectedFinalAnswer: String(parsed.detectedFinalAnswer || ''),
            feedback: String(parsed.feedback || 'Solution reviewed.'),
          });
          return;
        } catch {
          clearTimeout(timer);
        }
      }

      // Lenient offline fallback: check if any significant mathematical tokens or final value appear
      const expWords = String(expectedExplanation || '')
        .toLowerCase()
        .match(/\b\d+\b/g) || [];
      const overlapCount = expWords.filter((w) =>
        cleanTyped.replace(/,/g, '').includes(w)
      ).length;
      const lenientPass = hasImg || hasExpectedNum || overlapCount >= 2 || cleanTyped.length >= 40;

      res.json({
        isCorrect: lenientPass,
        creditScore: lenientPass ? 7 : 4,
        detectedFinalAnswer: cleanTyped.slice(-40) || 'Scanned work',
        feedback: lenientPass
          ? 'Credit awarded under lenient step-check! Compare your working with the model solution below.'
          : 'Try writing at least 2 clear mathematical steps and your final numerical result.',
      });
    } catch (err) {
      console.error('Error in /api/grade-solution:', err);
      res.status(500).json({ error: 'Could not grade solution right now.' });
    }
  });

  // ==========================================================================
  // STUDENT ACCOUNT REGISTRATION & PROGRESS SAVING API (NO EMAIL REQUIRED)
  // ==========================================================================
  interface QuizAttemptRecord {
    id: string;
    quizKey: string;
    quizKind: string;
    title: string;
    chapterIds: string[];
    score: number;
    total: number;
    percentage: number;
    timestamp: string;
    passed: boolean;
  }

  interface StoredAccount {
    username: string;
    mascot: string;
    pin: string;
    grade?: string;
    createdAt: string;
    lastLoginAt: string;
    points: number;
    unlockedBadgeIds: string[];
    chapterGamePoints: Record<string, number>;
    quizHistory?: QuizAttemptRecord[];
    completedQuizKeys?: string[];
    streakCount?: number;
    longestStreak?: number;
    lastStreakDate?: string | null;
    streakHistoryDays?: string[];
  }

  const accountsFilePath = path.join(__dirname, 'student_accounts_data.json');
  const studentAccounts = new Map<string, StoredAccount>();

  try {
    if (fs.existsSync(accountsFilePath)) {
      const raw = fs.readFileSync(accountsFilePath, 'utf-8');
      const list: StoredAccount[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        list.forEach((acc) => {
          if (acc.username) {
            const parsedPts = Number(acc.points);
            acc.points = Number.isFinite(parsedPts) ? Math.min(4000, Math.max(0, parsedPts)) : 0;
            acc.quizHistory = Array.isArray(acc.quizHistory) ? acc.quizHistory : [];
            acc.completedQuizKeys = Array.isArray(acc.completedQuizKeys) ? acc.completedQuizKeys : [];
            acc.streakCount = Math.max(0, Math.floor(Number(acc.streakCount) || 0));
            acc.longestStreak = Math.max(acc.streakCount, Math.floor(Number(acc.longestStreak) || 0));
            acc.lastStreakDate = typeof acc.lastStreakDate === 'string' ? acc.lastStreakDate : null;
            acc.streakHistoryDays = Array.isArray(acc.streakHistoryDays) ? acc.streakHistoryDays : [];
            studentAccounts.set(acc.username.toLowerCase().trim(), acc);
          }
        });
      }
    }
  } catch (err) {
    console.warn('[Accounts] Could not read accounts file:', err);
  }

  // Deterministic demo student account starting cleanly at 0 stats
  if (!studentAccounts.has('demostudent')) {
    studentAccounts.set('demostudent', {
      username: 'DemoStudent',
      mascot: '🦉',
      pin: '1234',
      grade: 'Class 8',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      points: 0,
      unlockedBadgeIds: [],
      chapterGamePoints: {},
      quizHistory: [],
      completedQuizKeys: [],
      streakCount: 0,
      longestStreak: 0,
      lastStreakDate: null,
      streakHistoryDays: [],
    });
  }

  function persistAccountsToDisk() {
    try {
      const list = Array.from(studentAccounts.values());
      fs.writeFileSync(accountsFilePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[Accounts] Could not write accounts file:', err);
    }
  }

  // 1. Register Account (NO EMAIL!)
  app.post('/api/accounts/register', (req, res) => {
    try {
      const {
        username,
        mascot = '🦉',
        pin,
        grade = 'Class 8',
        initialPoints = 0,
        initialBadgeIds = [],
        initialChapterPoints = {},
        initialQuizHistory = [],
        initialCompletedQuizKeys = [],
        initialStreakCount = 0,
        initialLongestStreak = 0,
        initialLastStreakDate = null,
        initialStreakHistoryDays = [],
      } = req.body || {};

      const cleanUser = String(username || '').trim();
      const cleanPin = String(pin || '').trim();

      if (!cleanUser || cleanUser.length < 2) {
        res.status(400).json({ error: 'Username must be at least 2 characters.' });
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(cleanUser)) {
        res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores.' });
        return;
      }
      if (!cleanPin || cleanPin.length < 3) {
        res.status(400).json({ error: 'Please enter a 4-digit secret PIN or passcode.' });
        return;
      }

      const lookupKey = cleanUser.toLowerCase();
      if (studentAccounts.has(lookupKey)) {
        res.status(409).json({ error: 'This student username is already registered. Please log in or choose another.' });
        return;
      }

      const parsedInitPts = Number(initialPoints);
      const safeStreak = Math.max(0, Math.floor(Number(initialStreakCount) || 0));
      const newAccount: StoredAccount = {
        username: cleanUser,
        mascot: String(mascot || '🦉'),
        pin: cleanPin,
        grade: String(grade || 'Class 8'),
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        points: Number.isFinite(parsedInitPts) ? Math.min(4000, Math.max(0, parsedInitPts)) : 0,
        unlockedBadgeIds: Array.isArray(initialBadgeIds) ? initialBadgeIds : [],
        chapterGamePoints: typeof initialChapterPoints === 'object' && initialChapterPoints !== null ? initialChapterPoints : {},
        quizHistory: Array.isArray(initialQuizHistory) ? initialQuizHistory : [],
        completedQuizKeys: Array.isArray(initialCompletedQuizKeys) ? initialCompletedQuizKeys : [],
        streakCount: safeStreak,
        longestStreak: Math.max(safeStreak, Math.floor(Number(initialLongestStreak) || 0)),
        lastStreakDate: typeof initialLastStreakDate === 'string' ? initialLastStreakDate : null,
        streakHistoryDays: Array.isArray(initialStreakHistoryDays) ? initialStreakHistoryDays : [],
      };

      studentAccounts.set(lookupKey, newAccount);
      persistAccountsToDisk();

      // Return public profile (omitting secret PIN)
      const { pin: _p, ...profile } = newAccount;
      res.status(201).json({ success: true, profile });
    } catch (err) {
      console.error('[Accounts Register Error]:', err);
      res.status(500).json({ error: 'Failed to create student account.' });
    }
  });

  // 2. Student Login (Username + PIN)
  app.post('/api/accounts/login', (req, res) => {
    try {
      const { username, pin } = req.body || {};
      const cleanUser = String(username || '').trim().toLowerCase();
      const cleanPin = String(pin || '').trim();

      if (!cleanUser || !cleanPin) {
        res.status(400).json({ error: 'Please enter both student username and 4-digit PIN.' });
        return;
      }

      const account = studentAccounts.get(cleanUser);
      if (!account || account.pin !== cleanPin) {
        res.status(401).json({ error: 'Incorrect username or 4-digit PIN.' });
        return;
      }

      account.lastLoginAt = new Date().toISOString();
      persistAccountsToDisk();

      const { pin: _p, ...profile } = account;
      res.json({ success: true, profile });
    } catch (err) {
      console.error('[Accounts Login Error]:', err);
      res.status(500).json({ error: 'Failed to log in.' });
    }
  });

  // 3. Save / Sync Progress
  app.post('/api/accounts/save-progress', (req, res) => {
    try {
      const {
        username,
        pin,
        points,
        unlockedBadgeIds,
        chapterGamePoints,
        quizHistory,
        completedQuizKeys,
        streakCount,
        longestStreak,
        lastStreakDate,
        streakHistoryDays,
      } = req.body || {};
      const cleanUser = String(username || '').trim().toLowerCase();
      const cleanPin = String(pin || '').trim();

      const account = studentAccounts.get(cleanUser);
      if (!account || account.pin !== cleanPin) {
        res.status(401).json({ error: 'Authentication failed for saving progress.' });
        return;
      }

      if (typeof points === 'number') {
        account.points = Math.min(4000, Math.max(0, points));
      }
      if (Array.isArray(unlockedBadgeIds)) {
        const set = new Set([...account.unlockedBadgeIds, ...unlockedBadgeIds]);
        account.unlockedBadgeIds = Array.from(set);
      }
      if (typeof chapterGamePoints === 'object' && chapterGamePoints !== null) {
        account.chapterGamePoints = {
          ...account.chapterGamePoints,
          ...chapterGamePoints,
        };
      }
      if (Array.isArray(quizHistory)) {
        const existingHistory = Array.isArray(account.quizHistory) ? account.quizHistory : [];
        const byId = new Map<string, QuizAttemptRecord>();
        existingHistory.forEach((h) => {
          if (h && h.id) byId.set(h.id, h);
        });
        quizHistory.forEach((h: QuizAttemptRecord) => {
          if (h && h.id) byId.set(h.id, h);
        });
        account.quizHistory = Array.from(byId.values()).slice(-120);
      }
      if (Array.isArray(completedQuizKeys)) {
        const keySet = new Set([
          ...(Array.isArray(account.completedQuizKeys) ? account.completedQuizKeys : []),
          ...completedQuizKeys,
        ]);
        account.completedQuizKeys = Array.from(keySet);
      }
      if (typeof streakCount === 'number' && Number.isFinite(streakCount)) {
        const safeCount = Math.max(0, Math.floor(streakCount));
        const incomingDate = typeof lastStreakDate === 'string' ? lastStreakDate : null;
        const currentDate = account.lastStreakDate || '';
        if (!currentDate || (incomingDate && incomingDate >= currentDate)) {
          account.streakCount = Math.max(
            incomingDate === currentDate ? account.streakCount || 0 : 0,
            safeCount
          );
          if (incomingDate) account.lastStreakDate = incomingDate;
        }
        account.longestStreak = Math.max(
          account.longestStreak || 0,
          Math.floor(Number(longestStreak) || 0),
          account.streakCount || 0
        );
      }
      if (Array.isArray(streakHistoryDays)) {
        const daySet = new Set([
          ...(Array.isArray(account.streakHistoryDays) ? account.streakHistoryDays : []),
          ...streakHistoryDays.filter((d: unknown) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)),
        ]);
        account.streakHistoryDays = Array.from(daySet).sort().slice(-90);
      }
      account.lastLoginAt = new Date().toISOString();
      persistAccountsToDisk();

      const { pin: _p, ...profile } = account;
      res.json({ success: true, profile });
    } catch (err) {
      console.error('[Accounts Save Error]:', err);
      res.status(500).json({ error: 'Failed to save progress.' });
    }
  });

  // 4. Fetch Profile
  app.get('/api/accounts/profile/:username', (req, res) => {
    const cleanUser = String(req.params.username || '').trim().toLowerCase();
    const account = studentAccounts.get(cleanUser);
    if (!account) {
      res.status(404).json({ error: 'Student profile not found.' });
      return;
    }
    const { pin: _p, ...profile } = account;
    res.json({ success: true, profile });
  });

  // Health check endpoint for instant readiness verification
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', port: PORT });
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  process.on('uncaughtException', (err) => {
    console.error('[Server] Uncaught exception:', err);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled rejection:', reason);
  });

  const startListening = (retriesLeft = 10) => {
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`Parabola Studio server running on http://0.0.0.0:${PORT}`);
    });

    httpServer.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && retriesLeft > 0) {
        console.warn(`Port ${PORT} in use, retrying in 400ms... (${retriesLeft} retries left)`);
        setTimeout(() => {
          try {
            httpServer.close();
          } catch {
            // ignore if not running
          }
          startListening(retriesLeft - 1);
        }, 400);
      } else {
        console.error('Server failed to start:', err);
      }
    });
  };

  const shutdown = () => {
    try {
      httpServer.close(() => {
        process.exit(0);
      });
      setTimeout(() => process.exit(0), 2000).unref();
    } catch {
      process.exit(0);
    }
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);

  startListening();
}

startServer();
