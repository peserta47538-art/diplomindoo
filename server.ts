/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_MATERIALS, INITIAL_QUESTIONS, INITIAL_BADGES } from './src/data';
import { User, StudentProfile, TeacherProfile, Question, Material, Certificate, AuditLog, ClassGroup } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// JSON File Database Simulation Paths
const DB_DIR = path.join(process.cwd(), 'server-db');
const USER_DB_PATH = path.join(DB_DIR, 'users.json');
const STUDENT_DB_PATH = path.join(DB_DIR, 'students.json');
const TEACHER_DB_PATH = path.join(DB_DIR, 'teachers.json');
const MATERIAL_DB_PATH = path.join(DB_DIR, 'materials.json');
const QUESTION_DB_PATH = path.join(DB_DIR, 'questions.json');
const CERT_DB_PATH = path.join(DB_DIR, 'certificates.json');
const CLASS_DB_PATH = path.join(DB_DIR, 'classes.json');
const LOG_DB_PATH = path.join(DB_DIR, 'audit_logs.json');
const PROGRESS_DB_PATH = path.join(DB_DIR, 'progress.json');

// Initialize database storage on startup if missing
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function readJSON<T>(filePath: string, defaultData: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultData;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Seed Initial Data
const SEED_USERS: User[] = [
  { id: 'usr_student', email: 'siswa@diplomindo.id', role: 'student', name: 'Ahmad Rafli', createdAt: new Date().toISOString() },
  { id: 'usr_teacher', email: 'guru@diplomindo.id', role: 'teacher', name: 'Dra. Sri Hartati', createdAt: new Date().toISOString() },
  { id: 'usr_admin', email: 'admin@diplomindo.id', role: 'admin', name: 'Super Admin', createdAt: new Date().toISOString() }
];

const SEED_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'std_rafli',
    userId: 'usr_student',
    nis: '12345',
    name: 'Ahmad Rafli',
    classId: 'cls_1',
    className: 'Kelas X-1',
    level: 5,
    xp: 450,
    coins: 120,
    badges: ['badge_bronze'],
    completedMaterials: ['mat_1', 'mat_2', 'mat_3'],
    completedGames: ['misi'],
    quizScores: { quiz_mat_1: 90, quiz_mat_2: 80 }
  }
];

const SEED_TEACHER_PROFILES: TeacherProfile[] = [
  {
    id: 'tch_sri',
    userId: 'usr_teacher',
    nip: '98765',
    name: 'Dra. Sri Hartati',
    schoolName: 'SMA Negeri 1 Jakarta'
  }
];

const SEED_CLASSES: ClassGroup[] = [
  { id: 'cls_1', name: 'X-A', teacherId: 'tch_sri' },
  { id: 'cls_2', name: 'X-B', teacherId: 'tch_sri' }
];

// Read arrays active in server memory
let dbUsers = readJSON<User[]>(USER_DB_PATH, SEED_USERS);
let dbStudents = readJSON<StudentProfile[]>(STUDENT_DB_PATH, SEED_STUDENT_PROFILES);
let dbTeachers = readJSON<TeacherProfile[]>(TEACHER_DB_PATH, SEED_TEACHER_PROFILES);
let dbMaterials = readJSON<Material[]>(MATERIAL_DB_PATH, INITIAL_MATERIALS);
let dbQuestions = readJSON<Question[]>(QUESTION_DB_PATH, INITIAL_QUESTIONS);
let dbCertificates = readJSON<Certificate[]>(CERT_DB_PATH, []);
let dbClasses = readJSON<ClassGroup[]>(CLASS_DB_PATH, SEED_CLASSES);
let dbLogs = readJSON<AuditLog[]>(LOG_DB_PATH, []);

function addAuditLog(userId: string, action: string, details: string) {
  const newLog: AuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    userId,
    action,
    timestamp: new Date().toISOString(),
    details
  };
  dbLogs.push(newLog);
  writeJSON(LOG_DB_PATH, dbLogs);
}

// Lazy load Gemini API
let genAI: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null; // Return null to indicate mock mode
  }
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAI;
}

