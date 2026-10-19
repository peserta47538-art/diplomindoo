/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, ShieldCheck, Award, MessageSquare, AlertCircle, Coins, LogIn } from 'lucide-react';

interface GameMisiProps {
  onAwardProgress: (xp: number, coins: number, gameId: string) => void;
  completedGames: string[];
}

interface MissionLevel {
  level: number;
  title: string;
  scenario: string;
  choices: {
    text: string;
    xp: number;
    coins: number;
    feedback: string;
    isCorrect: boolean;
  }[];
}

const MISSION_LEVELS: MissionLevel[] = [
  {
    level: 1,
    title: 'Misi 1: Pengenalan ASEAN (Asas Asia Tenggara)',
    scenario: 'Anda barusan dilantik sebagai Atase Diplomasi Muda Indonesia di Sekretariat ASEAN. Menlu Adam Malik meminta Anda mereview draf Deklarasi Bangkok 1967 sebelum ditandatangani. Namun ada pasal rancangan yang ditolak negara peninjau karena dinilai mengancam kedaulatan internal. Apa langkah diplomasi awal Anda?',
    choices: [
      {
        text: 'Mengusulkan dimasukkannya asas non-intervensi (tidak ikut campur urusan dalam negeri kedaulatan negara tetangga) sebagai kesepakatan dasar kerja sama.',
        xp: 60,
        coins: 30,
        feedback: 'Sempurna! Asas non-intervensi dan kedaulatan mutlak merupakan pilar utama piagam kemitraan ASEAN (*ASEAN Way*) yang sukses mendamaikan kawasan.',
        isCorrect: true
      },
      {
        text: 'Menolak merubah draf deklarasi dan mengancam Indonesia akan keluar dari wacana gabungan ASEAN jika draf didebat.',
        xp: 15,
        coins: 5,
        feedback: 'Kurang bijak. Sebagai salah satu pelopor utama, Indonesia mengedepankan asas musyawarah mufakat, bukan paksaan unilateral.',
        isCorrect: false
      },
      {
        text: 'Merekomendasikan penundaan deklarasi hingga 5 tahun ke depan agar seluruh negara melakukan konsiliasi menyeluruh.',
        xp: 30,
        coins: 10,
        feedback: 'Kurang tepat. Penundaan terlalu lama melemahkan keteguhan geopolitik kawasan Asia Tenggara yang saat itu tengah dilanda krisis Perang Dingin.',
        isCorrect: false
      }
    ]
  },
  {
    level: 2,
    title: 'Misi 2: Menyelesaikan Konflik Antarnegara (JIM Kamboja)',
    scenario: 'Terjadi sengketa bersenjata yang berkepanjangan di Kamboja tahun 1980-an yang menelan jutaan korban jiwa. Suasana geopolitik ASEAN sangat membara. Menlu Mochtar Kusumaatmadja menugaskan Anda menjadi juru mediasi di forum perundingan formal Jakarta Informal Meeting (JIM). Bagaimana cara Anda mempertemukan faksi-faksi yang bermusuhan?',
    choices: [
      {
        text: 'Mengusulkan penyelenggaraan jamuan makan malam informal berpakaian sipil santai tanpa atribut militer, agar para pemimpin bisa berdialog dari hati ke hati terlebih dahulu sebelum negosiasi formal.',
        xp: 75,
        coins: 40,
        feedback: 'Luar biasa! Ini adalah taktik legendaris bertajuk "Cocktail Party" di Jakarta Informal Meeting (JIM) yang sukses memecah kebuntuan perang Kamboja secara damai!',
        isCorrect: true
      },
      {
        text: 'Mengundang salah satu faksi bersenjata saja yang dinilai membela visi Indonesia, dan memboikot faksi yang berkoalisi dengan blok kiri.',
        xp: 20,
        coins: 10,
        feedback: 'Tindakan ini menyalahi asas Bebas Aktif. Juru mediasi internasional wajib bersikap adil, imparsial, serta merangkul semua pihak demi perdamaian yang berkelanjutan.',
        isCorrect: false
      },
      {
        text: 'Membagikan draf perjanjian perdamaian buatan Indonesia secara paksa dan mengancam intervensi militer bersama jika draf tidak disepakati.',
        xp: 35,
        coins: 15,
        feedback: 'Kurang tepat. ASEAN tidak menganut pakta militer pertahanan agresif, tindakan mengancam akan menghancurkan kepercayaan tetangga terhadap niat damai Indonesia.',
        isCorrect: false
      }
    ]
  },
  {
    level: 3,
    title: 'Misi 3: Sidang PBB (To Build the World Anew!)',
    scenario: 'Tensi perang dingin dunia melonjak tinggi. Indonesia dipercaya berdiri di mimbar Sidang Umum PBB tahun 1960. Anda diminta merancang kerangka pidato utama delegasi RI dalam menyikapi dominasi dua kekuatan besar (Blok Barat dan Blok Timur). Konsep ideologi apa yang Anda tawarkan?',
    choices: [
      {
        text: 'Menyampaikan pidato "To Build the World Anew!" mempromosikan nilai-nilai Pancasila sebagai ideologi alternatif dunia yang mengutamakan ketuhanan, kemanusiaan, persatuan, musyawarah, dan keadilan sosial bagi tata dunia baru.',
        xp: 80,
        coins: 50,
        feedback: 'Hebat, catatan sejarah mencatat pidato ini mengubah pandangan dunia! Pancasila terbukti menjadi inspirasi internasional untuk mendamaikan polarisasi kekuatan adidaya.',
        isCorrect: true
      },
      {
        text: 'Menyatakan Indonesia secara resmi bergabung penuh ke Blok Timur/Jakarta-Peking karena didatangkan bantuan subsidi senjata besar-besaran.',
        xp: 25,
        coins: 10,
        feedback: 'Kurang tepat. Menghambakan diri ke satu blok kekuatan menghancurkan doktrin Bebas Aktif kita dan berisiko menyeret nusantara ke tengah pusaran perang sipil global.',
        isCorrect: false
      },
      {
        text: 'Mendominasi perdebatan dengan menuntut penghapusan hak veto seluruh Dewan Keamanan PBB dan mengancam pembubaran PBB.',
        xp: 40,
        coins: 20,
        feedback: 'Tuntutan sepihak yang radikal meniadakan ruang diplomasi. Indonesia lebih mengutamakan mereformasi PBB dari dalam melalui dialog konstruktif bertahap.',
        isCorrect: false
      }
    ]
  },
  {
    level: 4,
    title: 'Misi 4: Keputusan Diplomat Sengketa Natuna Utara',
    scenario: 'Kapal sengketa (Coast Guard) negara asing melanggar garis batas Zona Ekonomi Eksklusif (ZEE) Indonesia di perairan Natuna Utara, mengklaim bahwa kawasan tersebut berada di bawah "Nostalgic Fishing Grounds" leluhur mereka. Awak patroli kelautan RI menanti instruksi tindakan diplomatik Anda.',
    choices: [
      {
        text: 'Gunakan landasan konvensi PBB UNCLOS 1982 yang menetapkan kedaulatan ZEE 200 mil laut bagi Indonesia. Tolak klaim "Sembilan Garis Putus" negara asing secara tertib melalui surat nota protes PBB diringi pengawalan ketat Bakamla.',
        xp: 90,
        coins: 60,
        feedback: 'Sangat cemerlang! UNCLOS 1982 adalah instrumen kedaulatan utama kelautan Indonesia yang diakui penuh konvensi hukum laut PBB. Kedaulatan terjaga tanpa provokasi militer melampaui batas.',
        isCorrect: true
      },
      {
        text: 'Mengizinkan kapal asing menjarah asalkan mereka berjanji memberikan keringanan tarif permodalan ekspor manufaktur ke negara kita.',
        xp: 20,
        coins: 5,
        feedback: 'Keputusan buruk! Menukarkan kedaulatan landas batas tanah air dengan kompensasi moneter melanggar sumpah jabatan bela negara dan hukum konstitusional.',
        isCorrect: false
      },
      {
        text: 'Memanggil aliansi militer negara adidaya Barat untuk mendirikan pangkalan militer permanen perang laut di kepulauan Natuna.',
        xp: 45,
        coins: 20,
        feedback: 'Kurang tepat. Mengundang kekuatan militer asing di tanah air menyalahi prinsip Bebas Aktif dan berisiko tinggi menjadikan Indonesia palagan pertempuran antar adidaya.',
        isCorrect: false
      }
    ]
  },
  {
    level: 5,
    title: 'Misi 5: Krisis Iklim dan Penyelamatan Paru-paru Dunia',
    scenario: 'Dalam perhelatan COP PBB mengenai krisis perubahan iklim global, Indonesia didesak menghentikan industri batu bara domestik secara instan. Di satu sisi, listrik nasional masih bertumpu pada suplai batu bara dan penutupan langsung memicu mati lampu masal serta PHK berjuta karyawan industri. Kebijakan resolutif apa yang Anda bawa?',
    choices: [
      {
        text: 'Mengusulkan mekanisme Transisi Energi Berkeadilan (Just Energy Transition) dengan menuntut transfer pembiayaan teknologi hijau dari negara industri maju emiter emisi terbesar kepada negara pemilik hutan tropis.',
        xp: 100,
        coins: 70,
        feedback: 'Ini diplomasi berkeadilan yang luar biasa! Indonesia merawat kelestarian ekologi dengan menuntut pertukaran keadilan ekonomi global (win-win solution ekologi vs ekonomi).',
        isCorrect: true
      },
      {
        text: 'Keluar dari forum lingkungan hidup dan menyatakan Indonesia bebas membakar hutan demi pembangunan ekonomi nasional tanpa peduli iklim global.',
        xp: 15,
        coins: 5,
        feedback: 'Sikap isolasionis yang merugikan. Dampak perubahan iklim juga memicu krisis pangan nasional. Menjaga komitmen hijau menumbuhkan martabat kepemimpinan moral kita.',
        isCorrect: false
      }
    ]
  }
];

