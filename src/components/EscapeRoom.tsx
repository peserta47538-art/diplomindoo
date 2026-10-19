/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Clock, Coins, HelpCircle, RefreshCw, AlertTriangle, Key } from 'lucide-react';

interface EscapeRoomProps {
  onAwardProgress: (xp: number, coins: number, gameId: string) => void;
}

interface RoomData {
  id: number;
  title: string;
  description: string;
  question: string;
  options: string[];
  correctIdx: number;
  hint: string;
}

const ROOMS_DATA: RoomData[] = [
  {
    id: 1,
    title: 'Ruang 1: Sandi Organisasi Global ASEAN & PBB',
    description: 'Anda dikurung di ruangan dokumen rahasia PBB. Untuk membongkar kunci digital pintu pertama, pecahkan teka-teki pendiri ASEAN di bawah ini.',
    question: 'Siapakah perwakilan delegasi kabinet menteri luar negeri Republik Indonesia yang membubuhkan tandatangan pada naskah piagam Deklarasi Bangkok tahun 1967?',
    options: ['Mohammad Hatta', 'Sugandhi Kartoprasetyo', 'Adam Malik', 'Soemitro Djojohadikoesoemo'],
    correctIdx: 2, // Adam Malik
    hint: 'Beliau menjabat sebagai Presidensi Sidang Umum PBB tahun 1971 dan merupakan politisi ulung kelahiran Pematangsiantar.'
  },
  {
    id: 2,
    title: 'Ruang 2: Brankas Peran Diplomasi Indonesia',
    description: 'Pintu kedua terkunci rapat oleh rantai baja. Satu-satunya jalan adalah memecahkan kode brankas yang mencatat prestasi pertama sejarah regional kita.',
    question: 'Di kota manakah perhelatan akbar Konferensi Tingkat Tinggi (KTT) ASEAN ke-1 dilangsungkan pada tahun 1976?',
    options: ['Bandung, Jawa Barat', 'Denpasar (Bali)', 'Kuala Lumpur', 'Singapura'],
    correctIdx: 1, // Denpasar (Bali)
    hint: 'Kota wisata legendaris bergelar Pulau Dewata yang menghasilkan kesepakatan Treaty of Amity and Cooperation.'
  },
  {
    id: 3,
    title: 'Ruang 3: Laboratorium Studi Kasus Ambalat & Kelautan',
    description: 'Gas berbahaya mulai bocor. Pecahkan kunci pintu ketiga dengan mengidentifikasi landasan perlindungan kedaulatan parit laut nusantara.',
    question: 'Berdasarkan hukum laut internasional PBB (UNCLOS 1982), hak kelautan eksklusif Indonesia untuk mengeksploitasi sumber alam migas hingga batas 200 mil laut dinamakan...',
    options: ['Laut Teritorial Terpadu', 'Zona Ekonomi Eksklusif (ZEE)', 'Landas Kontinen Tambahan', 'Laut Bebas Antara'],
    correctIdx: 1, // ZEE
    hint: 'Singkatannya adalah ZEE. Diatur dalam hukum konvensi laut Perserikatan Bangsa-Bangsa.'
  },
  {
    id: 4,
    title: 'Ruang 4: Meluruskan Miskonsepsi Sejarah PBB',
    description: 'Kunci holografik menuntut Anda menepis kesalahan nalar para ilmuis siber masa lalunya.',
    question: 'Manakah alasan hukum yang BENAR mengapa Presiden Soekarno menarik Indonesia keluar dari PBB pada Januari tahun 1965?',
    options: [
      'PBB menunjuk sekutu kolonialis Belanda menguasai Papua Barat',
      'Masuknya federasi Malaysia sebagai Dewan Keamanan tidak tetap PBB secara sepihak',
      'PBB mengalami kebangkrutan keuangan masal',
      'Indonesia didesak merubah asas Pancasila menjadi komunis'
    ],
    correctIdx: 1, // Masuknya Malaysia
    hint: 'Berkaitan dengan konfrontasi ganyang Malaysia ("Dwi Komando Rakyat") saat itu.'
  },
  {
    id: 5,
    title: 'Ruang 5: Gerbang Akhir Diplomasi Global siber',
    description: 'Ruang kendali utama reaktor. Untuk meredam radiasi siber, tentukan karakter doktrin dasar diplomasi Indonesia.',
    question: 'Ketika poros diplomasi dituntut tidak memihak aliansi militer global manapun namun terus aktif mewujudkan perdamaian abadi, doktrin tersebut dinamakan...',
    options: ['Doktrin Ofensif Maritim', 'Politik Luar Negeri Bebas Aktif', 'Netralitas Pasif Pancasila', 'Poros Jakarta-Beijing-Moscow'],
    correctIdx: 1, // Bebas Aktif
    hint: 'Dirumuskan oleh Mohammad Hatta lewat kiasan mengagumkan "Mendayung di antara Dua Karang".'
  }
];