// Entry routes - No password/email required: only Name and Class!
app.post('/api/auth/login', (req, res) => {
  const name = (req.body.name || '').trim();
  const className = (req.body.className || req.body.classId || 'Kelas X-1').trim();
  const requestedRole = req.body.role || 'student';
  const email = (req.body.email || '').trim().toLowerCase();

  if (!name) {
    return res.status(400).json({ error: 'Nama Lengkap wajib diisi.' });
  }

  // Generate consistent virtual email identifier
  const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const classSlug = className.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const userEmail = email || `${cleanSlug}_${classSlug}@diplomindo.id`;

  // Find user by email or by exact name and role
  let user = dbUsers.find(u =>
    (email && u.email.toLowerCase() === email) ||
    u.email.toLowerCase() === userEmail.toLowerCase() ||
    (u.name.toLowerCase() === name.toLowerCase() && u.role === requestedRole)
  );

  if (!user) {
    const newUserId = `usr_${Date.now()}`;
    user = {
      id: newUserId,
      email: userEmail,
      role: requestedRole,
      name,
      createdAt: new Date().toISOString()
    };
    dbUsers.push(user);
    writeJSON(USER_DB_PATH, dbUsers);
    addAuditLog(newUserId, 'Student Enter', `Akses belajar baru: ${name} (${className})`);
  } else {
    user.name = name;
    if (requestedRole) {
      user.role = requestedRole;
    }
    writeJSON(USER_DB_PATH, dbUsers);
  }

  // Ensure and return appropriate role profile
  if (user.role === 'teacher') {
    let profile = dbTeachers.find(t => t.userId === user?.id || t.name.toLowerCase() === name.toLowerCase());
    if (!profile) {
      profile = {
        id: `tch_${Date.now()}`,
        userId: user.id,
        nip: `NIP-${Math.floor(10000 + Math.random() * 90000)}`,
        name: user.name,
        schoolName: 'SMA Sederajat Indonesia'
      };
      dbTeachers.push(profile);
      writeJSON(TEACHER_DB_PATH, dbTeachers);
    } else {
      profile.name = user.name;
      writeJSON(TEACHER_DB_PATH, dbTeachers);
    }
    addAuditLog(user.id, 'Authentication', `Guru ${profile.name} berhasil masuk`);
    return res.json({ token: 'mock-jwt-teacher-token', user, profile });
  }

  if (user.role === 'admin') {
    addAuditLog(user.id, 'Authentication', `Admin ${user.name} berhasil masuk`);
    return res.json({ token: 'mock-jwt-admin-token', user, profile: null });
  }

  // Student profile (default)
  let profile = dbStudents.find(s => s.userId === user?.id || (s.name.toLowerCase() === name.toLowerCase() && (s.className?.toLowerCase() === className.toLowerCase() || s.classId?.toLowerCase() === className.toLowerCase())));
  if (!profile) {
    // Also try finding student by name
    profile = dbStudents.find(s => s.name.toLowerCase() === name.toLowerCase());
  }

  if (!profile) {
    profile = {
      id: `std_${Date.now()}`,
      userId: user.id,
      nis: `NIS-${Math.floor(10000 + Math.random() * 90000)}`,
      name: user.name,
      classId: className,
      className: className,
      level: 1,
      xp: 0,
      coins: 0,
      badges: [],
      completedMaterials: [],
      completedGames: [],
      quizScores: {}
    };
    dbStudents.push(profile);
    writeJSON(STUDENT_DB_PATH, dbStudents);
  } else {
    profile.name = user.name;
    if (className) {
      profile.className = className;
      profile.classId = className;
    }
    writeJSON(STUDENT_DB_PATH, dbStudents);
  }

  addAuditLog(user.id, 'Student Access', `Siswa ${profile.name} (${profile.className || className}) masuk ke simulasi`);
  return res.json({ token: 'mock-jwt-student-token', user, profile });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, nis, nip, className } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nama dan Email wajib diisi' });
  }

  const existing = dbUsers.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'Email sudah terdaftar' });
  }

  const newUserId = `usr_${Date.now()}`;
  const newUser: User = {
    id: newUserId,
    email,
    role: role || 'student',
    name,
    createdAt: new Date().toISOString()
  };

  dbUsers.push(newUser);
  writeJSON(USER_DB_PATH, dbUsers);

  if (newUser.role === 'teacher') {
    const newTeacherProfile: TeacherProfile = {
      id: `tch_${Date.now()}`,
      userId: newUserId,
      nip: nip || `NIP-${Math.floor(10000 + Math.random() * 90000)}`,
      name,
      schoolName: 'SMA Sederajat Indonesia'
    };
    dbTeachers.push(newTeacherProfile);
    writeJSON(TEACHER_DB_PATH, dbTeachers);
    addAuditLog(newUserId, 'Registration', `New Teacher Registered NIP: ${newTeacherProfile.nip}`);
    return res.json({ user: newUser, profile: newTeacherProfile });
  } else {
    // Allocate class
    let assignedClass = dbClasses.find(c => c.name === className);
    if (!assignedClass && className) {
      assignedClass = { id: `cls_${Date.now()}`, name: className, teacherId: 'tch_sri' };
      dbClasses.push(assignedClass);
      writeJSON(CLASS_DB_PATH, dbClasses);
    }

    const newStudentProfile: StudentProfile = {
      id: `std_${Date.now()}`,
      userId: newUserId,
      nis: nis || `NIS-${Math.floor(10000 + Math.random() * 90000)}`,
      name,
      classId: assignedClass ? assignedClass.id : 'cls_1',
      level: 1,
      xp: 0,
      coins: 0,
      badges: [],
      completedMaterials: [],
      completedGames: [],
      quizScores: {}
    };
    dbStudents.push(newStudentProfile);
    writeJSON(STUDENT_DB_PATH, dbStudents);
    addAuditLog(newUserId, 'Registration', `New Student Registered NIS: ${newStudentProfile.nis}`);
    return res.json({ user: newUser, profile: newStudentProfile });
  }
});

