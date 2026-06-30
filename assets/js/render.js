/* =========================================================
   RENDER.JS
   Các hàm render dữ liệu từ CONFIG (config.js) ra giao diện.
   Không xử lý sự kiện (click, submit...) ở đây — phần đó nằm
   trong main.js.
   ========================================================= */

const Render = {

    /* ---------- Thiệp mời (intro) ---------- */
    renderIntro() {
        const { couple } = CONFIG;

        document.getElementById('names').innerHTML = `
            ${couple.groomName}
            <span class="amp">&amp;</span>
            ${couple.brideName}
        `;
        document.getElementById('date').innerText = couple.inviteDate;
        document.getElementById('thanmoi').innerText = couple.thanMoi;
    },

    /* ---------- Section 1: tên, ảnh, cha mẹ hai bên ---------- */
    renderSection1() {
        const { couple, parents } = CONFIG;

        // Tên cô dâu chú rể + vai trò
        const sides = document.querySelectorAll('.s1-side');
        if (sides[0]) {
            sides[0].querySelector('.s1-role').innerText = couple.groomRole;
            sides[0].querySelector('.s1-name').innerText = couple.groomName;
        }
        if (sides[1]) {
            sides[1].querySelector('.s1-role').innerText = couple.brideRole;
            sides[1].querySelector('.s1-name').innerText = couple.brideName;
        }

        // Tagline cong (textPath)
        const taglinePath = document.querySelector('#archPath + text textPath, .tagline-svg textPath');
        if (taglinePath) taglinePath.textContent = couple.tagline;

        // Ảnh cưới
        const photoImg = document.querySelector('.s1-photo-arch img');
        if (photoImg) {
            photoImg.src = couple.photo;
            photoImg.alt = `${couple.groomName} & ${couple.brideName}`;
        }

        // Cha mẹ hai bên
        const parentCols = document.querySelectorAll('.s1-parents-col');
        const fillParentCol = (col, data) => {
            if (!col || !data) return;
            col.querySelector('.s1-parents-label').innerText = data.label;
            const nameEls = col.querySelectorAll('.s1-parents-name');
            data.names.forEach((n, i) => { if (nameEls[i]) nameEls[i].innerText = n; });
            col.querySelector('.s1-parents-addr').innerHTML = data.address;
        };
        fillParentCol(parentCols[0], parents.groom);
        fillParentCol(parentCols[1], parents.bride);
    },

    /* ---------- Khối "Save the date" ---------- */
    renderSaveTheDate() {
        const { saveTheDate } = CONFIG;
        const titles = document.querySelectorAll('.couple-block .content-title');
        if (titles[0]) titles[0].innerText = saveTheDate.groomFullName;
        if (titles[1]) titles[1].innerText = saveTheDate.brideFullName;

        document.querySelector('.ceremony-label').innerText = saveTheDate.ceremonyLabel;
        document.querySelector('.ceremony-place').innerText = saveTheDate.ceremonyPlace;
        document.querySelector('.ceremony-time').innerHTML =
            `VÀO LÚC<span>${saveTheDate.ceremonyTime}</span>`;

        document.querySelector('.date-card .weekday').innerText = saveTheDate.weekday;
        document.querySelector('.date-card .day').innerText = saveTheDate.day;
        document.querySelector('.date-card .month').innerText = saveTheDate.month;
        document.querySelector('.date-card .year').innerText = saveTheDate.year;
        document.querySelector('.date-card .lunar').innerText = saveTheDate.lunar;
    },

    /* ---------- Địa điểm tổ chức ---------- */
    renderLocation() {
        const { location } = CONFIG;
        document.querySelector('.location-title').innerText = location.title;
        document.querySelector('.location-name').innerText = location.name;
        document.querySelector('.map-card iframe').src = location.mapEmbedUrl;
        document.querySelector('.location-address').innerHTML = location.address;
        document.querySelector('.btn-map').href = location.directionUrl;
    },

    /* ---------- Album ảnh ---------- */
    renderGallery() {
        const wrap = document.querySelector('.gallery');
        if (!wrap) return;
        wrap.innerHTML = CONFIG.gallery.map(item => {
            const sizeClass = item.size === 'large' ? ' gallery-large' : '';
            const revealAttr = item.size === 'large'
                ? 'data-reveal-scale'
                : (item.rotate === 'right' ? 'data-reveal-rotate-r' : 'data-reveal-rotate-l');
            return `
                <div class="gallery-item${sizeClass}" ${revealAttr}>
                    <img src="${item.src}">
                </div>
            `;
        }).join('');
    },

    /* ---------- Lịch trình ngày cưới ---------- */
    renderTimeline() {
        const wrap = document.querySelector('#timeline .timeline');
        if (!wrap) return;

        const itemsHtml = CONFIG.timeline.map(ev => {
            const revealAttr = ev.side === 'left' ? 'data-reveal-left' : 'data-reveal-right';
            const card = `
                <div class="timeline-card">
                    <span class="time">${ev.time}</span>
                    <h3>${ev.title}</h3>
                    <span class="place">${ev.place}</span>
                </div>`;
            const dot = `<div class="timeline-dot"></div>`;

            return ev.side === 'left'
                ? `<div class="timeline-item left" ${revealAttr}>${card}${dot}</div>`
                : `<div class="timeline-item right" ${revealAttr}>${dot}${card}</div>`;
        }).join('');

        wrap.innerHTML = `<div class="timeline-line"></div>${itemsHtml}`;
    },

    /* ---------- Danh sách lời chúc ---------- */
    renderWishList(data) {
        const wishList = document.getElementById('wishList');
        const wishTotal = document.getElementById('wishTotal');
        if (!wishList || !wishTotal) return;

        wishTotal.innerText = data.length;

        wishList.innerHTML = data.map(item => {
            const icon = item.attend === 'Có tham dự' ? '💖' : '🌿';
            const attendClass = item.attend === 'Có tham dự' ? 'yes' : 'no';
            return `
                <div class="wish-card">
                    <div class="wish-top">
                        <div class="wish-avatar">${item.name.charAt(0).toUpperCase()}</div>
                        <div class="wish-user">
                            <div class="wish-name">${item.name}</div>
                            <div class="wish-attend ${attendClass}">${icon} ${item.attend}</div>
                        </div>
                    </div>
                    <div class="wish-divider"></div>
                    <div class="wish-message">"${item.message}"</div>
                    <div class="wish-footer"><span>🕒 ${formatDate(item.time)}</span></div>
                </div>
            `;
        }).join('');
    },

    /* ---------- Phong bao mừng cưới: QR + thông tin ngân hàng ---------- */
    renderEnvelope() {
        const { bank } = CONFIG;

        document.getElementById('bankNameDisplay').innerText = bank.displayBankName;
        document.getElementById('bankOwnerDisplay').innerText = bank.displayOwnerName;
        document.getElementById('bankNumberDisplay').innerText = bank.displayAccountNo;
        document.getElementById('bankNoteDisplay').innerText = bank.displayNote;

        const qrUrl = `https://img.vietqr.io/image/${bank.bankCode}-${bank.accountNo}-compact2.png`
            + `?accountName=${encodeURIComponent(bank.accountNameNoAccent)}`
            + `&addInfo=${encodeURIComponent(bank.transferNote)}`;

        document.getElementById('envelopeQrImg').src = qrUrl;
    },

    /* ---------- Gọi tất cả các hàm render lúc khởi động ---------- */
    renderAll() {
        this.renderIntro();
        this.renderSection1();
        this.renderSaveTheDate();
        this.renderLocation();
        this.renderGallery();
        this.renderTimeline();
        this.renderEnvelope();
    }
};

function formatDate(dateString){

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth()+1).padStart(2,'0');
    const year = date.getFullYear();

    const hour = String(date.getHours()).padStart(2,'0');
    const minute = String(date.getMinutes()).padStart(2,'0');

    return `${hour}:${minute} • ${day}/${month}/${year}`;

}