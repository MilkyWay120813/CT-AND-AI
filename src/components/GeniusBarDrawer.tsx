import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Lightbulb,
  X,
  Send,
  RotateCcw,
  Calculator,
  CheckCircle2,
  Camera,
  MessageSquare,
  Upload,
  RefreshCw,
  Sparkles,
  Maximize2,
  Minimize2,
  ArrowLeft,
} from 'lucide-react';
import { solveGeniusMath, GeniusMathResult } from '../utils/geniusMathSolver';
import { searchBookKnowledge } from '../utils/bookKnowledgeSearch';
import { formatMathText } from '../utils/formatMath';
import { soundscapeEngine } from '../utils/soundscapeEngine';

interface GeniusBarDrawerProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: (next: boolean) => void;
  onExitToHub?: () => void;
}

interface GeniusMessage {
  id: string;
  role: 'user' | 'genius';
  text: string;
  imagePreviewUrl?: string;
  steps?: string[];
  formula?: string;
  example?: string;
  diagramSvg?: string;
  timestamp: string;
}

// Instantaneous (<10ms) universal greeting & math/calculus solver
function tryInstantMathOrGreeting(rawQuestion: string): GeniusMathResult | null {
  const qLower = rawQuestion.trim().toLowerCase().replace(/[?!.]+$/, '').trim();

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|namaste)$/.test(qLower)) {
    return {
      answer:
        'Hello! Welcome to the Genius Bar. Ask any question — calculus (e.g. "derivative of 3x^2"), algebra equations, arithmetic, science, or general knowledge — or switch to Camera Scanner to scan a photo!',
      steps: [
        'Examples: "Derivative of 3x^2", "x^2 - 5x + 6 = 0", "Cube of 213", "What is photosynthesis?".',
      ],
      formula: '',
      example: '',
    };
  }

  return solveGeniusMath(rawQuestion) || searchBookKnowledge(rawQuestion);
}