// Materials API
app.get('/api/materials', (req, res) => {
  res.json(dbMaterials);
});

app.post('/api/materials', (req, res) => {
  const material: Material = req.body;
  if (!material.title || !material.summary) {
    return res.status(400).json({ error: 'Judul dan Ringkasan materi tidak boleh kosong' });
  }
  material.id = material.id || `mat_${Date.now()}`;
  material.order = material.order || (dbMaterials.length + 1);
  dbMaterials.push(material);
  writeJSON(MATERIAL_DB_PATH, dbMaterials);
  addAuditLog('usr_teacher', 'Manage Materials', `Added material: ${material.title}`);
  res.json(material);
});

app.put('/api/materials/:id', (req, res) => {
  const { id } = req.params;
  const index = dbMaterials.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Materi tidak ditemukan' });
  }
  dbMaterials[index] = { ...dbMaterials[index], ...req.body };
  writeJSON(MATERIAL_DB_PATH, dbMaterials);
  addAuditLog('usr_teacher', 'Manage Materials', `Updated material: ${dbMaterials[index].title}`);
  res.json(dbMaterials[index]);
});

app.delete('/api/materials/:id', (req, res) => {
  const { id } = req.params;
  const index = dbMaterials.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Materi tidak ditemukan' });
  }
  const deleted = dbMaterials.splice(index, 1);
  writeJSON(MATERIAL_DB_PATH, dbMaterials);
  addAuditLog('usr_teacher', 'Manage Materials', `Deleted material ID: ${id}`);
  res.json({ success: true, deleted: deleted[0] });
});

// Dynamic Question Management API
app.get('/api/questions', (req, res) => {
  res.json(dbQuestions);
});

app.post('/api/questions', (req, res) => {
  const question: Question = req.body;
  if (!question.text || !question.correctAnswer) {
    return res.status(400).json({ error: 'Pertanyaan dan kunci jawaban wajib ada' });
  }
  question.id = question.id || `q_${Date.now()}`;
  dbQuestions.push(question);
  writeJSON(QUESTION_DB_PATH, dbQuestions);
  addAuditLog('usr_teacher', 'Manage Questions', `Created question: ${question.text.substring(0, 30)}...`);
  res.json(question);
});

app.put('/api/questions/:id', (req, res) => {
  const { id } = req.params;
  const index = dbQuestions.findIndex(q => q.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Soal tidak ditemukan' });
  }
  dbQuestions[index] = { ...dbQuestions[index], ...req.body };
  writeJSON(QUESTION_DB_PATH, dbQuestions);
  addAuditLog('usr_teacher', 'Manage Questions', `Updated question ID: ${id}`);
  res.json(dbQuestions[index]);
});

app.delete('/api/questions/:id', (req, res) => {
  const { id } = req.params;
  const index = dbQuestions.findIndex(q => q.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Soal tidak ditemukan' });
  }
  dbQuestions.splice(index, 1);
  writeJSON(QUESTION_DB_PATH, dbQuestions);
  addAuditLog('usr_teacher', 'Manage Questions', `Deleted question ID: ${id}`);
  res.json({ success: true });
});

// Direct open access student endpoints (No login required)
app.get('/api/student/current', (req, res) => {
  let student = dbStudents.find(s => s.name.toLowerCase().includes('dimas'));
  if (!student) {
    student = dbStudents[0];
  }
  if (!student) {
    student = {
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
    };
    dbStudents.push(student);
    writeJSON(STUDENT_DB_PATH, dbStudents);
  }
  res.json(student);
});

