import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import * as math from 'mathjs';

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

  // Pure Mathematics Evaluation Engine for Genius Bar (100% Mathematics Only)
  function solvePureMathematicsQuestion(rawQuestion: string): {
    answer: string;
    steps: string[];
    formula: string;
    example: string;
    diagramSvg?: string;
  } | null {
    const q = rawQuestion.trim();
    const qLower = q.toLowerCase().replace(/[?!.]+$/, '').trim();

    // 1. Cube of N: e.g. "cube of 213", "213 cubed", "cube 213", "213^3", "213³"
    const cubeMatch =
      qLower.match(/^cube\s+of\s+([+-]?\d+(?:\.\d+)?)$/) ||
      qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*cubed$/) ||
      qLower.match(/^cube\s+([+-]?\d+(?:\.\d+)?)$/) ||
      qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*\^\s*3$/) ||
      qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*³$/);

    if (cubeMatch) {
      const n = parseFloat(cubeMatch[1]);
      const nSq = n * n;
      const nCube = nSq * n;
      const nFormatted = Number.isInteger(n) ? String(n) : n.toString();
      const cubeFormatted = Number.isInteger(nCube) ? nCube.toLocaleString('en-US') : nCube.toString();
      const sqFormatted = Number.isInteger(nSq) ? nSq.toLocaleString('en-US') : nSq.toString();

      return {
        answer: `The cube of ${nFormatted} is ${cubeFormatted} (${nFormatted}³ = ${cubeFormatted}).`,
        steps: [
          `Definition: The cube of a number n is obtained by multiplying it by itself twice: n³ = n × n × n.`,
          `Step 1: Calculate the square of ${nFormatted}: ${nFormatted} × ${nFormatted} = ${sqFormatted}.`,
          `Step 2: Multiply by ${nFormatted} once more: ${sqFormatted} × ${nFormatted} = ${cubeFormatted}.`,
          `Result: ${nFormatted}³ = ${cubeFormatted}.`,
        ],
        formula: `n³ = n × n × n  ⇒  ${nFormatted}³ = ${cubeFormatted}`,
        example: `In geometry, a 3D cube with edge length ${nFormatted} has a volume of V = s³ = ${cubeFormatted} cubic units.`,
        diagramSvg: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" rx="14" fill="#0F172A"/>
          <polygon points="170,120 250,120 250,200 170,200" fill="rgba(45,212,191,0.2)" stroke="#2DD4BF" stroke-width="2.5"/>
          <polygon points="170,120 250,120 290,75 210,75" fill="rgba(45,212,191,0.35)" stroke="#2DD4BF" stroke-width="2.5"/>
          <polygon points="250,120 290,75 290,155 250,200" fill="rgba(45,212,191,0.15)" stroke="#2DD4BF" stroke-width="2.5"/>
          <text x="180" y="215" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">edge = ${nFormatted}</text>
          <text x="120" y="42" fill="#FDE047" font-size="14" font-weight="bold" font-family="monospace">Volume = s³ = ${cubeFormatted}</text>
        </svg>`,
      };
    }

    // 2. Square of N: e.g. "square of 213", "213 squared", "square 213", "213^2", "213²"
    const sqMatch =
      qLower.match(/^square\s+of\s+([+-]?\d+(?:\.\d+)?)$/) ||
      qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*squared$/) ||
      qLower.match(/^square\s+([+-]?\d+(?:\.\d+)?)$/) ||
      qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*\^\s*2$/) ||
      qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*²$/);

    if (sqMatch) {
      const n = parseFloat(sqMatch[1]);
      const nSq = n * n;
      const nFormatted = Number.isInteger(n) ? String(n) : n.toString();
      const sqFormatted = Number.isInteger(nSq) ? nSq.toLocaleString('en-US') : nSq.toString();
      return {
        answer: `The square of ${nFormatted} is ${sqFormatted} (${nFormatted}² = ${sqFormatted}).`,
        steps: [
          `Definition: The square of a number n is obtained by multiplying it by itself: n² = n × n.`,
          `Multiply: ${nFormatted} × ${nFormatted} = ${sqFormatted}.`,
          `Result: ${nFormatted}² = ${sqFormatted}.`,
        ],
        formula: `n² = n × n  ⇒  ${nFormatted}² = ${sqFormatted}`,
        example: `In geometry, a 2D square with side length ${nFormatted} has an area of A = s² = ${sqFormatted} square units.`,
        diagramSvg: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" rx="14" fill="#0F172A"/>
          <rect x="130" y="55" width="140" height="140" fill="rgba(45,212,191,0.2)" stroke="#2DD4BF" stroke-width="2.5"/>
          <text x="175" y="215" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">side = ${nFormatted}</text>
          <text x="130" y="40" fill="#FDE047" font-size="14" font-weight="bold" font-family="monospace">Area = s² = ${sqFormatted}</text>
        </svg>`,
      };
    }

    // 3. Cube root of N: e.g. "cube root of 213", "cbrt 213", "cube root of 9663597"
    const cbrtMatch =
      qLower.match(/^(?:cube\s*root\s*(?:of)?|cbrt|∛)\s*([+-]?\d+(?:\.\d+)?)$/);
    if (cbrtMatch) {
      const n = parseFloat(cbrtMatch[1]);
      const val = Math.cbrt(n);
      const formatted = Number.isInteger(val) ? String(val) : Number(val.toFixed(6)).toString();
      return {
        answer: `The cube root of ${n} is ${formatted} (∛${n} ≈ ${formatted}).`,
        steps: [
          `Definition: The cube root of a number x is the value y such that y³ = x.`,
          `Calculation: ∛${n} = ${formatted}.`,
          `Verification: (${formatted})³ = ${(val * val * val).toFixed(4)}.`,
        ],
        formula: `∛x = y  ⇔  y³ = x`,
        example: `For a cube with volume ${n}, the edge length is ∛${n} = ${formatted}.`,
      };
    }

    // 4. Square root of N: e.g. "square root of 144", "sqrt 144", "√144"
    const sqrtMatch =
      qLower.match(/^(?:square\s*root\s*(?:of)?|sqrt|√)\s*(\d+(?:\.\d+)?)$/);
    if (sqrtMatch) {
      const n = parseFloat(sqrtMatch[1]);
      const val = Math.sqrt(n);
      const formatted = Number.isInteger(val) ? String(val) : Number(val.toFixed(6)).toString();
      return {
        answer: `The square root of ${n} is ${formatted} (√${n} = ${formatted}).`,
        steps: [
          `Definition: The principal square root of x is the non-negative number y such that y² = x.`,
          `Calculation: √${n} = ${formatted}.`,
          `Verification: ${formatted} × ${formatted} = ${(val * val).toFixed(4)}.`,
        ],
        formula: `√x = y  ⇔  y² = x`,
        example: `For a square with area ${n}, the side length is √${n} = ${formatted}.`,
      };
    }

    // 5. Factors / Prime Factorization of N: e.g. "factors of 213", "prime factors of 213"
    const factorMatch = qLower.match(/^(?:prime\s+)?(?:factors|factorization|divisors)\s+of\s+(\d+)$/);
    if (factorMatch) {
      const n = parseInt(factorMatch[1], 10);
      if (n > 0 && n <= 100000000) {
        const divisors: number[] = [];
        for (let i = 1; i * i <= n; i++) {
          if (n % i === 0) {
            divisors.push(i);
            if (i * i !== n) divisors.push(n / i);
          }
        }
        divisors.sort((a, b) => a - b);

        let temp = n;
        const primeFactors: number[] = [];
        for (let d = 2; d * d <= temp; d++) {
          while (temp % d === 0) {
            primeFactors.push(d);
            temp = Math.floor(temp / d);
          }
        }
        if (temp > 1) primeFactors.push(temp);

        const primeFreq: Record<number, number> = {};
        primeFactors.forEach((p) => {
          primeFreq[p] = (primeFreq[p] || 0) + 1;
        });
        const primeProductStr = Object.entries(primeFreq)
          .map(([p, count]) => (count > 1 ? `${p}^${count}` : p))
          .join(' × ') || String(n);

        return {
          answer: `The number ${n} has ${divisors.length} divisor${divisors.length === 1 ? '' : 's'}. Its prime factorization is: ${n} = ${primeProductStr}.`,
          steps: [
            `All divisors of ${n}: ${divisors.join(', ')}.`,
            `Prime factors: ${Array.from(new Set(primeFactors)).join(', ') || String(n)}.`,
            `Expressed as product of prime powers: ${n} = ${primeProductStr}.`,
            divisors.length === 2 ? `${n} is a PRIME number.` : `${n} is a COMPOSITE number.`,
          ],
          formula: `Prime Factorization: ${n} = ${primeProductStr}`,
          example: divisors.length > 2 ? `Notice that ${n} is divisible by ${divisors[1]} since ${divisors[1]} × ${n / divisors[1]} = ${n}.` : '',
        };
      }
    }

    // 6. Powers: e.g. "2 to the power of 10", "2^10", "2 raised to 10"
    const powerMatch =
      qLower.match(/^(\d+(?:\.\d+)?)\s*(?:to the power of|raised to(?:\s+the\s+power\s+of)?|\^)\s*(\d+(?:\.\d+)?)$/);
    if (powerMatch) {
      const base = parseFloat(powerMatch[1]);
      const exp = parseFloat(powerMatch[2]);
      const res = Math.pow(base, exp);
      const resFormatted = Number.isInteger(res) ? res.toLocaleString('en-US') : Number(res.toFixed(6)).toString();
      return {
        answer: `${base}^${exp} = ${resFormatted}.`,
        steps: [
          `Base = ${base}, Exponent = ${exp}.`,
          `Multiply ${base} by itself ${exp} times.`,
          `Result: ${base}^${exp} = ${resFormatted}.`,
        ],
        formula: `aᵇ = a × a × ... × a (b times)`,
        example: '',
      };
    }

    // 7. LCM of A and B
    const lcmMatch = qLower.match(/^(?:lcm|least common multiple)\s+(?:of\s+)?(\d+)\s*(?:and|,)\s*(\d+)$/);
    if (lcmMatch) {
      const a = parseInt(lcmMatch[1], 10);
      const b = parseInt(lcmMatch[2], 10);
      const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
      const g = gcd(a, b);
      const lcm = (a * b) / g;
      return {
        answer: `The LCM of ${a} and ${b} is ${lcm}.`,
        steps: [
          `Find GCD(${a}, ${b}) = ${g}.`,
          `Formula: LCM(a, b) = (a × b) ÷ GCD(a, b).`,
          `Calculation: (${a} × ${b}) ÷ ${g} = ${a * b} ÷ ${g} = ${lcm}.`,
        ],
        formula: `LCM(a, b) = (a × b) ÷ GCD(a, b) = ${lcm}`,
        example: '',
      };
    }

    // 8. HCF / GCD of A and B
    const gcdMatch = qLower.match(/^(?:gcd|hcf|greatest common divisor|highest common factor)\s+(?:of\s+)?(\d+)\s*(?:and|,)\s*(\d+)$/);
    if (gcdMatch) {
      const a = parseInt(gcdMatch[1], 10);
      const b = parseInt(gcdMatch[2], 10);
      const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
      const g = gcd(a, b);
      return {
        answer: `The HCF (GCD) of ${a} and ${b} is ${g}.`,
        steps: [
          `Find common factors of ${a} and ${b}.`,
          `Using Euclidean algorithm: GCD(${a}, ${b}) = ${g}.`,
          `Result: Greatest common divisor is ${g}.`,
        ],
        formula: `GCD(${a}, ${b}) = ${g}`,
        example: '',
      };
    }

    // 9. Percentage: e.g. "25% of 480"
    const pctMatch = qLower.match(/^(\d+(?:\.\d+)?)\s*%\s*(?:of\s*)?(\d+(?:\.\d+)?)$/);
    if (pctMatch) {
      const p = parseFloat(pctMatch[1]);
      const total = parseFloat(pctMatch[2]);
      const res = Number(((p / 100) * total).toFixed(4));
      return {
        answer: `${p}% of ${total} is ${res}.`,
        steps: [
          `Convert percentage to decimal: ${p}% = ${p}/100 = ${p / 100}.`,
          `Multiply by ${total}: (${p} ÷ 100) × ${total} = ${res}.`,
        ],
        formula: `(${p} ÷ 100) × ${total} = ${res}`,
        example: '',
      };
    }

    // 10. Direct arithmetic expressions
    const cleanedExpr = q
      .replace(/^(what is|whats|what's|calculate|solve|evaluate|find|compute|simplify)\s+/i, '')
      .replace(/\?+$/, '')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/√\(([^)]+)\)/g, 'sqrt($1)')
      .replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)')
      .trim();

    if (/^[0-9+\-*/^().\s%sqrtpi,e]+$/i.test(cleanedExpr) && /\d/.test(cleanedExpr)) {
      try {
        const val = math.evaluate(cleanedExpr);
        if (typeof val === 'number' && Number.isFinite(val)) {
          const formattedVal = Number.isInteger(val)
            ? val.toLocaleString('en-US')
            : Number(val.toFixed(6)).toString();
          return {
            answer: `${cleanedExpr} = ${formattedVal}`,
            steps: [
              `Mathematical expression: ${cleanedExpr}`,
              `Evaluated result: ${formattedVal}`,
            ],
            formula: `${cleanedExpr} = ${formattedVal}`,
            example: '',
          };
        }
      } catch {
        // Continue
      }
    }

    return null;
  }

  // Server-side Genius Bar Pure Mathematics Q&A & Camera Photo Scanner Endpoint (100% Mathematics Only)
  app.post('/api/genius-bar', async (req, res) => {
    const { question, imageBase64, imageMimeType } = req.body || {};
    const cleanQuestion = typeof question === 'string' ? question.trim() : '';
    const hasImage = Boolean(imageBase64 && imageMimeType);

    if (!cleanQuestion && !hasImage) {
      res.json({
        answer: 'Welcome to the Genius Bar! Ask any mathematics problem, calculation, or formula (e.g. "Cube of 213", "Square root of 15625") or scan a photo of your math problem.',
        steps: [],
        formula: '',
        example: '',
        diagramSvg: '',
      });
      return;
    }

    // Fast Path 1: Check deterministic pure mathematics engine for text questions
    if (!hasImage && cleanQuestion) {
      const pureMathResult = solvePureMathematicsQuestion(cleanQuestion);
      if (pureMathResult) {
        res.json(pureMathResult);
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

    // Tier 1: Gemini AI with STRICT PURE MATHEMATICS System Instruction
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
            ? `Read the mathematics problem or equation shown in this photo and solve it completely with step-by-step mathematical working. If the problem involves geometry, 2D/3D shapes, angles, graphs, or mensuration, generate a clear, labeled SVG diagram in diagramSvg. ${
                cleanQuestion ? `Additional student note: ${cleanQuestion}` : ''
              }`
            : `Solve this mathematics question: ${cleanQuestion}`,
        });

        const geminiPromise = getAiClient().models.generateContent({
          model: hasImage ? 'gemini-3.8-flash' : 'gemini-3.1-flash-lite',
          contents: { parts },
          config: {
            systemInstruction:
              'You are the Genius Bar Pure Mathematics Mentor. You answer EXCLUSIVELY MATHEMATICS QUESTIONS (arithmetic, algebra, geometry, trigonometry, mensuration, exponents, powers, square and cube roots, fractions, decimals, number theory, ratio and proportions, statistics, and mathematical word problems). You MUST REFUSE or REDIRECT any non-mathematical topics (absolutely NO music bands, pop culture, USA trivia, history, biology, or non-math general knowledge). If a number is asked about, always interpret it purely as a mathematical entity (e.g. "cube of 213" is 213³ = 9,663,597, never a music band). Never use raw LaTeX backslashes; always use clean Unicode math symbols (√, ², ³, ×, ÷, ½, ∠, °, π). DIAGRAM RULE: Whenever the problem involves geometry, 2D/3D shapes, angles, or coordinate graphs, generate a valid, self-contained `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">...</svg>` string using a dark blueprint background (`<rect width="400" height="240" rx="14" fill="#0F172A"/>`), teal/amber strokes (`#2DD4BF`, `#FDE047`), and white/teal `<text>` labels.',
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
                    'Complete <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">...</svg> diagram for geometry, coordinate graph, or diagrammatic math questions; empty string "" if no diagram is needed.',
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
        // Proceed to Tier 2 Pure Math AI Fallback
      }
    }

    // Tier 2: Pure Mathematics AI Fallback (Strictly Mathematical, No Wikipedia or Pop Trivia)
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
                'You are the Genius Bar Pure Mathematics Mentor. Answer ONLY mathematics questions with clear mathematical steps and formulas. If a question is not about mathematics, politely explain that the Genius Bar is purely for mathematics and invite them to ask a math question.',
            },
            {
              role: 'user',
              content: cleanQuestion || 'Solve the mathematics problem.',
            },
          ],
        }),
      });
      if (aiResponse.ok) {
        const text = (await aiResponse.text()).trim();
        if (text) {
          const result = {
            answer: text,
            steps: [],
            formula: '',
            example: '',
            diagramSvg: generateFallbackGeometrySvg(cleanQuestion, text),
          };
          if (cacheKey) geniusBarCache.set(cacheKey, result);
          res.json(result);
          return;
        }
      }
    } catch {
      // Ignore
    }

    // Tier 3: Pure Math Fallback Response (Never non-math trivia)
    res.json({
      answer: `The Genius Bar is dedicated 100% to Mathematics. For math problems, calculations, formulas, or geometry (e.g. "Cube of 213", "Square root of 15625", "Why is 3⁻² = 1/9?", "Area of trapezium"), please rephrase or scan your problem directly.`,
      steps: [
        'Non-mathematical topics (trivia, pop culture, geography) are excluded.',
        'Ask any arithmetic, algebra, geometry, powers, or word problems.',
      ],
      formula: 'Pure Mathematics Only',
      example: 'Example: "Cube of 213" ⇒ 213³ = 9,663,597',
      diagramSvg: generateFallbackGeometrySvg(cleanQuestion),
    });
  });

  // ==========================================================================
  // STUDENT ACCOUNT REGISTRATION & PROGRESS SAVING API (NO EMAIL REQUIRED)
  // ==========================================================================
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
            acc.points = Math.min(4000, Math.max(0, Number(acc.points) || 120));
            studentAccounts.set(acc.username.toLowerCase().trim(), acc);
          }
        });
      }
    }
  } catch (err) {
    console.warn('[Accounts] Could not read accounts file:', err);
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
        initialPoints = 120,
        initialBadgeIds = [],
        initialChapterPoints = {},
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

      const newAccount: StoredAccount = {
        username: cleanUser,
        mascot: String(mascot || '🦉'),
        pin: cleanPin,
        grade: String(grade || 'Class 8'),
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        points: Math.min(4000, Math.max(0, Number(initialPoints) || 120)),
        unlockedBadgeIds: Array.isArray(initialBadgeIds) ? initialBadgeIds : [],
        chapterGamePoints: typeof initialChapterPoints === 'object' && initialChapterPoints !== null ? initialChapterPoints : {},
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
      const { username, pin, points, unlockedBadgeIds, chapterGamePoints } = req.body || {};
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
