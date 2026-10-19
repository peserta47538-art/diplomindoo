/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import LandingPage from './components/LandingPage';
import { Material, Question, StudentProfile } from './types';
import { GraduationCap, Users, BookOpen, Globe } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'student' | 'teacher' | 'info'>('student');
  const [profile, setProfile] = useState<StudentProfile>({
    id: 'std_dimas',
    userId: 'usr_student',
    nis: 'NIS-14614',
    name: 'Dimas Septian',
    classId: 'cls_1',
    className: 'Kelas X-1',
    level: 1,
    xp: 0,
    coins: 0,
    badges: [],
    completedMaterials: [],
    completedGames: [],
    quizScores: {}
  });

  const [user, setUser] = useState<any>({
    id: 'usr_student',
    name: 'Dimas Septian',
    role: 'student'
  });

  const [materials, setMaterials] = useState<Material[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppData = async () => {
    try {
      // 1. Fetch materials
      const matRes = await fetch('/api/materials');
      if (matRes.ok) {
        const matData = await matRes.json();
        setMaterials(matData);
      }

      // 2. Fetch questions
      const qRes = await fetch('/api/questions');
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuestions(qData);
      }

      // 3. Fetch active student profile directly (No login required)
      const studentRes = await fetch('/api/student/current');
      if (studentRes.ok) {
        const studentData = await studentRes.json();
        setProfile(studentData);
        setUser({
          id: studentData.userId || studentData.id,
          name: studentData.name,
          role: 'student'
        });
      }
    } catch (err) {
      console.error('Error fetching initial app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  const handleUpdateStudentIdentity = async (newName: string, newClass: string) => {
    try {
      const res = await fetch('/api/student/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: profile.id,
          name: newName,
          className: newClass
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setUser((prev: any) => ({ ...prev, name: updated.name }));
      }
    } catch (err) {
      console.error('Error updating identity:', err);
    }
  };

  const handleRefreshData = () => {
    fetchAppData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="h-10 w-10 rounded-xl bg-red-600 border border-red-500 animate-spin flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-500/30">
          🌏
        </div>
        <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Membuka Lab Diplomindo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col">
      {/* GLOBAL TOP NAVIGATION BAR - Instant role/mode switching with ZERO login */}
      <nav className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-red-500/20">
            <span>🇮🇩</span>
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-white uppercase flex items-center gap-1.5">
              <span>DIPLOMINDO</span>
              <span className="text-[9px] bg-red-500/30 text-red-300 px-1.5 py-0.2 rounded font-mono font-bold">AKSES TERBUKA</span>
            </h1>
          </div>
        </div>

        {/* Navigation Mode Switcher - 1-Click Access */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentView('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              currentView === 'student'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Lab Siswa</span>
          </button>

          <button
            onClick={() => setCurrentView('teacher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              currentView === 'teacher'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Dashboard Guru</span>
          </button>

          <button
            onClick={() => setCurrentView('info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              currentView === 'info'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Info Kurikulum</span>
          </button>
        </div>

        {/* Current Active Student Pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Siswa:</span>
          <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
            {profile.name} ({profile.className || 'Kelas X-1'})
          </span>
        </div>
      </nav>

      {/* RENDER ACTIVE VIEW DIRECTLY WITHOUT ANY LOGIN */}
      {currentView === 'student' && (
        <StudentDashboard
          user={user}
          initialProfile={profile}
          materials={materials}
          questions={questions}
          onSwitchRole={(newRole) => setCurrentView(newRole as any)}
          onUpdateStudentIdentity={handleUpdateStudentIdentity}
        />
      )}

      {currentView === 'teacher' && (
        <TeacherDashboard
          user={{ name: 'Dra. Sri Hartati', role: 'teacher', email: 'guru@diplomindo.id' }}
          materials={materials}
          questions={questions}
          onSwitchRole={(newRole) => setCurrentView(newRole as any)}
          onRefreshData={handleRefreshData}
        />
      )}

      {currentView === 'info' && (
        <LandingPage
          currentStudentName={profile.name}
          currentStudentClass={profile.className || 'Kelas X-1'}
          onStartLearning={(name, cls) => {
            if (name && cls) {
              handleUpdateStudentIdentity(name, cls);
            }
            setCurrentView('student');
          }}
        />
      )}
    </div>
  );
}