app.post('/api/student/identity', (req, res) => {
  const { studentId, name, className } = req.body;
  let index = dbStudents.findIndex(s => s.id === studentId || s.userId === studentId);
  if (index === -1) {
    index = dbStudents.findIndex(s => s.name.toLowerCase() === (name || '').toLowerCase());
  }

  if (index !== -1) {
    if (name) dbStudents[index].name = name.trim();
    if (className) {
      dbStudents[index].className = className.trim();
      dbStudents[index].classId = className.trim();
    }
    writeJSON(STUDENT_DB_PATH, dbStudents);
    addAuditLog(dbStudents[index].userId || 'usr_open', 'Identity Update', `Siswa memperbarui identitas: ${name} (${className})`);
    return res.json(dbStudents[index]);
  }

  const newProfile: StudentProfile = {
    id: studentId || `std_${Date.now()}`,
    userId: `usr_${Date.now()}`,
    nis: `NIS-${Math.floor(10000 + Math.random() * 90000)}`,
    name: name ? name.trim() : 'Dimas Septian',
    classId: className ? className.trim() : 'Kelas X-1',
    className: className ? className.trim() : 'Kelas X-1',
    level: 1,
    xp: 0,
    coins: 0,
    badges: [],
    completedMaterials: [],
    completedGames: [],
    quizScores: {}
  };
  dbStudents.push(newProfile);
  writeJSON(STUDENT_DB_PATH, dbStudents);
  addAuditLog(newProfile.userId, 'New Student', `Profil siswa baru dibuat langsung: ${newProfile.name} (${newProfile.className})`);
  return res.json(newProfile);
});

// Student Progress, XP & Score Updates
app.get('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const student = dbStudents.find(s => s.userId === userId || s.id === userId);
  if (student) return res.json(student);
  
  const teacher = dbTeachers.find(t => t.userId === userId);
  if (teacher) return res.json(teacher);

  return res.status(404).json({ error: 'Profil tidak ditemukan' });
});

app.post('/api/profile/:studentId/progress', (req, res) => {
  const { studentId } = req.params;
  const { xpEarned, coinsEarned, materialCompleted, gameCompleted, quizId, quizScore } = req.body;

  const index = dbStudents.findIndex(s => s.id === studentId || s.userId === studentId);
  if (index === -1) {
    return res.status(404).json({ error: 'Profil siswa tidak ditemukan' });
  }

  const s = dbStudents[index];
  if (xpEarned) s.xp += Number(xpEarned);
  if (coinsEarned) s.coins += Number(coinsEarned);

  // Recalculate level (Level 1-50, every 100 XP gives 1 level)
  s.level = Math.min(50, Math.floor(s.xp / 100) + 1);

  if (materialCompleted && !s.completedMaterials.includes(materialCompleted)) {
    s.completedMaterials.push(materialCompleted);
  }

  if (gameCompleted && !s.completedGames.includes(gameCompleted)) {
    s.completedGames.push(gameCompleted);
  }

  if (quizId && quizScore !== undefined) {
    s.quizScores[quizId] = Math.max(s.quizScores[quizId] || 0, Number(quizScore));
  }

  // Award Gamification Badges dynamically
  const awardedBadges: string[] = [...s.badges];
  if (s.xp >= 100 && !awardedBadges.includes('badge_bronze')) {
    awardedBadges.push('badge_bronze');
  }
  if (s.completedMaterials.length >= 4 && !awardedBadges.includes('badge_silver')) {
    awardedBadges.push('badge_silver');
  }
  if (s.completedMaterials.length >= 8 && s.completedGames.includes('misi') && !awardedBadges.includes('badge_gold')) {
    awardedBadges.push('badge_gold');
  }
  if (s.xp >= 2000 && !awardedBadges.includes('badge_world')) {
    awardedBadges.push('badge_world');
  }
  s.badges = awardedBadges;

  dbStudents[index] = s;
  writeJSON(STUDENT_DB_PATH, dbStudents);

  // If criteria met, automatically issue a Certificate
  const completedAllMaterials = s.completedMaterials.length >= 8;
  const completedAllGames = s.completedGames.includes('misi') && s.completedGames.includes('escape') && s.completedGames.includes('sidang');
  
  // Calculate average score of quizzes
  const quizIds = Object.keys(s.quizScores);
  const avgQuizScore = quizIds.length > 0 
    ? quizIds.reduce((sum, qId) => sum + s.quizScores[qId], 0) / quizIds.length 
    : 0;

  let certificate: Certificate | null = null;
  const meetsCriteria = completedAllMaterials || (s.xp >= 1200 && avgQuizScore >= 75);
  
  if (meetsCriteria) {
    const certExists = dbCertificates.find(c => c.nis === s.nis);
    if (!certExists) {
      certificate = {
        id: `cert_${Date.now()}`,
        studentName: s.name,
        nis: s.nis,
        className: s.className || s.classId || 'Kelas X-1',
        finalScore: Math.round(Math.max(avgQuizScore, 80)),
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        qrCodeUrl: `https://diplomindo.id/verify/cert_${Date.now()}`
      };
      dbCertificates.push(certificate);
      writeJSON(CERT_DB_PATH, dbCertificates);
      addAuditLog(s.userId, 'Gamification', `Issued automatic graduation Certificate ID: ${certificate.id}`);
    } else {
      certificate = certExists;
    }
  }

  res.json({ profile: s, certificateIssued: certificate });
});

