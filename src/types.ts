/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  name: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  nis: string;
  name: string;
  classId: string;
  className?: string;
  level: number;
  xp: number;
  coins: number;
  badges: string[]; // references of badge ids
  completedMaterials: string[]; // references of material ids
  completedGames: string[]; // 'misi' | 'escape' | 'sidang'
  quizScores: { [quizId: string]: number };
}

export interface TeacherProfile {
  id: string;
  userId: string;
  nip: string;
  name: string;
  schoolName: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  teacherId: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  category: 'HI' | 'ASEAN' | 'PBB' | 'DIPLOMASI' | 'GLOBALISASI';
  order: number;
  videoUrl?: string;
  summary: string;
  infographics: string[]; // list of quick pointers or items
  funFacts: string[]; // "Apakah Kamu Tahu?" list
}

export interface Quiz {
  id: string;
  title: string;
  materialId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'matching' | 'drag_drop' | 'case_study';

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  text: string;
  options?: string[]; // for multiple choice
  correctAnswer: string; // for MC, true/false, drag-drop
  pairingLeft?: string[]; // for matching (matching items)
  pairingRight?: string[]; // for matching (matched destinations, index-matched to correctAnswer JSON)
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  nis: string;
  level: number;
  xp: number;
  badgesCount: number;
}

export interface GameProgress {
  studentId: string;
  misiCompletedLevels: number; // 0 to 5
  escapeCompletedRooms: number; // 0 to 5
  sidangScore: {
    diplomacy: number;
    negotiation: number;
    argumentation: number;
    scenario: string;
  } | null;
}

export interface Badge {
  id: string;
  name: string;
  stars: number;
  icon: string;
  description: string;
  xpRequired: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  nis: string;
  className: string;
  finalScore: number;
  date: string;
  qrCodeUrl: string;
}
