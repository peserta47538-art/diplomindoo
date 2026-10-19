/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, Compass, ShieldAlert, Users, Info, Star } from 'lucide-react';
import { WORLD_MAP_DATA } from '../data';

export default function InteractiveMap() {
  const [activeRegion, setActiveRegion] = useState<'indonesia' | 'asean' | 'un' | null>('indonesia');
  const [zoomLevel, setZoomLevel] = useState(1);

  const data = activeRegion ? WORLD_MAP_DATA[activeRegion] : null;

  return (
    <div className="space-y-6" id="interactive-map-wrapper">
      <div className="text-white text-left space-y-2">
        <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" /> Peta Interaktif Hubungan Internasional
        </h3>
        <p className="text-xs text-slate-400">
          Gunakan satelit peta digital di bawah ini. Ketuk penanda berkedip di wilayah Dunia untuk melihat keanggotaan organisasi, peran penting Indonesia, serta kontribusi pertahanan Kontingen Garuda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Map Canvas Frame */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between overflow-hidden min-h-[350px] relative">
          
          {/* Zoom controls inside map */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold font-mono text-xs text-slate-300 hover:text-white"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold font-mono text-xs text-slate-300 hover:text-white"
            >
              -
            </button>
            <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 p-2 rounded-lg font-mono">
              Zoom: {zoomLevel * 100}%
            </span>
          </div>

          {/* Interactive World Grid map simulation */}
          <div className="flex-grow w-full relative flex items-center justify-center min-h-[250px] transition-transform duration-300" style={{ transform: `scale(${zoomLevel})` }}>
            {/* World Map Schematic Lines background */}
            <svg className="absolute inset-0 w-full h-full text-slate-800 stroke-1 opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Fake ocean waves and continent silhouettes */}
              <circle cx="20%" cy="30%" r="20" fill="currentColor" className="text-slate-900/5" />
              <circle cx="60%" cy="50%" r="40" fill="currentColor" className="text-slate-900/5" />
            </svg>

            {/* Simulated Continents / Regions */}
            <div className="w-[85%] h-[80%] rounded-xl border border-slate-900 bg-slate-900/10 pointer-events-none absolute"></div>

            {/* MARKER 1: INDONESIA */}
            <button
              type="button"
              onClick={() => setActiveRegion('indonesia')}
              className="absolute group z-10"
              style={{ left: `${WORLD_MAP_DATA.indonesia.coordinates.x}%`, top: `${WORLD_MAP_DATA.indonesia.coordinates.y}%` }}
              id="pin-indonesia"
            >
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-red-500/30 animate-ping -left-2 -top-2"></span>
              <div className={`relative h-4 w-4 rounded-full border-2 border-white transition flex items-center justify-center ${activeRegion === 'indonesia' ? 'bg-red-500 scale-125' : 'bg-red-600 hover:scale-110'}`}>
                <Star className="h-1.5 w-1.5 text-white" />
              </div>
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 font-bold border border-slate-800 px-1.5 py-0.5 rounded shadow whitespace-nowrap text-white">
                🇮🇩 Indonesia
              </span>
            </button>

            {/* MARKER 2: ASEAN */}
            <button
              type="button"
              onClick={() => setActiveRegion('asean')}
              className="absolute group z-10"
              style={{ left: `${WORLD_MAP_DATA.asean.coordinates.x}%`, top: `${WORLD_MAP_DATA.asean.coordinates.y}%` }}
              id="pin-asean"
            >
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-blue-500/30 animate-ping -left-2 -top-2"></span>
              <div className={`relative h-4 w-4 rounded-full border-2 border-white transition flex items-center justify-center ${activeRegion === 'asean' ? 'bg-blue-500 scale-125' : 'bg-blue-600 hover:scale-110'}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
              </div>
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 font-bold border border-slate-800 px-1.5 py-0.5 rounded shadow whitespace-nowrap text-white">
                🌏 ASEAN HQ
              </span>
            </button>

            {/* MARKER 3: UN / PEACE KEEPING OUTPOST */}
            <button
              type="button"
              onClick={() => setActiveRegion('un')}
              className="absolute group z-10"
              style={{ left: `${WORLD_MAP_DATA.un.coordinates.x}%`, top: `${WORLD_MAP_DATA.un.coordinates.y}%` }}
              id="pin-un"
            >
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-emerald-500/30 animate-ping -left-2 -top-2"></span>
              <div className={`relative h-4 w-4 rounded-full border-2 border-white transition flex items-center justify-center ${activeRegion === 'un' ? 'bg-emerald-500 scale-125' : 'bg-emerald-600 hover:scale-110'}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
              </div>
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 font-bold border border-slate-800 px-1.5 py-0.5 rounded shadow whitespace-nowrap text-white">
                🇺🇳 PBB / Konga Misi
              </span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 font-bold text-center mt-2">
            Klik region berdenyut merah/biru/hijau pada koordinat samudera di atas untuk merubah visual analisis data.
          </p>
        </div>

        {/* Detailed Data Hub panel card */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between text-left relative overflow-hidden">
          {data ? (
            <div className="space-y-6" id="map-detail-panel">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  Analisis Geostrategis
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">{data.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
                  {data.desc}
                </p>
              </div>

              {/* Dynamic displays based on region selections */}
              {activeRegion === 'indonesia' && data.joinedOrgs && (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Keanggotaan & Organisasi Diikuti
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {data.joinedOrgs.map((org, i) => (
                      <span key={i} className="text-xs font-semibold bg-slate-950 text-white border border-slate-800 px-3 py-1.5 rounded-xl">
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeRegion === 'asean' && data.roles && (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Peran Kunci & Kontribusi Regional
                  </h5>
                  <ul className="space-y-2.5 text-xs text-slate-350">
                    {data.roles.map((role, i) => (
                      <li key={i} className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex gap-3">
                        <span className="text-blue-400 text-sm font-bold mt-0.5">•</span>
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeRegion === 'un' && data.roles && (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Komitmen Kontingen Pasukan Garuda
                  </h5>
                  <ul className="space-y-2.5 text-xs text-slate-350">
                    {data.roles.map((role, i) => (
                      <li key={i} className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex gap-3">
                        <span className="text-emerald-400 text-sm font-bold mt-0.5">✓</span>
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full space-y-2 text-slate-500">
              <Info className="h-8 w-8 text-slate-700" />
              <p className="text-xs">Pilih pin koordinat di peta untuk memulai analisis.</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 mt-6 flex items-center gap-2">
            <div className="text-xs font-bold text-slate-300">Asas Diplomasi:</div>
            <div className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Bebas Aktif
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
