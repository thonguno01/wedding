/* =========================================================
   MAIN.JS
   Xử lý sự kiện, animation (GSAP), canvas hiệu ứng, đếm ngược
   và gọi API gửi/lấy lời chúc. Dữ liệu lấy từ CONFIG (config.js),
   việc hiển thị dữ liệu tĩnh đã được thực hiện bởi render.js.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // 1) Render toàn bộ dữ liệu tĩnh từ CONFIG trước khi gắn sự kiện
    Render.renderAll();

    gsap.registerPlugin(ScrollTrigger);

    /* =========================================================
       PETAL CANVAS — falling flower petals
       ========================================================= */
    const petalCanvas = document.getElementById('petal-canvas');
    const pctx = petalCanvas.getContext('2d');
    let petals = [];
    let petalIntensity = 1;

    function resizeCanvases() {
        [petalCanvas, document.getElementById('dust-canvas')].forEach(c => {
            c.width = window.innerWidth;
            c.height = window.innerHeight;
        });
    }

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    function makePetal() {
        return {
            x: Math.random() * petalCanvas.width,
            y: -20 - Math.random() * 300,

            size: 0.3 + Math.random() * 0.7,

            speedY: 0.4 + Math.random() * 0.8,
            speedX: (Math.random() - 0.5) * 0.6,

            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,

            sway: Math.random() * Math.PI * 2,
            swaySpeed: 0.01 + Math.random() * 0.02,

            blur: Math.random() * 1.5,

            // giảm độ đậm
            opacity: 0.25 + Math.random() * 0.35,

            // màu pastel nhẹ
            color: [
                '#F3C6C6', // hồng phấn
                '#E8B4B8', // dusty rose
                '#F5D7A1', // champagne
                '#D9A7A7'  // hồng nude
            ][Math.floor(Math.random() * 4)]
        };
    }

    for (let i = 0; i < CONFIG.effects.petalCount; i++) {
        petals.push(makePetal());
    }

    function drawPetal(p) {
        pctx.save();

        pctx.translate(p.x, p.y);
        pctx.rotate(p.rot);
        pctx.scale(p.size, p.size);

        pctx.beginPath();
        pctx.moveTo(0, 10);
        pctx.globalAlpha = p.opacity;
        pctx.bezierCurveTo(
            -25, -10,
            -20, -35,
            0, -20
        );

        pctx.bezierCurveTo(
            20, -35,
            25, -10,
            0, 10
        );

        pctx.closePath();

        pctx.fillStyle = p.color;
        pctx.fill();

        pctx.restore();
    }

    function animatePetals() {
        pctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
        petals.forEach(p => {
            p.y += p.speedY * petalIntensity;
            p.sway += p.swaySpeed;
            p.x += p.speedX + Math.sin(p.sway) * 0.6;
            p.rot += p.rotSpeed;
            if (p.y > petalCanvas.height + 30) {
                Object.assign(p, makePetal());
                p.y = -20;
            }
            drawPetal(p);
        });
        requestAnimationFrame(animatePetals);
    }

    animatePetals();

    /* =========================================================
       DUST CANVAS — soft floating gold particles
       ========================================================= */
    const dustCanvas = document.getElementById('dust-canvas');
    const dctx = dustCanvas.getContext('2d');
    let dust = [];

    function makeDust() {
        return {
            x: Math.random() * dustCanvas.width,
            y: Math.random() * dustCanvas.height,
            r: 0.6 + Math.random() * 1.6,
            speed: 0.08 + Math.random() * 0.25,
            drift: Math.random() * 2 * Math.PI,
            driftSpeed: 0.005 + Math.random() * 0.01,
            opacity: 0.15 + Math.random() * 0.35
        };
    }

    for (let i = 0; i < CONFIG.effects.dustCount; i++) {
        dust.push(makeDust());
    }

    function animateDust() {
        dctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
        dust.forEach(d => {
            d.y -= d.speed;
            d.drift += d.driftSpeed;
            d.x += Math.sin(d.drift) * 0.3;
            if (d.y < -10) {
                d.y = dustCanvas.height + 10;
                d.x = Math.random() * dustCanvas.width;
            }
            dctx.beginPath();
            dctx.fillStyle = `rgba(216,179,106,${d.opacity})`;
            dctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            dctx.fill();
        });
        requestAnimationFrame(animateDust);
    }

    animateDust();

    /* =========================================================
       INTRO CARD TIMELINE
       ========================================================= */
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl
        .to('#invite-card', { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, 0)
        .to('#badge', { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.8)' }, 0.5)
        .to('#names', { opacity: 1, duration: 0.8 }, 0.9)
        .to('#divider', { opacity: 1, duration: 0.6 }, 1.3)
        .to('#date', { opacity: 1, duration: 0.6 }, 1.6)
        .to('#thanmoi', { opacity: 1, duration: 0.6 }, 1.9)
        .to('#open-btn', {
            opacity: 1, duration: 0.7, onComplete() {
                document.getElementById('open-btn').classList.add('is-ready');
            }
        }, 2.3);

    /* =========================================================
       OPEN INVITATION — play music + intensify petals + reveal content
       ========================================================= */
    const openBtn = document.getElementById('open-btn');
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    openBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!openBtn.classList.contains('is-ready')) return;
        openBtn.classList.remove('is-ready');

        music.volume = 0;
        music.play().catch(() => {});
        gsap.to(music, { volume: 0.6, duration: 2 });

        petalIntensity = 2.6;
        for (let i = 0; i < CONFIG.effects.petalBurstOnOpen; i++) {
            petals.push(makePetal());
        }
        setTimeout(() => {
            petalIntensity = 1;
            petals.length = CONFIG.effects.petalCount;
        }, 2500);

        const closeTl = gsap.timeline({
            onComplete() {
                document.getElementById('intro').style.display = 'none';
                document.getElementById('content').style.visibility = 'visible';
                musicToggle.style.visibility = 'visible';
                musicToggle.classList.add('playing');
                initRevealAnimations();
            }
        });

        closeTl
            .to('#invite-card', { scale: 1.06, duration: 0.8, ease: 'power2.in' }, 0)
            .to('#intro', { opacity: 0, duration: 1, ease: 'power2.inOut' }, 0.3)
            .to('.seal-bottom', { opacity: 0, duration: 0.6 }, 0);
    });

    musicToggle.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicToggle.classList.add('playing');
        } else {
            music.pause();
            musicToggle.classList.remove('playing');
        }
    });

    /* =========================================================
       SCROLL REVEAL FOR CONTENT
       ========================================================= */
    function initRevealAnimations() {
        ScrollTrigger.refresh();

        const baseTrigger = (el) => ({
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        });

        document.querySelectorAll('[data-reveal]').forEach(el => {
            gsap.to(el, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', scrollTrigger: baseTrigger(el) });
        });

        document.querySelectorAll('[data-reveal-left]').forEach(el => {
            gsap.to(el, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: baseTrigger(el) });
        });

        document.querySelectorAll('[data-reveal-right]').forEach(el => {
            gsap.to(el, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: baseTrigger(el) });
        });

        document.querySelectorAll('[data-reveal-scale]').forEach(el => {
            gsap.to(el, { opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.6)', scrollTrigger: baseTrigger(el) });
        });

        document.querySelectorAll('[data-reveal-pop]').forEach(el => {
            gsap.to(el, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(2)', scrollTrigger: baseTrigger(el) });
        });

        document.querySelectorAll('[data-reveal-flip]').forEach(el => {
            gsap.to(el, { opacity: 1, rotateX: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: baseTrigger(el) });
        });

        document.querySelectorAll('[data-reveal-mask]').forEach(el => {
            gsap.to(el, { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power2.inOut', scrollTrigger: baseTrigger(el) });
        });

        document.querySelectorAll('[data-reveal-line]').forEach(el => {
            gsap.to(el, { width: 60, duration: 1, ease: 'power2.inOut', scrollTrigger: baseTrigger(el) });
        });

        document.querySelectorAll('[data-reveal-rotate-l]').forEach(el => {
            gsap.to(el, { opacity: 1, rotate: 0, y: 0, scale: 1, duration: 1.1, ease: 'back.out(1.5)', scrollTrigger: baseTrigger(el) });
        });
        document.querySelectorAll('[data-reveal-rotate-r]').forEach(el => {
            gsap.to(el, { opacity: 1, rotate: 0, y: 0, scale: 1, duration: 1.1, ease: 'back.out(1.5)', scrollTrigger: baseTrigger(el) });
        });

        gsap.to('.s1-parents-col, .s1-parents-divider', {
            opacity: 1, x: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: '.s1-parents-row', start: 'top 88%' }
        });
        gsap.to('.count-item', {
            opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'back.out(2)',
            scrollTrigger: { trigger: '.countdown', start: 'top 90%' }
        });
        gsap.to('.gallery-item', {
            opacity: 1, rotate: 0, x: 0, y: 0, scale: 1, duration: 1, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: '#album', start: 'top 70%' }
        });

        gsap.fromTo('.section-banner',
            { y: 60, opacity: 0, scale: 0.92, filter: 'blur(6px)' },
            {
                y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
                scrollTrigger: { trigger: '#album', start: 'top 85%' }
            });

        gsap.fromTo('.section-desc',
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, delay: .25,
                scrollTrigger: { trigger: '#album', start: 'top 85%' }
            });
    }

    /* =========================================================
       COUNTDOWN
       ========================================================= */
    const weddingDate = new Date(CONFIG.weddingDateISO).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        if (distance <= 0) return;

        const day = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const second = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('cd-day').innerHTML = String(day).padStart(2, '0');
        document.getElementById('cd-hour').innerHTML = String(hour).padStart(2, '0');
        document.getElementById('cd-minute').innerHTML = String(minute).padStart(2, '0');
        document.getElementById('cd-second').innerHTML = String(second).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* =========================================================
       WISH FORM — gửi & tải lời chúc
       ========================================================= */
    const API_URL = CONFIG.wishApiUrl;

    async function loadWishes() {
        const response = await fetch(API_URL);
        const data = await response.json();
        Render.renderWishList(data);
    }

    document.getElementById('wishForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = this.querySelector('button');

        const data = {
            name: document.getElementById('name').value.trim(),
            attend: document.querySelector('input[name="attend"]:checked').value,
            message: document.getElementById('message').value.trim()
        };

        if (!data.name) {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu họ tên',
                text: 'Vui lòng nhập họ và tên của bạn.',
                confirmButtonColor: '#8C0F18'
            });
            return;
        }

        if (!data.message) {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu lời chúc',
                text: 'Vui lòng nhập lời chúc dành cho cô dâu chú rể.',
                confirmButtonColor: '#8C0F18'
            });
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Cảm ơn bạn ❤️',
                    html: `
                        <p>Lời chúc của bạn đã được gửi thành công.</p>
                        <small>Chúc bạn có một ngày thật nhiều niềm vui!</small>
                    `,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#8C0F18'
                });

                document.getElementById('wishForm').reset();
                await loadWishes();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: 'Không thể gửi lời chúc.',
                    confirmButtonColor: '#8C0F18'
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Kết nối thất bại',
                text: 'Không thể kết nối tới máy chủ.',
                confirmButtonColor: '#8C0F18'
            });
        }

        btn.disabled = false;
        btn.innerHTML = 'GỬI LỜI CHÚC';
    });

    loadWishes();

    /* =========================================================
       PHONG BAO MỪNG CƯỚI — mở / đóng popup QR
       ========================================================= */
    const envBtn = document.getElementById('envelopeOpenBtn');
    const envModal = document.getElementById('envelopeModal');
    const envClose = document.getElementById('envelopeCloseBtn');

    envBtn.addEventListener('click', () => {
        envModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    });

    function closeEnvelope() {
        envModal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    envClose.addEventListener('click', closeEnvelope);
    envModal.addEventListener('click', (e) => {
        if (e.target === envModal) closeEnvelope();
    });

});