// Leaderboard API
app.get('/api/leaderboard', (req, res) => {
  const sorted = [...dbStudents]
    .sort((a, b) => b.xp - a.xp)
    .map((s, index) => ({
      rank: index + 1,
      name: s.name,
      nis: s.nis,
      level: s.level,
      xp: s.xp,
      badgesCount: s.badges.length
    }));
  res.json(sorted);
});

// Certificates Verification & Details
app.get('/api/certificates', (req, res) => {
  res.json(dbCertificates);
});

app.get('/api/certificates/verify/:id', (req, res) => {
  const { id } = req.params;
  const cert = dbCertificates.find(c => c.id === id);
  if (!cert) return res.status(404).json({ error: 'Sertifikat tidak sah atau tidak ditemukan' });
  res.json(cert);
});

// Activity logs
app.get('/api/logs', (req, res) => {
  res.json(dbLogs.slice(-100).reverse()); // return last 100 logs
});

// Analytics Dashboard for Teachers
app.get('/api/analytics', (req, res) => {
  // Compute analytics
  const totalStudents = dbStudents.length;
  if (totalStudents === 0) {
    return res.json({
      totalStudents: 0,
      averageXp: 0,
      toughestMaterial: 'Belum ada data',
      averageQuizScore: 0,
      materialDistribution: []
    });
  }

  let totalXp = 0;
  let totalScoreSum = 0;
  let scoreCount = 0;
  const materialFailCount: { [id: string]: { tries: number; fails: number } } = {};

  dbStudents.forEach(s => {
    totalXp += s.xp;
    Object.keys(s.quizScores).forEach(qId => {
      const score = s.quizScores[qId];
      totalScoreSum += score;
      scoreCount++;
      if (!materialFailCount[qId]) {
        materialFailCount[qId] = { tries: 0, fails: 0 };
      }
      materialFailCount[qId].tries++;
      if (score < 75) {
        materialFailCount[qId].fails++;
      }
    });
  });

  // Find toughest material (where fail rate or average score is lowest)
  let toughest = 'Materi 8: Tantangan Keamanan Era Globalisasi (Sengketa Siber & Laut Natuna)';
  let maxFailRate = -1;
  Object.keys(materialFailCount).forEach(qId => {
    const stats = materialFailCount[qId];
    const failRate = stats.fails / stats.tries;
    if (failRate > maxFailRate) {
      maxFailRate = failRate;
      const mat = dbMaterials.find(m => `quiz_${m.id}` === qId || m.id === qId);
      if (mat) poorestTitle: toughest = mat.title;
    }
  });

  const averageXp = Math.round(totalXp / totalStudents);
  const averageQuizScore = scoreCount > 0 ? Math.round(totalScoreSum / scoreCount) : 82;

  // Material progress distribution
  const materialProgressDistribution = dbMaterials.map(m => {
    const completedCount = dbStudents.filter(s => s.completedMaterials.includes(m.id)).length;
    const rate = Math.round((completedCount / totalStudents) * 100);
    return {
      materialId: m.id,
      title: m.title,
      completionRate: rate
    };
  });

  res.json({
    totalStudents,
    averageXp,
    toughestMaterial: toughest,
    averageQuizScore,
    materialProgressDistribution
  });
});

/**
 * ==========================================
 * GEMINI API ADVANCED EDTECH AGENT PROXIES
 * ==========================================
 */

