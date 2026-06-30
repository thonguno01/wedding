/* =========================================================
   CONFIG.JS
   Toàn bộ dữ liệu / thông tin cấu hình của thiệp cưới.
   Chỉ cần chỉnh sửa trong file này, không cần đụng vào
   các file render.js / main.js.
   ========================================================= */

const CONFIG = {

  /* ---------- Thông tin cô dâu chú rể (dùng cho intro & section 1) ---------- */
  couple: {
    groomName: "PT",
    brideName: "TT",
    groomRole: "Út Nam",
    brideRole: "Út Nữ",
    inviteDate: "02 tháng 08, 2026",
    thanMoi: "Thân Mời",
    tagline: "✦ LOVE NEVER FAILS ✦",
    photo: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&q=80"
  },

  /* ---------- Thông tin cha mẹ hai bên ---------- */
  parents: {
    groom: {
      label: "Ông Bà",
      names: ["Phan Trọng T", "Nguyễn THị H"],
      address: "Tổ Dân Phố Song Khê,<br>Trực Ninh, Nam Định"
    },
    bride: {
      label: "Ông Bà",
      names: ["Nguyễn Văn S", "Phùng Thị Đ"],
      address: "38 Xã Hoa Lư ,<br>, Tỉnh Phú Thọ"
    }
  },

  /* ---------- Khối "Save the date" ---------- */
  saveTheDate: {
    groomFullName: "P V T",
    brideFullName: "N T T T",
    ceremonyLabel: "LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI",
    ceremonyPlace: "TƯ GIA",
    ceremonyTime: "09:00",
    weekday: "CHỦ NHẬT",
    day: "02",
    month: "THÁNG 08",
    year: "2026",
    lunar: "(Tức ngày 20/06 năm Bính Ngọ)"
  },

  /* ---------- Đếm ngược ---------- */
  // Định dạng ISO, dùng cho new Date(...)
  weddingDateISO: "2026-08-02T10:00:00",

  /* ---------- Địa điểm tổ chức ---------- */
  location: {
    title: "ĐỊA ĐIỂM TỔ CHỨC",
    name: "TƯ GIA NHÀ TRAI",
    mapEmbedUrl: "https://www.google.com/maps?q=20.3069699,106.2801533&z=17&output=embed",
    address: "Tổ Dân Phố Song Khuê ,<br>Xã Cổ Lễ, Ninh Bình",
    directionUrl: "https://www.google.com/maps?q=20.3069699,106.2801533"
  },

  /* ---------- Album ảnh ---------- */
  gallery: [
    { src: "./assets/images/1.jpg", size: "large", rotate: "left" },
    { src: "./assets/images/2.jpg", size: "normal", rotate: "left" },
    { src: "./assets/images/3.jpg", size: "normal", rotate: "right" },
    { src: "./assets/images/4.jpg", size: "large", rotate: "left" },
    { src: "./assets/images/5.jpg", size: "normal", rotate: "left" },
    { src: "./assets/images/6.jpg", size: "normal", rotate: "right" }
  ],

  /* ---------- Lịch trình ngày cưới ---------- */
  timeline: [
    { time: "08:00", title: "Lễ Vu Quy",   place: "TƯ GIA NHÀ GÁI", side: "left" },
    { time: "09:00", title: "Lễ Thành Hôn", place: "TƯ GIA NHÀ TRAI", side: "right" },
    { time: "10:30", title: "Đón Khách",    place: "SẢNH TIỆC", side: "left" },
    { time: "11:00", title: "Khai Tiệc",    place: "NHÀ HÀNG", side: "right" },
    { time: "12:00", title: "Chụp Hình",    place: "LƯU NIỆM", side: "left" },
    { time: "11:00", title: "Khai Tiệc",    place: "NHÀ HÀNG", side: "right" },
    { time: "12:00", title: "Chụp Hình",    place: "LƯU NIỆM", side: "left" },
  ],

  /* ---------- API Google Apps Script (lời chúc) ---------- */
  wishApiUrl: "https://script.google.com/macros/s/AKfycbyA6QehZwvbkj_If8F-_6QuQR8cKjhbUHEPTlUumTwHDPaxb5U5A0q5hur3gSKQ9C0hEg/exec",

  /* ---------- Thông tin ngân hàng / VietQR (phong bao mừng cưới) ---------- */
  bank: {
    bankCode: "VCB",                 // mã ngân hàng VietQR: VCB, TCB, MB, ACB, BIDV, VTB...
    accountNo: "1234567899999",      // số tài khoản, không khoảng trắng
    accountNameNoAccent: "NGUYEN VAN A", // tên chủ tài khoản KHÔNG DẤU (dùng để sinh QR)
    transferNote: "Mung cuoi Gia Khanh Quynh Anh", // nội dung chuyển khoản (không dấu)

    // Thông tin hiển thị đẹp (có dấu) trong popup
    displayBankName: "VIETCOMBANK",
    displayOwnerName: "NGUYỄN VĂN A",
    displayAccountNo: "1234 5678 9999",
    displayNote: "Mừng cưới Gia Khánh & Quỳnh Anh"
  },

  /* ---------- Hiệu ứng nền (cánh hoa rơi / bụi vàng) ---------- */
  effects: {
    petalCount: 18,
    petalBurstOnOpen: 20,
    dustCount: 40
  }
};