export default function EscapeRoom({ onAwardProgress }: EscapeRoomProps) {
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes timer
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [roomComplete, setRoomComplete] = useState(false);
  const [escaped, setEscaped] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (escaped || gameOver) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, escaped, gameOver]);

  const activeRoom = ROOMS_DATA[currentRoomIdx];

  const handleUnlockDoor = () => {
    if (selectedOpt === null) return;

    if (selectedOpt === activeRoom.correctIdx) {
      setRoomComplete(true);
      // Give 40 XP and 20 Coins on room unlock
      onAwardProgress(40, 20, '');
    } else {
      // Deduct 15 seconds as a penalty for wrong answer
      setTimeLeft((prev) => Math.max(0, prev - 15));
      alert('🔒 Kombinasi Kunci Salah! Alarm berbunyi, waktu Anda dipotong 15 detik sebagai denda!');
    }
  };

  const handleNextRoom = () => {
    setSelectedOpt(null);
    setRoomComplete(false);
    setShowHint(false);

    if (currentRoomIdx < ROOMS_DATA.length - 1) {
      setCurrentRoomIdx((prev) => prev + 1);
    } else {
      setEscaped(true);
      // Award final game completion
      onAwardProgress(100, 50, 'escape');
    }
  };

  const handleRestart = () => {
    setCurrentRoomIdx(0);
    setTimeLeft(240);
    setSelectedOpt(null);
    setShowHint(false);
    setRoomComplete(false);
    setEscaped(false);
    setGameOver(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (gameOver) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 max-w-lg mx-auto" id="escape-fail-container">
        <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Waktu Habis! Kunci Terkunci Selamanya</h3>
          <p className="text-xs text-slate-400">Pintu digital terlah ditutup otomatis oleh protokol sistem. Jangan menyerah, asah kembali ingatan materi kedaulatan Anda.</p>
        </div>
        <button
          onClick={handleRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 mx-auto"
          id="btn-escape-retry"
        >
          <RefreshCw className="h-4 w-4" /> Ulangi Escape Room
        </button>
      </div>
    );
  }

  if (escaped) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 max-w-xl mx-auto" id="escape-success-container">
        <div className="h-20 w-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          <Unlock className="h-10 w-10 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white">Anda Berhasil Meloloskan Diri!</h3>
          <p className="text-xs text-slate-400">Semua 5 pintu digital berhasil dinetralkan. Anda terbukti memiliki penalaran komprehensif organisasi internasional.</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase">Waktu Tersisa</span>
            <p className="text-lg font-black text-blue-400">{formatTime(timeLeft)}</p>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase">Bonus Payout</span>
            <p className="text-lg font-black text-amber-400">+100 XP / +50 Coins *</p>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition"
          id="btn-escape-restart"
        >
          Mainkan Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 max-w-3xl mx-auto text-left relative" id="escape-panel-wrapper">
      
      {/* Upper info panel stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-500/20">
            ESCAPE ROOM EDUCATION
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">Game 2: Escape Room Diplomasi</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl shrink-0">
            <Clock className="h-4 w-4 animate-pulse" /> {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Visual Rooms Progress dots */}
      <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-850" id="escape-rooms-pips">
        {ROOMS_DATA.map((r, i) => {
          const isPassed = i < currentRoomIdx;
          const isCurrent = i === currentRoomIdx;
          return (
            <div key={r.id} className="flex-grow flex items-center">
              <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold transition ${
                isPassed 
                  ? 'bg-emerald-600 border-emerald-500 text-white' 
                  : isCurrent 
                    ? 'bg-blue-600 border-blue-500 text-white animate-pulse' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
                {r.id}
              </div>
              {i < 4 && (
                <div className={`flex-grow h-[2px] mx-2 ${
                  isPassed ? 'bg-emerald-600' : 'bg-slate-800'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Room Card description and puzzle */}
      <div className="p-5 md:p-6 bg-slate-950 rounded-2xl border border-slate-850 space-y-4">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
          <Key className="h-4 w-4 text-amber-400" /> {activeRoom.title}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {activeRoom.description}
        </p>
        <div className="pt-4 border-t border-slate-900 text-slate-100 text-xs md:text-sm font-bold leading-relaxed">
          🔒 [SOAL SANDI]: {activeRoom.question}
        </div>
      </div>

      {/* Answer selection options */}
      <div className="space-y-3" id="escape-room-options">
        <div className="grid grid-cols-1 gap-2.5">
          {activeRoom.options.map((opt, idx) => {
            const isSelected = selectedOpt === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => { if (!roomComplete) setSelectedOpt(idx); }}
                disabled={roomComplete}
                className={`p-3 rounded-xl border text-xs text-left leading-relaxed transition flex gap-3 items-center ${
                  roomComplete 
                    ? idx === activeRoom.correctIdx
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-950/20 border-slate-900 text-slate-600'
                    : isSelected
                      ? 'bg-blue-600/10 border-blue-500 text-white font-semibold'
                      : 'bg-slate-950/60 border-slate-850 text-slate-300 hover:bg-slate-950 hover:border-slate-800'
                }`}
              >
                <span className={`h-5 w-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-blue-600 text-white border-blue-500' : 'border-slate-800 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls & Hints trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1.5"
            id="btn-trigger-hint"
          >
            <HelpCircle className="h-4 w-4" /> {showHint ? 'Sembunyikan Petunjuk' : 'Tampilkan Hint (Buka Petunjuk)'}
          </button>
          
          {showHint && (
            <p className="text-[11px] text-amber-300/80 italic mt-2 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 max-w-md">
              💡 **Hint:** {activeRoom.hint}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 shrink-0">
          {!roomComplete ? (
            <button
              onClick={handleUnlockDoor}
              disabled={selectedOpt === null}
              className={`font-semibold text-xs py-2.5 px-6 rounded-xl transition shadow flex items-center gap-2 ${
                selectedOpt === null
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10'
              }`}
            >
              <Lock className="h-4 w-4" /> Buka Kunci Pintu (+ XP)
            </button>
          ) : (
            <button
              onClick={handleNextRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow shadow-blue-500/20 flex items-center gap-2"
            >
              <Unlock className="h-4 w-4 animate-bounce" /> Lolos ke Pintu {currentRoomIdx < 4 ? currentRoomIdx + 2 : 'Bebas!'} ➜
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
