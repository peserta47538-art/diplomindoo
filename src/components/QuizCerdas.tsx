/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle, AlertTriangle, Play, HelpCircle, ArrowRight } from 'lucide-react';
import { Question, StudentProfile } from '../types';

interface QuizProps {
  questions: Question[];
  profile: StudentProfile;
  onSubmitQuizScore: (quizId: string, score: number, xpEarned: number, coinsEarned: number) => void;
}

export default function QuizCerdas({ questions, profile, onSubmitQuizScore }: QuizProps) {
  const [activeSegment, setActiveSegment] = useState<'selection' | 'playing' | 'completed'>('selection');
  const [activeDifficulty, setActiveDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [selectedQuizTitle, setSelectedQuizTitle] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarnedTotal, setXpEarnedTotal] = useState(0);
  const [coinsEarnedTotal, setCoinsEarnedTotal] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]); // track if each question was correct

  // Initialize a random quiz of 5 questions based on difficulty filters
  const handleStartQuiz = (difficulty: 'all' | 'easy' | 'medium' | 'hard', title: string) => {
    let filtered = questions;
    if (difficulty !== 'all') {
      filtered = questions.filter(q => q.difficulty === difficulty);
    }

    // Shuffle questions and select up to 5
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    if (selected.length === 0) {
      alert('⚠️ Belum ada bank soal dalam kesulitan ini. Cobalah pilih "Semua Tingkat"!');
      return;
    }

    setSelectedQuizTitle(title);
    setCurrentQuestions(selected);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setUserAnswers([]);
    setActiveSegment('playing');
  };

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null) return;

    const currentQ = currentQuestions[currentQuestionIdx];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    // Record answer
    setUserAnswers(prev => [...prev, isCorrect]);
    if (isCorrect) setScore(prev => prev + 20); // 20 pts per correct answers (Total 100 max)

    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);

    if (currentQuestionIdx < currentQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Evaluate total results and save profile stats
      const finalScore = score;
      const finalXp = finalScore; // 1 XP per score point
      const finalCoins = Math.round(finalScore / 2); // 1 coin per 2 score points

      setXpEarnedTotal(finalXp);
      setCoinsEarnedTotal(finalCoins);

      onSubmitQuizScore('quiz_mixed_eval', finalScore, finalXp, finalCoins);
      setActiveSegment('completed');
    }
  };

  if (activeSegment === 'completed') {
    return (
      <div className="p-8 bg-white border border-red-100 rounded-3xl text-center space-y-6 max-w-lg mx-auto shadow-md shadow-red-500/5" id="quiz-done-container">
        <div className="h-20 w-20 bg-red-50 text-red-650 flex items-center justify-center mx-auto border border-red-200 rounded-full shadow-md shadow-red-500/10">
          <Award className="h-10 w-10 animate-pulse text-red-600" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-850">Evaluasi Selesai!</h3>
          <p className="text-xs text-slate-500 font-medium">Evaluasi pemahaman materi Hubungan Internasional telah tersimpan di buku kelas.</p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Skor Evaluasi</span>
            <p className="text-4xl font-extrabold text-red-600">{score} / 100</p>
          </div>
          <div className="flex justify-around border-t border-slate-200 pt-4">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">XP Baru</span>
              <p className="text-base font-extrabold text-red-600">+{xpEarnedTotal} XP</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Coins</span>
              <p className="text-base font-extrabold text-amber-600">+{coinsEarnedTotal}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setActiveSegment('selection')}
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-200 transition-colors"
          >
            Pilih Kuis Lain
          </button>
          <button
            onClick={() => handleStartQuiz('all', 'Evaluasi Campur Kilat')}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-red-500/20 transition-colors"
          >
            Ulangi Kuis
          </button>
        </div>
      </div>
    );
  }

  if (activeSegment === 'playing') {
    const currentQ = currentQuestions[currentQuestionIdx];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    return (
      <div className="bg-white border border-red-100 rounded-3xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto text-left relative overflow-hidden shadow-md shadow-red-500/5" id="quiz-playing-frame">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>

        {/* Header stats */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <span className="text-[9px] bg-red-100 text-red-650 border border-red-200 px-2 py-0.5 rounded font-black uppercase">
              {selectedQuizTitle}
            </span>
            <h3 className="text-base font-black text-slate-800">Soal {currentQuestionIdx + 1} dari 5</h3>
          </div>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
            Kesulitan: {currentQ.difficulty.toUpperCase()}
          </span>
        </div>

        {/* Question Text displayed on elegant card */}
        <div className="p-5 md:p-6 bg-red-50/50 rounded-2xl border border-red-100 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold">
            <HelpCircle className="h-4 w-4" /> Masalah {currentQuestionIdx + 1}:
          </div>
          <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-bold">
            {currentQ.text}
          </p>
        </div>

        {/* Options list selection */}
        <div className="grid grid-cols-1 gap-2.5" id="quiz-options-wrapper">
          {currentQ.options?.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionClick(opt)}
                disabled={isSubmitted}
                className={`p-3.5 rounded-xl border text-xs text-left leading-relaxed transition flex gap-3 items-center ${
                  isSubmitted
                    ? opt === currentQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                      : isSelected
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    : isSelected
                      ? 'bg-red-500/10 border-red-400 text-red-700 font-extrabold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-350'
                }`}
              >
                <span className={`h-5 w-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-red-600 text-white border-red-500' : 'border-slate-200 text-slate-500 bg-white'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback area */}
        {isSubmitted && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
            isCorrect 
              ? 'bg-emerald-50 border-emerald-250 text-emerald-800 font-medium' 
              : 'bg-red-50 border-red-200 text-red-700 font-medium'
          }`} id="quiz-feedback-box">
            <div className="flex items-center gap-1.5 font-bold">
              {isCorrect ? (
                <><CheckCircle className="h-4 w-4 text-emerald-600" /> Kunci Jawaban BENAR!</>
              ) : (
                <><AlertTriangle className="h-4 w-4 text-red-600" /> Jawaban KURANG TEPAT</>
              )}
            </div>
            {!isCorrect && (
              <p>Kunci Jawaban yang Sah: <strong>{currentQ.correctAnswer}</strong></p>
            )}
          </div>
        )}

        {/* Navigation triggers */}
        <div className="flex justify-end pt-2">
          {!isSubmitted ? (
            <button
              onClick={handleAnswerSubmit}
              disabled={selectedOption === null}
              className={`font-bold text-xs px-5 py-2.5 rounded-xl shadow transition ${
                selectedOption === null
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-red-650 hover:bg-red-700 text-white shadow-md shadow-red-500/20'
              }`}
            >
              Kirim Jawaban
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow shadow-emerald-500/20 flex items-center gap-1.5 transition-colors"
            >
              {currentQuestionIdx < 4 ? 'Soal Berikutnya' : 'Klaim Hasil Kuis 🏆'} <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Segment Selection layout index
  return (
    <div className="space-y-6 text-left" id="quiz-selection-wrapper">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-slate-850 tracking-tight">Kuis Cerdas Pelatihan</h3>
        <p className="text-xs text-slate-500 font-medium">
          Uji penalaran Anda mengenai peran kedaulatan Indonesia di ASEAN/PBB dengan memilih tingkatan kesulitan adaptif kuis di bawah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-6 bg-white border border-red-100 hover:border-red-500/40 cursor-pointer rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow transition duration-300" onClick={() => handleStartQuiz('easy', 'Evaluasi Tingkat Mudah')}>
          <div className="space-y-1">
            <span className="text-[10px] bg-red-50 border border-red-150 text-red-600 p-1.5 rounded font-black uppercase">TINGKAT 1</span>
            <h4 className="text-md font-bold text-slate-800 pt-2">Sandi Dasar (Mudah)</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Dirancang untuk menguji ingatan terminologi instansi, tanggal deklarasi, pendiri, dan semboyan ASEAN.</p>
          </div>
          <button className="text-xs text-red-650 hover:underline font-extrabold text-left pt-2 border-t border-slate-100">
            Mulai Kuis (+50 XP) ➜
          </button>
        </div>

        <div className="p-6 bg-white border border-red-100 hover:border-red-500/40 cursor-pointer rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow transition duration-300" onClick={() => handleStartQuiz('medium', 'Evaluasi Tingkat Sedang')}>
          <div className="space-y-1">
            <span className="text-[10px] bg-red-50 border border-red-150 text-red-600 p-1.5 rounded font-black uppercase">TINGKAT 2</span>
            <h4 className="text-md font-bold text-slate-800 pt-2">Studi & Asas (Sedang)</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Menguji ketaatan asas, asimilasi taktik mediator sengketa regional, serta misi perdamaian Garuda di Timur Tengah.</p>
          </div>
          <button className="text-xs text-red-650 hover:underline font-extrabold text-left pt-2 border-t border-slate-100">
            Mulai Kuis (+100 XP) ➜
          </button>
        </div>

        <div className="p-6 bg-white border border-red-100 hover:border-red-500/40 cursor-pointer rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow transition duration-300" onClick={() => handleStartQuiz('hard', 'Evaluasi Tingkat Sulit')}>
          <div className="space-y-1">
            <span className="text-[10px] bg-red-50 border border-red-150 text-red-600 p-1.5 rounded font-black uppercase">TINGKAT 3</span>
            <h4 className="text-md font-bold text-slate-800 pt-2">Analisis Geopolitik (Sulit)</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Tantangan krisis karbon sawit, bela tumpah darah Laut Natuna Utara, dan penyelarasan piagam PBB.</p>
          </div>
          <button className="text-xs text-red-650 hover:underline font-extrabold text-left pt-2 border-t border-slate-100">
            Mulai Kuis (+150 XP) ➜
          </button>
        </div>
      </div>
    </div>
  );
}
