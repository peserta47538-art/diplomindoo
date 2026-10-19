/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Play, CheckCircle, Award, Compass, HelpCircle, ArrowLeft } from 'lucide-react';
import { Material, StudentProfile } from '../types';

interface MaterialViewProps {
  materials: Material[];
  profile: StudentProfile;
  onCompleteMaterial: (materialId: string, xp: number, coins: number) => void;
}

export default function MaterialView({ materials, profile, onCompleteMaterial }: MaterialViewProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [videoPlay, setVideoPlay] = useState(false);

  const handleMarkComplete = (matId: string) => {
    if (profile.completedMaterials.includes(matId)) return;
    // Award 50 XP and 20 Coins on completing a material
    onCompleteMaterial(matId, 50, 20);
  };

  if (selectedMaterial) {
    const isCompleted = profile.completedMaterials.includes(selectedMaterial.id);
    return (
      <div className="space-y-6 text-left" id="material-detail-container">
        {/* Breadcrumb / Back button */}
        <button
          onClick={() => { setSelectedMaterial(null); setVideoPlay(false); }}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          id="btn-back-to-materials"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Materi
        </button>

        {/* Hero Card style info */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/25">
                Materi {selectedMaterial.order} • {selectedMaterial.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white">{selectedMaterial.title}</h3>
            </div>
            
            <button
              onClick={() => handleMarkComplete(selectedMaterial.id)}
              disabled={isCompleted}
              className={`font-bold text-xs py-2.5 px-4 rounded-xl shadow transition flex items-center gap-2 ${
                isCompleted 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {isCompleted ? 'Selesai Dibaca ✓' : 'Selesai Membaca (+50 XP)'}
            </button>
          </div>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            {selectedMaterial.summary}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
            {/* Embedded Video Player */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Play className="h-4 w-4 text-blue-400" /> Video Pembelajaran Interaktif
              </h4>
              <div className="w-full aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative group">
                {videoPlay ? (
                  <iframe
                    src={`${selectedMaterial.videoUrl}?autoplay=1`}
                    title="Video Pembelajaran"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 p-6 text-center cursor-pointer" onClick={() => setVideoPlay(true)}>
                    <div className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-110">
                      <Play className="h-8 w-8 ml-1" />
                    </div>
                    <p className="text-xs text-slate-300 font-bold mt-4">Ketuk untuk Putar Video Pembelajaran</p>
                    <p className="text-[10px] text-slate-500 mt-1">Kelas X SMA PPKn/IPS • Diplomindo Media</p>
                  </div>
                )}
              </div>
            </div>

            {/* Infographics Points */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-400" /> Ringkasan Infografis
              </h4>
              <ul className="space-y-3">
                {selectedMaterial.infographics.map((info, idx) => (
                  <li key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                    <span className="h-5 w-5 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Apakah Kamu Tahu Fun Fact section */}
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-5 rounded-2xl space-y-2 mt-4" id="fact-card">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 animate-bounce" /> Apakah Kamu Tahu? (Fakta Unik Indonesia!)
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed md:pl-6 list-disc">
              {selectedMaterial.funFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Material List cards grid
  return (
    <div className="space-y-6" id="materials-grid-container">
      <div className="text-white text-left space-y-2">
        <h3 className="text-xl font-bold tracking-tight">Katalog Materi Pembelajaran</h3>
        <p className="text-xs text-slate-400">Bacalah dan cermati seluruh sub-materi hubungan internasional di bawah untuk mengumpulkan XP, bersiap memainkan Game Hubungan Internasional, serta mengklaim sertifikat kelulusan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="materials-grid">
        {materials.map((m) => {
          const isCompleted = profile.completedMaterials.includes(m.id);
          return (
            <div
              key={m.id}
              onClick={() => setSelectedMaterial(m)}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 cursor-pointer transition flex flex-col justify-between text-left relative group overflow-hidden"
            >
              {isCompleted && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  SELESAI ✓
                </div>
              )}
              
              <div className="space-y-3">
                <span className="text-[9px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-bold">
                  MATERI {m.order}
                </span>
                <h4 className="text-sm font-extrabold text-white group-hover:text-blue-400 transition leading-snug">
                  {m.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {m.description.substring(0, 95)}...
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800/80 mt-4 text-[10px] text-slate-500 font-bold">
                <span>Category: {m.category}</span>
                <span className="text-blue-400 group-hover:underline flex items-center gap-1">
                  Mulai Belajar ➜
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