export default function GameMisiIndonesia({ onAwardProgress, completedGames }: GameMisiProps) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameScores, setGameScores] = useState({ xp: 0, coins: 0 });
  const [missionComplete, setMissionComplete] = useState(false);

  const levelData = MISSION_LEVELS[currentLevelIdx];

  const handleSelectChoice = (idx: number) => {
    if (showFeedback) return;
    setSelectedChoiceIdx(idx);
  };

  const handleSubmitDecision = () => {
    if (selectedChoiceIdx === null) return;
    setShowFeedback(true);
  };

  const handleNextLevel = () => {
    if (selectedChoiceIdx === null) return;
    const choice = levelData.choices[selectedChoiceIdx];

    // Accumulate local game score
    setGameScores((prev) => ({
      xp: prev.xp + choice.xp,
      coins: prev.coins + choice.coins
    }));

    // Trigger API reward process
    onAwardProgress(choice.xp, choice.coins, currentLevelIdx === 4 ? 'misi' : '');

    // Reset step states
    setSelectedChoiceIdx(null);
    setShowFeedback(false);

    if (currentLevelIdx < MISSION_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      setMissionComplete(true);
      // Final award for complete game
      onAwardProgress(100, 50, 'misi');
    }
  };

  const handleRestart = () => {
    setCurrentLevelIdx(0);
    setSelectedChoiceIdx(null);
    setShowFeedback(false);
    setGameScores({ xp: 0, coins: 0 });
    setMissionComplete(false);
  };

  if (missionComplete) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 max-w-2xl mx-auto" id="misi-congrats-container">
        <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/20 animate-bounce">
          <Award className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white">Misi Diplomasi Selesai!</h3>
          <p className="text-xs text-slate-400">Anda berhasil menuntaskan seluruh 5 tingkat krisis strategis demi kedaulatan Republik Indonesia!</p>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">XP Terkumpul</span>
            <p className="text-2xl font-black text-blue-400">+{gameScores.xp + 100} XP</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Coins Didapat</span>
            <p className="text-2xl font-black text-amber-400">+{gameScores.coins + 50} <Coins className="h-5 w-5 inline text-amber-500 shadow-amber-500/20" /></p>
          </div>
        </div>

        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs text-emerald-400 font-medium leading-relaxed text-left">
          🌟 **Pencapaian Baru:** Gelar **Diplomat Muda** dan lencana prestasi telah diperbaharui. Selesai mempraktikkan asas keadilan hukum, mulailah melangkah ke tantangan **Escape Room** berikutnya!
        </div>

        <button
          onClick={handleRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow shadow-blue-500/15"
          id="btn-misi-restart"
        >
          Mainkan Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-left relative overflow-hidden" id="rpg-misi-wrapper">
      {/* Upper header statistics info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] bg-blue-500/10 text-blue-400 font-extrabold px-2 py-0.5 rounded border border-blue-500/20">
            RPG EDUKASI DIPLOMETRI
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">Game 1: Misi Indonesia di Dunia</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850 font-bold text-slate-300">
            Stage {levelData.level} / 5
          </span>
          <span className="text-xs text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-xl shadow shadow-amber-500/5">
            <Coins className="h-4 w-4" /> {gameScores.coins} Coins
          </span>
        </div>
      </div>

      {/* Progress horizontal steps bar */}
      <div className="relative w-full h-[6px] bg-slate-950 rounded-full overflow-hidden" id="progress-misi-level-bar">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 rounded-full" 
          style={{ width: `${(levelData.level / 5) * 100}%` }}
        />
      </div>

      {/* Main Scenario Display Card */}
      <div className="p-5 md:p-6 bg-slate-950 rounded-2xl border border-slate-850 space-y-4">
        <div className="flex items-center gap-2.5 text-xs text-blue-400 font-bold">
          <Compass className="h-4 w-4 text-blue-400" /> {levelData.title}
        </div>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
          {levelData.scenario}
        </p>
      </div>

      {/* Decisions options list */}
      <div className="space-y-3" id="rpg-options">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pilih Tindakan Diplomatik:</h4>
        <div className="grid grid-cols-1 gap-3">
          {levelData.choices.map((choice, idx) => {
            const isSelected = selectedChoiceIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectChoice(idx)}
                disabled={showFeedback}
                className={`p-4 rounded-xl border text-xs text-left leading-relaxed transition flex gap-3 ${
                  showFeedback 
                    ? isSelected 
                      ? choice.isCorrect 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                        : 'bg-red-500/10 border-red-500/40 text-red-300'
                      : 'bg-slate-950/30 border-slate-900 text-slate-500'
                    : isSelected
                      ? 'bg-blue-600/10 border-blue-500 text-white font-semibold'
                      : 'bg-slate-950/50 border-slate-850 text-slate-350 hover:bg-slate-950/80 hover:border-slate-800'
                }`}
              >
                <span className={`h-5 w-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                  showFeedback
                    ? isSelected && choice.isCorrect
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : isSelected
                        ? 'bg-red-500 text-white border-red-400'
                        : 'border-slate-800 text-slate-600'
                    : isSelected
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{choice.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auto feedback Panel on decision submitted */}
      {showFeedback && selectedChoiceIdx !== null && (
        <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
          levelData.choices[selectedChoiceIdx].isCorrect 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`} id="rpg-feedback-panel">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="h-4 w-4" /> Evaluasi Dewan Diplomasi:
          </div>
          <p>{levelData.choices[selectedChoiceIdx].feedback}</p>
          <div className="font-semibold pt-1">
            Imbalan Misi: +{levelData.choices[selectedChoiceIdx].xp} XP, +{levelData.choices[selectedChoiceIdx].coins} Coins
          </div>
        </div>
      )}

      {/* Navigation triggers */}
      <div className="flex justify-end pt-2">
        {!showFeedback ? (
          <button
            type="button"
            onClick={handleSubmitDecision}
            disabled={selectedChoiceIdx === null}
            className={`font-bold text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 ${
              selectedChoiceIdx === null
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/10'
            }`}
            id="btn-submit-decision"
          >
            Serahkan Keputusan
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextLevel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow shadow-emerald-500/25 flex items-center gap-1.5"
            id="btn-next-misi-step"
          >
            {currentLevelIdx < 4 ? 'Lanjutkan Misi' : 'Selesaikan Petualangan 🏆'}
          </button>
        )}
      </div>
    </div>
  );
}
