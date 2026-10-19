/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, Award, Play, AlertCircle, Sparkles, Send, Coins } from 'lucide-react';
import { INTERNASIONAL_SCENARIOS } from '../data';

interface SidangProps {
  onAwardProgress: (xp: number, coins: number, gameId: string) => void;
}

export default function SidangSimulasi({ onAwardProgress }: SidangProps) {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number | null>(null);
  const [decisionText, setDecisionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    diplomacy: number;
    negotiation: number;
    argumentation: number;
    feedbackHtml: string;
  } | null>(null);

  const scenario = selectedScenarioIdx !== null ? INTERNASIONAL_SCENARIOS[selectedScenarioIdx] : null;

  const handleSubmitSpeech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionText || selectedScenarioIdx === null) return;

    setLoading(true);
    setEvaluation(null);

    try {
      const res = await fetch('/api/ai/sidang-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: scenario?.title,
          situation: scenario?.situation,
          decisionText
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengevaluasi keputusan');
      }

      setEvaluation(data);
      
      // Calculate overall performance average of scores to decide XP/Coin payout
      const average = Math.round((data.diplomacy + data.negotiation + data.argumentation) / 3);
      if (average >= 75) {
        // Award substantial points
        onAwardProgress(100, 40, 'sidang');
      } else {
        // Award partial
        onAwardProgress(50, 15, 'sidang');
      }
    } catch (err: any) {
      alert(`⚠️ Ada gangguan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedScenarioIdx(null);
    setDecisionText('');
    setEvaluation(null);
  };

  if (selectedScenarioIdx === null) {
    return (
      <div className="space-y-6 text-left" id="sidang-index-container">
        <div className="text-white space-y-2">
          <h3 className="text-xl font-bold tracking-tight">Game 3: Simulasi Sidang Internasional (Forum AI)</h3>
          <p className="text-xs text-slate-400">
            Masuki arena perundingan tingkat tinggi ASEAN dan Dewan Keamanan PBB selaku Delegasi Indonesia. Pilih sengketa internasional kontemporer di bawah, lalu tuangkan resolusi keputusan terbaik Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {INTERNASIONAL_SCENARIOS.map((sc, idx) => (
            <div
              key={sc.id}
              onClick={() => setSelectedScenarioIdx(idx)}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 cursor-pointer transition flex flex-col justify-between space-y-4 text-left group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <div className="space-y-2">
                <span className="text-[10px] bg-slate-950 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded font-extrabold uppercase">
                  Skenario Hubungan Internasional
                </span>
                <h4 className="text-md font-bold text-white group-hover:text-blue-400 transition tracking-tight leading-snug">
                  {sc.title}
                </h4>
                <p className="text-xs text-slate-450 leading-relaxed line-clamp-3">
                  {sc.situation}
                </p>
              </div>

              <span className="text-[11px] text-blue-400 group-hover:underline font-bold pt-2 border-t border-slate-850">
                Masuki Sidang Dewan ➜
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-left relative overflow-hidden" id="active-sidang-wrapper">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl"></div>

      {/* breadcrumb */}
      <button
        onClick={handleReset}
        className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg font-bold"
      >
        ← Kembali Pilih Sengketa
      </button>

      {/* Skenario Header */}
      <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-850">
        <span className="text-[10px] bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-extrabold uppercase">
          PERUNDINGAN DEWAN KEAMANAN MULTILATERAL
        </span>
        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">{scenario?.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed font-semibold bg-slate-950/50 p-3 rounded-xl border border-slate-900">
          🚨 [SITUASI KRITIS]: {scenario?.situation}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Text Speech Form for students */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmitSpeech} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                Konsep Pidato / Resolusi Diplomatik Anda:
              </label>
              <textarea
                required
                rows={7}
                placeholder="Tuliskan argumen hukum, asas 'Bebas Aktif' yang Anda pegang, atau langkah taktis kompromi yang Anda miliki demi mewujudkan perdamaian..."
                value={decisionText}
                onChange={(e) => setDecisionText(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-850 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl p-4 text-xs md:text-sm text-white leading-relaxed placeholder-slate-600 outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading || !decisionText}
              className={`w-full font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow ${
                loading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/15'
              }`}
            >
              <Send className="h-4 w-4" />
              {loading ? 'Mengirim Pidato ke PBB...' : 'Serahkan Resolusi ke Mahkamah Sidang'}
            </button>
          </form>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 text-[10px] text-slate-400 space-y-1">
            <div className="font-bold flex items-center gap-1 text-slate-300">
              <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" /> Petunjuk Skor Tinggi:
            </div>
            <p>1. Hubungkan resolusi Anda dengan instrumen hukum konvensi (seperti UNCLOS 1982, Piagam PBB, Dasasila Bandung).</p>
            <p>2. Dahulukan penyelesaian sengketa melalui jalur musyawarah multilateral (Dewan Keamanan, Mahkamah Internasional) dibanding pengerahan senjata ofensif.</p>
          </div>
        </div>

        {/* Results / Feedback Panel from Gemini AI */}
        <div className="lg:col-span-6">
          {evaluation ? (
            <div className="space-y-6 p-5 bg-slate-950 border border-slate-850 rounded-2xl text-left" id="sidang-evaluation-result">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Hasil Evaluasi Panelis
              </h4>

              {/* Three indicators for grades */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">DIPLOMASI</span>
                  <p className="text-xl font-bold text-blue-400">{evaluation.diplomacy}</p>
                  <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">NEGOSIASI</span>
                  <p className="text-xl font-bold text-emerald-400">{evaluation.negotiation}</p>
                  <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">ARGUMENTASI</span>
                  <p className="text-xl font-bold text-amber-400">{evaluation.argumentation}</p>
                  <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                </div>
              </div>

              {/* Text review */}
              <div className="space-y-2 text-xs md:text-sm text-slate-350 leading-relaxed border-t border-slate-900 pt-4" id="ai-sidang-html-feedback">
                <p className="whitespace-pre-line bg-slate-900 p-4 rounded-xl border border-slate-900 text-slate-300">
                  {evaluation.feedbackHtml}
                </p>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-[11px] text-emerald-400 font-bold">
                  Skor evaluasi berhasil disimpan ke buku nilai Anda!
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-3xl min-h-[250px] space-y-2 text-slate-500">
              <AlertCircle className="h-8 w-8 text-slate-700 animate-pulse" />
              <p className="text-xs font-medium">Sidang PBB menanti draf resolusi diplomatik Anda.</p>
              <p className="text-[10px] text-slate-600 max-w-xs">{loading ? 'Tunggu beberapa detik, Gemini AI sedang menganalisa data argumentasi...' : 'Lengkapi kotak draf pidato di sebelah kiri untuk dikonsiliasikan.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
