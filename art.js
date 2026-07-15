// Full-bleed generative hero: an N-body gravity field in the style of the
// gallery's gravitational visualizers — a few fixed masses (positive and
// negative) bend a cloud of particles whose fading trails paint the field.
// Hue follows each particle's heading, so regions of coherent flow share
// color. The pointer acts as one more attractor and bends the field live.
(function () {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = document.createElement('canvas');
    canvas.id = 'art-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:0;';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');

    const BG = 'rgba(11, 15, 19, 1)';       // matches --bg-0
    const FADE = 'rgba(11, 15, 19, 0.035)'; // trail decay per frame
    const SOFTEN = 1400;                    // gravity softening (px^2)
    const SPEED_CAP = 3.4;
    const G = 9000;                         // field strength

    let W, H, particles, masses;
    const pointer = { x: 0, y: 0, active: false };

    function rand(a, b) {
        return a + Math.random() * (b - a);
    }

    function makeMasses() {
        // A handful of fixed bodies; negative (repulsive) masses outnumber
        // positive ones, like the gallery's negative-mass studies.
        const count = 5;
        const list = [];
        for (let i = 0; i < count; i++) {
            list.push({
                x: rand(W * 0.12, W * 0.88),
                y: rand(H * 0.12, H * 0.88),
                m: (i < 2 ? 1 : -1) * rand(0.65, 1.35)
            });
        }
        return list;
    }

    function spawn(p) {
        p.x = rand(0, W);
        p.y = rand(0, H);
        p.px = p.x;
        p.py = p.y;
        const a = rand(0, Math.PI * 2);
        const s = rand(0.15, 0.6);
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
        return p;
    }

    function init() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        W = canvas.width  = window.innerWidth * dpr;
        H = canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        masses = makeMasses();

        const count = Math.min(1000, Math.max(300, Math.floor(W * H / 2600)));
        particles = Array.from({ length: count }, () => spawn({}));

        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, W, H);
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
    }

    function step(drawAlpha) {
        for (const p of particles) {
            let ax = 0;
            let ay = 0;

            for (const b of masses) {
                const dx = b.x - p.x;
                const dy = b.y - p.y;
                const d2 = dx * dx + dy * dy + SOFTEN;
                const f = (b.m * G) / (d2 * Math.sqrt(d2));
                ax += dx * f;
                ay += dy * f;
            }

            if (pointer.active) {
                const dx = pointer.x - p.x;
                const dy = pointer.y - p.y;
                const d2 = dx * dx + dy * dy + SOFTEN;
                const f = 11000 / (d2 * Math.sqrt(d2));
                ax += dx * f;
                ay += dy * f;
            }

            p.vx += ax;
            p.vy += ay;

            const speed = Math.hypot(p.vx, p.vy);
            if (speed > SPEED_CAP) {
                p.vx = (p.vx / speed) * SPEED_CAP;
                p.vy = (p.vy / speed) * SPEED_CAP;
            }

            p.px = p.x;
            p.py = p.y;
            p.x += p.vx;
            p.y += p.vy;

            const margin = 40;
            if (p.x < -margin || p.x > W + margin || p.y < -margin || p.y > H + margin) {
                spawn(p);
                continue;
            }

            const hue = ((Math.atan2(p.vy, p.vx) / (Math.PI * 2)) * 360 + 560) % 360;
            ctx.strokeStyle = `hsla(${hue.toFixed(0)}, 72%, 63%, ${drawAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
        }
    }

    function frame() {
        requestAnimationFrame(frame);
        ctx.fillStyle = FADE;
        ctx.fillRect(0, 0, W, H);
        step(0.55);
    }

    window.addEventListener('pointermove', (event) => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        pointer.x = event.clientX * dpr;
        pointer.y = event.clientY * dpr;
        pointer.active = true;
    });

    window.addEventListener('pointerleave', () => {
        pointer.active = false;
    });

    window.addEventListener('resize', () => {
        init();
        if (reducedMotion) renderStill();
    });

    // Without motion, run the simulation offscreen-style in one burst and
    // leave the finished plate on screen — a print instead of a performance.
    function renderStill() {
        for (let i = 0; i < 1000; i++) {
            step(0.16);
        }
    }

    init();
    if (reducedMotion) {
        renderStill();
    } else {
        requestAnimationFrame(frame);
    }
})();
