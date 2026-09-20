/* =====================================================
   Catatan Si Kecil — app.js
   Vanilla JS, tanpa library. Data disimpan di localStorage
   (di perangkat/browser yang dipakai).
   Bahasa: Indonesia · English · 日本語
   ===================================================== */
(() => {
  'use strict';

  /* ---------- Konfigurasi ---------- */
  const STORE = { records: 'kecil.records.v1', settings: 'kecil.settings.v1' };

  // Roda pilih ml (ubah angka ini kalau mau rentang berbeda)
  const ML_MIN = 5, ML_MAX = 100, ML_STEP = 5;

  // 12 warna pastel
  const THEMES = [
    { id: 'strawberry', name: 'Strawberry Cream', color: '#FFC2CE' },
    { id: 'lavender',   name: 'Lavender Cloud',   color: '#E8DCF8' },
    { id: 'peach',      name: 'Peach Sorbet',     color: '#FFDFCB' },
    { id: 'ocean',      name: 'Ocean Breeze',     color: '#CBE2F8' },
    { id: 'pistachio',  name: 'Pistachio Dream',  color: '#D0EAD6' },
    { id: 'lemon',      name: 'Lemon Meringue',   color: '#FFF0B8' },
    { id: 'sakura',     name: 'Sakura Blossom',   color: '#FDD1DC' },
    { id: 'cloudy',     name: 'Cloudy Day',       color: '#D8E0F2' },
    { id: 'berry',      name: 'Berry Smoothie',   color: '#E8BCDF' },
    { id: 'mocha',      name: 'Mocha Latte',      color: '#E8D0C3' },
    { id: 'mint',       name: 'Mint Chocolate',   color: '#CCEBE4' },
    { id: 'candy',      name: 'Candy Floss',      color: '#FBCFDD' }
  ];

  const TYPES = {
    pee:     { icon: 'potty',  img: 'pee',        cvar: '--c-pee' },
    poop:    { icon: 'poop',   img: 'poop',       cvar: '--c-poop' },
    breast:  { icon: 'heart',  img: 'breastfeed', cvar: '--c-breast' },
    formula: { icon: 'bottle', img: 'formula',    cvar: '--c-formula' },
    weight:  { icon: 'scale',  img: 'weight',     cvar: '--c-weight' }
  };

  // Folder gambar (relatif terhadap index.html): images/pee.png, poop.png, breastfeed.png, formula.png, banner.png
  // Kalau ekstensi file-mu bukan .png (misal .jpg / .webp), cukup ubah IMG_EXT di bawah.
  const IMG_DIR = 'images/', IMG_EXT = 'png';

  // label warna diambil dari terjemahan: pee_<id> / poop_<id>
  const PEE_COLORS = [
    { id: 'bening',     color: '#EAF3F6', light: true },
    { id: 'pucat',      color: '#F8EEA6', light: true },
    { id: 'kuning',     color: '#F3D33C', light: true },
    { id: 'kuning-tua', color: '#DDA019', light: true },
    { id: 'jingga',     color: '#E3792F' },
    { id: 'kemerahan',  color: '#E28C8C' },
    { id: 'cokelat',    color: '#8A5A2B' },
    { id: 'pesto',      color: '#7F8A3A' }
  ];

  const POOP_COLORS = [
    { id: 'kuning',       color: '#D6B12E', grain: true, light: true },
    { id: 'kuning-hijau', color: '#B5B83A', grain: true, light: true },
    { id: 'hijau',        color: '#5F9B3E' },
    { id: 'cokelat',      color: '#7B4B29' },
    { id: 'hijau-tua',    color: '#2E3A22' }
  ];

  const DEFAULT_FIELDS = {
    pee:     () => ({ color: 'pucat' }),
    poop:    () => ({ amount: 2, color: 'kuning' }),
    breast:  () => ({ ml: 0, min: 10 }),
    formula: () => ({ ml: 60 }),
    weight:  () => ({ kg: 5.00 })
  };

  const DEFAULT_SETTINGS = {
    theme: 'strawberry', font: 'fredoka', mode: 'auto', fontSize: 16, lang: 'id',
    babyName: '', birthDate: '', photo: '',
    fontAuto: false, prevFont: ''   // dipakai untuk otomatis ganti font saat bahasa Jepang
  };

  /* ---------- Terjemahan (Indonesia · English · 日本語) ---------- */
  // Tambah bahasa baru: salin satu blok, ganti isinya, lalu daftarkan di LANGS.
  // Teks boleh memakai {placeholder}, atau berupa fungsi bila butuh bentuk jamak.
  const I18N = {
    id: {
      appTitle: 'Catatan Si Kecil', appDesc: 'Catat pipis, BAB, ASI, dan susu formula si kecil dengan mudah.',
      babyDefault: 'Si Kecil',
      days: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
      daysShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
      months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      weekdays: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      dayTitle: '{dow}, {d} {monS}', fullDate: '{dow}, {d} {mon} {y}', monthYear: '{mon} {y}', yearOnly: '{y}',
      ageY: p => `${p.n} tahun`, ageM: p => `${p.n} bulan`, ageD: p => `${p.n} hari`, ageJoin: ' ',
      notBorn: 'Belum lahir pada tanggal ini', ageHint: 'Isi tanggal lahir di Pengaturan',
      count: p => `${p.n} catatan`, unitTimes: 'x',
      // aria / judul
      ariaDay: 'Catatan harian', ariaBackCal: 'Kembali ke kalender', ariaPrevDay: 'Hari sebelumnya', ariaNextDay: 'Hari berikutnya',
      ariaSettings: 'Pengaturan', chooseType: 'Pilih jenis catatan', ariaSummary: 'Ringkasan hari ini', ariaCalView: 'Kalender',
      ariaPrevMonth: 'Bulan sebelumnya', ariaNextMonth: 'Bulan berikutnya', ariaBack: 'Kembali',
      ariaAdd: 'Tambah catatan', ariaCancelDraft: 'Batalkan catatan',
      history: 'Riwayat', calendar: 'Kalender', settings: 'Pengaturan', today: 'Hari ini', open: 'Buka',
      // jenis catatan
      type_pee: 'Pipis', type_poop: 'BAB', type_breast: 'ASI', type_formula: 'Susu formula',
      types_pee: 'Pipis', types_poop: 'BAB', types_breast: 'ASI', types_formula: 'Formula',
      lblDuration: 'Durasi', lblBottleMl: 'ASI botol', unitMin: 'mnt',
      type_weight: 'Berat badan', types_weight: 'Berat', amtWeight: 'Berat badan', kgLess: 'Kurangi berat', kgMore: 'Tambah berat',
      amount_1: 'Sedikit', amount_2: 'Sedang', amount_3: 'Banyak',
      pee_bening: 'Bening', pee_pucat: 'Kuning pucat', pee_kuning: 'Kuning', 'pee_kuning-tua': 'Kuning tua',
      pee_jingga: 'Jingga / bata', pee_kemerahan: 'Kemerahan', pee_cokelat: 'Cokelat', pee_pesto: 'Pesto',
      poop_kuning: 'Kuning berbiji', 'poop_kuning-hijau': 'Kuning kehijauan berbiji', poop_hijau: 'Hijau',
      poop_cokelat: 'Cokelat', 'poop_hijau-tua': 'Hijau tua / kehitaman',
      // catatan
      emptyTitle: 'Belum ada catatan', emptyText: 'Tekan tombol + untuk menambahkan catatan pertama.',
      hintPick: 'Pilih salah satu ikon di atas: pipis, BAB, ASI, atau susu formula.',
      editEntry: p => `Ubah catatan ${p.type} pukul ${p.time}`, newEntry: 'Catatan baru', editDraft: 'Ubah catatan',
      time: 'Jam', cancel: 'Batal', save: 'Simpan', del: 'Hapus catatan',
      colorPee: 'Warna pipis', colorPoop: 'Warna BAB', amountLabel: 'Banyaknya', amountAria: 'Banyaknya BAB',
      amtBreast: 'Jumlah ASI', amtFormula: 'Jumlah susu formula', inMl: p => `${p.label} dalam mililiter`,
      notePh: 'Catatan (opsional)',
      saved: 'Catatan tersimpan', deleted: 'Catatan dihapus', undo: 'Urungkan',
      // kalender
      monthCount: p => `${p.n} catatan bulan ini`, monthNone: 'Belum ada catatan bulan ini',
      todaySuffix: ', hari ini', hasNotes: ', ada catatan', todayNone: 'belum ada catatan',
      // pengaturan
      sec_profile: 'Profil si kecil', lbl_name: 'Nama', ph_name: 'Nama si kecil', lbl_birth: 'Tanggal lahir', lbl_photo: 'Foto',
      photoAdd: 'Tambah foto si kecil', photoChange: 'Ganti foto si kecil', photoPick: 'Pilih foto', photoReplace: 'Ganti foto', photoRemove: 'Hapus foto',
      photoSaved: 'Foto tersimpan', photoRemoved: 'Foto dihapus', photoErr: 'Foto tidak bisa dibuka. Coba foto lain.',
      sec_lang: 'Bahasa',
      sec_colors: 'Warna aplikasi', lbl_mode: 'Mode', mode_light: 'Terang', mode_dark: 'Gelap', mode_auto: 'Otomatis',
      sec_text: 'Tulisan', lbl_font: 'Jenis huruf', lbl_size: 'Ukuran tulisan', sizeSmall: 'Kecil', sizeBig: 'Besar',
      preview: 'Si kecil minum ASI 80 ml jam 14.05.',
      sec_data: 'Data', btn_export: 'Unduh cadangan', btn_import: 'Pulihkan dari cadangan', btn_wipe: 'Hapus semua catatan',
      noteData: 'Catatan tersimpan di browser perangkat ini. Unduh cadangan secara berkala supaya data aman.',
      confirmWipe: 'Hapus semua catatan? Tindakan ini tidak bisa dibatalkan.',
      exported: 'Cadangan diunduh', imported: p => `${p.n} catatan dipulihkan`, importBad: 'File cadangan tidak valid', wiped: 'Semua catatan dihapus'
    },

    en: {
      appTitle: 'Little One’s Log', appDesc: 'Easily track your baby’s pee, poop, breast milk and formula.',
      babyDefault: 'Little One',
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      dayTitle: '{dowS}, {monS} {d}', fullDate: '{dow}, {mon} {d}, {y}', monthYear: '{mon} {y}', yearOnly: '{y}',
      ageY: p => `${p.n} ${p.n === 1 ? 'year' : 'years'}`, ageM: p => `${p.n} ${p.n === 1 ? 'month' : 'months'}`, ageD: p => `${p.n} ${p.n === 1 ? 'day' : 'days'}`, ageJoin: ' ',
      notBorn: 'Not born yet on this date', ageHint: 'Add a birth date in Settings',
      count: p => `${p.n} ${p.n === 1 ? 'note' : 'notes'}`, unitTimes: 'x',
      ariaDay: 'Daily log', ariaBackCal: 'Back to calendar', ariaPrevDay: 'Previous day', ariaNextDay: 'Next day',
      ariaSettings: 'Settings', chooseType: 'Choose a note type', ariaSummary: 'Today’s summary', ariaCalView: 'Calendar',
      ariaPrevMonth: 'Previous month', ariaNextMonth: 'Next month', ariaBack: 'Back',
      ariaAdd: 'Add a note', ariaCancelDraft: 'Cancel note',
      history: 'History', calendar: 'Calendar', settings: 'Settings', today: 'Today', open: 'Open',
      type_pee: 'Pee', type_poop: 'Poop', type_breast: 'Breast milk', type_formula: 'Formula',
      types_pee: 'Pee', types_poop: 'Poop', types_breast: 'Breast', types_formula: 'Formula',
      lblDuration: 'Duration', lblBottleMl: 'Bottle', unitMin: 'min',
      type_weight: 'Weight', types_weight: 'Weight', amtWeight: 'Weight', kgLess: 'Decrease weight', kgMore: 'Increase weight',
      amount_1: 'Small', amount_2: 'Medium', amount_3: 'Large',
      pee_bening: 'Clear', pee_pucat: 'Pale yellow', pee_kuning: 'Yellow', 'pee_kuning-tua': 'Dark yellow',
      pee_jingga: 'Orange / brick', pee_kemerahan: 'Reddish', pee_cokelat: 'Brown', pee_pesto: 'Pesto green',
      poop_kuning: 'Yellow, seedy', 'poop_kuning-hijau': 'Yellow-green, seedy', poop_hijau: 'Green',
      poop_cokelat: 'Brown', 'poop_hijau-tua': 'Dark green / blackish',
      emptyTitle: 'No notes yet', emptyText: 'Tap the + button to add your first note.',
      hintPick: 'Pick an icon above: pee, poop, breast milk or formula.',
      editEntry: p => `Edit ${p.type} note at ${p.time}`, newEntry: 'New note', editDraft: 'Edit note',
      time: 'Time', cancel: 'Cancel', save: 'Save', del: 'Delete note',
      colorPee: 'Pee color', colorPoop: 'Poop color', amountLabel: 'Amount', amountAria: 'Poop amount',
      amtBreast: 'Breast milk amount', amtFormula: 'Formula amount', inMl: p => `${p.label} in milliliters`,
      notePh: 'Note (optional)',
      saved: 'Note saved', deleted: 'Note deleted', undo: 'Undo',
      monthCount: p => `${p.n} ${p.n === 1 ? 'note' : 'notes'} this month`, monthNone: 'No notes this month',
      todaySuffix: ', today', hasNotes: ', has notes', todayNone: 'no notes yet',
      sec_profile: 'Baby profile', lbl_name: 'Name', ph_name: 'Baby’s name', lbl_birth: 'Date of birth', lbl_photo: 'Photo',
      photoAdd: 'Add baby photo', photoChange: 'Change baby photo', photoPick: 'Choose photo', photoReplace: 'Change photo', photoRemove: 'Remove photo',
      photoSaved: 'Photo saved', photoRemoved: 'Photo removed', photoErr: 'Couldn’t open that photo. Try another one.',
      sec_lang: 'Language',
      sec_colors: 'App colors', lbl_mode: 'Mode', mode_light: 'Light', mode_dark: 'Dark', mode_auto: 'Auto',
      sec_text: 'Text', lbl_font: 'Font', lbl_size: 'Text size', sizeSmall: 'Small', sizeBig: 'Large',
      preview: 'Baby had 80 ml of breast milk at 2:05 PM.',
      sec_data: 'Data', btn_export: 'Download backup', btn_import: 'Restore from backup', btn_wipe: 'Delete all notes',
      noteData: 'Notes are stored in this device’s browser. Download a backup regularly to keep your data safe.',
      confirmWipe: 'Delete all notes? This can’t be undone.',
      exported: 'Backup downloaded', imported: p => `${p.n} ${p.n === 1 ? 'note' : 'notes'} restored`, importBad: 'Invalid backup file', wiped: 'All notes deleted'
    },

    ja: {
      appTitle: '赤ちゃんノート', appDesc: 'おしっこ・うんち・母乳・粉ミルクをかんたんに記録できます。',
      babyDefault: '赤ちゃん',
      days: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      daysShort: ['日', '月', '火', '水', '木', '金', '土'],
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      weekdays: ['月', '火', '水', '木', '金', '土', '日'],
      dayTitle: '{monS}{d}日({dowS})', fullDate: '{y}年{mon}{d}日({dowS})', monthYear: '{y}年{mon}', yearOnly: '{y}年',
      ageY: p => `${p.n}歳`, ageM: p => `${p.n}か月`, ageD: p => `${p.n}日`, ageJoin: '',
      notBorn: 'この日はまだ生まれていません', ageHint: '設定で生年月日を入力してください',
      count: p => `${p.n}件`, unitTimes: '回',
      ariaDay: '1日の記録', ariaBackCal: 'カレンダーに戻る', ariaPrevDay: '前の日', ariaNextDay: '次の日',
      ariaSettings: '設定', chooseType: '記録の種類を選ぶ', ariaSummary: '今日のまとめ', ariaCalView: 'カレンダー',
      ariaPrevMonth: '前の月', ariaNextMonth: '次の月', ariaBack: '戻る',
      ariaAdd: '記録を追加', ariaCancelDraft: '記録をキャンセル',
      history: '履歴', calendar: 'カレンダー', settings: '設定', today: '今日', open: '開く',
      type_pee: 'おしっこ', type_poop: 'うんち', type_breast: '母乳', type_formula: '粉ミルク',
      types_pee: 'おしっこ', types_poop: 'うんち', types_breast: '母乳', types_formula: 'ミルク',
      lblDuration: '授乳時間', lblBottleMl: '哺乳瓶', unitMin: '分',
      type_weight: '体重', types_weight: '体重', amtWeight: '体重', kgLess: '体重を減らす', kgMore: '体重を増やす',
      amount_1: '少ない', amount_2: 'ふつう', amount_3: '多い',
      pee_bening: '透明', pee_pucat: '薄い黄色', pee_kuning: '黄色', 'pee_kuning-tua': '濃い黄色',
      pee_jingga: 'オレンジ・レンガ色', pee_kemerahan: '赤っぽい', pee_cokelat: '茶色', pee_pesto: '緑がかった色',
      poop_kuning: '黄色(つぶつぶ)', 'poop_kuning-hijau': '黄緑(つぶつぶ)', poop_hijau: '緑',
      poop_cokelat: '茶色', 'poop_hijau-tua': '濃い緑・黒っぽい',
      emptyTitle: 'まだ記録がありません', emptyText: '+ ボタンを押して最初の記録を追加しましょう。',
      hintPick: '上のアイコンから選んでください:おしっこ・うんち・母乳・粉ミルク',
      editEntry: p => `${p.time}の${p.type}の記録を編集`, newEntry: '新しい記録', editDraft: '記録を編集',
      time: '時刻', cancel: 'キャンセル', save: '保存', del: '記録を削除',
      colorPee: 'おしっこの色', colorPoop: 'うんちの色', amountLabel: '量', amountAria: 'うんちの量',
      amtBreast: '母乳の量', amtFormula: '粉ミルクの量', inMl: p => `${p.label}(ミリリットル)`,
      notePh: 'メモ(任意)',
      saved: '保存しました', deleted: '削除しました', undo: '元に戻す',
      monthCount: p => `今月 ${p.n}件`, monthNone: '今月はまだ記録がありません',
      todaySuffix: '、今日', hasNotes: '、記録あり', todayNone: 'まだ記録なし',
      sec_profile: '赤ちゃんのプロフィール', lbl_name: '名前', ph_name: '赤ちゃんの名前', lbl_birth: '生年月日', lbl_photo: '写真',
      photoAdd: '赤ちゃんの写真を追加', photoChange: '赤ちゃんの写真を変更', photoPick: '写真を選ぶ', photoReplace: '写真を変更', photoRemove: '写真を削除',
      photoSaved: '写真を保存しました', photoRemoved: '写真を削除しました', photoErr: '写真を開けませんでした。別の写真をお試しください。',
      sec_lang: '言語',
      sec_colors: 'アプリの色', lbl_mode: 'モード', mode_light: 'ライト', mode_dark: 'ダーク', mode_auto: '自動',
      sec_text: '文字', lbl_font: 'フォント', lbl_size: '文字サイズ', sizeSmall: '小', sizeBig: '大',
      preview: '14:05に母乳を80ml飲みました。',
      sec_data: 'データ', btn_export: 'バックアップをダウンロード', btn_import: 'バックアップから復元', btn_wipe: 'すべての記録を削除',
      noteData: '記録はこの端末のブラウザに保存されます。データを守るため、こまめにバックアップしてください。',
      confirmWipe: 'すべての記録を削除しますか?この操作は取り消せません。',
      exported: 'バックアップをダウンロードしました', imported: p => `${p.n}件を復元しました`, importBad: 'バックアップファイルが正しくありません', wiped: 'すべての記録を削除しました'
    }
  };
  const LANGS = [{ id: 'id', name: 'Indonesia' }, { id: 'en', name: 'English' }, { id: 'ja', name: '日本語' }];

  // Ukuran ml dan lain-lain tetap sama di semua bahasa
  const FONTS = [
    { id: 'fredoka',   name: 'Fredoka',           sample: 'Aa' },
    { id: 'comfortaa', name: 'Comfortaa',         sample: 'Aa' },
    { id: 'mplus',     name: 'M PLUS Rounded 1c', sample: 'Aaあ' },
    { id: 'kosugi',    name: 'Kosugi Maru',       sample: 'Aaあ' }
  ];

  /* ---------- Ikon (garis sederhana, 24x24) ---------- */
  const ICONS = {
    plus:    '<path d="M12 5v14M5 12h14"/>',
    back:    '<path d="M15 5l-7 7 7 7"/>',
    left:    '<path d="M15 5l-7 7 7 7"/>',
    right:   '<path d="M9 5l7 7-7 7"/>',
    up:      '<path d="M12 19V5M6 11l6-6 6 6"/>',
    check:   '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    clock:   '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    trash:   '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    minus:   '<path d="M5 12h14"/>',
    scale:   '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 10a4 3 0 0 1 8 0"/><path d="M12 10l1.5-1.5"/><path d="M9 16h6"/>',
    download:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    upload:  '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
    calendar:'<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10h16M9 3.5v4M15 3.5v4"/>',
    camera:  '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    heart:   '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    potty:   '<path d="M6.5 10.5V5.5A1.5 1.5 0 0 1 8 4h1"/><path d="M4 10.5h16"/><path d="M5 10.5c0 4.5 2.4 7.5 7 7.5s7-3 7-7.5"/><path d="M8 18.5L7 21h10l-1-2.5"/>',
    poop:    '<path d="M6.5 20.5a3.25 3.25 0 0 1 0-6.5h11a3.25 3.25 0 0 1 0 6.5z"/><path d="M8.5 14a3 3 0 0 1 0-6h7a3 3 0 0 1 0 6"/><path d="M9.5 8c0-2.3 1.7-3.7 3.9-5 .1 1.6.8 2.3 1.6 3.2.4.5.6 1 .6 1.8"/><circle cx="9.8" cy="17" r=".75" fill="currentColor" stroke="none"/><circle cx="14.2" cy="17" r=".75" fill="currentColor" stroke="none"/><path d="M10.7 18.5c.8.6 1.8.6 2.6 0"/>',
    bottle:  '<path d="M12 2.5c1.4 0 2 1 2 2.2V6h-4V4.7c0-1.2.6-2.2 2-2.2z"/><path d="M8.5 6h7v2.2h-7z"/><path d="M9 8.2V19a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8.2"/><path d="M12 11.5h3M12 14.5h3M12 17.5h3"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  // Gambar ikon jenis catatan. Kalau file gambar belum ada, otomatis kembali ke ikon garis.
  const tIcon = ty => `<img class="timg" src="${IMG_DIR}${TYPES[ty].img}.${IMG_EXT}" data-fb="${TYPES[ty].icon}" alt="" draggable="false">`;
  document.addEventListener('error', e => {
    const i = e.target;
    if (i && i.tagName === 'IMG' && i.dataset.fb) i.outerHTML = icon(i.dataset.fb);
  }, true);

  /* ---------- Util ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const dateKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const todayKey = () => dateKey(new Date());
  const nowTime = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { console.warn('Gagal menyimpan', e); }
  }

  /* ---------- State ---------- */
  const state = {
    records: [],
    settings: { ...DEFAULT_SETTINGS },
    date: todayKey(),
    cal: null,
    draft: null,
    draftEl: null,
    draftFresh: false,
    lastMain: '#/calendar',
    route: null
  };
  {
    const r = load(STORE.records, []);
    state.records = Array.isArray(r) ? r : [];
    state.settings = { ...DEFAULT_SETTINGS, ...load(STORE.settings, {}) };
    if (!I18N[state.settings.lang]) state.settings.lang = 'id';
  }
  const persist = () => save(STORE.records, state.records);
  const persistSettings = () => save(STORE.settings, state.settings);

  /* ---------- Terjemahan: fungsi bantu ---------- */
  function t(key, p) {
    const dict = I18N[state.settings.lang] || I18N.id;
    let v = dict[key] ?? I18N.id[key] ?? key;
    if (typeof v === 'function') return v(p || {});
    if (typeof v === 'string' && p) return v.replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : m));
    return v;
  }
  const tl = id => t('type_' + id);   // label panjang jenis catatan
  const ts = id => t('types_' + id);  // label pendek
  const fmtDate = (key, d) => t(key, {
    dow: t('days')[d.getDay()], dowS: t('daysShort')[d.getDay()],
    mon: t('months')[d.getMonth()], monS: t('monthsShort')[d.getMonth()],
    d: d.getDate(), y: d.getFullYear()
  });
  const isValidPhoto = s => typeof s === 'string' && /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(s);

  function applyStaticText() {
    document.documentElement.lang = state.settings.lang;
    document.title = t('appTitle');
    const md = $('meta[name="description"]'); if (md) md.content = t('appDesc');
    $$('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
    $$('[data-i18n-aria]').forEach(n => { n.setAttribute('aria-label', t(n.dataset.i18nAria)); });
    $('#cal-week').innerHTML = t('weekdays').map(d => `<span>${d}</span>`).join('');
    $('#chooser-box').innerHTML = Object.entries(TYPES).map(([id, ty], i) => `
      <button type="button" class="type-btn" data-type="${id}" style="--i:${i};--c:var(${ty.cvar})" aria-pressed="false">
        <span class="type-ic">${tIcon(id)}</span><span class="type-name">${esc(ts(id))}</span>
      </button>`).join('');
    syncChooser();
    setFab(!!state.draft);
  }

  const views = { day: $('#view-day'), cal: $('#view-cal'), settings: $('#view-settings') };
  const fab = $('#fab');
  const chooser = $('#chooser');
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false, addEventListener() {} };

  /* ---------- Pengaturan tampilan ---------- */
  function applySettings() {
    const s = state.settings, root = document.documentElement;
    s.fontSize = clamp(Number(s.fontSize) || 16, 13, 24);
    root.style.fontSize = s.fontSize + 'px';
    root.dataset.theme = THEMES.some(x => x.id === s.theme) ? s.theme : 'strawberry';
    root.dataset.font = FONTS.some(f => f.id === s.font) ? s.font : 'fredoka';
    const dark = s.mode === 'dark' || (s.mode === 'auto' && mq.matches);
    root.dataset.mode = dark ? 'dark' : 'light';
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#131218' : (THEMES.find(x => x.id === root.dataset.theme) || THEMES[0]).color;
  }
  mq.addEventListener && mq.addEventListener('change', () => { if (state.settings.mode === 'auto') applySettings(); });

  // Ganti bahasa. Saat masuk bahasa Jepang, font otomatis jadi M PLUS Rounded 1c;
  // saat keluar dari Jepang, font kembali ke pilihan sebelumnya (kalau tadi diganti otomatis).
  function setLanguage(lang) {
    const s = state.settings, old = s.lang;
    if (!I18N[lang] || lang === old) return;
    s.lang = lang;
    if (lang === 'ja') {
      if (s.font !== 'mplus') { s.prevFont = s.font; s.font = 'mplus'; s.fontAuto = true; }
    } else if (old === 'ja' && s.fontAuto && s.font === 'mplus') {
      s.font = s.prevFont || 'fredoka'; s.fontAuto = false; s.prevFont = '';
    }
    persistSettings();
    applySettings();
    applyStaticText();
    renderCurrent();
  }

  function renderCurrent() {
    if (state.route === 'day') renderDay();
    else if (state.route === 'cal') renderCal();
    else if (state.route === 'settings') renderSettings();
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function hideToast() { $('#toast').classList.remove('show'); }
  function toast(msg, actionLabel, action) {
    const tt = $('#toast');
    tt.innerHTML = `<span>${esc(msg)}</span>${actionLabel ? `<button type="button">${esc(actionLabel)}</button>` : ''}`;
    const b = $('button', tt);
    if (b) b.onclick = () => { hideToast(); action && action(); };
    tt.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, actionLabel ? 5000 : 2400);
  }

  /* ---------- Router (hash) ---------- */
  function show(name, dir) {
    Object.entries(views).forEach(([k, v]) => { v.hidden = k !== name; v.classList.remove('from-left', 'from-right'); });
    views[name].classList.add(dir);
    fab.classList.toggle('is-hidden', name !== 'day');
    window.scrollTo(0, 0);
  }

  function route() {
    const hash = location.hash;
    let m;
    if ((m = hash.match(/^#\/day\/(\d{4}-\d{2}-\d{2})$/))) {
      const goingBack = state.route === 'day' && m[1] < state.date;
      discardDraft(false);
      state.date = m[1]; state.lastMain = hash; state.route = 'day';
      renderDay();
      show('day', goingBack ? 'from-left' : 'from-right');
    } else if (hash === '#/calendar') {
      discardDraft(false);
      const d = parseKey(state.date);
      state.cal = { y: d.getFullYear(), m: d.getMonth() };
      state.lastMain = hash; state.route = 'cal';
      renderCal();
      show('cal', 'from-left');
    } else if (hash === '#/settings') {
      discardDraft(false);
      state.route = 'settings';
      renderSettings();
      show('settings', 'from-right');
    } else {
      history.replaceState(null, '', '#/day/' + todayKey());
      route();
    }
  }
  const go = h => { location.hash = h; };

  /* =====================================================
     HALAMAN DATA
     ===================================================== */
  function ageText(birthKey, atKey) {
    if (!birthKey) return '';
    const b = parseKey(birthKey), a = parseKey(atKey);
    if (a < b) return t('notBorn');
    let months = (a.getFullYear() - b.getFullYear()) * 12 + a.getMonth() - b.getMonth();
    let days = a.getDate() - b.getDate();
    if (days < 0) { months--; days += new Date(a.getFullYear(), a.getMonth(), 0).getDate(); }
    if (months < 1) return t('ageD', { n: Math.round((a - b) / 864e5) });
    const y = Math.floor(months / 12), mo = months % 12;
    return [y && t('ageY', { n: y }), mo && t('ageM', { n: mo }), days && t('ageD', { n: days })].filter(Boolean).join(t('ageJoin'));
  }

  function avatarHTML(cls = '') {
    const s = state.settings;
    const name = s.babyName.trim() || t('babyDefault');
    const inner = isValidPhoto(s.photo)
      ? `<img src="${s.photo}" alt="">`
      : `<span aria-hidden="true">${esc([...name][0].toUpperCase())}</span>`;
    return `<button type="button" class="avatar ${cls}" data-act="photo" aria-label="${esc(t(s.photo ? 'photoChange' : 'photoAdd'))}">${inner}<span class="avatar-cam">${icon('camera')}</span></button>`;
  }

  function renderBaby() {
    const s = state.settings;
    const name = s.babyName.trim() || t('babyDefault');
    const age = ageText(s.birthDate, state.date);
    $('#baby-card').innerHTML = `
      ${avatarHTML()}
      <div class="baby-info">
        <div class="baby-name">${esc(name)}</div>
        <div class="baby-age">${esc(age || t('ageHint'))}</div>
      </div>`;
  }

  function renderSummary() {
    const rs = state.records.filter(r => r.date === state.date);
    const cnt = ty => rs.filter(r => r.type === ty).length;
    const sum = (ty, k = 'ml') => rs.filter(r => r.type === ty).reduce((a, r) => a + (Number(r[k]) || 0), 0);
    const bMl = sum('breast'), bMin = sum('breast', 'min');
    const tile = (ty, v, unit, label = tl(ty), cls = '') => `
      <div class="tile ${cls}" style="--c:var(${TYPES[ty].cvar})">
        <div class="ic">${tIcon(ty)}</div>
        <div><div class="tile-v">${v}${unit ? `<small>${esc(unit)}</small>` : ''}</div><div class="tile-l">${esc(label)}</div></div>
      </div>`;
    // berat terakhir yang tercatat pada/sebelum tanggal yang dibuka
    const lastW = state.records
      .filter(r => r.type === 'weight' && r.date <= state.date)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time) || (a.created || 0) - (b.created || 0))
      .pop();
    const wLabel = lastW && lastW.date !== state.date ? `${tl('weight')} · ${fmtDate('dayTitle', parseKey(lastW.date))}` : tl('weight');
    $('#summary').innerHTML =
      tile('pee', cnt('pee'), t('unitTimes')) +
      tile('poop', cnt('poop'), t('unitTimes')) +
      tile('breast', bMin, t('unitMin'), bMl ? `${tl('breast')} · ${bMl} ml` : tl('breast')) +
      tile('formula', sum('formula'), 'ml') +
      tile('weight', lastW ? Number(lastW.kg).toFixed(2) : '–', lastW ? 'kg' : '', wLabel, 'wide');
  }

  function renderDay() {
    const d = parseKey(state.date), isToday = state.date === todayKey();
    $('#day-title').textContent = fmtDate('dayTitle', d);
    $('#day-sub').innerHTML = `${esc(fmtDate('yearOnly', d))}${isToday ? `<span class="badge">${esc(t('today'))}</span>` : ''}`;
    $('#day-next').disabled = state.date >= todayKey();
    renderBaby();
    renderSummary();
    renderList(true);
  }

  function entryDetail(r) {
    const dot = c => `<span class="dot${c.grain ? ' grain' : ''}" style="--sw:${c.color}"></span>`;
    if (r.type === 'pee') {
      const c = PEE_COLORS.find(x => x.id === r.color);
      return c ? `${dot(c)}<span>${esc(t('pee_' + c.id))}</span>` : '';
    }
    if (r.type === 'poop') {
      const c = POOP_COLORS.find(x => x.id === r.color);
      return `<b>${esc(r.amount ? t('amount_' + r.amount) : '')}</b>${c ? `<span class="sep">·</span>${dot(c)}<span>${esc(t('poop_' + c.id))}</span>` : ''}`;
    }
    if (r.type === 'breast') {
      const parts = [];
      if (Number(r.min) > 0) parts.push(`<span><b>${r.min}</b> ${esc(t('unitMin'))}</span>`);
      if (Number(r.ml) > 0) parts.push(`<span><b>${r.ml}</b> ml</span>`);
      return parts.join('<span class="sep">·</span>');
    }
    if (r.type === 'weight') return `<span><b>${Number(r.kg).toFixed(2)}</b> kg</span>`;
    return `<span><b>${r.ml}</b> ml</span>`;
  }

  function buildEntry(r, n, flash) {
    const ty = TYPES[r.type];
    const node = el(`
      <article class="entry${flash ? ' flash' : ''}" tabindex="0" role="button" style="--c:var(${ty.cvar});--n:${Math.min(n, 10)}" aria-label="${esc(t('editEntry', { type: tl(r.type), time: r.time }))}">
        <div class="ic">${tIcon(r.type)}</div>
        <div class="entry-main">
          <div class="entry-title">${esc(tl(r.type))}</div>
          <div class="entry-detail">${entryDetail(r)}</div>
          ${r.note ? `<div class="entry-note">${esc(r.note)}</div>` : ''}
        </div>
        <div class="entry-side">
          ${r.type === 'weight' ? '' : `<time class="entry-time">${r.time}</time>`}
          <button type="button" class="del" aria-label="${esc(t('del'))}">${icon('trash')}</button>
        </div>
      </article>`);
    node.addEventListener('click', e => {
      if (e.target.closest('.del')) { e.stopPropagation(); deleteRecord(r.id); return; }
      openEdit(r.id);
    });
    node.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target === node) openEdit(r.id); });
    return node;
  }

  function renderList(animate = false, flashId = null) {
    const list = $('#list');
    const items = state.records
      .filter(r => r.date === state.date)
      .sort((a, b) => b.time.localeCompare(a.time) || (b.created || 0) - (a.created || 0));
    $('#list-count').textContent = items.length ? t('count', { n: items.length }) : '';
    list.classList.toggle('stagger', animate);
    list.innerHTML = '';
    state.draftEl = null;

    if (state.draft && state.draft.isNew) list.appendChild(buildDraftCard());
    items.forEach((r, i) => {
      if (state.draft && !state.draft.isNew && state.draft.id === r.id) list.appendChild(buildDraftCard());
      else list.appendChild(buildEntry(r, i, r.id === flashId));
    });

    if (!items.length && !state.draft) {
      list.appendChild(el(`
        <div class="empty">
          <div class="ic-big">${tIcon('formula')}</div>
          <strong>${esc(t('emptyTitle'))}</strong>
          ${esc(t('emptyText'))}
        </div>`));
    }
    if (state.draftEl) mountBody();
  }

  /* ---------- Tombol + dan pilihan jenis ---------- */
  function setFab(active) {
    fab.classList.toggle('active', active);
    fab.setAttribute('aria-expanded', String(active));
    fab.setAttribute('aria-label', t(active ? 'ariaCancelDraft' : 'ariaAdd'));
  }
  function setChooser(open) {
    chooser.classList.toggle('open', open);
    chooser.setAttribute('aria-hidden', String(!open));
    chooser.inert = !open;
    syncChooser();
  }
  function syncChooser() {
    $$('.type-btn').forEach(b => b.setAttribute('aria-pressed', String(!!state.draft && state.draft.type === b.dataset.type)));
  }

  function startDraft() {
    state.draft = { isNew: true, date: state.date, time: nowTime(), type: null, note: '' };
    state.draftFresh = true;
    setChooser(true);
    setFab(true);
    renderList(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function discardDraft(rerender = true) {
    const had = !!state.draft;
    state.draft = null; state.draftEl = null; state.draftFresh = false;
    setChooser(false);
    setFab(false);
    if (had && rerender) renderList(false);
  }

  function setType(type) {
    const d = state.draft;
    if (!d || !d.isNew || d.type === type) return;
    ['color', 'amount', 'ml', 'kg', 'min'].forEach(k => delete d[k]);
    d.type = type;
    Object.assign(d, DEFAULT_FIELDS[type]());
    syncChooser();
    if (state.draftEl) {
      state.draftEl.style.setProperty('--c', `var(${TYPES[type].cvar})`);
      $('[data-role="type"]', state.draftEl).innerHTML = typeHead(d);
      mountBody();
    }
  }

  function openEdit(id) {
    const r = state.records.find(x => x.id === id);
    if (!r) return;
    discardDraft(false);
    state.draft = { ...r, isNew: false, note: r.note || '' };
    setFab(true);
    renderList(false);
    if (state.draftEl && state.draftEl.scrollIntoView) state.draftEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function typeHead(d) {
    if (!d.type) return `<span class="ic sm">${icon('up')}</span><span>${esc(t('chooseType'))}</span>`;
    return `<span class="ic sm">${tIcon(d.type)}</span><span>${esc(tl(d.type))}</span>`;
  }

  /* ---------- Kartu isi data ---------- */
  function buildDraftCard() {
    const d = state.draft;
    const style = d.type ? ` style="--c:var(${TYPES[d.type].cvar})"` : '';
    const card = el(`
      <section class="draft${state.draftFresh ? ' enter' : ''}"${style} aria-label="${esc(t(d.isNew ? 'newEntry' : 'editDraft'))}">
        <div class="draft-head">
          <label class="time-pill">${icon('clock')}<input class="time-input" type="time" value="${d.time}" aria-label="${esc(t('time'))}" required></label>
          <div class="draft-type" data-role="type">${typeHead(d)}</div>
        </div>
        <div data-role="body"></div>
        <div class="draft-actions">
          <button type="button" class="btn ghost" data-act="cancel">${esc(t('cancel'))}</button>
          <button type="button" class="btn primary" data-act="save">${icon('check')}${esc(t('save'))}</button>
        </div>
      </section>`);
    state.draftFresh = false;
    state.draftEl = card;
    $('.time-input', card).addEventListener('input', e => { if (e.target.value) d.time = e.target.value; });
    card.addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'cancel') discardDraft(true); else saveDraft();
    });
    return card;
  }

  function colorField(label, list, selected, prefix) {
    const sel = list.find(c => c.id === selected);
    const nm = c => t(prefix + c.id);
    return `
      <div class="field" data-field="color">
        <div class="field-head"><span class="field-label">${esc(label)}</span><span class="field-value" data-role="color-name">${sel ? esc(nm(sel)) : ''}</span></div>
        <div class="swatches" role="radiogroup" aria-label="${esc(label)}">
          ${list.map(c => `<button type="button" role="radio" aria-checked="${c.id === selected}" class="swatch${c.light ? ' light' : ''}${c.grain ? ' grain' : ''}" data-id="${c.id}" style="--sw:${c.color}" title="${esc(nm(c))}" aria-label="${esc(nm(c))}">${icon('check')}</button>`).join('')}
        </div>
      </div>`;
  }

  function amountField(level) {
    return `
      <div class="field" data-field="amount">
        <div class="field-head"><span class="field-label">${esc(t('amountLabel'))}</span><span class="field-value" data-role="amount-name">${esc(t('amount_' + level))}</span></div>
        <div class="amount" role="radiogroup" aria-label="${esc(t('amountAria'))}" data-level="${level}">
          ${[1, 2, 3].map(v => `<button type="button" role="radio" aria-checked="${v === level}" data-v="${v}"><span class="bar"></span>${esc(t('amount_' + v))}</button>`).join('')}
        </div>
      </div>`;
  }

  const fmtVal = (v, unit, zero) => (zero && !v) ? '–' : `${v} ${unit}`;

  function wheelField(label, value, o = {}) {
    const { min = ML_MIN, max = ML_MAX, step = ML_STEP, unit = 'ml', key = 'ml', zero = false } = o;
    const vals = [];
    for (let v = min; v <= max; v += step) vals.push(v);
    return `
      <div class="field" data-field="${key}">
        <div class="field-head"><span class="field-label">${esc(label)}</span><span class="field-value" data-role="${key}-val">${esc(fmtVal(value, unit, zero))}</span></div>
        <div class="wheel" data-key="${key}" data-unit="${esc(unit)}" data-zero="${zero ? 1 : 0}">
          <div class="wheel-band"></div>
          <div class="wheel-scroll" tabindex="0" role="spinbutton" aria-label="${esc(label + ' (' + unit + ')')}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${value}">
            <div class="wheel-pad"></div>
            ${vals.map(v => `<div class="wheel-item" data-v="${v}">${zero && v === 0 ? '–' : v}</div>`).join('')}
            <div class="wheel-pad"></div>
          </div>
          <span class="wheel-unit">${esc(unit)}</span>
        </div>
      </div>`;
  }

  /* ---------- Berat badan ---------- */
  const KG_MIN = 0.5, KG_MAX = 30, KG_STEP = 0.05;
  const round2 = v => Math.round(v * 100) / 100;

  function weightField(value) {
    return `
      <div class="field" data-field="kg">
        <div class="field-head"><span class="field-label">${esc(t('amtWeight'))}</span></div>
        <div class="kg-box">
          <button type="button" class="kg-btn" data-kg="-1" aria-label="${esc(t('kgLess'))}">${icon('minus')}</button>
          <label class="kg-val">
            <input class="kg-input" type="number" inputmode="decimal" min="${KG_MIN}" max="${KG_MAX}" step="0.01" value="${Number(value).toFixed(2)}" aria-label="${esc(t('amtWeight'))}">
            <span class="kg-unit">kg</span>
          </label>
          <button type="button" class="kg-btn" data-kg="1" aria-label="${esc(t('kgMore'))}">${icon('plus')}</button>
        </div>
      </div>`;
  }

  function mountBody() {
    const d = state.draft, card = state.draftEl;
    if (!d || !card) return;
    const body = $('[data-role="body"]', card);
    const saveBtn = $('[data-act="save"]', card);
    const tp = $('.time-pill', card); if (tp) tp.hidden = d.type === 'weight';   // berat badan: cukup tanggal

    if (!d.type) {
      body.innerHTML = `<div class="hint">${icon('up')}<span>${esc(t('hintPick'))}</span></div>`;
      saveBtn.disabled = true;
      return;
    }

    let html = '';
    if (d.type === 'pee') html = colorField(t('colorPee'), PEE_COLORS, d.color, 'pee_');
    if (d.type === 'poop') html = amountField(d.amount) + colorField(t('colorPoop'), POOP_COLORS, d.color, 'poop_');
    if (d.type === 'breast') html = `<div class="wheel-pair">${
      wheelField(t('lblDuration'), d.min || 0, { key: 'min', min: 0, max: 60, step: 1, unit: t('unitMin'), zero: true })}${
      wheelField(t('lblBottleMl'), d.ml || 0, { key: 'ml', min: 0, unit: 'ml', zero: true })}</div>`;
    if (d.type === 'formula') html = wheelField(t('amtFormula'), d.ml);
    if (d.type === 'weight') html = weightField(d.kg);
    if (d.type !== 'weight') html += `<div class="field"><input class="input" type="text" data-role="note" maxlength="140" placeholder="${esc(t('notePh'))}" value="${esc(d.note || '')}"></div>`;

    body.innerHTML = html;
    body.classList.remove('swap-in'); void body.offsetWidth; body.classList.add('swap-in');
    saveBtn.disabled = false;

    // warna
    const sw = $('.swatches', body);
    if (sw) {
      const prefix = d.type === 'pee' ? 'pee_' : 'poop_';
      sw.addEventListener('click', e => {
        const b = e.target.closest('.swatch');
        if (!b) return;
        d.color = b.dataset.id;
        $$('.swatch', sw).forEach(x => x.setAttribute('aria-checked', String(x === b)));
        $('[data-role="color-name"]', body).textContent = t(prefix + d.color);
      });
    }

    // banyaknya BAB
    const am = $('.amount', body);
    if (am) am.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      d.amount = Number(b.dataset.v);
      am.dataset.level = d.amount;
      $$('button', am).forEach(x => x.setAttribute('aria-checked', String(x === b)));
      $('[data-role="amount-name"]', body).textContent = t('amount_' + d.amount);
    });

    // roda pilih (menit / ml)
    $$('.wheel', body).forEach(wheel => {
      const key = wheel.dataset.key, unit = wheel.dataset.unit, zero = wheel.dataset.zero === '1';
      initWheel(wheel, d[key], v => {
        d[key] = v;
        $(`[data-role="${key}-val"]`, body).textContent = fmtVal(v, unit, zero);
        $('.wheel-scroll', wheel).setAttribute('aria-valuenow', v);
      });
    });

    // catatan
    const noteIn = $('[data-role="note"]', body);
    if (noteIn) noteIn.addEventListener('input', e => { d.note = e.target.value; });

    // berat badan
    const kgBox = $('.kg-box', body);
    if (kgBox) {
      const inp = $('.kg-input', kgBox);
      const setKg = v => { d.kg = round2(clamp(v, KG_MIN, KG_MAX)); inp.value = d.kg.toFixed(2); };
      kgBox.addEventListener('click', e => { const b = e.target.closest('.kg-btn'); if (b) setKg(d.kg + Number(b.dataset.kg) * KG_STEP); });
      inp.addEventListener('input', () => { const v = parseFloat(inp.value); if (v >= KG_MIN && v <= KG_MAX) d.kg = round2(v); });
      inp.addEventListener('change', () => { const v = parseFloat(inp.value); setKg(isNaN(v) ? d.kg : v); });
      inp.addEventListener('focus', () => inp.select());
    }
  }

  /* ---------- Roda pilih (gaya alarm iPhone) ---------- */
  function initWheel(root, value, onChange) {
    const sc = $('.wheel-scroll', root);
    const items = $$('.wheel-item', root);
    const itemH = () => items[0].offsetHeight || 1;
    let last = -1, ready = false, raf = 0;

    const paint = () => {
      raf = 0;
      const pos = sc.scrollTop / itemH();
      items.forEach((it, i) => {
        const dist = i - pos, a = Math.min(Math.abs(dist), 3);
        it.style.transform = `perspective(20rem) rotateX(${(-dist * 20).toFixed(1)}deg) scale(${(1 - a * 0.1).toFixed(3)})`;
        it.style.opacity = (1 - a * 0.26).toFixed(2);
        it.classList.toggle('on', Math.abs(dist) < 0.5);
      });
      const idx = clamp(Math.round(pos), 0, items.length - 1);
      if (idx !== last) {
        last = idx;
        onChange(Number(items[idx].dataset.v));
        if (ready && navigator.vibrate) navigator.vibrate(4);
      }
    };

    sc.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
    items.forEach((it, i) => it.addEventListener('click', () => sc.scrollTo({ top: i * itemH(), behavior: 'smooth' })));
    sc.addEventListener('keydown', e => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      sc.scrollTo({ top: clamp(last + (e.key === 'ArrowDown' ? 1 : -1), 0, items.length - 1) * itemH(), behavior: 'smooth' });
    });

    let start = items.findIndex(it => Number(it.dataset.v) === Number(value));
    if (start < 0) start = 0;
    sc.scrollTop = start * itemH();
    paint();
    ready = true;
  }

  /* ---------- Simpan / hapus ---------- */
  function saveDraft() {
    const d = state.draft;
    if (!d || !d.type) return;
    const rec = {
      id: d.id || uid(), created: d.created || Date.now(),
      date: d.date, time: d.time || nowTime(), type: d.type, note: (d.note || '').trim()
    };
    if (d.type === 'pee') rec.color = d.color;
    if (d.type === 'poop') { rec.amount = d.amount; rec.color = d.color; }
    if (d.type === 'breast' || d.type === 'formula') rec.ml = d.ml;
    if (d.type === 'breast') rec.min = d.min;
    if (d.type === 'weight') rec.kg = d.kg;

    if (d.isNew) state.records.push(rec);
    else { const i = state.records.findIndex(r => r.id === rec.id); if (i >= 0) state.records[i] = rec; }
    persist();
    state.draft = null; state.draftEl = null;
    setChooser(false);
    setFab(false);
    renderSummary();
    renderList(false, rec.id);
    toast(t('saved'));
  }

  function deleteRecord(id) {
    const i = state.records.findIndex(r => r.id === id);
    if (i < 0) return;
    const [rec] = state.records.splice(i, 1);
    persist();
    renderSummary();
    renderList(false);
    toast(t('deleted'), t('undo'), () => {
      state.records.push(rec);
      persist();
      renderSummary();
      renderList(false, rec.id);
    });
  }

  /* ---------- Foto si kecil ---------- */
  // Foto dipotong persegi & dikecilkan (320px) supaya hemat tempat penyimpanan.
  function processPhoto(file) {
    if (!file || !/^image\//.test(file.type)) { toast(t('photoErr')); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const S = 320, c = document.createElement('canvas');
      c.width = c.height = S;
      const w = img.naturalWidth, h = img.naturalHeight, m = Math.min(w, h);
      c.getContext('2d').drawImage(img, (w - m) / 2, (h - m) / 2, m, m, 0, 0, S, S);
      URL.revokeObjectURL(url);
      state.settings.photo = c.toDataURL('image/jpeg', 0.86);
      persistSettings();
      refreshProfile();
      toast(t('photoSaved'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast(t('photoErr')); };
    img.src = url;
  }
  function removePhoto() {
    state.settings.photo = '';
    persistSettings();
    refreshProfile();
    toast(t('photoRemoved'));
  }
  function refreshProfile() {
    if (state.route === 'settings') renderSettings();
    else if (state.route === 'day') renderBaby();
  }

  /* =====================================================
     KALENDER
     ===================================================== */
  function renderCal(dir = 0) {
    const { y, m } = state.cal;
    $('#cal-month').textContent = fmtDate('monthYear', new Date(y, m, 1));

    const byDate = {};
    let monthCount = 0;
    const prefix = `${y}-${pad(m + 1)}-`;
    state.records.forEach(r => {
      (byDate[r.date] = byDate[r.date] || new Set()).add(r.type);
      if (r.date.startsWith(prefix)) monthCount++;
    });
    $('#cal-sub').textContent = monthCount ? t('monthCount', { n: monthCount }) : t('monthNone');

    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    const total = Math.ceil((offset + new Date(y, m + 1, 0).getDate()) / 7) * 7;
    const tk = todayKey();
    let html = '';
    for (let i = 0; i < total; i++) {
      const d = new Date(y, m, 1 - offset + i), k = dateKey(d), types = byDate[k];
      const cls = ['cal-day', d.getMonth() !== m && 'muted', k === tk && 'today', k === state.date && 'selected', d.getDay() === 0 && 'sun'].filter(Boolean).join(' ');
      const dots = types ? Object.keys(TYPES).filter(ty => types.has(ty)).map(ty => `<i style="--c:var(${TYPES[ty].cvar})"></i>`).join('') : '';
      const label = fmtDate('fullDate', d) + (k === tk ? t('todaySuffix') : '') + (types ? t('hasNotes') : '');
      html += `<button type="button" class="${cls}" data-date="${k}"${k === tk ? ' aria-current="date"' : ''} aria-label="${esc(label)}"><span>${d.getDate()}</span><span class="dots">${dots}</span></button>`;
    }
    const grid = $('#cal-grid');
    grid.innerHTML = html;
    if (dir) { grid.style.setProperty('--dir', dir); grid.classList.remove('swap'); void grid.offsetWidth; grid.classList.add('swap'); }

    $('#legend').innerHTML = Object.keys(TYPES).map(ty => `<span style="--c:var(${TYPES[ty].cvar})"><i></i>${esc(tl(ty))}</span>`).join('');

    const now = new Date();
    const todayCount = state.records.filter(r => r.date === tk).length;
    $('#today-card').innerHTML = `
      <div class="ic">${icon('calendar')}</div>
      <div class="grow">
        <strong>${esc(t('today'))}</strong>
        <small>${esc(fmtDate('fullDate', now))} · ${esc(todayCount ? t('count', { n: todayCount }) : t('todayNone'))}</small>
      </div>
      <button type="button" class="btn soft" data-open-today>${esc(t('open'))}</button>`;
  }

  function shiftMonth(delta) {
    const d = new Date(state.cal.y, state.cal.m + delta, 1);
    state.cal = { y: d.getFullYear(), m: d.getMonth() };
    renderCal(delta);
  }

  /* =====================================================
     PENGATURAN
     ===================================================== */
  function renderSettings() {
    const s = state.settings;
    const hasPhoto = isValidPhoto(s.photo);
    $('#settings-body').innerHTML = `
      <section class="card">
        <h3>${esc(t('sec_profile'))}</h3>
        <div class="row"><span class="row-label">${esc(t('lbl_photo'))}</span>
          <div class="photo-row">
            ${avatarHTML('lg')}
            <div class="photo-actions">
              <button type="button" class="btn soft" data-photo="pick">${icon('camera')}${esc(t(hasPhoto ? 'photoReplace' : 'photoPick'))}</button>
              ${hasPhoto ? `<button type="button" class="btn danger" data-photo="remove">${icon('trash')}${esc(t('photoRemove'))}</button>` : ''}
            </div>
          </div>
        </div>
        <div class="row"><label for="set-name">${esc(t('lbl_name'))}</label>
          <input id="set-name" class="input" type="text" maxlength="30" placeholder="${esc(t('ph_name'))}" value="${esc(s.babyName)}"></div>
        <div class="row"><label for="set-birth">${esc(t('lbl_birth'))}</label>
          <input id="set-birth" class="input" type="date" max="${todayKey()}" value="${esc(s.birthDate)}"></div>
      </section>

      <section class="card">
        <h3>${esc(t('sec_lang'))}</h3>
        <div class="seg" role="group" aria-label="${esc(t('sec_lang'))}">
          ${LANGS.map(l => `<button type="button" lang="${l.id}" data-setting="lang" data-value="${l.id}">${esc(l.name)}</button>`).join('')}
        </div>
      </section>

      <section class="card">
        <h3>${esc(t('sec_colors'))}</h3>
        <div class="row">
          <div class="themes">
            ${THEMES.map(x => `<button type="button" class="theme-btn" data-setting="theme" data-value="${x.id}" style="--sw:${x.color}"><i></i>${esc(x.name)}</button>`).join('')}
          </div>
        </div>
        <div class="row"><span class="row-label">${esc(t('lbl_mode'))}</span>
          <div class="seg">
            <button type="button" data-setting="mode" data-value="light">${esc(t('mode_light'))}</button>
            <button type="button" data-setting="mode" data-value="dark">${esc(t('mode_dark'))}</button>
            <button type="button" data-setting="mode" data-value="auto">${esc(t('mode_auto'))}</button>
          </div>
        </div>
      </section>

      <section class="card">
        <h3>${esc(t('sec_text'))}</h3>
        <div class="row"><span class="row-label">${esc(t('lbl_font'))}</span>
          <div class="font-opts">
            ${FONTS.map(f => `<button type="button" class="font-btn" data-setting="font" data-value="${f.id}"><span class="aa">${f.sample}</span><span class="nm">${f.name}</span></button>`).join('')}
          </div>
        </div>
        <div class="row">
          <span class="row-label">${esc(t('lbl_size'))} <b id="size-val">${s.fontSize} px</b></span>
          <input id="set-size" class="range" type="range" min="13" max="24" step="1" value="${s.fontSize}" aria-label="${esc(t('lbl_size'))}">
          <div class="range-ends" aria-hidden="true"><span>${esc(t('sizeSmall'))}</span><span>${esc(t('sizeBig'))}</span></div>
          <div class="preview">${esc(t('preview'))}</div>
        </div>
      </section>

      <section class="card">
        <h3>${esc(t('sec_data'))}</h3>
        <div class="btn-stack">
          <button type="button" class="btn soft" data-data="export">${icon('download')}${esc(t('btn_export'))}</button>
          <button type="button" class="btn soft" data-data="import">${icon('upload')}${esc(t('btn_import'))}</button>
          <button type="button" class="btn danger" data-data="wipe">${icon('trash')}${esc(t('btn_wipe'))}</button>
        </div>
        <p class="note">${esc(t('noteData'))}</p>
      </section>`;
    syncSettingsUI();
  }

  function syncSettingsUI() {
    $$('[data-setting]').forEach(b => b.setAttribute('aria-pressed', String(state.settings[b.dataset.setting] === b.dataset.value)));
    const r = $('#set-size');
    if (r) {
      r.style.setProperty('--pct', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
      $('#size-val').textContent = `${r.value} px`;
    }
  }

  function exportData() {
    const payload = { app: 'catatan-si-kecil', version: 1, exportedAt: new Date().toISOString(), settings: state.settings, records: state.records };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    a.download = `catatan-si-kecil-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(t('exported'));
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const incoming = (Array.isArray(data) ? data : data.records) || [];
        const valid = incoming.filter(r => r && typeof r.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && /^\d{2}:\d{2}$/.test(r.time) && TYPES[r.type]);
        const have = new Set(state.records.map(r => r.id));
        const fresh = valid.filter(r => !have.has(r.id));
        state.records.push(...fresh);
        persist();

        // profil (nama, tanggal lahir, foto) dipulihkan hanya kalau di perangkat ini masih kosong
        const st = !Array.isArray(data) && data.settings;
        if (st && typeof st === 'object') {
          const s = state.settings;
          if (!s.babyName && typeof st.babyName === 'string') s.babyName = st.babyName.slice(0, 30);
          if (!s.birthDate && /^\d{4}-\d{2}-\d{2}$/.test(st.birthDate || '')) s.birthDate = st.birthDate;
          if (!s.photo && isValidPhoto(st.photo)) s.photo = st.photo;
          persistSettings();
          if (state.route === 'settings') renderSettings();
        }
        toast(t('imported', { n: fresh.length }));
      } catch { toast(t('importBad')); }
    };
    reader.readAsText(file);
  }

  /* =====================================================
     EVENT
     ===================================================== */
  function bind() {
    // ikon
    $$('[data-icon]').forEach(n => { n.innerHTML = icon(n.dataset.icon); });

    // pilihan jenis (4 ikon)
    $('#chooser-box').addEventListener('click', e => { const b = e.target.closest('.type-btn'); if (b) setType(b.dataset.type); });

    // navigasi
    $('#btn-back').addEventListener('click', () => go('#/calendar'));
    $('#btn-settings-day').addEventListener('click', () => go('#/settings'));
    $('#btn-settings-cal').addEventListener('click', () => go('#/settings'));
    $('#btn-back-settings').addEventListener('click', () => go(state.lastMain));
    const shiftDay = n => { const d = parseKey(state.date); d.setDate(d.getDate() + n); go('#/day/' + dateKey(d)); };
    $('#day-prev').addEventListener('click', () => shiftDay(-1));
    $('#day-next').addEventListener('click', () => shiftDay(1));

    // foto: klik ikon/foto si kecil (halaman data & pengaturan)
    const photoInput = $('#photo-file');
    $('#baby-card').addEventListener('click', e => { if (e.target.closest('[data-act="photo"]')) photoInput.click(); });
    photoInput.addEventListener('change', e => { const f = e.target.files[0]; if (f) processPhoto(f); e.target.value = ''; });

    // kalender
    $('#cal-prev').addEventListener('click', () => shiftMonth(-1));
    $('#cal-next').addEventListener('click', () => shiftMonth(1));
    $('#cal-grid').addEventListener('click', e => { const b = e.target.closest('.cal-day'); if (b) go('#/day/' + b.dataset.date); });
    $('#today-card').addEventListener('click', e => { if (e.target.closest('[data-open-today]')) go('#/day/' + todayKey()); });
    $('.cal-title').addEventListener('click', () => {
      const n = new Date(), same = state.cal.y === n.getFullYear() && state.cal.m === n.getMonth();
      if (!same) { const dir = (n.getFullYear() * 12 + n.getMonth()) > (state.cal.y * 12 + state.cal.m) ? 1 : -1; state.cal = { y: n.getFullYear(), m: n.getMonth() }; renderCal(dir); }
    });

    // tombol +
    fab.addEventListener('click', () => {
      fab.classList.remove('pulse'); void fab.offsetWidth; fab.classList.add('pulse');
      if (state.draft) discardDraft(true); else startDraft();
    });
    fab.addEventListener('animationend', e => { if (e.animationName === 'fabPulse') fab.classList.remove('pulse'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.draft) discardDraft(true); });

    // pengaturan
    const sb = $('#settings-body');
    sb.addEventListener('click', e => {
      const ph = e.target.closest('[data-photo]');
      if (ph) { if (ph.dataset.photo === 'pick') photoInput.click(); else removePhoto(); return; }
      if (e.target.closest('[data-act="photo"]')) { photoInput.click(); return; }

      const opt = e.target.closest('[data-setting]');
      if (opt) {
        const key = opt.dataset.setting, val = opt.dataset.value;
        if (key === 'lang') { setLanguage(val); return; }
        if (key === 'font') { state.settings.fontAuto = false; }
        state.settings[key] = val;
        persistSettings(); applySettings(); syncSettingsUI();
        return;
      }
      const act = e.target.closest('[data-data]');
      if (!act) return;
      if (act.dataset.data === 'export') exportData();
      if (act.dataset.data === 'import') $('#import-file').click();
      if (act.dataset.data === 'wipe' && confirm(t('confirmWipe'))) {
        state.records = []; persist(); toast(t('wiped'));
      }
    });
    sb.addEventListener('input', e => {
      const tg = e.target;
      if (tg.id === 'set-name') { state.settings.babyName = tg.value; persistSettings(); }
      if (tg.id === 'set-birth') { state.settings.birthDate = tg.value; persistSettings(); }
      if (tg.id === 'set-size') { state.settings.fontSize = Number(tg.value); persistSettings(); applySettings(); syncSettingsUI(); }
    });
    $('#import-file').addEventListener('change', e => { const f = e.target.files[0]; if (f) importData(f); e.target.value = ''; });

    // kalender ikut hari baru saat aplikasi dibuka kembali
    document.addEventListener('visibilitychange', () => { if (!document.hidden && state.route === 'cal') renderCal(); });
    window.addEventListener('hashchange', route);
  }

  /* ---------- Mulai ---------- */
  applySettings();
  bind();
  applyStaticText();
  route();
})();