// 1. CHAT TUTOR AI PROXY
app.post('/api/ai/tutor', async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Pesan pertanyaan wajib diisi' });
  }

  const gemini = getGemini();

  // If no API Key matches, trigger smart localized educational advisor
  if (!gemini) {
    // Elegant fallback simulation modeling the complete curriculum
    let simulatedAnswer = `Halo! Saya adalah **Tutor AI Diplomindo**. Sepertinya sistem belum mendeteksi kunci API Gemini. Saya beroperasi dalam mode pembelajaran lokal.

`;
    const lowercaseMsg = message.toLowerCase();
    if (lowercaseMsg.includes('asean') || lowercaseMsg.includes('peran indonesia di asean')) {
      simulatedAnswer += `**Mengenai peran Indonesia dalam ASEAN:**
Indonesia adalah inisiator utama pembentukan ASEAN melalui Deklarasi Bangkok (Adam Malik, 8 Agustus 1967).
- **Inisiator Perdamaian:** Indonesia menyelenggarakan *Jakarta Informal Meeting* (JIM) tahun 1988 untuk menyudahi konflik perang Kamboja dan Vietnam.
- **Tuan Rumah Pertama:** Indonesia menyelenggarakan KTT ASEAN ke-1 di Bali (1976).
- **Pilar Ekonomi:** Mengusung implementasi Masyarakat Ekonomi ASEAN (MEA) sejak 2015.
- **Visi Geopolitik:** Menelurkan konsepsi *ASEAN Outlook on the Indo-Pacific* demi posisi ASEAN tetap independen dari dominasi adidaya.`;
    } else if (lowercaseMsg.includes('pbb') || lowercaseMsg.includes('kontingen garuda')) {
      simulatedAnswer += `**Mengenai peran Indonesia dalam PBB & Kontingen Garuda:**
Indonesia resmi bergabung menjadi anggota PBB ke-60 pada September 1950.
- **Kontingen Garuda (Konga):** Konga I diutus perdana ke Mesir pada tahun 1957. Hingga kini, TNI & POLRI secara rutin berpatroli dengan Baret Biru PBB menjaga perdamaian di kawasan rawan (Lebanon, Sudan Selatan, Kongo, dsb).
- **Keanggotaan DK PBB:** Terpilih 4 kali sebagai Anggota Tidak Tetap Dewan Keamanan PBB.
- **Dewan HAM:** Aktif menyuarakan bela kemerdekaan dan keadilan internasional bagi Palestina sesuai Pembukaan UUD 1945.`;
    } else if (lowercaseMsg.includes('bebas aktif')) {
      simulatedAnswer += `**Konsep Politik Luar Negeri Bebas Aktif:**
Dirumuskan oleh **Drs. Mohammad Hatta** dalam pidatonya yang legendaris **"Mendayung di antara Dua Karang"** (1948).
1. **BEBAS:** Tidak memihak dalam ketegangan blok-blok kekuatan militer global (misal dulu Barat vs Timur, kini perlombaan teknologi geopolitik).
2. **AKTIF:** Berkomitmen secara konsisten mengirimkan pasukan perdamaian, mendukung diplomasi kemanusiaan, serta mendirikan forum KAA 1955 Bandung yang melahirkan Dasasila Bandung.`;
    } else {
      simulatedAnswer += `Pertanyaan Anda tentang "${message}" sangat menarik dalam kajian Hubungan Internasional!

Untuk materi kelas X SMA, ketahuilah bahwa diplomasi Indonesia selalu berlandaskan prinsip **Bebas Aktif**, serta didorong oleh kepentingan nasional demi kedamaian abadi dan keadilan sosial di kancah antarbangsa.

Ada topik spesifik yang ingin Anda diskusikan? Cobalah ketik "peran Indonesia di ASEAN," "Kontingen Garuda," atau "Politik Bebas Aktif"!`;
    }

    return res.json({ text: simulatedAnswer, model: 'Demo mode/Simulated Flash' });
  }

  // Real Gemini call
  try {
    const payloadHistory = chatHistory || [];
    const formattedContents = [
      {
        text: `Anda adalah "Tutor AI Diplomindo" - asisten pembelajaran pintar, inspiratif, dan hangat untuk siswa kelas X (10) SMA di Indonesia.
Misi Anda: Membantu siswa memahami materi "Peran Indonesia dalam Hubungan Antarnegara dan Organisasi Internasional" (ASEAN, PBB, KAA, G20, Gerakan Non Blok, dan pengiriman Kontingen Garuda).
Aturan:
1. Jawab menggunakan bahasa Indonesia yang santun, interaktif, mudah dipahami siswa SMA berusia 15-16 tahun, dan kontekstual.
2. Gunakan pemformatan Markdown (penebalan, poin-poin) untuk memperjelas.
3. Selalu sambungkan jawaban Anda dengan kurikulum pendidikan Pancasila / PPKn kelas X SMA.
4. Jangan menjawab pertanyaan di luar batas Hubungan Internasional, diplomasi, sejarah Indonesia, atau organisasi global secara luas.`
      },
      ...payloadHistory.map((ch: any) => ({
        text: `${ch.role === 'user' ? 'Siswa' : 'Asisten'}: ${ch.content || ch.text}`
      })),
      { text: `Siswa: ${message}` }
    ];

    const response = await gemini.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents
    });

    res.json({ text: response.text || 'Maaf, asisten tidak membuahkan respon.', model: 'gemini-3.5-flash' });
  } catch (err: any) {
    console.error('Gemini Chat error:', err);
    res.status(500).json({ error: 'Gagal menghubungi Gemini AI. Hubungi Guru atau Admin.', details: err.message });
  }
});

