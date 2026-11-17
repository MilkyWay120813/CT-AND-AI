import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Award,
  Flame,
  ArrowRight,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { GanitaChapter } from '../types/math';
import { StudentAccountProfile, STUDENT_MASCOTS } from '../types/account';
import { AccountQuizAnalyticsView } from './AccountQuizAnalyticsView';
import {
  registerAccountOnServer,
  loginAccountOnServer,
  syncProgressToServer,
  saveLocalStudentAccount,
  getSavedPin,
} from '../utils/accountStorage';
import {
  evaluateStreakView,
  sanitizeStreakSnapshot,
} from '../utils/streakTracker';

interface StudentAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeAccount: StudentAccountProfile | null;
  onAccountChange: (account: StudentAccountProfile | null) => void;
  currentPoints: number;
  unlockedBadgeIds: string[];
  chapterGamePoints: Record<string, number>;
  initialTab?: 'profile' | 'stats' | 'register' | 'login';
  chapters?: GanitaChapter[];
  onJumpToChapter?: (chapterId: string) => void;
}

export const StudentAccountModal: React.FC<StudentAccountModalProps> = ({
  isOpen,
  onClose,
  activeAccount,
  onAccountChange,
  currentPoints,
  unlockedBadgeIds,
  chapterGamePoints,
  initialTab,
  chapters = [],
  onJumpToChapter,
}) => {
  const [tab, setTab] = useState<'profile' | 'stats' | 'register' | 'login'>(() => {
    if (initialTab === 'stats' && activeAccount) return 'stats';
    if (initialTab && (initialTab === 'register' || initialTab === 'login')) {
      return activeAccount ? 'profile' : initialTab;
    }
    return activeAccount ? 'profile' : 'login';
  });

  React.useEffect(() => {
    if (!isOpen) return;
    if (initialTab === 'stats') {
      setTab(activeAccount ? 'stats' : 'login');
    } else if (initialTab === 'profile') {
      setTab(activeAccount ? 'profile' : 'login');
    } else if (initialTab === 'register' || initialTab === 'login') {
      setTab(activeAccount ? 'profile' : initialTab);
    } else {
      setTab(activeAccount ? 'profile' : 'login');
    }
  }, [isOpen, initialTab, activeAccount]);

  // Form states
  const [regUsername, setRegUsername] = useState('');
  const [regMascot, setRegMascot] = useState('🦉');
  const [regPin, setRegPin] = useState('');
  const [regGrade, setRegGrade] = useState('Class 8');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPin, setLoginPin] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const profile = await registerAccountOnServer({
        username: regUsername.trim(),
        mascot: regMascot,
        pin: regPin.trim(),
        grade: regGrade,
        initialPoints: currentPoints,
        initialBadgeIds: unlockedBadgeIds,
        initialChapterPoints: chapterGamePoints,
      });
      onAccountChange(profile);
      setSuccessMsg(`Welcome, ${profile.username}! Your student account is ready and your progress is saved.`);
      setTab('profile');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const profile = await loginAccountOnServer({
        username: loginUsername.trim(),
        pin: loginPin.trim(),
      });
      onAccountChange(profile);
      setSuccessMsg(`Welcome back, ${profile.username}! Progress successfully restored.`);
      setTab('profile');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    if (!activeAccount) return;
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const savedCreds = getSavedPin();
    const pin = savedCreds?.pin || '';

    try {
      const synced = await syncProgressToServer(
        activeAccount.username,
        pin,
        currentPoints,
        unlockedBadgeIds,
        chapterGamePoints,
        activeAccount.quizHistory,
        activeAccount.completedQuizKeys,
        sanitizeStreakSnapshot(activeAccount)
      );
      if (synced) {
        onAccountChange(synced);
        setSuccessMsg('Progress saved and synced to the cloud!');
      } else {
        setSuccessMsg('Local progress verified.');
      }
    } catch {
      setErrorMsg('Could not reach sync server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    saveLocalStudentAccount(null);
    onAccountChange(null);
    setTab('login');
    setSuccessMsg('Signed out. All session stats are reset and locked until you sign back in.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65"
    >
      <div
        className={`relative w-full ${
          tab === 'stats' ? 'max-w-3xl' : 'max-w-lg'
        } rounded-3xl bg-[#FAF6EE] border-2 border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all`}
      >
        {/* Header */}
        <div className="bg-[#12352B] text-white px-6 py-5 flex items-center justify-between border-b border-teal-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center text-xl shadow">
              {activeAccount?.mascot || '👤'}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
                Student Account & Progress Saving
              </div>
              <h3 className="text-lg font-black text-white">
                {activeAccount ? activeAccount.username : 'No Email Required!'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-white px-6 pt-3 gap-4">
          {activeAccount ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setTab('profile');
                  setErrorMsg(null);
                }}
                className={`pb-3 text-xs font-black border-b-2 transition cursor-pointer ${
                  tab === 'profile'
                    ? 'border-[#00B4A7] text-[#00B4A7]'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                My Profile & Sync
              </button>
              <button
                type="button"
                data-testid="account-tab-quiz-stats"
                onClick={() => {
                  setTab('stats');
                  setErrorMsg(null);
                }}
                className={`pb-3 text-xs font-black border-b-2 transition cursor-pointer inline-flex items-center gap-1.5 ${
                  tab === 'stats'
                    ? 'border-[#00B4A7] text-[#00B4A7]'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>
                  Quiz Stats &amp; Graphs ({(activeAccount.quizHistory || []).length})
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg(null);
                }}
                className={`pb-3 text-xs font-black border-b-2 transition cursor-pointer ${
                  tab === 'login'
                    ? 'border-[#00B4A7] text-[#00B4A7]'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg(null);
                }}
                className={`pb-3 text-xs font-black border-b-2 transition cursor-pointer ${
                  tab === 'register'
                    ? 'border-[#00B4A7] text-[#00B4A7]'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                Create Student Account (No Email)
              </button>
            </>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB: PROFILE */}
          {tab === 'profile' && activeAccount && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 rounded-2xl bg-amber-100 border border-amber-300">
                      {activeAccount.mascot}
                    </span>
                    <div>
                      <h4 className="text-xl font-black text-stone-900">
                        {activeAccount.username}
                      </h4>
                      <div className="text-xs text-stone-500 font-semibold">
                        {activeAccount.grade || 'Class 8'} · Member since{' '}
                        {new Date(activeAccount.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                    <div className="text-[10px] uppercase font-bold text-stone-500">
                      Total Mastery EXP (Max 4,000)
                    </div>
                    <div className="text-xl font-black text-[#0F766E] tabular-nums mt-0.5">
                      {Math.min(4000, currentPoints).toLocaleString()} / 4,000 EXP
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                    <div className="text-[10px] uppercase font-bold text-stone-500">
                      Badges Acquired
                    </div>
                    <div className="text-xl font-black text-amber-600 tabular-nums mt-0.5">
                      {unlockedBadgeIds.length} / 115
                    </div>
                  </div>
                </div>

                {(() => {
                  const sView = evaluateStreakView(activeAccount);
                  return (
                    <div
                      data-testid="account-streak-summary"
                      className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-2xs">
                            <Flame className="w-4 h-4 fill-current" />
                          </span>
                          <div>
                            <div className="text-xs font-black text-amber-950">
                              Daily Study Streak: {sView.displayStreak}{' '}
                              {sView.displayStreak === 1 ? 'Day' : 'Days'}
                            </div>
                            <div className="text-[11px] font-semibold text-amber-800">
                              {sView.studiedToday
                                ? 'Studied today · Keep your habit burning!'
                                : sView.status === 'at-risk'
                                ? 'Open any lesson or simulation today to keep your streak!'
                                : 'Start studying today to ignite your streak!'}
                            </div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-white border border-amber-300 text-[11px] font-black text-amber-900 tabular-nums">
                          Best: {sView.longestStreak} {sView.longestStreak === 1 ? 'day' : 'days'}
                        </span>
                      </div>

                      <div className="grid grid-cols-7 gap-1.5 pt-1">
                        {sView.recent7Days.map((d) => (
                          <div
                            key={d.dateKey}
                            className={`flex flex-col items-center py-1.5 rounded-lg border text-[10px] font-bold ${
                              d.active
                                ? 'bg-orange-500 text-white border-orange-600'
                                : d.isToday
                                ? 'bg-white text-amber-900 border-amber-400'
                                : 'bg-white/70 text-stone-500 border-stone-200'
                            }`}
                          >
                            <span>{d.label}</span>
                            <span className="mt-0.5 text-xs">
                              {d.active ? '🔥' : d.isToday ? '○' : '·'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Sync Action */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setTab('stats')}
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#12352B] hover:bg-[#194530] text-amber-300 text-xs font-black transition cursor-pointer shadow-xs"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Quiz Stats &amp; Line Graphs</span>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleManualSync}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#00B4A7] hover:bg-[#0E948B] text-white text-xs font-black transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Sync Progress to Cloud</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: QUIZ STATS & ANALYTICS GRAPHS */}
          {tab === 'stats' && activeAccount && (
            <AccountQuizAnalyticsView
              quizHistory={activeAccount.quizHistory || []}
              chapters={chapters}
              onPracticeChapter={
                onJumpToChapter
                  ? (chId) => {
                      onJumpToChapter(chId);
                      onClose();
                    }
                  : undefined
              }
            />
          )}

          {/* TAB: REGISTER (NO EMAIL) */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Safe for Students — No Email Required!</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Choose a nickname and a secret 4-digit PIN. Your progress (game points & badges) will be saved to your profile and backed up automatically.
                </p>
              </div>

              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-xs font-black text-stone-700 uppercase tracking-wider">
                  Student Nickname / Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun_Math or ParabolaChamp"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-sm font-bold focus:border-[#00B4A7] focus:outline-none"
                  />
                </div>
              </div>

              {/* Mascot Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-stone-700 uppercase tracking-wider">
                  Choose Your Student Mascot Avatar
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {STUDENT_MASCOTS.map((m) => (
                    <button
                      key={m.emoji}
                      type="button"
                      onClick={() => setRegMascot(m.emoji)}
                      className={`p-2 rounded-xl border-2 text-center transition cursor-pointer flex flex-col items-center ${
                        regMascot === m.emoji
                          ? 'border-[#00B4A7] bg-teal-50 ring-2 ring-[#00B4A7]/30 scale-105'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span className="text-[10px] font-bold text-stone-700 mt-1 truncate w-full">
                        {m.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4-Digit PIN */}
              <div className="space-y-1">
                <label className="text-xs font-black text-stone-700 uppercase tracking-wider">
                  Secret 4-Digit Passcode / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="password"
                    maxLength={8}
                    required
                    placeholder="e.g. 1234 or 2026"
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-sm font-bold focus:border-[#00B4A7] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  Remember this 4-digit PIN to log back in on any other computer or tablet.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-black transition cursor-pointer shadow-md disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                <span>Create Student Account & Save Progress</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  Already have a student account? Log in here →
                </button>
              </div>
            </form>
          )}

          {/* TAB: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1.5">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Stats Start Reset &amp; Unlock Upon Sign-In</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Every visit starts with stats reset to 0. Sign in with your student nickname and 4-digit PIN (or create a free account without email) to unlock badges, chapter ranks, and up to 4,000 EXP.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername('DemoStudent');
                    setLoginPin('1234');
                    setErrorMsg(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-[11px] font-black transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Fill Demo Student (DemoStudent · PIN 1234)</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-stone-700 uppercase tracking-wider">
                  Student Nickname / Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="Your registered username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-sm font-bold focus:border-[#00B4A7] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-stone-700 uppercase tracking-wider">
                  Secret 4-Digit Passcode / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="password"
                    maxLength={8}
                    required
                    placeholder="Your 4-digit PIN"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-sm font-bold focus:border-[#00B4A7] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-black transition cursor-pointer shadow-md disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                <span>Sign In &amp; Unlock Stats</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  New student? Create an account in 10 seconds (No Email) →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
