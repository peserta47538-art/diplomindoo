/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Compass, BookOpen, Globe, Award, HelpCircle, MessageSquare, ShieldAlert, FileText, Send, Coins, LogOut, Sparkles, Trophy, User, School, Edit3, X } from 'lucide-react';
import { StudentProfile, Material, Question, Certificate, LeaderboardEntry } from '../types';

// Subcomponents imports
import MaterialView from './MaterialView';
import InteractiveMap from './InteractiveMap';
import GameMisiIndonesia from './GameMisiIndonesia';
import EscapeRoom from './EscapeRoom';
import SidangSimulasi from './SidangSimulasi';
import QuizCerdas from './QuizCerdas';
import CertificateCanvas from './CertificateCanvas';

interface StudentDashboardProps {
  user: any;
  initialProfile: StudentProfile;
  materials: Material[];
  questions: Question[];
  onLogout?: () => void;
  onSwitchRole?: (role: string) => void;
  onUpdateStudentIdentity?: (name: string, className: string) => void;
}

export default function StudentDashboard({
  user,
  initialProfile,
  materials,
  questions,
  onLogout,
  onSwitchRole,
  onUpdateStudentIdentity
}: StudentDashboardProps) {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<'materi' | 'map' | 'misi' | 'escape' | 'sidang' | 'quiz' | 'scores' | 'tutor' | 'leaderboard'>('materi');

  // Identity edit modal states
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [editName, setEditName] = useState(initialProfile.name || 'Dimas Septian');
  const [editClass, setEditClass] = useState(initialProfile.className || 'Kelas X-1');
  const [customClass, setCustomClass] = useState('');
  
  // Tutor chatbot states
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; content?: string; text?: string }[]>([
    { role: 'model', text: 'Halo! Saya adalah **Tutor AI Diplomindo**. Tanyakan apa saja seputar peran Indonesia di ASEAN, PBB, Konferensi Asia-Afrika, atau Politik Luar Negeri Bebas Aktif. Saya siap membantumu!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Recommendations panel state
  const [recommendation, setRecommendation] = useState('');
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Certificate state
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${profile.userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    }
  };

  const loadCertificate = async () => {
    try {
      const res = await fetch('/api/certificates');
      if (res.ok) {
        const data: Certificate[] = await res.json();
        const myCert = data.find(c => c.nis === profile.nis);
        if (myCert) {
          setActiveCertificate(myCert);
        }
      }
    } catch (err) {
      console.error('Error loading certificate:', err);
    }
  };

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = editName.trim();
    const finalClass = editClass === 'custom' ? customClass.trim() : editClass;
    if (!finalName || !finalClass) return;

    try {
      const res = await fetch('/api/student/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: profile.id,
          name: finalName,
          className: finalClass
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        onUpdateStudentIdentity?.(finalName, finalClass);
        setShowIdentityModal(false);
      }
    } catch (err) {
      console.error('Error saving identity:', err);
    }
  };

  const handleUpdateProgress = async (xpEarned: number, coinsEarned: number, gameCompleted?: string, materialCompleted?: string, quizId?: string, quizScore?: number) => {
    try {
      const res = await fetch(`/api/profile/${profile.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xpEarned,
          coinsEarned,
          gameCompletedCode: gameCompleted, // let API handle completed game list
          materialCompleted,
          gameCompleted,
          quizId,
          quizScore
        })
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        if (data.certificateIssued) {
          setActiveCertificate(data.certificateIssued);
        }
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleRequestAIRecommendation = async () => {
    setLoadingRecommendation(true);
    try {
      const res = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentProfile: profile })
      });
      const data = await res.json();
      if (res.ok) {
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error('Error recommendation:', err);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          chatHistory: chatHistory.map((item) => ({
            role: item.role,
            content: item.text || item.content
          }))
        })
      });
      const data = await res.json();
      if (res.ok) {
        setChatHistory((prev) => [...prev, { role: 'model', text: data.text }]);
      } else {
        setChatHistory((prev) => [...prev, { role: 'model', text: '⚠️ Gagal merespon pertanyaan. Pastikan koneksi server tersambung baik.' }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatHistory((prev) => [...prev, { role: 'model', text: '⚠️ Kesalahan jaringan dalam menghubungi Tutor AI.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Scroll chat thread to bottom on message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Load and refresh everything on startup
  useEffect(() => {
    fetchProfile();
    loadLeaderboard();
    loadCertificate();
    handleRequestAIRecommendation();
  }, []);

  // Sync leaderboard when profile modifies
  useEffect(() => {
    loadLeaderboard();
    loadCertificate();
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col md:flex-row" id="student-dashboard-layout">
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between shrink-0 p-4" id="sidebar-panel">
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 pb-4 border-b border-red-500/30">
            <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-500/30">
              <span className="text-sm font-bold">🇮🇩</span>
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                DIPLOMINDO
              </h2>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">BELANUSA VIRTUAL LAB</p>
            </div>
          </div>

          {/* Student Profile Overview widget */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-red-500/10 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-red-650 to-amber-500 flex items-center justify-center text-white font-black text-sm border-2 border-red-500/30">
                  {profile.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{profile.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] bg-red-500/20 text-red-300 font-bold px-1.5 py-0.5 rounded border border-red-500/30">
                      {profile.className || profile.classId || 'Kelas X'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold font-mono">NIS: {profile.nis}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditName(profile.name);
                  setEditClass(profile.className || 'Kelas X-1');
                  setShowIdentityModal(true);
                }}
                title="Ubah Nama & Kelas"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Level statistics indicator */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>Diplomat Level {profile.level}</span>
                <span className="text-red-400 font-mono">{profile.xp} XP</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                {/* Every level has 100 XP increment */}
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-300" 
                  style={{ width: `${profile.xp % 100}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-300 font-bold bg-slate-900/50 p-2 rounded-lg border border-slate-850">
              <span className="flex items-center gap-1"><Coins className="h-3.5 w-3.5 text-amber-500" /> {profile.coins || 0} Coins</span>
              <span className="text-red-400">{profile.badges.length} Lencana</span>
            </div>
          </div>

          {/* Navigational Links Menu */}
          <nav className="space-y-1 text-left" id="sidebar-nav">
            <button
              onClick={() => setActiveTab('materi')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'materi' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <BookOpen className="h-4 w-4" /> Katalog Materi
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'map' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <Globe className="h-4 w-4" /> Peta Interaktif
            </button>
            <button
              onClick={() => setActiveTab('misi')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'misi' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <Compass className="h-4 w-4" /> Misi Indonesia RPG
            </button>
            <button
              onClick={() => setActiveTab('escape')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'escape' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <Award className="h-4 w-4" /> Escape Room
            </button>
            <button
              onClick={() => setActiveTab('sidang')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'sidang' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <MessageSquare className="h-4 w-4" /> Sidang Negara AI
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'quiz' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <HelpCircle className="h-4 w-4" /> Kuis Cerdas
            </button>
            <button
              onClick={() => setActiveTab('tutor')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'tutor' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <Sparkles className="h-4 w-4 text-amber-400" /> Tutor AI Pintar
            </button>
            <button
              onClick={() => setActiveTab('scores')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'scores' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <FileText className="h-4 w-4" /> Nilai & Sertifikat
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'leaderboard' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <Trophy className="h-4 w-4 text-amber-500" /> Rangking Kelas
            </button>
          </nav>
        </div>

        {/* Quick Role & Identity Actions (No Login Barrier) */}
        <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              setEditName(profile.name);
              setEditClass(profile.className || 'Kelas X-1');
              setShowIdentityModal(true);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer border border-slate-700/60 shadow-xs"
            id="btn-sidebar-edit-identity"
          >
            <Edit3 className="h-3.5 w-3.5 text-red-400" />
            <span>Ubah Nama & Kelas</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchRole?.('teacher')}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl transition cursor-pointer"
          >
            <span>👨‍🏫 Buka Dashboard Guru</span>
          </button>
        </div>
      </aside>

      {/* CENTRAL DISPLAY CAROUSEL */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-5xl space-y-6 text-left" id="student-main-content">
        
        {/* PROGRESS BLOCKER BANNER INSIDE MAIN PAGE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* Main Greetings Card styled with gorgeous patriotic Merah Putih scheme */}
          <div className="md:col-span-8 p-5 bg-gradient-to-r from-red-600 via-red-550 to-rose-600 border-2 border-red-500 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-lg shadow-red-500/10 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="inline-block bg-white text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-widest leading-none shadow-xs">
                  🇮🇩 Lab Kewarganegaraan • {profile.className || profile.classId || 'Kelas X'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditName(profile.name);
                    setEditClass(profile.className || 'Kelas X-1');
                    setShowIdentityModal(true);
                  }}
                  className="inline-flex items-center gap-1 text-[10px] bg-black/20 hover:bg-black/35 text-white font-bold px-2 py-0.5 rounded-full transition cursor-pointer border border-white/20"
                >
                  <Edit3 className="h-2.5 w-2.5" /> Ganti Identitas
                </button>
              </div>
              <h3 className="text-xl font-black flex items-center flex-wrap gap-2">
                <span>Selamat Mengabdi, {profile.name}!</span>
              </h3>
              <p className="text-[11px] text-red-100 leading-relaxed max-w-xl font-medium">
                Negara menanti pemikiran kritis, jiwa patriotis, dan tindakan cerdas dari Anda. Selesaikan seluruh modul interaktif untuk mengasah ilmu tata nusa & ketertiban dunia!
              </p>
            </div>
            {/* Lencana Badges Row widget */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/25 mt-4 overflow-x-auto z-10">
              <span className="text-[9px] uppercase font-bold text-red-200 shrink-0">Lencana Kehormatan:</span>
              <div className="flex gap-1.5">
                {profile.badges.length > 0 ? (
                  profile.badges.map((bName, k) => (
                    <span key={k} className="text-[10px] font-bold bg-slate-900 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-lg">
                      {bName === 'badge_bronze' ? '🥉 Pemula' : bName === 'badge_silver' ? '🥈 Muda' : bName === 'badge_gold' ? '🥇 Nasional' : '🏆 Diplomat Dunia'}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] text-red-200 font-bold">Lencana belum diperoleh. Selesaikan tantangan kuis/misi pertama Anda!</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Recommended Learning widget */}
          <div className="md:col-span-4 p-5 bg-white border border-red-100 rounded-3xl flex flex-col justify-between text-left space-y-3 relative shadow-md shadow-red-500/5">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-red-600 flex items-center gap-1">
                <Sparkles className="h-4 w-4 animate-pulse text-red-600" /> Diagnosis Cerdas AI
              </h4>
              <p className="text-[10px] text-slate-600 font-bold leading-relaxed line-clamp-3">
                {loadingRecommendation ? 'Tunggu, AI sedang mendeteksi kuis lemah...' : recommendation || 'Melakukan kalkulasi rekomendasi...'}
              </p>
            </div>
            <button
              onClick={handleRequestAIRecommendation}
              className="text-[9px] font-extrabold text-red-650 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 p-1.5 rounded-lg w-full transition-colors"
            >
              Ulangi Analisis AI 🔄
            </button>
          </div>
        </div>

        {/* CONTAINER SWITCH FOR TABS PANEL */}
        <div className="pt-2" id="tab-outlet">
          {activeTab === 'materi' && (
            <MaterialView
              materials={materials}
              profile={profile}
              onCompleteMaterial={(matId, xp, coins) => handleUpdateProgress(xp, coins, undefined, matId)}
            />
          )}

          {activeTab === 'map' && (
            <InteractiveMap />
          )}

          {activeTab === 'misi' && (
            <GameMisiIndonesia
              completedGames={profile.completedGames}
              onAwardProgress={(xp, coins, gameId) => handleUpdateProgress(xp, coins, gameId)}
            />
          )}

          {activeTab === 'escape' && (
            <EscapeRoom
              onAwardProgress={(xp, coins, gameId) => handleUpdateProgress(xp, coins, gameId)}
            />
          )}

          {activeTab === 'sidang' && (
            <SidangSimulasi
              onAwardProgress={(xp, coins, gameId) => handleUpdateProgress(xp, coins, gameId)}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizCerdas
              questions={questions}
              profile={profile}
              onSubmitQuizScore={(qId, score, xp, coins) => handleUpdateProgress(xp, coins, undefined, undefined, qId, score)}
            />
          )}

          {activeTab === 'tutor' && (
            <div className="bg-white border border-red-100 rounded-3xl p-5 md:p-6 space-y-4 max-w-4xl mx-auto flex flex-col h-[500px] shadow-md shadow-red-500/5" id="tutor-chatbot-frame">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 h-10 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-red-500 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-black text-slate-850">Konsultasi Tutor AI Diplomindo</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Menjawab sesuai Panduan Kurikulum PPKn Kelas X</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatHistory([{ role: 'model', text: 'Halo! Ada materi geostrategis ASEAN, PBB atau KAA yang ingin kamu tanyakan hari ini?' }])}
                  className="text-[10px] bg-slate-100 px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 hover:text-slate-800 transition-all"
                >
                  Bersihkan Chat
                </button>
              </div>

              {/* Chat messages thread */}
              <div className="flex-grow overflow-y-auto space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-200" id="dialog-thread">
                {chatHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3.5 rounded-2xl max-w-xl text-xs leading-relaxed text-left ${
                      item.role === 'user'
                        ? 'bg-red-600 text-white rounded-br-none shadow shadow-red-500/10'
                        : 'bg-white text-slate-700 rounded-bl-none border border-slate-200 shadow-sm'
                    }`}>
                      <p className="whitespace-pre-line font-medium">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 bg-white text-slate-500 border border-slate-200 rounded-2xl text-xs rounded-bl-none animate-pulse shadow-sm font-medium">
                      Tutor AI mengetik analisis materi...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Form Input query block */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2 shrink-0">
                <input
                  type="text"
                  required
                  placeholder="Ketik pertanyaanmu, contoh: Jelaskan apa tujuan dibentuknya ASEAN"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-grow bg-white border border-slate-250 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none placeholder-slate-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 rounded-xl flex items-center justify-center shadow-md shadow-red-500/15 transition-colors"
                >
                  Kirim ➜
                </button>
              </form>
            </div>
          )}

          {activeTab === 'scores' && (
            <div className="space-y-6" id="scores-certificate-hub">
              {/* Scores summary list */}
              <div className="bg-white border border-red-100 rounded-3xl p-6 text-left space-y-4 shadow-md shadow-red-500/5">
                <h3 className="text-base font-black text-slate-850 tracking-tight">Status & Buku Nilai Tugas Kelas</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Kuis Evaluasi</span>
                    <p className="text-xl font-extrabold text-red-600">{profile.quizScores.quiz_mixed_eval !== undefined ? profile.quizScores.quiz_mixed_eval : 'Belum Kuis'}</p>
                    <span className="text-[9px] text-slate-500 font-medium block">Kriteria Lulus: 75</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Selesai Membaca</span>
                    <p className="text-xl font-extrabold text-emerald-600">{profile.completedMaterials.length} / 8</p>
                    <span className="text-[9px] text-slate-500 font-medium block">Materi Pokok</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Game Diplomasi</span>
                    <p className="text-xl font-extrabold text-amber-600">{profile.completedGames.length} / 3</p>
                    <span className="text-[9px] text-slate-500 font-medium block">Misi Selesai</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col justify-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Penghargaan Lencana</span>
                    <p className="text-base font-extrabold text-slate-800">{profile.badges.length} Pin</p>
                  </div>
                </div>
              </div>

              {/* Certificate Canvas Frame */}
              <div className="border border-slate-200 p-1 rounded-3xl bg-white shadow-sm" id="pdf-certificate-loader">
                {activeCertificate ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-2xl text-xs text-emerald-850 font-bold block text-center">
                      🌟 Kualifikasi Sertifikat Lengkap! Sertifikat elektronik Anda diterbitkan secara resmi.
                    </div>
                    <CertificateCanvas certificate={activeCertificate} />
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white border border-red-50 rounded-3xl space-y-4 text-slate-500">
                    <Award className="h-10 w-10 text-red-500 mx-auto animate-pulse" />
                    <div className="space-y-1">
                      <h4 className="text-slate-800 text-base font-extrabold">Sertifikat Belum Memenuhi Kualifikasi</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                        Untuk memicu penerbitan Sertifikat Kelulusan Resmi SMAN / Diplomindo, pastikan menyelesaikan **Misi Indonesia RPG**, **Escape Room**, serta memperoleh nilai rata-rata kuis di atas **skor 75**!
                      </p>
                    </div>
                    {/* Progression rate checker */}
                    <div className="max-w-xs mx-auto bg-red-50/50 p-4 rounded-2xl border border-red-100 space-y-2">
                      <div className="flex justify-between text-[10px] uppercase font-black text-slate-650">
                        <span>Langkah Menuju Sertifikat:</span>
                        <span className="text-red-650 font-black font-mono">{(profile.completedMaterials.length / 8 * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: `${profile.completedMaterials.length / 8 * 100}%` }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-white border border-red-100 rounded-3xl p-6 text-left space-y-4 shadow-sm" id="leaderboard-panel">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-850 tracking-tight flex items-center gap-1.5">
                  <Trophy className="h-5 w-5 text-amber-500 animate-bounce" /> Dewan Kehormatan Rangking Kelas
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Peringkat diukur realtime berdasarkan perolehan total XP dari seluruh siswa Diplomindo di SMAN.</p>
              </div>

              {/* Table rendering list */}
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white">
                <table className="w-full text-xs text-left" id="table-leaderboard">
                  <thead className="bg-red-50 text-[10px] text-red-700 uppercase tracking-wider border-b border-red-100 font-black">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">NIS</th>
                      <th className="p-3">Level</th>
                      <th className="p-3">Total XP</th>
                      <th className="p-3">Lencana</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {leaderboard.map((item) => (
                      <tr 
                        key={item.nis} 
                        className={`hover:bg-slate-50/85 transition-colors ${
                          item.nis === profile.nis ? 'bg-red-50/60 text-red-700 font-bold border-l-4 border-l-red-600' : ''
                        }`}
                      >
                        <td className="p-3 font-mono font-black">{item.rank === 1 ? '🥇 1' : item.rank === 2 ? '🥈 2' : item.rank === 3 ? '🥉 3' : item.rank}</td>
                        <td className="p-3 font-bold text-slate-800">{item.name}</td>
                        <td className="p-3 text-slate-400 font-mono">{item.nis}</td>
                        <td className="p-3 font-medium">Level {item.level}</td>
                        <td className="p-3 font-extrabold text-red-600 font-mono">{item.xp} XP</td>
                        <td className="p-3 text-slate-500">{item.badgesCount} Badges</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* IDENTITY EDIT MODAL (No Login Barrier) */}
      {showIdentityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-red-100 text-left relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Ubah Identitas Siswa</h4>
                  <p className="text-[11px] text-slate-500">Tanpa login, langsung tersimpan.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIdentityModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIdentity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Contoh: Dimas Septian"
                  className="w-full bg-[#FCFCFC] border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelas</label>
                <select
                  value={editClass}
                  onChange={(e) => setEditClass(e.target.value)}
                  className="w-full bg-[#FCFCFC] border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none font-semibold cursor-pointer"
                >
                  <option value="Kelas X-1">🏫 Kelas X-1</option>
                  <option value="Kelas X-2">🏫 Kelas X-2</option>
                  <option value="Kelas X-3">🏫 Kelas X-3</option>
                  <option value="Kelas X-4">🏫 Kelas X-4</option>
                  <option value="Kelas X-5">🏫 Kelas X-5</option>
                  <option value="Kelas X-6">🏫 Kelas X-6</option>
                  <option value="Kelas X-A">🏫 Kelas X-A</option>
                  <option value="Kelas X-B">🏫 Kelas X-B</option>
                  <option value="Kelas X-C">🏫 Kelas X-C</option>
                  <option value="custom">✏️ Ketik Kelas Lainnya...</option>
                </select>

                {editClass === 'custom' && (
                  <input
                    type="text"
                    required
                    placeholder="Ketik nama kelas (misal: X IPS 1)"
                    value={customClass}
                    onChange={(e) => setCustomClass(e.target.value)}
                    className="w-full mt-2 bg-[#FCFCFC] border border-amber-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none font-medium"
                  />
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowIdentityModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-md shadow-red-500/20 cursor-pointer"
                >
                  Simpan Identitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