// 2. AI LEARNING RECOMMENDATION PROXY
app.post('/api/ai/recommendation', async (req, res) => {
  const { studentProfile } = req.body;
  if (!studentProfile) return res.status(400).json({ error: 'Siswa wajib melampirkan profil untuk dianalisa' });

  const gemini = getGemini();

  if (!gemini) {
    // Generate intelligent heuristic recommendations
    const quizScores = studentProfile.quizScores || {};
    const weakQuizzes = Object.keys(quizScores).filter(k => quizScores[k] < 75);
    let recommendations = '### Rekomendasi Belajar Personal:\n';
    
    if (weakQuizzes.length === 0) {
      if (studentProfile.completedMaterials.length < 8) {
        recommendations += '🌟 **Lanjutkan Langkah Hebatmu!** Hasil kuis dasar Anda sudah di atas KKM (>= 75). Rekomendasi utama Anda adalah menuntaskan seluruh sisa materi hingga Materi 8 (Tantangan Global) untuk mengklaim gelar **Diplomat Dunia**!';
      } else {
        recommendations += '🏆 **Selamat! Anda adalah Diplomat Sempurna.** Seluruh materi dan kuis bernilai mengagumkan. Silakan asah simulasi sidang internasional di menu Game untuk bersiap meraih nilai 100.';
      }
    } else {
      recommendations += 'Berdasarkan rekam nilai kuis Anda, berikut adalah rekomendasi prioritas:\n';
      weakQuizzes.forEach(wq => {
        const matId = wq.replace('quiz_', '');
        const matIdx = dbMaterials.find(m => m.id === matId);
        if (matIdx) {
          recommendations += `- 📖 **Review Kembali: ${matIdx.title}** (Kuis Anda bernilai ${quizScores[wq]}). Tonton ulang video pembelajarannya dan cermati saksama Infografis Fakta Unik "Apakah Kamu Tahu?".\n`;
        }
      });
      recommendations += '\n💡 *Tip sukses:* Cobalah kerjakan kuis setelah membaca rangkuman visual, karena soal dirancang menguji pemahaman kontekstual Anda!';
    }
    return res.json({ recommendation: recommendations, isMock: true });
  }

  try {
    const analysisPrompt = `Analisis performa belajar siswa SMA kelas X berikut:
Nama: ${studentProfile.name}
Materi Selesai: ${studentProfile.completedMaterials?.join(', ') || 'Belum ada'}
Game Selesai: ${studentProfile.completedGames?.join(', ') || 'Belum ada'}
Nilai Kuis (Kunci Kuis: Skor): ${JSON.stringify(studentProfile.quizScores || {})}
Daftar Materi yang Tersedia: ${dbMaterials.map(m => m.id + ': ' + m.title).join('; ')}

Misi Anda:
1. Identifikasi submateri mana yang masih lemah (di bawah KKM 75).
2. Tuliskan rekomendasi belajar yang personal, ramah, membakar semangat belajar siswa.
3. Berikan saran pengerjaan game diplomasi mana yang bisa membantu pemahaman.
Berikan keluaran dalam format Markdown terstruktur yang indah.`;

    const response = await gemini.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: analysisPrompt
    });

    res.json({ recommendation: response.text || 'Gagal merancang analisis.', isMock: false });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal menganalisis profil dengan Gemini.', details: err.message });
  }
});

// 3. AI QUIZ GENERATOR FOR TEACHERS
app.post('/api/ai/quiz-generator', async (req, res) => {
  const { materialTitle, difficulty, questionCount } = req.body;
  if (!materialTitle) {
    return res.status(400).json({ error: 'Judul/Topik materi wajib ditentukan' });
  }

  const numQuestions = questionCount || 3;
  const level = difficulty || 'medium';
  const gemini = getGemini();

  if (!gemini) {
    // Generate intelligent seed matching questions
    const generated: Question[] = [];
    for (let i = 0; i < numQuestions; i++) {
      generated.push({
        id: `q_ai_${Date.now()}_${i}`,
        quizId: `quiz_temp_ai`,
        type: 'multiple_choice',
        text: `[AI Generated Demo] Manakah keputusan strategis yang tepat berkaitan dengan tantangan kontemporer ${materialTitle} bagi Indonesia di tingkat global?`,
        options: [
          'Berkoordinasi dengan PBB dan mendahulukan perundingan hukum laut internasional',
          'Mengambil sikap militer menyerang pangkalan negara lain',
          'Memutus seluruh kedutaan besar negara tetangga',
          'Melarang kapal barang melintasi perairan nasional tanpa kompromi'
        ],
        correctAnswer: 'Berkoordinasi dengan PBB dan mendahulukan perundingan hukum laut internasional',
        difficulty: level
      });
    }
    return res.json({ questions: generated, isMock: true });
  }

  try {
    const prompt = `Anda adalah sistem pembuat kuis EdTech cerdas untuk guru IPS/PPKn SMA kelas X di Indonesia.
Generasikan sebanyak ${numQuestions} soal pilihan ganda baru mengenai tema pembelajaran: "${materialTitle}".
Tingkat kesulitan soal harus: "${level}".
Masing-masing soal wajib memiliki 4 opsi jawaban (Pilihan A, B, C, D).

Keluarkan hasil berupa JSON Array murni tanpa penjelasan pembuka/penutup, yang mematuhi skema format ini:
[
  {
    "text": "Pertanyaan soal...",
    "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
    "correctAnswer": "Teks jawaban yang benar persis sama dengan salah satu nilai di array options"
  }
]`;

    const response = await gemini.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING }
            },
            required: ['text', 'options', 'correctAnswer']
          }
        }
      }
    });

    const parsedQuestions = JSON.parse(response.text || '[]');
    const finalFormatted: Question[] = parsedQuestions.map((q: any, index: number) => ({
      id: `q_ai_${Date.now()}_${index}`,
      quizId: 'quiz_mat_8', // Appendable to global database by default
      type: 'multiple_choice',
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: level
    }));

    // Auto-save generated questions to DB for dynamic play!
    dbQuestions = [...dbQuestions, ...finalFormatted];
    writeJSON(QUESTION_DB_PATH, dbQuestions);
    addAuditLog('usr_teacher', 'AI Generate', `Teacher generated ${numQuestions} questions via Gemini API for: ${materialTitle}`);

    res.json({ questions: finalFormatted, isMock: false });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal menggenerasi soal AI.', details: err.message });
  }
});

