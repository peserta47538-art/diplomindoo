/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Material, Question, Badge } from './types';

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat_1',
    title: 'Pengertian Hubungan Internasional',
    description: 'Memahami dasar-dasar interaksi antarnegara di kancah global serta pentingnya diplomasi bagi kedaulatan bangsa.',
    category: 'HI',
    order: 1,
    videoUrl: 'https://www.youtube.com/embed/YIByC75VlWw', // Placeholder
    summary: 'Hubungan Internasional (HI) adalah interaksi global yang melibatkan negara, organisasi internasional, kelompok kepentingan, atau individu dalam melintasi batas negara. Bagi Indonesia, HI bertujuan membina kerja sama antarnegara demi kemaslahatan nasional dan ketertiban dunia.',
    infographics: [
      'Subjek Hubungan Internasional meliputi Negara, Organisasi Internasional, Tahta Suci Vatikan, Palang Merah Internasional, Pemberontak (Belligereen), dan Perusahaan Multinasional.',
      'Asas-Asas Hubungan Internasional: Asas Teritorial, Asas Kebangsaan, dan Asas Kepentingan Umum.',
      'Metode diplomasi mencakup negosiasi (perundingan), mediasi (bantuan pihak ketiga), dan persuasi.'
    ],
    funFacts: [
      'Secara formal, Indonesia memulai diplomasi internasionalnya segera setelah proklamasi kemerdekaan lewat pengakuan kedaulatan pertama dari Mesir dan negara-negara Liga Arab lainnya!',
      'Istilah diplomasi berasal dari bahasa Yunani "diploma" yang berarti lembar lipat ganda, yang merujuk pada dokumen resmi perjanjian perbatasan zaman dahulu.'
    ]
  },
  {
    id: 'mat_2',
    title: 'Tujuan Hubungan Internasional',
    description: 'Menganalisis alasan mendasar mengapa Indonesia menjalin kemitraan dengan negara luar, sesuai dengan amanat konstitusi.',
    category: 'HI',
    order: 2,
    videoUrl: 'https://www.youtube.com/embed/7Vp8YQnS66Y',
    summary: 'Tujuan utama Hubungan Internasional bagi Indonesia bersumber pada Pembukaan UUD 1945 alinea ke-4, yaitu: ikut melaksanakan ketertiban dunia yang berdasarkan kemerdekaan, perdamaian abadi, dan keadilan sosial, serta melindungi segenap bangsa Indonesia.',
    infographics: [
      'Mencegah Konflik Global: Menjaga stabilitas kawasan dan dunia melalui penyelesaian damai.',
      'Pembangunan Ekonomi: Menarik investasi asing, memperluas pasar ekspor, dan transfer teknologi.',
      'Perlindungan Warga Negara Indonesia (WNI) di luar negeri melalui fungsi kedutaan dan konsulat.'
    ],
    funFacts: [
      'Salah satu bukti nyata sukses hubungan internasional Indonesia adalah ekspor komoditas andalan seperti sawit dan kopi yang dinikmati oleh ratusan juta penduduk di Benua Eropa dan Amerika!',
      'Indonesia memiliki lebih dari 130 perwakilan diplomatik (KBRI, PTRI, KJRI) di seluruh dunia untuk melayani jutaan WNI.'
    ]
  },
  {
    id: 'mat_3',
    title: 'Organisasi Internasional (ASEAN, PBB, G20, OKI, WTO)',
    description: 'Mempelajari organisasi global dan regional yang diikuti Indonesia, serta fungsinya masing-masing.',
    category: 'ASEAN',
    order: 3,
    videoUrl: 'https://www.youtube.com/embed/3A-v8HskZ9M',
    summary: 'Organisasi internasional merupakan wadah kerja sama negara-negara untuk mencapai kesepakatan bersama. Indonesia aktif di ASEAN (regional), PBB (global), G20 (ekonomi utama), OKI (solidaritas negara Islam), dan WTO (perdagangan dunia).',
    infographics: [
      'ASEAN (Association of Southeast Asian Nations) didirikan pada 8 Agustus 1967 berdasarkan Deklarasi Bangkok.',
      'PBB (Perserikatan Bangsa-Bangsa): Indonesia menjadi anggota ke-60 pada September 1950.',
      'G20: Forum koordinasi ekonomi global terbesar. Indonesia sukses memegang Presidensi G20 pada tahun 2022.',
      'OKI (Organisasi Kerja Sama Islam): Berdiri untuk membela kepentingan umat Islam di dunia.',
      'WTO (World Trade Organization): Mengatur aturan perdagangan antarnegara agar adil dan transparan.'
    ],
    funFacts: [
      'Indonesia merupakan satu-satunya anggota PBB yang pernah menyatakan "keluar" secara resmi pada tahun 1965 karena ketegangan konfrontasi, namun masuk kembali pada tahun 1966!',
      'Indonesia adalah salah satu dari 5 negara pendiri utama ASEAN bersama Malaysia, Thailand, Filipina, dan Singapura.'
    ]
  },
  {
    id: 'mat_4',
    title: 'Peran Indonesia dalam ASEAN',
    description: 'Menelusuri peran sentral Indonesia sebagai pemimpin informal dan inisiator perdamaian di Asia Tenggara.',
    category: 'ASEAN',
    order: 4,
    videoUrl: 'https://www.youtube.com/embed/0Qf8O8U5vZs',
    summary: 'Indonesia diakui sebagai "pemimpin alami" di ASEAN karena ukuran geografis dan populasinya. Inisiatif kunci Indonesia meliputi pembentukan ASEAN Community, Jakarta Informal Meeting (JIM) untuk mendamaikan Kamboja, serta ASEAN Outlook on the Indo-Pacific.',
    infographics: [
      'Penggagas Deklarasi Bangkok: Menandatangani pendirian ASEAN (Adam Malik sebagai Menlu saat itu).',
      'Tuan Rumah Pertama KTT ASEAN: KTT ASEAN ke-1 diadakan di Bali pada tahun 1976.',
      'Inisiator Masyarakat Ekonomi ASEAN (MEA) dan ASEAN Security Community (ASC).'
    ],
    funFacts: [
      'Gedung Sekretariat Jenderal ASEAN berlokasi di Jakarta Selatan, Indonesia, yang menegaskan posisi Indonesia sebagai kiblat penting diplomasi Asia Tenggara!',
      'Semboyan ASEAN adalah "One Vision, One Identity, One Community".'
    ]
  },
  {
    id: 'mat_5',
    title: 'Peran Indonesia dalam PBB',
    description: 'Menganalisis keaktifan Indonesia dalam sidang-sidang PBB, Dewan Keamanan, Dewan HAM, serta komitmen kemanusiaan.',
    category: 'PBB',
    order: 5,
    videoUrl: 'https://www.youtube.com/embed/S2p2I5q3_gE',
    summary: 'Di forum PBB, Indonesia menyuarakan hak-hak kemerdekaan negara terjajah (seperti Palestina), keadilan ekonomi bagi negara berkembang, dan penegakan hukum internasional. Indonesia telah terpilih beberapa kali sebagai Anggota Tidak Tetap Dewan Keamanan PBB.',
    infographics: [
      'Anggota Tidak Tetap DK PBB: Indonesia terpilih sebanyak 4 kali (1973, 1995, 2007, dan 2019).',
      'Anggota Dewan HAM PBB: Berulangkali dipercaya dunia untuk menangani perlindungan hak asasi manusia global.',
      'Diplomasi Multilateral: Berperan aktif dalam menetapkan Sustainable Development Goals (SDGs).'
    ],
    funFacts: [
      'Presiden Soekarno berpidato di Sidang Umum PBB tahun 1960 dengan menyampaikan konsep Pancasila sebagai ideologi global dalam pidato bersejarahnya yang berjudul "To Build the World Anew!"',
      'Pahlawan nasional Indonesia, LN Palar, adalah duta besar RI pertama untuk PBB yang memperjuangkan kemerdekaan Indonesia di mata dunia.'
    ]
  },
  {
    id: 'mat_6',
    title: 'Indonesia dalam Misi Perdamaian Dunia',
    description: 'Menyingkap kontribusi legendaris pasukan baret biru Kontingen Garuda (Konga) di belahan dunia yang berkonflik.',
    category: 'PBB',
    order: 6,
    videoUrl: 'https://www.youtube.com/embed/Xq-UfB2fGv8',
    summary: 'Komitmen Indonesia nyata melalui pengiriman Kontingen Garuda (Konga) dalam misi pemeliharaan perdamaian PBB (UN Peacekeeping Operations). Sejak tahun 1957, puluhan ribu prajurit TNI dan polri telah dikirim ke Timur Tengah, Afrika, dan Balkan.',
    infographics: [
      'Kontingen Garuda I dikirim ke Mesir pada Januari 1957 untuk mengamankan Terusan Suez.',
      'Indonesia masuk dalam 10 besar negara penyumbang pasukan pemelihara perdamaian PBB terbesar di dunia.',
      'Misi non-militer: Pasukan Indonesia terkenal sangat humanis, sering membangun sekolah, merawat medis warga lokal, dan membagikan makanan.'
    ],
    funFacts: [
      'Pasukan pemelihara perdamaian Indonesia sangat populer di Lebanon karena sapaan tulus mereka "Halo, hoba!" yang disukai anak-anak dan masyarakat lokal setempat!',
      'PBB memberikan penghargaan medali perdamaian PBB (UN Peacekeeping Medal) kepada ribuan infanteri Indonesia atas profesionalisme tinggi.'
    ]
  },
  {
    id: 'mat_7',
    title: 'Diplomasi Indonesia',
    description: 'Mendalami doktrin diplomasi Indonesia yang "Bebas Aktif" serta pengaruh Konferensi Asia Afrika (KAA).',
    category: 'DIPLOMASI',
    order: 7,
    videoUrl: 'https://www.youtube.com/embed/K8NfOfT63sA',
    summary: 'Kebijakan luar negeri Indonesia dipandu oleh doktrin Politik Luar Negeri Bebas Aktif yang digagas oleh Moh. Hatta pada tahun 1948 ("Mendayung di antara Dua Karang"). Bebas berarti tidak memihak blok kekuatan mana pun; Aktif berarti terus berikhtiar memelihara perdamaian internasional.',
    infographics: [
      'Inisiator Konferensi Asia Afrika (KAA) di Bandung tahun 1955, yang memicu kemerdekaan puluhan negara di Asia dan Afrika.',
      'Sponsor Gerakan Non-Blok (GNB): Menyeimbangkan tensi Perang Dingin antara Blok Barat dan Blok Timur.',
      'Diplomasi Kebudayaan dan Kuliner: Menggunakan diplomasi "Gastronomi" (rendang, nasi goreng) untuk diplomasi publik.'
    ],
    funFacts: [
      'KAA Bandung 1955 menghasilkan "Dasasila Bandung" yang dipuji dunia sebagai dasar pembentukan tata dunia baru yang adil!',
      'Mohammad Hatta merumuskan Politik Bebas Aktif saat menyampaikan pidato berjudul "Mendayung di antara Dua Karang" di sidang BP KNIP pada tahun 1948.'
    ]
  },
  {
    id: 'mat_8',
    title: 'Tantangan Indonesia di Era Globalisasi',
    description: 'Menghadapi isu-isu kontemporer seperti ketegangan siber, kedaulatan laut (Laut Natuna Utara), dan perubahan iklim.',
    category: 'GLOBALISASI',
    order: 8,
    videoUrl: 'https://www.youtube.com/embed/yQy192H_8eY',
    summary: 'Globalisasi menghadirkan tantangan multisektor bagi eksistensi Indonesia. Isu penting yang dihadapi diplomasi modern mencakup perlindungan Zona Ekonomi Eksklusif (ZEE) di Laut Natuna Utara, diplomasi karbon untuk krisis iklim, serta kedaulatan digital.',
    infographics: [
      'Sengketa ZEE Laut Natuna Utara: Indonesia menolak klaim historis sepihak (Nine-Dash Line) berdasarkan UNCLOS 1982.',
      'Diplomasi Iklim: Target pencapaian Net Zero Emission dan peran hutan hujan tropis Indonesia sebagai paru-paru dunia.',
      'Keamanan Siber (Cyber Security): Menahan infiltrasi intelijen, hoaks transnasional, dan menjaga integritas data nasional.'
    ],
    funFacts: [
      'Indonesia berambisi menjadi poros maritim dunia karena terletak tepat di selat pelayaran tersibuk dunia, Selat Malaka, yang dilalui sepertiga kapal dagang dunia!',
      'Istilah Laut Natuna Utara disahkan pemerintah Indonesia pada tahun 2017 untuk menegaskan kedaulatan hukum laut teritorial RI sesuai peraturan PBB.'
    ]
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_bronze',
    name: '🥉 Diplomat Pemula',
    stars: 1,
    icon: 'MessageSquareIcon',
    description: 'Mempelajari dasar hubungan internasional pertama kali.',
    xpRequired: 100
  },
  {
    id: 'badge_silver',
    name: '🥈 Diplomat Muda',
    stars: 2,
    icon: 'CompassIcon',
    description: 'Selesai menuntaskan 4 materi pembelajaran diplomasi dasar.',
    xpRequired: 400
  },
  {
    id: 'badge_gold',
    name: '🥇 Diplomat Nasional',
    stars: 3,
    icon: 'AwardIcon',
    description: 'Menyelesaikan seluruh materi, 2 game diplomasi, dan kuis penting.',
    xpRequired: 1000
  },
  {
    id: 'badge_world',
    name: '🏆 Diplomat Dunia',
    stars: 4,
    icon: 'GlobeIcon',
    description: 'Menyelesaikan seluruh Game/Misi serta membuktikannya lewat evaluasi puncak dengan skor tinggi!',
    xpRequired: 2000
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // MAT_1 Questions
  {
    id: 'q_1',
    quizId: 'quiz_mat_1',
    type: 'multiple_choice',
    text: 'Siapa tokoh pahlawan nasional yang mengemukakan doktrin Politik Bebas Aktif Indonesia dengan pidato berjudul "Mendayung di antara Dua Karang"?',
    options: [
      'Ir. Soekarno',
      'Drs. Mohammad Hatta',
      'Adam Malik',
      'Sutan Syahrir'
    ],
    correctAnswer: 'Drs. Mohammad Hatta',
    difficulty: 'easy'
  },
  {
    id: 'q_2',
    quizId: 'quiz_mat_1',
    type: 'true_false',
    text: 'Asas Kebangsaan menyatakan bahwa hukum di sebuah negara hanya berlaku untuk warga negaranya di dalam wilayah teritorial negara tersebut dan tidak mengikat di luar.',
    options: ['Benar', 'Salah'],
    correctAnswer: 'Salah', // Asas kebangsaan mengikat WN dimanapun berada
    difficulty: 'medium'
  },
  {
    id: 'q_3',
    quizId: 'quiz_mat_1',
    type: 'drag_drop',
    text: 'Subjek Hukum Internasional yang merupakan pusat otoritas gereja Katolik di dunia dan memiliki kedaulatan politik setara negara adalah...',
    options: ['Palang Merah Internasional', 'Tahta Suci Vatikan', 'Perserikatan Bangsa-Bangsa'],
    correctAnswer: 'Tahta Suci Vatikan',
    difficulty: 'easy'
  },

  // MAT_2 Questions
  {
    id: 'q_4',
    quizId: 'quiz_mat_2',
    type: 'multiple_choice',
    text: 'Tujuan Hubungan Internasional Indonesia termaktub secara jelas dalam Pembukaan UUD NRI Tahun 1945 alinea ke...',
    options: ['Satu', 'Dua', 'Tiga', 'Empat'],
    correctAnswer: 'Empat',
    difficulty: 'easy'
  },
  {
    id: 'q_5',
    quizId: 'quiz_mat_2',
    type: 'case_study',
    text: 'Seorang tenaga kerja asal Indonesia (WNI) menghadapi masalah ketenagakerjaan di Malaysia. Lembaga perwakilan RI yang berkewajiban melindungi WNI tersebut di tingkat kota/konsuler selain KBRI Kuala Lumpur adalah...',
    options: [
      'Atase Militer',
      'Konsulat Jenderal Republik Indonesia (KJRI)',
      'Organisasi Internasional Khusus',
      'Kementerian Hukum dan HAM RI'
    ],
    correctAnswer: 'Konsulat Jenderal Republik Indonesia (KJRI)',
    difficulty: 'medium'
  },

  // MAT_3 Questions
  {
    id: 'q_6',
    quizId: 'quiz_mat_3',
    type: 'multiple_choice',
    text: 'Sebutkan tanggal berdirinya organisasi ASEAN yang didasarkan pada Deklarasi Bangkok!',
    options: [
      '1 Juni 1945',
      '17 Agustus 1945',
      '8 Agustus 1967',
      '24 Oktober 1945'
    ],
    correctAnswer: '8 Agustus 1967',
    difficulty: 'easy'
  },
  {
    id: 'q_7',
    quizId: 'quiz_mat_3',
    type: 'matching',
    text: 'Pasangkan organisasi di bawah ini dengan fokus utamanya secara berurutan: ASEAN, PBB, WTO.',
    pairingLeft: ['ASEAN', 'PBB', 'WTO'],
    pairingRight: ['Perjanjian Perdagangan Global', 'Integrasi Regional Asia Tenggara', 'Perdamaian dan Keamanan Dunia'],
    correctAnswer: 'ASEAN - Integrasi Regional Asia Tenggara, PBB - Perdamaian dan Keamanan Dunia, WTO - Perjanjian Perdagangan Global',
    difficulty: 'medium'
  },

  // MAT_4 Questions
  {
    id: 'q_8',
    quizId: 'quiz_mat_4',
    type: 'multiple_choice',
    text: 'Apa peran nyata Indonesia dalam mengatasi konflik internal di Kamboja tahun 1980-an yang diakui dunia internasional?',
    options: [
      'Mengirimkan bantuan persenjataan pemusnah massal',
      'Menyelenggarakan perundingan Jakarta Informal Meeting (JIM)',
      'Melakukan invasi militer menduduki Phnom Penh',
      'Membekukan keanggotaan Kamboja di ASEAN'
    ],
    correctAnswer: 'Menyelenggarakan perundingan Jakarta Informal Meeting (JIM)',
    difficulty: 'medium'
  },
  {
    id: 'q_9',
    quizId: 'quiz_mat_4',
    type: 'true_false',
    text: 'Indonesia didaulat menjadi tuan rumah untuk Konferensi Tingkat Tinggi (KTT) ASEAN ke-1 yang bersejarah di Bali pada tahun 1976.',
    options: ['Benar', 'Salah'],
    correctAnswer: 'Benar',
    difficulty: 'easy'
  },

  // MAT_5 Questions
  {
    id: 'q_10',
    quizId: 'quiz_mat_5',
    type: 'multiple_choice',
    text: 'Pada tahun 1965, Indonesia sempat keluar dari keanggotaan PBB. Apa alasan utama keputusan politik luar negeri Presiden Soekarno saat itu?',
    options: [
      'PBB menolak permohonan dana pinjaman pembangunan Indonesia',
      'Terpilihnya Malaysia sebagai anggota tidak tetap Dewan Keamanan PBB',
      'Adanya tekanan militer dari Uni Soviet',
      'Persengketaan batas laut teritorial dengan Australia'
    ],
    correctAnswer: 'Terpilihnya Malaysia sebagai anggota tidak tetap Dewan Keamanan PBB',
    difficulty: 'hard'
  },
  {
    id: 'q_11',
    quizId: 'quiz_mat_5',
    type: 'true_false',
    text: 'Indonesia tercatat sudah terpilih sebanyak 4 periode/kali sebagai anggota tidak tetap Dewan Keamanan (DK) PBB di kancah politik global.',
    options: ['Benar', 'Salah'],
    correctAnswer: 'Benar',
    difficulty: 'medium'
  },

  // MAT_6 Questions
  {
    id: 'q_12',
    quizId: 'quiz_mat_6',
    type: 'multiple_choice',
    text: 'Nama kontingen pasukan pemelihara perdamaian asal Indonesia yang dikirim untuk menjalankan misi pemeliharaan keamanan PBB di seluruh dunia adalah...',
    options: [
      'Kontingen Garuda',
      'Komando Pasukan Khusus',
      'Laskar Diplomasi Merdeka',
      'Garda Pancasila Internasional'
    ],
    correctAnswer: 'Kontingen Garuda',
    difficulty: 'easy'
  },
  {
    id: 'q_13',
    quizId: 'quiz_mat_6',
    type: 'case_study',
    text: 'Dalam misi perdamaian PBB di kawasan konflik seperti Lebanon, pasukan Indonesia seringkali mendapat penerimaan yang hangat dari rakyat setempat dibandingkan kontingen negara lain. Hal ini dikarenakan...',
    options: [
      'Pasukan Indonesia membawa bantuan logistik persenjataan canggih',
      'Pendekatan humanis, menghormati nilai agama lokal, sapaan bersahabat, rutin pengobatan sosial gratis',
      'Tindakan militer agresif menumpas kelompok bersenjata',
      'Gaji pasukan Indonesia dibagikan secara langsung kepada kepala desa setempat'
    ],
    correctAnswer: 'Pendekatan humanis, menghormati nilai agama lokal, sapaan bersahabat, rutin pengobatan sosial gratis',
    difficulty: 'medium'
  },

  // MAT_7 Questions
  {
    id: 'q_14',
    quizId: 'quiz_mat_7',
    type: 'multiple_choice',
    text: 'Inisiatif bersejarah Indonesia yang menyatukan bangsa-bangsa terjajah di benua timur untuk berdaulat mandiri melalui perhelatan Konferensi Asia Afrika (KAA) dilangsungkan di kota...',
    options: ['Yogyakarta', 'Jakarta', 'Bandung', 'Bali'],
    correctAnswer: 'Bandung',
    difficulty: 'easy'
  },
  {
    id: 'q_15',
    quizId: 'quiz_mat_7',
    type: 'true_false',
    text: 'Dasasila Bandung yang lahir dari KAA 1955 merupakan cikal bakal lahirnya kerja sama militer ofensif bagi negara berkembang.',
    options: ['Benar', 'Salah'],
    correctAnswer: 'Salah', // KAA menolak aliansi militer perang dingin
    difficulty: 'medium'
  },

  // MAT_8 Questions
  {
    id: 'q_16',
    quizId: 'quiz_mat_8',
    type: 'case_study',
    text: 'Terjadi pelanggaran penangkapan ikan ilegal oleh kapal nelayan asing bersenjata di wilayah Laut Natuna Utara. Dasar hukum internasional yang digunakan Indonesia untuk menangkal klaim kedaulatan sepihak (Traditional Fishing Grounds negara asing) adalah...',
    options: [
      'Perjanjian bilateral eksklusif dengan Amerika Serikat',
      'Konvensi Hukum Laut PBB 1982 (UNCLOS 1982)',
      'Deklarasi Hak-Hak Kemanusiaan PBB',
      'Piagam Organisasi Perdagangan Dunia (WTO)'
    ],
    correctAnswer: 'Konvensi Hukum Laut PBB 1982 (UNCLOS 1982)',
    difficulty: 'hard'
  },
  {
    id: 'q_17',
    quizId: 'quiz_mat_8',
    type: 'multiple_choice',
    text: 'Salah satu tantangan global yang menuntut peran "diplomasi hijau" Indonesia sebagai pemegang hutan hujan tropis terluas adalah menangani isu...',
    options: [
      'Kejahatan siber pencucian uang asing',
      'Sengketa bea masuk baja berkualitas tinggi',
      'Perubahan iklim global dan emisi karbon',
      'Perluasan wilayah perbatasan darat darurat'
    ],
    correctAnswer: 'Perubahan iklim global dan emisi karbon',
    difficulty: 'easy'
  },

  // Extra generic smart questions to build a bank of at least 20 items
  {
    id: 'q_18',
    quizId: 'quiz_mat_3',
    type: 'multiple_choice',
    text: 'Di mana markas besar Perserikatan Bangsa-Bangsa (PBB) berada?',
    options: ['Jenewa, Swiss', 'London, Inggris', 'New York, Amerika Serikat', 'Paris, Prancis'],
    correctAnswer: 'New York, Amerika Serikat',
    difficulty: 'easy'
  },
  {
    id: 'q_19',
    quizId: 'quiz_mat_1',
    type: 'multiple_choice',
    text: 'Asas yang berlandaskan pada wewenang negara untuk melindungi dan mengatur kepentingan dalam kehidupan masyarakatnya diatur dalam asas...',
    options: ['Asas Kebangsaan', 'Asas Teritorial', 'Asas Kepentingan Umum', 'Asas Timbal Balik'],
    correctAnswer: 'Asas Kepentingan Umum',
    difficulty: 'medium'
  },
  {
    id: 'q_20',
    quizId: 'quiz_mat_7',
    type: 'multiple_choice',
    text: 'Negara manakah di Afrika yang memberikan dukungan paling gigih serta pengakuan simbolis kemerdekaan Republik Indonesia saat dideklarasikan?',
    options: ['Mesir', 'Afrika Selatan', 'Kenya', 'Maroko'],
    correctAnswer: 'Mesir',
    difficulty: 'easy'
  }
];