export const GeniusBarDrawer: React.FC<GeniusBarDrawerProps> = ({
  isOpen: controlledOpen,
  onOpenChange,
  isFullscreen: controlledFullscreen,
  onToggleFullscreen,
  onExitToHub,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const isFullscreen =
    controlledFullscreen !== undefined ? controlledFullscreen : internalFullscreen;

  const setIsOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  const setIsFullscreen = useCallback(
    (next: boolean) => {
      if (controlledFullscreen === undefined) {
        setInternalFullscreen(next);
      }
      onToggleFullscreen?.(next);
    },
    [controlledFullscreen, onToggleFullscreen]
  );

  const handleClosePanel = useCallback(() => {
    soundscapeEngine.playPageFlipSfx();
    if (isFullscreen && onExitToHub) {
      onExitToHub();
      return;
    }
    setIsFullscreen(false);
    setIsOpen(false);
  }, [isFullscreen, onExitToHub, setIsFullscreen, setIsOpen]);

  const [activeTab, setActiveTab] = useState<'chat' | 'camera'>('chat');
  const [inputQuestion, setInputQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Camera Scanner states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<{
    dataUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [photoNote, setPhotoNote] = useState('');

  const [messages, setMessages] = useState<GeniusMessage[]>([
    {
      id: 'welcome-msg',
      role: 'genius',
      text: 'Welcome to the Genius Bar! Ask ANY question — calculus (e.g. "Derivative of 3x^2"), algebra equations, geometry, science, or general knowledge — or switch to Camera Scanner to snap a photo.',
      timestamp: 'Ready',
    },
  ]);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCameraStream = useCallback(
    async (mode: 'environment' | 'user' = facingMode) => {
      stopCameraStream();
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError(
            'Live camera stream is not supported in this browser. Use "Upload / Take Photo" below to scan your question.'
          );
          return;
        }
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setIsCameraActive(true);
      } catch {
        setCameraError(
          'Camera permission was declined or unavailable. You can still tap "Upload / Choose Photo" below to scan any question image!'
        );
      }
    },
    [facingMode, stopCameraStream]
  );

  // Start/stop camera automatically when switching to/from the Camera tab
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !capturedImage) {
      startCameraStream(facingMode);
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [isOpen, activeTab, capturedImage, facingMode, startCameraStream, stopCameraStream]);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [messages, isOpen, activeTab]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClosePanel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClosePanel]);

  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    const base64 = dataUrl.split(',')[1] || '';
    setCapturedImage({
      dataUrl,
      base64,
      mimeType: 'image/jpeg',
    });
    stopCameraStream();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const base64 = dataUrl.split(',')[1] || '';
      setCapturedImage({
        dataUrl,
        base64,
        mimeType: file.type || 'image/jpeg',
      });
      stopCameraStream();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const submitToGeniusBar = async ({
    questionText,
    imagePayload,
  }: {
    questionText: string;
    imagePayload?: { dataUrl: string; base64: string; mimeType: string } | null;
  }) => {
    const q = questionText.trim();
    if (!q && !imagePayload) return;

    const nowLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: GeniusMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: q || 'Scanned question photo for AI solution',
      imagePreviewUrl: imagePayload?.dataUrl,
      timestamp: nowLabel,
    };

    // Fast Path 1: Pure arithmetic or greeting (only when no photo is attached)
    if (!imagePayload && q) {
      const instant = tryInstantMathOrGreeting(q);
      if (instant) {
        const instantMsg: GeniusMessage = {
          id: `genius-${Date.now() + 1}`,
          role: 'genius',
          text: instant.answer,
          steps: instant.steps,
          formula: instant.formula || undefined,
          example: instant.example || undefined,
          diagramSvg: instant.diagramSvg || undefined,
          timestamp: nowLabel,
        };
        setMessages((prev) => [...prev, userMsg, instantMsg]);
        return;
      }
    }

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    const reqController = new AbortController();
    const reqTimer = setTimeout(() => reqController.abort(), 24000);
    try {
      const response = await fetch('/api/genius-bar', {
        method: 'POST',
        signal: reqController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          imageBase64: imagePayload?.base64,
          imageMimeType: imagePayload?.mimeType,
        }),
      });
      clearTimeout(reqTimer);

      const data = await response.json();

      if (response.ok && data && data.answer) {
        const aiMsg: GeniusMessage = {
          id: `genius-${Date.now()}`,
          role: 'genius',
          text: formatMathText(data.answer),
          steps: Array.isArray(data.steps)
            ? data.steps.map((s: string) => formatMathText(s))
            : [],
          formula: data.formula ? formatMathText(data.formula) : undefined,
          example: data.example ? formatMathText(data.example) : undefined,
          diagramSvg:
            typeof data.diagramSvg === 'string' && data.diagramSvg.includes('<svg')
              ? data.diagramSvg
              : undefined,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `genius-${Date.now()}`,
            role: 'genius',
            text:
              (data && typeof data.error === 'string' && data.error) ||
              'Could not answer that question right now. Please try rephrasing or retaking the photo.',
            timestamp: nowLabel,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `genius-${Date.now()}`,
          role: 'genius',
          text: 'Connection was interrupted while reaching the Genius Bar AI. Please try asking again.',
          timestamp: nowLabel,
        },
      ]);
    } finally {
      clearTimeout(reqTimer);
      setIsThinking(false);
    }
  };

  const handleAskTextQuestion = async () => {
    const q = inputQuestion.trim();
    if (!q || isThinking) return;
    setInputQuestion('');
    await submitToGeniusBar({ questionText: q });
  };

  const handleSolveCapturedPhoto = async () => {
    if (!capturedImage || isThinking) return;
    const imgToSolve = capturedImage;
    const noteToSolve = photoNote;
    setCapturedImage(null);
    setPhotoNote('');
    setActiveTab('chat');
    await submitToGeniusBar({
      questionText: noteToSolve,
      imagePayload: imgToSolve,
    });
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'genius',
        text: 'Welcome to the Genius Bar! Ask me any question and I will answer it for you.',
        timestamp: 'Ready',
      },
    ]);
  };

  return (
    <>
      {/* =====================================================================
          1. FLOATING, GLOWING CIRCLE BUTTON THAT EXPANDS ON MOUSE HOVER
         ===================================================================== */}
      <button
        type="button"
        onClick={() => {
          soundscapeEngine.playPageFlipSfx();
          setIsOpen(true);
        }}
        aria-label="Open Genius Bar"
        title="Genius Bar — Ask or Scan any question"
        className="fixed bottom-7 right-7 z-40 group w-20 h-20 hover:w-56 hover:h-16 rounded-full bg-gradient-to-br from-[#0F766E] via-[#0D9488] to-[#115E59] text-white border-2 border-[#5EEAD4] shadow-[0_0_28px_rgba(45,212,191,0.85),0_0_55px_rgba(253,224,71,0.4)] hover:shadow-[0_0_38px_rgba(45,212,191,1),0_0_75px_rgba(253,224,71,0.65)] flex flex-col hover:flex-row items-center justify-center gap-1 hover:gap-3 px-2 hover:px-6 transition-all duration-300 ease-out hover:scale-105 animate-[bounce_3s_ease-in-out_infinite] hover:animate-none cursor-pointer overflow-hidden"
      >
        <div className="w-8 h-8 rounded-full bg-[#FDE047]/20 border border-[#FDE047]/60 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-[#FDE047] fill-[#FDE047]" />
        </div>
        <div className="flex flex-col items-center group-hover:items-start leading-tight">
          <span className="text-[11px] group-hover:text-sm font-extrabold tracking-tight text-white whitespace-nowrap">
            Genius Bar
          </span>
          <span className="hidden group-hover:inline text-[11px] font-semibold text-[#5EEAD4] whitespace-nowrap">
            Ask or Scan →
          </span>
        </div>
      </button>

      {/* =====================================================================
          2. DIMMED BACKDROP OVERLAY & SLIDE-OVER SIDE TAB ("GENIUS BAR")
         ===================================================================== */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex ${
            isFullscreen ? 'justify-center' : 'justify-end'
          }`}
        >
          {/* Slightly Darkened Backdrop Scrim to draw attention to the Genius Bar */}
          <div
            onClick={handleClosePanel}
            className="fixed inset-0 bg-black/55 transition-opacity cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-Over or Full-Screen Genius Bar Panel */}
          <aside
            data-testid={isFullscreen ? 'genius-bar-fullscreen' : 'genius-bar-panel'}
            aria-label="Genius Bar Question & Answer Panel"
            className={`relative z-10 h-full bg-[#FAF6EE] text-stone-900 shadow-2xl flex flex-col justify-between overflow-hidden ${
              isFullscreen
                ? 'w-full max-w-none rounded-none border-0'
                : 'w-full max-w-md sm:max-w-lg border-l border-stone-300'
            }`}
          >
            {/* Top Genius Bar Header + 2-Tab Switcher (Ask Question | Camera Scanner) */}
            <div className="bg-[#132A46] text-white px-6 pt-5 pb-4 border-b border-white/10 space-y-4 shrink-0">
              <div
                className={`flex items-center justify-between gap-4 ${
                  isFullscreen ? 'max-w-4xl mx-auto w-full' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#2DD4BF]/20 border border-[#5EEAD4]/50 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-6 h-6 text-[#FDE047] fill-[#FDE047]" />
                  </div>
                  <div>
                    <div
                      role="heading"
                      aria-level={2}
                      className="text-lg sm:text-xl font-extrabold tracking-tight text-white"
                    >
                      {isFullscreen
                        ? 'Genius Bar · Step-by-Step Board Work'
                        : 'Genius Bar'}
                    </div>
                    <p className="text-xs text-[#5EEAD4] font-medium">
                      Universal AI Q&amp;A &amp; Camera Question Scanner
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onExitToHub && isFullscreen && (
                    <button
                      type="button"
                      data-testid="genius-bar-exit-hub-btn"
                      onClick={() => {
                        soundscapeEngine.playPageFlipSfx();
                        onExitToHub();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FDE047] hover:bg-[#FACC15] text-[#142E21] text-xs font-black transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Exit to Chapter Hub</span>
                    </button>
                  )}
                  <button
                    type="button"
                    data-testid="genius-bar-fullscreen-toggle"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? 'Switch to Side Drawer' : 'Expand Fullscreen'}
                    aria-label={isFullscreen ? 'Switch to Side Drawer' : 'Expand Fullscreen'}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetChat}
                    title="Clear Conversation"
                    aria-label="Clear Conversation"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClosePanel}
                    title="Close Genius Bar"
                    aria-label="Close Genius Bar"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Segmented Tab Bar: Ask Question vs Camera Scanner */}
              <div
                className={`grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/30 border border-white/10 ${
                  isFullscreen ? 'max-w-4xl mx-auto w-full' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-[#2DD4BF] text-[#042F2E] shadow-xs'
                      : 'text-stone-200 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask Question</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('camera')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    activeTab === 'camera'
                      ? 'bg-[#2DD4BF] text-[#042F2E] shadow-xs'
                      : 'text-stone-200 hover:text-white'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Camera Scanner</span>
                </button>
              </div>
            </div>

            {activeTab === 'camera' ? (
              /* ===============================================================
                 TAB 2: CAMERA SCANNER (Live Viewfinder + Photo Capture/Upload)
                 =============================================================== */
              <div
                className={`flex-1 overflow-y-auto p-5 space-y-5 ${
                  isFullscreen ? 'max-w-4xl mx-auto w-full' : ''
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {!capturedImage ? (
                  <div className="space-y-4">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-950 border-2 border-[#0F766E] shadow-lg flex items-center justify-center">
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        autoPlay
                        className="w-full h-full object-cover"
                      />

                      {/* Scanning Target Frame Overlay */}
                      <div className="absolute inset-6 border-2 border-dashed border-[#5EEAD4]/80 rounded-xl pointer-events-none flex items-end justify-center pb-3">
                        <span className="px-3 py-1 rounded-full bg-black/65 text-[#5EEAD4] text-xs font-bold">
                          Align question inside frame
                        </span>
                      </div>

                      {cameraError && (
                        <div className="absolute inset-0 bg-stone-950/90 p-6 flex flex-col items-center justify-center text-center space-y-3">
                          <Camera className="w-10 h-10 text-[#5EEAD4]" />
                          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xs">
                            {cameraError}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Camera Action Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={handleCaptureFrame}
                        disabled={!isCameraActive}
                        className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white font-extrabold text-sm shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-extrabold text-sm shadow-xs transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-[#0F766E]" />
                        <span>Upload / Choose Photo</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setFacingMode((prev) =>
                            prev === 'environment' ? 'user' : 'environment'
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>
                          Switch Camera ({facingMode === 'environment' ? 'Rear' : 'Front'})
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => startCameraStream(facingMode)}
                        className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        Restart Camera
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Captured Photo Review & Solve Card */
                  <div className="space-y-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-900 border border-stone-200">
                      <img
                        src={capturedImage.dataUrl}
                        alt="Captured question"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <input
                      type="text"
                      value={photoNote}
                      onChange={(e) => setPhotoNote(e.target.value)}
                      placeholder="Optional: Add a note (e.g. Solve Question 3)..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 focus:bg-white border border-stone-300 focus:border-[#0F766E] focus:outline-none text-xs sm:text-sm text-stone-900"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCapturedImage(null)}
                        className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                      >
                        Retake Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleSolveCapturedPhoto}
                        disabled={isThinking}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-extrabold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#FDE047]" />
                        <span>Scan &amp; Answer</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ===============================================================
                 TAB 1: ASK QUESTION (Q&A Feed + Input Box)
                 =============================================================== */
              <>
                <div
                  className={`flex-1 overflow-y-auto px-5 py-5 space-y-4 ${
                    isFullscreen ? 'max-w-4xl mx-auto w-full' : ''
                  }`}
                >
                  {messages.map((msg) => {
                    if (msg.role === 'user') {
                      return (
                        <div key={msg.id} className="flex justify-end">
                          <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#0F766E] text-white px-4 py-3 shadow-xs space-y-2">
                            {msg.imagePreviewUrl && (
                              <img
                                src={msg.imagePreviewUrl}
                                alt="Scanned question"
                                className="w-full max-h-44 object-contain rounded-lg border border-white/20 bg-black/20"
                              />
                            )}
                            <p className="text-sm font-semibold leading-relaxed">
                              {msg.text}
                            </p>
                            <div className="text-[11px] text-teal-200 text-right">
                              You · {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className="flex justify-start">
                        <div className="w-full rounded-2xl rounded-tl-xs bg-white border border-stone-200/90 p-5 shadow-xs space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-[#0F766E]">
                            <span className="flex items-center gap-1.5">
                              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
                              <span>Genius Bar</span>
                            </span>
                            <span className="text-stone-400 font-normal">
                              {msg.timestamp}
                            </span>
                          </div>

                          <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium">
                            {msg.text}
                          </p>

                          {msg.diagramSvg && (
                            <div className="rounded-xl overflow-hidden border border-stone-300 bg-[#0F172A] shadow-xs">
                              <div className="px-3 py-1.5 bg-[#132A46] border-b border-white/10 flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                                  AI Geometric / Visual Diagram
                                </span>
                              </div>
                              <div
                                className="w-full p-2 flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-56"
                                dangerouslySetInnerHTML={{ __html: msg.diagramSvg }}
                              />
                            </div>
                          )}

                          {msg.steps && msg.steps.length > 0 && (
                            <div className="space-y-2 pt-1">
                              {msg.steps.map((st, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs sm:text-sm text-stone-700"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                                  <span>{st}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {msg.formula && (
                            <div className="p-3 rounded-xl bg-[#132A46] text-amber-200 font-mono text-xs sm:text-sm flex items-center gap-2">
                              <Calculator className="w-4 h-4 text-[#5EEAD4] shrink-0" />
                              <span className="font-bold">{msg.formula}</span>
                            </div>
                          )}

                          {msg.example && (
                            <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] text-[#115E59] text-xs leading-relaxed font-semibold">
                              {msg.example}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-white border border-stone-200 px-4 py-3 text-xs font-bold text-[#0F766E] shadow-xs">
                        Answering your question...
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Input Composer with Quick Camera Shortcut & Pure Math Quick Chips */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskTextQuestion();
                  }}
                  className={`p-4 bg-white border-t border-stone-200 shrink-0 space-y-2.5 ${
                    isFullscreen ? 'max-w-4xl mx-auto w-full rounded-t-2xl border-x' : ''
                  }`}
                >
                  {messages.length <= 1 && (
                    <div className="flex flex-wrap items-center gap-1.5 pb-1">
                      <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mr-1">
                        Try Asking:
                      </span>
                      {[
                        'Derivative of 3x^2',
                        'x^2 - 5x + 6 = 0',
                        'Cube of 213',
                        'Area of trapezium',
                        'What is photosynthesis?',
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            setInputQuestion(chip);
                            submitToGeniusBar({ questionText: chip });
                          }}
                          className="px-2.5 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-teal-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('camera')}
                      title="Open Camera Scanner to snap a photo of a question"
                      className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#0F766E] border border-stone-300 transition-colors cursor-pointer shrink-0"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={inputQuestion}
                      onChange={(e) => setInputQuestion(e.target.value)}
                      placeholder="Ask any question (e.g. 'Derivative of 3x^2', '3x + 5 = 20', 'What is photosynthesis?')..."
                      className="flex-1 px-4 py-3 rounded-xl bg-stone-100 focus:bg-white border border-stone-300 focus:border-[#0F766E] focus:outline-none text-sm text-stone-900 placeholder:text-stone-500"
                    />
                    <button
                      type="submit"
                      disabled={!inputQuestion.trim() || isThinking}
                      className="px-4 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
                    >
                      <span>Ask</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
};
