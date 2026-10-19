/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, Award, Compass, ShieldCheck, User, School, ArrowRight, GraduationCap, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  currentStudentName?: string;
  currentStudentClass?: string;
  onStartLearning?: (name: string, className: string) => void;
  onLoginSuccess?: (user: any, profile: any, role: string) => void;
}

export default function LandingPage({
  currentStudentName = 'Dimas Septian',
  currentStudentClass = 'Kelas X-1',
  onStartLearning
}: LandingPageProps) {
  const [name, setName] = useState(currentStudentName);
  const [selectedClass, setSelectedClass] = useState(currentStudentClass);
  const [customClass, setCustomClass] = useState('');

  const CLASS_OPTIONS = [
    'Kelas X-1',
    'Kelas X-2',
    'Kelas X-3',
    'Kelas X-4',
    'Kelas X-5',
    'Kelas X-6',
    'Kelas X-7',
    'Kelas X-A',
    'Kelas X-B',
    'Kelas X-C',
    'Kelas X-D',
    'custom'
  ];

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = name.trim() || 'Dimas Septian';
    const finalClass = selectedClass === 'custom' ? (customClass.trim() || 'Kelas X-1') : selectedClass;
    onStartLearning?.(finalName, finalClass);
  };

  const handleQuickFill = (presetName: string, presetClass: string) => {
    setName(presetName);
    if (CLASS_OPTIONS.includes(presetClass)) {
      setSelectedClass(presetClass);
    } else {
      setSelectedClass('custom');
      setCustomClass(presetClass);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] via-[#FFFBFB] to-[#F3F6FF] text-slate-800 flex flex-col justify-between overflow-x-hidden relative" id="landing-container">
      {/* Absolute Decorative Background Elements with Indonesian Flag vibe */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER NAVBAR */}
      <header className="border-b border-red-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <Globe className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-red-600 flex items-center gap-2">
                DIPLOMINDO
                <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full border border-red-600/30">KELAS X SMA</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-bold tracking-normal uppercase">Ketertiban Dunia & Bela Negara</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-red-600 transition-colors">Tujuan Pembelajaran</a>
            <a href="#feature-grid" className="hover:text-red-700 transition-colors">Fitur Kewarganegaraan</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStart()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-red-500/20 flex items-center gap-1.5 cursor-pointer"
              id="btn-nav-start"
            >
              <span>Buka Lab Siswa</span> 🚀
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION CONTAINER */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10" id="hero-main">
        {/* Left Hand Text Elements */}
        <div className="lg:col-span-7 space-y-6 text-left" id="hero-pitch">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-200">
            <Compass className="h-3 w-3 text-red-600" /> Kurikulum Merdeka • PPKn Terintegrasi AI
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
            Semangat Pancasila di <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-550 to-amber-500">Kancah Internasional</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
            Selamat datang di <strong>Diplomindo</strong>! Disiapkan khusus bagi siswa Kelas X SMA untuk memahami geopolitik dunia secara asyik. Berperan langsung sebagai Diplomat Muda Indonesia, kuasai kerja sama multilateral, musyawarah mufakat ASEAN, bela negara di PBB, hingga merumuskan solusi global secara taktis.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 max-w-lg" id="col-metrics">
            <div className="p-3 bg-white rounded-xl border border-red-100 shadow-xs">
              <p className="text-sm font-bold text-slate-500">Materi PPKn</p>
              <p className="text-lg font-black text-red-600">8 Modul Baku</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-red-100 shadow-xs">
              <p className="text-sm font-bold text-slate-500">Game Edukasi</p>
              <p className="text-lg font-black text-amber-500">3 Simulasi</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-red-100 shadow-xs">
              <p className="text-sm font-bold text-slate-500">Siswa Pintar</p>
              <p className="text-lg font-black text-blue-600">Asisten AI</p>
            </div>
          </div>

          {/* MASCOT DISPLAY */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-white p-5 rounded-2xl border border-red-100 shadow-lg shadow-red-500/5 mt-6 transition hover:shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-600 to-amber-500"></div>
            <img 
              src="/src/assets/images/student_mascot_1780976726712.png" 
              alt="Siswa Pancasila Kelas X SMA" 
              className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-xl border border-red-200 shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wide">
                🇮🇩 Karakter Kelas X Tangguh
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-800 mt-1 leading-snug">
                Diplomat Muda Pelopor Pancasila
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                Platform pembelajaran interaktif berbasis gamifikasi dan AI. Melatih nalar kritis, semangat bela negara, jiwa patriot, dan persahabatan bangsa sejalan dengan Profil Pelajar Pancasila.
              </p>
            </div>
          </div>
        </div>

        {/* Right Hand: OPEN DIRECT ACCESS CARD (NO LOGIN) */}
        <div className="lg:col-span-5 w-full flex justify-center" id="hero-entry-card">
          <div className="w-full max-w-md bg-white border border-red-200/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-red-500/10 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-200 mb-3">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Akses Terbuka Siswa</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Mulai Belajar Sekarang
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Langsung masuk ke materi & simulasi tanpa perlu registrasi atau login.
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-4" id="form-student-entry">
              {/* NAMA LENGKAP INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-red-600" />
                  <span>Nama Siswa</span>
                </label>
                <input
                  id="student-name-input"
                  type="text"
                  required
                  placeholder="Contoh: Dimas Septian"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FCFCFC] border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 transition placeholder-slate-400 outline-none font-medium"
                />
              </div>

              {/* KELAS SELECTION */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <School className="h-3.5 w-3.5 text-red-600" />
                  <span>Kelas</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-[#FCFCFC] border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 transition outline-none font-semibold cursor-pointer"
                  >
                    {CLASS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'custom' ? '✏️ Ketik Kelas Lainnya...' : `🏫 ${opt}`}
                      </option>
                    ))}
                  </select>

                  {selectedClass === 'custom' && (
                    <input
                      type="text"
                      required
                      placeholder="Ketik nama kelas Anda (misal: X IPS 2)"
                      value={customClass}
                      onChange={(e) => setCustomClass(e.target.value)}
                      className="w-full bg-[#FCFCFC] border border-amber-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-800 outline-none font-medium"
                    />
                  )}
                </div>
              </div>

              {/* QUICK PRESET BUTTONS */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Pilihan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('Dimas Septian', 'Kelas X-1')}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition cursor-pointer"
                  >
                    ⚡ Dimas Septian (X-1)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('Ahmad Rafli', 'Kelas X-2')}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition cursor-pointer"
                  >
                    ⚡ Ahmad Rafli (X-2)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('Nadia Putri', 'Kelas X-3')}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition cursor-pointer"
                  >
                    ⚡ Nadia Putri (X-3)
                  </button>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-black text-sm py-3.5 rounded-xl transition shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buka Lab Belajar Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Akses instan tanpa password atau email.</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* DETAILED INFO SECTION */}
      <section className="bg-white border-t border-red-100 py-16 px-4" id="about">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h3 className="text-3xl font-black text-slate-900 leading-tight">Menyelami Konstitusi, Mengukir Perdamaian Dunia</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Sesuai dengan amanat Undang-Undang Dasar Negara Republik Indonesia Tahun 1945 alinea ke-4, diplomasi Indonesia menapaki jalan <strong>Bebas Aktif</strong>. DIPLOMINDO memformulasikan kurikulum materi Hubungan Internasional SMA Kelas X ke dalam tantangan seru yang melatih nalar, etika diplomasi, musyawarah mufakat, dan kesadaran bela nusa secara digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left" id="feature-grid">
            <div className="p-6 bg-[#FEFBFB] border border-red-100 rounded-2xl space-y-3 hover:border-red-300 transition-all hover:bg-[#FFF5F5]/30">
              <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Compass className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Peta Interaktif Internasional</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualisasikan lokasi perwakilan diplomatik RI, persebaran Kontingen Garuda di daerah sengketa, pangkalan kerja sama strategis ASEAN, serta pilar keamanan PBB langsung di atas satelit peta interaktif.
              </p>
            </div>

            <div className="p-6 bg-[#FBFBFF] border border-blue-100 rounded-2xl space-y-3 hover:border-blue-300 transition-all hover:bg-[#F5F8FF]/30">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Escape Room Diplomat</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tantangan "Escape Room Digital" 5 ruang penuh teka-teki logika organisasi, simulasi ratifikasi perjanjian hukum internasional, meluruskan miskonsepsi asas, dan kuis bermasa waktu.
              </p>
            </div>

            <div className="p-6 bg-[#FCFDF8] border border-amber-100 rounded-2xl space-y-3 hover:border-amber-300 transition-all hover:bg-[#FAFBF3]/30">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Simulasi Sidang Berbantu AI</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Masuki perdebatan PBB & ASEAN virtual. Tuliskan teks pidato naskah posisi/pernyataan Anda dalam perundingan batas wilayah, sengketa maritim, atau iklim, lalu biarkan asisten AI menilai kecocokannya dengan kedaulatan NKRI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-medium text-slate-400">© 2026 DIPLOMINDO • Platform EdTech Ketertiban Dunia SMA Kelas X. Terakreditasi Nilai Pancasila.</p>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors">Syarat & Ketentuan</span>
            <span>•</span>
            <span className="hover:text-white transition-colors">Kebijakan Privasi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