export const WORLD_MAP_DATA = {
  indonesia: {
    name: 'Profil Indonesia',
    desc: 'Negara kepulauan terbesar di dunia dengan garis pantai strategis, mengusung diplomasi kemanusiaan perdamaian dunia.',
    joinedOrgs: ['PBB (Anggota ke-60, sejak 1950)', 'ASEAN (Pendiri utama, sejak 1967)', 'G20 (Anggota aktif)', 'OKI', 'WTO', 'APEC', 'GNB'],
    coordinates: { x: 45, y: 70 } // Percentage in container coordinates
  },
  asean: {
    name: 'Konsep & Peran ASEAN',
    desc: 'Asosiasi Negara-Negara Asia Tenggara yang didirikan pada tanggal 8 Agustus 1967 melingkupi 10 negara di Asia Tenggara.',
    roles: [
      'Pendiri Utama: Diwakili komitmen Adam Malik di Bangkok.',
      'Tuan Rumah KTT Pertama: Bali Concord I tahun 1976 menetapkan fondasi harmoni kesepakatan regional.',
      'Mediator Regional: Inisiator penyelesaian sengketa Kamboja (KTT JIM).',
      'Poros Maritim: Konsensus ASEAN Outlook di Indo-Pasifik demi stabilitas jalur laut internasional.'
    ],
    coordinates: { x: 40, y: 55 }
  },
  un: {
    name: 'Misi Dunia PBB',
    desc: 'Organisasi terbesar dengan keanggotaan penuh hampir seluruh negara internasional untuk menjaga kedamaian global bersama.',
    roles: [
      'Kontingen Garuda: Sejak 1957 aktif di Sinai, Kongo, Kamboja, Bosnia, Lebanon, Sudan, hingga Mali.',
      'Anggota DK PBB: Dewan Pembuat Kebijakan Strategis, menyuarakan kedaulatan negara tertindas.',
      'Dewan HAM PBB: Berpartisipasi menjaga marwah harkat manusia universal.'
    ],
    coordinates: { x: 68, y: 28 }
  }
};