// 4. INTERACTIVE GAME 3 FORUM DECISION EVALUATOR PROXY
app.post('/api/ai/sidang-evaluate', async (req, res) => {
  const { scenarioTitle, situation, decisionText } = req.body;
  if (!decisionText) {
    return res.status(400).json({ error: 'Tanggapan/Keputusan diplomatik wajib diisi' });
  }

  const gemini = getGemini();

  if (!gemini) {
    // Elegant fallback simulation
    const wordCount = decisionText.split(' ').length;
    let scores = { diplomacy: 75, negotiation: 80, argumentation: 70 };
    let responseText = '';

    if (decisionText.toLowerCase().includes('pbb') || decisionText.toLowerCase().includes('hukum') || decisionText.toLowerCase().includes('damai')) {
      scores = { diplomacy: 92, negotiation: 88, argumentation: 90 };
      responseText = `Analisis Simulasi Diplomasi (Demo Mode):
Luar biasa! Keputusan Anda untuk melibatkan PBB dan berpijak pada instrument hukum internasional memperlihatkan pemahaman yang solid terhadap pilar **Bebas Aktif**. Indonesia dinilai sebagai pembeli perdamaian rasional yang memperjuangkan keadilan hukum tanpa ketegangan perang saudara.`;
    } else {
      scores = { diplomacy: 60, negotiation: 65, argumentation: 55 };
      responseText = `Analisis Simulasi Diplomasi (Demo Mode):
Keputusan Anda menunjukkan kegigihan, namun kurang taktik negosiasi yang mengedepankan prinsip multilateral hukum laut (UNCLOS 1982). Mengandalkan serbuan konfrontasi langsung berisiko merugikan perekonomian Indonesia dan dijauhi solidaritas ASEAN.`;
    }

    return res.json({ scores, feedbackHtml: responseText });
  }

  try {
    const evalPrompt = `Skenario Sidang Internasional:
Tema: ${scenarioTitle}
Sinyal Situasi: ${situation}
Keputusan yang Diambil Siswa (Delegasi RI): "${decisionText}"

Tugas Anda sebagai "Majelis Panel Penilai PBB & ASEAN":
Evaluasi keputusan siswa tersebut dari 3 aspek (Skala Nilai: 0 hingga 100):
1. Nilai Diplomasi (Kesesuaian dengan asas Bebas-Aktif dan ketaatan hukum internasional, UNCLOS, dsb)
2. Nilai Negosiasi (Efektivitas penyelesaian masalah demi win-win solution)
3. Nilai Argumentasi (Kekuatan retorika dan nalar penyampaian solusi)

Format respon Anda harus dalam format JSON murni dengan struktur:
{
  "diplomacy": angka_0_100,
  "negotiation": angka_0_100,
  "argumentation": angka_0_100,
  "feedbackHtml": "Rangkuman ulasan evaluasi menggunakan paragraf singkat ber-Markdown mengenai mengapa Anda memberikan nilai tersebut, dampak tindakan diplomatik bagi dunia, dan tips perbaikan."
}`;

    const response = await gemini.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: evalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diplomacy: { type: Type.INTEGER },
            negotiation: { type: Type.INTEGER },
            argumentation: { type: Type.INTEGER },
            feedbackHtml: { type: Type.STRING }
          },
          required: ['diplomacy', 'negotiation', 'argumentation', 'feedbackHtml']
        }
      }
    });

    const parsedResult = JSON.parse(response.text || '{}');
    res.json(parsedResult);
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mengevaluasi dengan Gemini.', details: err.message });
  }
});

// Setup Dev Server and Assets Routing
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DIPLOMINDO Server] Running at: http://localhost:${PORT}`);
  });
}

bootstrap();
