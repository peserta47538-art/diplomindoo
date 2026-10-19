/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Users, BarChart3, Plus, Trash2, Edit, AlertCircle, RefreshCw, CheckCircle, Sparkles, LogOut } from 'lucide-react';
import { Material, Question, StudentProfile } from '../types';

interface TeacherProps {
  user: any;
  materials: Material[];
  questions: Question[];
  onLogout?: () => void;
  onSwitchRole?: (role: string) => void;
  onRefreshData: () => void;
}

export default function TeacherDashboard({ user, materials, questions, onLogout, onSwitchRole, onRefreshData }: TeacherProps) {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'material-manager' | 'quiz-manager'>('monitoring');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // New Material form states
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatCat, setNewMatCat] = useState('Hubungan Internasional');
  const [newMatDesc, setNewMatDesc] = useState('');
  const [newMatSummary, setNewMatSummary] = useState('');
  const [newMatVideo, setNewMatVideo] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');

  // Editing Material states
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editMatTitle, setEditMatTitle] = useState('');
  const [editMatCat, setEditMatCat] = useState('');
  const [editMatDesc, setEditMatDesc] = useState('');
  const [editMatSummary, setEditMatSummary] = useState('');
  const [editMatVideo, setEditMatVideo] = useState('');
  const [editMatInfographics, setEditMatInfographics] = useState<string[]>([]);
  const [editMatFunFacts, setEditMatFunFacts] = useState<string[]>([]);

  // New Question form states
  const [newQDifficulty, setNewQDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [newQText, setNewQText] = useState('');
  const [newQOpt1, setNewQOpt1] = useState('');
  const [newQOpt2, setNewQOpt2] = useState('');
  const [newQOpt3, setNewQOpt3] = useState('');
  const [newQOpt4, setNewQOpt4] = useState('');
  const [newQCorrect, setNewQCorrect] = useState('');

  const normalizeYoutubeUrl = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.includes('youtube.com/embed/')) return trimmed;
    const watchRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = trimmed.match(watchRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return trimmed;
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await fetch('/api/leaderboard'); // Leaderboard api returns students detailed profiles info sorted
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle || !newMatDesc) return;

    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newMatTitle,
          category: newMatCat,
          description: newMatDesc,
          summary: newMatSummary || newMatDesc,
          videoUrl: normalizeYoutubeUrl(newMatVideo) || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          infographics: [newMatDesc],
          funFacts: ['Fakta kustom ditambahkan oleh Guru.']
        })
      });
      if (res.ok) {
        alert('🏆 Sukses menambahkan materi baru!');
        setNewMatTitle('');
        setNewMatDesc('');
        setNewMatSummary('');
        setNewMatVideo('https://www.youtube.com/embed/dQw4w9WgXcQ');
        onRefreshData(); // refresh parent states
      }
    } catch (err) {
      console.error('Add material error:', err);
    }
  };

  const startEditMaterial = (m: Material) => {
    setEditingMaterial(m);
    setEditMatTitle(m.title);
    setEditMatCat(m.category);
    setEditMatDesc(m.description);
    setEditMatSummary(m.summary || m.description);
    setEditMatVideo(m.videoUrl || '');
    setEditMatInfographics(m.infographics || []);
    setEditMatFunFacts(m.funFacts || []);
  };

  const handleUpdateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    if (!editMatTitle || !editMatDesc) return;

    try {
      const res = await fetch(`/api/materials/${editingMaterial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editMatTitle,
          category: editMatCat,
          description: editMatDesc,
          summary: editMatSummary || editMatDesc,
          videoUrl: normalizeYoutubeUrl(editMatVideo),
          infographics: editMatInfographics.length > 0 ? editMatInfographics : [editMatDesc],
          funFacts: editMatFunFacts.length > 0 ? editMatFunFacts : ['Fakta dikustomisasi oleh Guru/Admin.']
        })
      });
      if (res.ok) {
        alert('🏆 Sukses memperbarui materi!');
        setEditingMaterial(null);
        onRefreshData();
      } else {
        const errData = await res.json();
        alert(`Gagal: ${errData.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error('Update material error:', err);
      alert('Gagal menghubungi server untuk memperbarui materi');
    }
  };

  const handleDeleteMaterial = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus materi "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/materials/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('🗑️ Sukses menghapus materi!');
        onRefreshData();
      } else {
        const errData = await res.json();
        alert(`Gagal: ${errData.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error('Delete material error:', err);
      alert('Gagal menghubungi server untuk menghapus materi');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText || !newQOpt1 || !newQCorrect) return;

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: newQDifficulty,
          text: newQText,
          options: [newQOpt1, newQOpt2, newQOpt3, newQOpt4].filter(Boolean),
          correctAnswer: newQCorrect
        })
      });
      if (res.ok) {
        alert('🏆 Sukses mendaftarkan soal baru dalam bank kuis!');
        setNewQText('');
        setNewQOpt1('');
        setNewQOpt2('');
        setNewQOpt3('');
        setNewQOpt4('');
        setNewQCorrect('');
        onRefreshData();
      }
    } catch (err) {
      console.error('Add question error:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Compute stats averages
  const classAvgScore = students.length > 0 
    ? Math.round(students.reduce((acc, curr) => acc + (curr.quizScores?.quiz_mixed_eval || 0), 0) / students.length)
    : 0;

  const totalCertifiedCount = students.filter(s => s.quizScores && s.quizScores.quiz_mixed_eval >= 75).length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col md:flex-row" id="teacher-dashboard-layout">
      
      {/* SIDEBAR PANEL */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-red-500/30">
            <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-500/30">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white uppercase">GURU HUB</h2>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">BELANUSA MODERATOR</p>
            </div>
          </div>

          {/* Teacher Profile widget */}
          <div className="bg-slate-950 p-4 rounded-xl border border-red-500/10 text-left space-y-1">
            <h4 className="text-xs font-bold text-white">Yth. Bapak/Ibu Guru</h4>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-black uppercase inline-block">
              NIP: 98765 • Pembina PPKn
            </span>
          </div>

          {/* Navigator Menu */}
          <nav className="space-y-1 text-left">
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'monitoring' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <BarChart3 className="h-4 w-4" /> Monitoring & Nilai Siswa
            </button>
            <button
              onClick={() => setActiveTab('material-manager')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'material-manager' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <BookOpen className="h-4 w-4" /> Manajemen Materi (8 Pokok)
            </button>
            <button
              onClick={() => setActiveTab('quiz-manager')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'quiz-manager' ? 'bg-red-600 text-white shadow shadow-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}
            >
              <HelpCircle className="h-4 w-4" /> Manajemen Soal Kuis
            </button>
          </nav>
        </div>

        {/* Switch back to Student View (No login required) */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => onSwitchRole?.('student')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer border border-slate-700"
          >
            <span>← Kembali ke Lab Siswa</span>
          </button>
        </div>
      </aside>

      {/* CENTRAL DISPLAY AREA */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto w-full max-w-5xl space-y-6 text-left" id="teacher-main-outlet">

        {/* tab monitoring */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6" id="monitoring-segment">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-850 tracking-tight">Monitoring & Hasil Evaluasi Belajar Kelas X</h3>
              <p className="text-xs text-slate-500 font-medium">Ikhtisar progres, level keaktifan, dan verifikasi sertifikat bimbingan kelulusan.</p>
            </div>

            {/* Class Stats widget row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white border border-red-100 rounded-2xl text-center shadow-sm">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Siswa Terdaftar</span>
                <p className="text-2xl font-black text-slate-800">{students.length} Siswa</p>
              </div>
              <div className="p-4 bg-white border border-red-100 rounded-2xl text-center shadow-sm">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Akurasi Rata-rata Kuis</span>
                <p className="text-2xl font-black text-red-600">{classAvgScore} / 100</p>
              </div>
              <div className="p-4 bg-white border border-red-100 rounded-2xl text-center shadow-sm">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Klaim Sertifikat Lengkap</span>
                <p className="text-2xl font-black text-emerald-600">{totalCertifiedCount} dari {students.length}</p>
              </div>
              <div className="p-4 bg-white border border-red-100 rounded-2xl text-center flex flex-col justify-center shadow-sm">
                <button
                  onClick={fetchStudents}
                  className="bg-red-50 hover:bg-red-100 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-650 font-bold mx-auto flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Segarkan Data
                </button>
              </div>
            </div>

            {/* Students table dashboard */}
            <div className="bg-white border border-red-100 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Tabel Progres Detail Siswa</h4>
                <div className="text-[10px] text-slate-400 font-bold font-mono">Dikelola otomatis oleh DIPLOMINDO LMS</div>
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-xl bg-slate-50">
                {loadingStudents ? (
                  <p className="text-xs text-slate-450 p-8 text-center animate-pulse font-bold">Menghubungkan ke basis data siswa...</p>
                ) : (
                  <table className="w-full text-xs text-left" id="table-students-monitoring">
                    <thead className="bg-slate-100 text-[10px] text-slate-600 uppercase tracking-widest font-extrabold">
                      <tr className="border-b border-slate-200">
                        <th className="p-3">Siswa</th>
                        <th className="p-3">Kelas</th>
                        <th className="p-3">NIS</th>
                        <th className="p-3">Level/XP</th>
                        <th className="p-3">Materi Selesai</th>
                        <th className="p-3 font-semibold">Tugas Kuis</th>
                        <th className="p-3">Sertifikat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {students.map(std => {
                        const hasPassed = std.quizScores?.quiz_mixed_eval >= 75;
                        return (
                          <tr key={std.nis} className="hover:bg-slate-100/60 transition">
                            <td className="p-3 font-bold text-slate-800">{std.name}</td>
                            <td className="p-3 font-semibold">
                              <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                {std.className || std.classId || 'Kelas X-1'}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-slate-400 font-bold">{std.nis}</td>
                            <td className="p-3 font-medium">Lvl {std.level} ({std.xp} XP)</td>
                            <td className="p-3">
                              <span className="font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                {std.completedMaterials?.length || 0} / 8
                              </span>
                            </td>
                            <td className={`p-3 font-bold font-mono ${hasPassed ? 'text-emerald-600' : 'text-red-650'}`}>
                              {std.quizScores?.quiz_mixed_eval !== undefined ? `${std.quizScores.quiz_mixed_eval}/100` : 'Belum Kuis'}
                            </td>
                            <td className="p-3">
                              {hasPassed ? (
                                <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-250 text-emerald-600 px-2 py-0.5 rounded">
                                  Terkirim ✓
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded">
                                  Langkah Kurang
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* tab material-manager */}
        {activeTab === 'material-manager' && (
          <div className="space-y-6" id="materials-manager-segment">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-850 tracking-tight">Manajemen Katalog Materi Hubungan Internasional</h3>
              <p className="text-xs text-slate-500 font-medium">Kelola kurikulum 8 pokok bahasan, perbaharui summary deskripsi, atau daftarkan materi pelengkap baru.</p>
            </div>

            {/* Create material form */}
            <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-red-600" /> Tambah Sub-Pokok Kurikulum Baru
              </h4>

              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Judul Pokok Pembelajaran:</label>
                    <input
                      required
                      type="text"
                      placeholder="Contoh: Peran Indonesia dalam Global Climate Change PBB"
                      value={newMatTitle}
                      onChange={(e) => setNewMatTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Kategori Pokok:</label>
                    <select
                      value={newMatCat}
                      onChange={(e) => setNewMatCat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white font-bold transition-colors"
                    >
                      <option>Hubungan Internasional</option>
                      <option>Organisasi Internasional</option>
                      <option>Misi Perdamaian Garuda</option>
                      <option>Asas Politik Bebas Aktif</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Deskripsi Pendahuluan:</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Tuliskan keterangan singkat ringkasan sub materi..."
                    value={newMatDesc}
                    onChange={(e) => setNewMatDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Full Summary Teori (Rangkuman Detail):</label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan kompilasi pembahasan materi yang dapat dilahap siswa dalam detail card..."
                    value={newMatSummary}
                    onChange={(e) => setNewMatSummary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Embed Video URL Pembelajaran (Optional):</label>
                  <input
                    type="text"
                    value={newMatVideo}
                    onChange={(e) => setNewMatVideo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-blue-600 outline-none focus:border-red-500 focus:bg-white font-mono transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow shadow-red-500/20 flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Simpan Materi Baru
                </button>
              </form>
            </div>

            {/* Existing materials list catalog card monitoring with editing tools */}
            <div className="bg-white border border-red-100 rounded-2xl p-5 space-y-4 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Kurikulum Berjalan Sekarang ({materials.length} Pokok)</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {materials.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded font-mono text-slate-600 uppercase font-extrabold">MATERI {m.order}</span>
                        <span className="text-xs font-bold text-slate-850">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                        <span className="bg-slate-100 text-slate-500 font-mono px-1.5 rounded uppercase border border-slate-200">{m.category}</span>
                        {m.videoUrl ? (
                          <span className="text-blue-600 bg-blue-50 px-1.5 rounded border border-blue-200 truncate max-w-xs md:max-w-md">📹 YT Embed Check: {m.videoUrl}</span>
                        ) : (
                          <span className="text-amber-600 bg-amber-50 px-1.5 rounded border border-amber-200">⚠️ Video Kosong</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditMaterial(m)}
                        className="p-2 text-slate-600 hover:text-red-650 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-1.5 text-[11px] font-bold transition-all shadow-sm active:scale-95"
                        title="Edit Materi & Tautan Video"
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(m.id, m.title)}
                        className="p-2 text-slate-400 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all shadow-sm active:scale-95"
                        title="Hapus Materi"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* tab quiz-manager */}
        {activeTab === 'quiz-manager' && (
          <div className="space-y-6" id="questions-manager-segment">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-850 tracking-tight">Manajemen Soal & Kunci Jawaban</h3>
              <p className="text-xs text-slate-500 font-medium">Lihat sebaran bank soal kuis kustom atau tambahkan soal pilihan ganda adaptif baru.</p>
            </div>

            {/* Create Question form card */}
            <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-red-600" /> Garap Butir Soal Baru
              </h4>

              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Tingkat Kesulitan Kognitif:</label>
                    <select
                      value={newQDifficulty}
                      onChange={(e: any) => setNewQDifficulty(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white font-bold transition-colors"
                    >
                      <option value="easy">Mudah (C1 - C2 Memahami Dasar)</option>
                      <option value="medium">Sedang (C3 - C4 Analisis Studi Asas)</option>
                      <option value="hard">Sangat Sulit (C5 - C6 Evaluasi Komparatif)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Kunci Jawaban yang Sah (Tulis Sama Persis dengan Pilihan):</label>
                    <input
                      required
                      type="text"
                      placeholder="Tuliskan nilai kunci jawaban sama persis dengan salah satu opsi..."
                      value={newQCorrect}
                      onChange={(e) => setNewQCorrect(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Pertanyaan Masalah:</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Draf pertanyaan..."
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 font-sans">
                    <label className="block text-[10px] text-slate-500 font-bold font-sans">Pilihan A:</label>
                    <input
                      required
                      type="text"
                      placeholder="Opsi A..."
                      value={newQOpt1}
                      onChange={(e) => setNewQOpt1(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1 font-sans">
                    <label className="block text-[10px] text-slate-500 font-bold font-sans">Pilihan B:</label>
                    <input
                      required
                      type="text"
                      placeholder="Opsi B..."
                      value={newQOpt2}
                      onChange={(e) => setNewQOpt2(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1 font-sans">
                    <label className="block text-[10px] text-slate-500 font-bold font-sans">Pilihan C:</label>
                    <input
                      type="text"
                      placeholder="Opsi C..."
                      value={newQOpt3}
                      onChange={(e) => setNewQOpt3(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1 font-sans">
                    <label className="block text-[10px] text-slate-500 font-bold font-sans">Pilihan D:</label>
                    <input
                      type="text"
                      placeholder="Opsi D..."
                      value={newQOpt4}
                      onChange={(e) => setNewQOpt4(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow shadow-red-500/20 flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Daftarkan Soal Baru
                </button>
              </form>
            </div>

            {/* List questions current */}
            <div className="bg-white border border-red-100 rounded-2xl p-5 space-y-4 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Sebaran Bank Soal Saat Ini ({questions.length} Soal Berjalan)</h4>
              <div className="space-y-2.5">
                {questions.slice(0, 15).map((q) => (
                  <div key={q.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase"> DIFFICULTY: {q.difficulty}</span>
                      <span className="text-emerald-600">Kunci: {q.correctAnswer}</span>
                    </div>
                    <p className="text-slate-800 font-bold">{q.text}</p>
                  </div>
                ))}
                {questions.length > 15 && (
                  <p className="text-[10px] text-slate-400 font-extrabold text-center">...dan {questions.length - 15} butir soal lainnya aman bersiap dalam bank kuis.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {editingMaterial && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="edit-material-modal">
          <div className="bg-white border border-red-100 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-red-650 animate-pulse" />
                <div>
                  <h3 className="text-base font-black text-slate-800">Edit Pokok Bahasan Teori</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Perbaharui materi pembelajaran, video, dan ringkasan kurikulum</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMaterial(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all font-bold text-xs"
              >
                Batal ✕
              </button>
            </div>

            <form onSubmit={handleUpdateMaterial} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Judul Pokok Pembelajaran:</label>
                  <input
                    required
                    type="text"
                    value={editMatTitle}
                    onChange={(e) => setEditMatTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Kategori Pokok:</label>
                  <select
                    value={editMatCat}
                    onChange={(e) => setEditMatCat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white font-bold transition-colors"
                  >
                    <option>Hubungan Internasional</option>
                    <option>Organisasi Internasional</option>
                    <option>Misi Perdamaian Garuda</option>
                    <option>Asas Politik Bebas Aktif</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Deskripsi Pendahuluan:</label>
                <textarea
                  required
                  rows={2}
                  value={editMatDesc}
                  onChange={(e) => setEditMatDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Full Summary Teori (Rangkuman Detail):</label>
                <textarea
                  rows={4}
                  value={editMatSummary}
                  onChange={(e) => setEditMatSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-colors"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Embed Video URL Pembelajaran:</label>
                <input
                  type="text"
                  placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  value={editMatVideo}
                  onChange={(e) => setEditMatVideo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-blue-600 outline-none focus:border-red-500 focus:bg-white font-mono transition-colors font-semibold"
                />
                <p className="text-[10px] text-slate-400 font-medium">✨ Anda bisa memasukkan tautan YouTube biasa, sistem akan otomatis mengubahnya menjadi format embed yang aman.</p>
              </div>

              {/* Infographics & Fun facts edits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase text-slate-650">Infografis Ringkas (Satu per Baris):</h4>
                  <textarea
                    rows={4}
                    value={editMatInfographics.join('\n')}
                    placeholder="Satu rincian infografis per baris..."
                    onChange={(e) => setEditMatInfographics(e.target.value.split('\n').filter(Boolean))}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 transition-colors"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase text-slate-650">Fakta Unik (Satu per Baris):</h4>
                  <textarea
                    rows={4}
                    value={editMatFunFacts.join('\n')}
                    placeholder="Satu fakta menarik per baris..."
                    onChange={(e) => setEditMatFunFacts(e.target.value.split('\n').filter(Boolean))}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-red-500 transition-colors"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-grow bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow shadow-red-500/20"
                >
                  Simpan Pembaruan Materi ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
