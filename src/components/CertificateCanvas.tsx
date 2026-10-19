/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, ShieldCheck, Download, Printer, CheckCircle, Globe } from 'lucide-react';
import { Certificate } from '../types';

interface CertificateProps {
  certificate: Certificate;
}

export default function CertificateCanvas({ certificate }: CertificateProps) {
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="certificate-canvas-container">
      {/* Action buttons */}
      <div className="flex justify-end gap-3" id="cert-controls">
        <button
          onClick={() => setShowVerificationModal(true)}
          className="text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl transition font-semibold flex items-center gap-2"
        >
          <ShieldCheck className="h-4 w-4 text-blue-400" /> Verifikasi QR Code
        </button>
        <button
          onClick={handlePrint}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition font-bold shadow shadow-blue-500/10 flex items-center gap-2"
        >
          <Printer className="h-4 w-4" /> Cetak / Unduh PDF
        </button>
      </div>

      {/* Main visual frame of school certificate */}
      <div 
        className="w-full bg-stone-50 text-slate-900 rounded-3xl border-8 border-amber-600 p-8 md:p-12 shadow-2xl relative select-none overflow-hidden text-center m-1"
        id="diplomindo-physical-certificate"
        style={{ fontFamily: '"Georgia", serif' }}
      >
        {/* Subtle retro watermarked background */}
        <div className="absolute inset-0 bg-white/40 opacity-10 pointer-events-none border m-4 border-amber-600/20"></div>
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/5 rounded-full pointer-events-none"></div>

        {/* Outer border decoration */}
        <div className="border border-amber-600/30 p-2 md:p-4 rounded-xl">
          
          {/* Header of the Menlu / SMAN / Diplomindo agency */}
          <div className="space-y-2">
            <div className="flex justify-center mb-1">
              <div className="h-14 w-14 rounded-full bg-blue-900 border border-amber-600 flex items-center justify-center text-white shadow">
                <Globe className="h-8 w-8 text-amber-400 animate-spin-slow" />
              </div>
            </div>
            <h4 className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-slate-550 font-sans">
              REPUBLIK INDONESIA • DEWAN EVALUASI PENDIDIKAN DIPLOMASI
            </h4>
            <h3 className="text-xl md:text-2xl font-bold tracking-normal text-blue-950">
              SERTIFIKAT KELULUSAN AKADEMIK
            </h3>
            <p className="text-[9px] md:text-[11px] italic text-slate-500 font-sans">
              Nomor Registrasi Sertifikat: CERT-{certificate.id.toUpperCase()}
            </p>
          </div>

          {/* Certificate Body text */}
          <div className="my-8 md:my-12 space-y-6">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
              Dengan bangga menganugerahkan kelulusan diplomatik dan kehormatan gelar kepada:
            </p>

            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 border-b-2 border-amber-605 inline-block px-10 pb-1.5" style={{ fontFamily: '"Georgia", serif' }}>
                {certificate.studentName}
              </h2>
              <p className="text-[11px] font-bold text-slate-500 font-sans pt-1">
                NIS: {certificate.nis} • Kelas Evaluasi: {certificate.className}
              </p>
            </div>

            <p className="text-xs md:text-sm text-slate-600 font-sans leading-relaxed max-w-xl mx-auto">
              Yang bersangkutan dinyatakan lulus program evaluasi kurikulum **Hubungan Internasional Kelas X SMA** melalui aplikasi **DIPLOMINDO** dengan menuntaskan 8 Materi Interaktif, lulus 3 Game Misi Diplomasi, serta membuktikannya lewat perolehan Nilai Kelulusan Akhir:
            </p>

            {/* Score pill seal */}
            <div className="inline-block bg-blue-950 text-amber-400 border-2 border-amber-600 rounded-full px-8 py-2 font-sans font-black tracking-widest text-sm shadow shadow-blue-950/20">
              STIMULUS NILAI AKHIR: {certificate.finalScore} / 100
            </div>
          </div>

          {/* Signatures column and QR code verification stamp */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 mt-8 items-center" id="cert-signatures">
            
            {/* Left principal signature */}
            <div className="text-left font-sans text-[10px] md:text-xs space-y-1 text-slate-600">
              <p className="font-bold text-blue-900">Dra. Sri Hartati</p>
              <p className="font-medium text-slate-400">Guru PPKn Kelas X SMA</p>
              <p className="text-[9px] italic text-slate-400">Ttd. Elektronik</p>
            </div>

            {/* Central QR Code Seal verifying ID */}
            <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowVerificationModal(true)}>
              <div className="bg-white border-2 border-amber-600 p-2 rounded-xl shadow-inner inline-block">
                {/* Simulated high contrast QR placeholder */}
                <svg className="w-12 h-12 text-slate-900" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="20" height="20" fill="currentColor" />
                  <rect x="0" y="80" width="20" height="20" fill="currentColor" />
                  <rect x="80" y="0" width="20" height="20" fill="currentColor" />
                  <rect x="30" y="30" width="40" height="40" fill="currentColor" opacity="0.8" />
                  <rect x="10" y="40" width="10" height="20" fill="currentColor" />
                  <rect x="60" y="10" width="10" height="10" fill="currentColor" />
                </svg>
              </div>
              <p className="text-[8px] text-slate-400 uppercase font-sans font-bold tracking-wider mt-1.5 hover:underline">
                Klik Untuk Verifikasi
              </p>
            </div>

            {/* Right director signature */}
            <div className="text-right font-sans text-[10px] md:text-xs space-y-1 text-slate-600">
              <p className="font-bold text-blue-900">Diplomindo EdTech</p>
              <p className="font-medium text-slate-400">Kementerian Pendidikan</p>
              <p className="text-[9px] text-slate-400 font-mono">ID: {certificate.id.substring(5, 11).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* VERIFICATION MODAL ON QR CLICK */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="cert-verify-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4 text-left">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <CheckCircle className="h-6 w-6 text-emerald-400 animate-pulse" />
              <div>
                <h4 className="font-bold text-white tracking-tight">QR Code Valid & Terverifikasi</h4>
                <p className="text-[10px] text-slate-500 font-mono">Kunci Hash: SHA-256 Valid</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-850 font-sans" id="verify-details">
              <p>📍 **Nama Penerima:** {certificate.studentName}</p>
              <p>📍 **NIS:** {certificate.nis}</p>
              <p>📍 **Sekolah / Kelas:** {certificate.className}</p>
              <p>📍 **Nilai Kelulusan:** {certificate.finalScore} / 100</p>
              <p>📍 **Tanggal Penerbitan:** {certificate.date}</p>
              <p>📍 **Otoritas:** Kementerian Pendidikan RI Virtual & ASEAN Center</p>
            </div>

            <button
              onClick={() => setShowVerificationModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              Tutup Verifikasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