export const INTERNASIONAL_SCENARIOS = [
  {
    id: 'sc_conflict',
    title: 'Konflik Laut Regional (Ambalat & Sengketa Nelayan)',
    situation: 'Terjadi eskalasi patroli kapal militer negara tetangga di perbatasan maritim kaya migas Blok Ambalat. Kapal nelayan asing mulai menjarah terumbu karang dan mengusir nelayan lokal kita secara ilegal diiringi klaim teritorial historis sepihak.',
    options: [
      {
        id: 'opt1',
        label: 'Kirim seluruh kapal perang serbu dan luncurkan rudal peringatan untuk segera tenggelamkan kapal tetangga.',
        impact: {
          diplomacy: -15,
          negotiation: 5,
          argumentation: -10,
          responseText: 'Tindakan Anda gegabah dan memicu kekhawatiran meluas di Dewan Keamanan PBB. Negara Anda dinilai melanggar piagam PBB pasal 2 ayat 4 tentang larangan penggunaan kekerasan militer dalam hubungan internasional.'
        }
      },
      {
        id: 'opt2',
        label: 'Adukan secara formal ke Mahkamah Internasional (ICJ) atau tribunal laut (ITLOS) berdasarkan UNCLOS 1982 sembari mengerahkan patroli Coast Guard sipil defensif.',
        impact: {
          diplomacy: 25,
          negotiation: 20,
          argumentation: 25,
          responseText: 'Langkah cerdas! Anda memanfaatkan pilar hukum multilateral UNCLOS 1982. Dunia internasional dan PBB bersimpati mendukung kedaulatan Indonesia yang sah karena bertindak sesuai aturan tertib hukum global yang disepakati.'
        }
      },
      {
        id: 'opt3',
        label: 'Diamkan saja dan relakan garis pantai digeser sedikit demi persahabatan harmonis antarnegara tetangga sekawasan.',
        impact: {
          diplomacy: 5,
          negotiation: -20,
          argumentation: -20,
          responseText: 'Tindakan mengalah melemahkan kedaulatan kedaulatan negara. Konstitusi mengamanatkan perlindungan wilayah tumpah darah Indonesia. Rakyat mengkritik tajam kelalaian pertahanan Anda!'
        }
      }
    ]
  },
  {
    id: 'sc_climate',
    title: 'Krisis Karbon dan Eksploitasi Hutan Hujan',
    situation: 'Indonesia mendapat desakan global untuk menghentikan pembangunan perkebunan skala besar guna menekan emisi gas rumah kaca. Namun di sisi ekonomi, jutaan petani lokal bergantung pada industri ekspor kelapa sawit tersebut.',
    options: [
      {
        id: 'opt1',
        label: 'Abaikan desakan internasional, keluarlah dari Paris Agreement demi kesejahteraan ekonomi sawit absolut.',
        impact: {
          diplomacy: -20,
          negotiation: -15,
          argumentation: 5,
          responseText: 'Keputusan ini mengisolasi Indonesia dari ekonomi masa depan bertenaga energi hijau. Tarif impor hukuman (carbon tax) berisiko menyumbat laju perdagangan ekspor Indonesia ke Eropa.'
        }
      },
      {
        id: 'opt2',
        label: 'Ajukan gagasan "Pendanaan Transisi Energi Adil dan Kompensasi Karbon Lestari" di KTT G20 kepada negara maju yang mensubsidi kelestarian hutan hujan nusantara.',
        impact: {
          diplomacy: 24,
          negotiation: 25,
          argumentation: 23,
          responseText: 'Brilian! Ini taktik diplomasi bilateral bernuansa hijau yang kuat. Anda memperjuangkan kepentingan petani lokal dengan win-win solution: menjaga ekologi bumi sembari mengalirkan dana hibah teknologi hijau ke Indonesia.'
        }
      }
    ]
  }
];
