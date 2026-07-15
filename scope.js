// Scopemeter screen: renders an I2C transaction on two logic traces —
// CH1 = SCL (clock), CH2 = SDA (data) — transmitting the site owner's name
// in ASCII, with logic-analyzer style decode labels under each byte.
// Also draws the probe harness: test leads from the meter's jacks down to
// the three index cards. Colors come from the --ch1/--ch2/--ch3 variables.
(function () {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rootStyle = getComputedStyle(document.documentElement);
    const CH1  = (rootStyle.getPropertyValue('--ch1') || '#f2b63d').trim();
    const CH2  = (rootStyle.getPropertyValue('--ch2') || '#4fc3dc').trim();
    const CH3  = (rootStyle.getPropertyValue('--ch3') || '#d76bd0').trim();
    const DIM  = (rootStyle.getPropertyValue('--dim') || '#8b98a5').trim();
    const AXIS = (rootStyle.getPropertyValue('--line') || 'rgba(148,170,186,0.16)').trim();

    // ------------------------------------------------------------- I2C model
    // The bus timeline is a list of slots, one clock period each. Data (SDA)
    // changes while the clock is low; START/STOP are SDA edges while SCL is
    // high, per the spec.
    const MESSAGE = 'ARYAN THOMARE';
    const ADDRESS = 0x50;

    const slots = [];   // {scl: 'clock'|'high', sda: 0|1|'fall'|'rise'}
    const decodes = []; // {start, span, text}
    const marks = [];   // {slot, text} — START / STOP markers

    function pushByte(byte, text) {
        decodes.push({ start: slots.length, span: 9, text });
        for (let i = 7; i >= 0; i--) {
            slots.push({ scl: 'clock', sda: (byte >> i) & 1 });
        }
        slots.push({ scl: 'clock', sda: 0 }); // ACK
    }

    slots.push({ scl: 'high', sda: 1 });
    slots.push({ scl: 'high', sda: 1 });
    marks.push({ slot: slots.length, text: 'S' });
    slots.push({ scl: 'high', sda: 'fall' }); // START condition
    pushByte((ADDRESS << 1) | 0, '0x50 W');
    for (const ch of MESSAGE) {
        const code = ch.charCodeAt(0);
        pushByte(code, '0x' + code.toString(16).toUpperCase() + " '" + ch + "'");
    }
    marks.push({ slot: slots.length, text: 'P' });
    slots.push({ scl: 'high', sda: 'rise' }); // STOP condition
    slots.push({ scl: 'high', sda: 1 });
    slots.push({ scl: 'high', sda: 1 });
    slots.push({ scl: 'high', sda: 1 });

    const TOTAL = slots.length;

    // u is a fractional slot position; returns 0/1 line levels
    function sclAt(u) {
        const slot = slots[Math.floor(u) % TOTAL];
        if (slot.scl === 'high') return 1;
        const f = u - Math.floor(u);
        return f > 0.3 && f < 0.75 ? 1 : 0;
    }

    function sdaAt(u) {
        const slot = slots[Math.floor(u) % TOTAL];
        const f = u - Math.floor(u);
        if (slot.sda === 'fall') return f < 0.5 ? 1 : 0;
        if (slot.sda === 'rise') return f < 0.5 ? 0 : 1;
        return slot.sda;
    }

    // --------------------------------------------------------------- screen
    const screen = document.getElementById('scope-canvas');
    if (screen) {
        const ctx = screen.getContext('2d');
        const VIEW = 20; // slots visible at once
        let W, H, dpr;

        function resizeScreen() {
            dpr = window.devicePixelRatio || 1;
            W = screen.width  = screen.offsetWidth * dpr;
            H = screen.height = screen.offsetHeight * dpr;
        }

        function trace(levelAt, offset, yHigh, yLow, color) {
            const slotPx = W / VIEW;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5 * dpr;
            ctx.beginPath();
            const step = 2 * dpr;
            for (let px = 0; px <= W; px += step) {
                const u = offset + px / slotPx;
                const y = levelAt(u) ? yHigh : yLow;
                px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
            }
            ctx.stroke();
        }

        function renderScreen(offset) {
            ctx.clearRect(0, 0, W, H);
            const slotPx = W / VIEW;

            // idle-level gridlines
            ctx.strokeStyle = AXIS;
            ctx.lineWidth = 1 * dpr;
            [0.32, 0.72].forEach((frac) => {
                ctx.beginPath();
                ctx.moveTo(0, H * frac);
                ctx.lineTo(W, H * frac);
                ctx.stroke();
            });

            trace(sclAt, offset, H * 0.12, H * 0.32, CH1);
            trace(sdaAt, offset, H * 0.52, H * 0.72, CH2);

            // decode row
            ctx.font = `${10 * dpr}px "IBM Plex Mono", ui-monospace, monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const decodeY = H * 0.88;

            for (const d of decodes) {
                for (const lap of [0, TOTAL]) { // handle wrap-around
                    const cx = (d.start + lap + d.span / 2 - offset) * slotPx;
                    if (cx < -60 * dpr || cx > W + 60 * dpr) continue;
                    const half = (d.span / 2 - 0.4) * slotPx;
                    ctx.strokeStyle = AXIS;
                    ctx.lineWidth = 1 * dpr;
                    ctx.beginPath();
                    ctx.moveTo(cx - half, decodeY);
                    ctx.lineTo(cx + half, decodeY);
                    ctx.stroke();
                    ctx.fillStyle = DIM;
                    const label = d.text;
                    ctx.save();
                    ctx.fillStyle = '#0b1014';
                    const w = ctx.measureText(label).width + 8 * dpr;
                    ctx.fillRect(cx - w / 2, decodeY - 7 * dpr, w, 14 * dpr);
                    ctx.restore();
                    ctx.fillStyle = DIM;
                    ctx.fillText(label, cx, decodeY);
                }
            }

            // START / STOP markers
            for (const m of marks) {
                for (const lap of [0, TOTAL]) {
                    const cx = (m.slot + lap + 0.5 - offset) * slotPx;
                    if (cx < -20 * dpr || cx > W + 20 * dpr) continue;
                    ctx.fillStyle = m.text === 'S' ? CH1 : CH2;
                    ctx.beginPath();
                    ctx.arc(cx, H * 0.42, 6 * dpr, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#0b1014';
                    ctx.fillText(m.text, cx, H * 0.42);
                }
            }
        }

        const SPEED = 2.4; // slots per second
        function loop(ms) {
            requestAnimationFrame(loop);
            renderScreen((ms * 0.001 * SPEED) % TOTAL);
        }

        if (reducedMotion) {
            resizeScreen();
            renderScreen(2); // static view: START + address byte + first data
            window.addEventListener('resize', () => {
                resizeScreen();
                renderScreen(2);
            });
        } else {
            window.addEventListener('resize', resizeScreen);
            resizeScreen();
            requestAnimationFrame(loop);
        }
    }

    // -------------------------------------------------------- probe harness
    const harness = document.getElementById('probe-canvas');
    if (harness) {
        const hctx = harness.getContext('2d');
        const COLORS = [CH1, CH2, CH3];

        function drawHarness() {
            const wrap = harness.parentElement;
            if (!wrap || wrap.offsetParent === null || wrap.offsetHeight === 0) return;

            const dpr = window.devicePixelRatio || 1;
            const W = harness.width  = harness.offsetWidth * dpr;
            const H = harness.height = harness.offsetHeight * dpr;
            hctx.clearRect(0, 0, W, H);

            const jacks = document.querySelectorAll('.jack');
            const cards = document.querySelectorAll('.channel_card');
            if (jacks.length !== 3 || cards.length !== 3) return;

            // leads only make sense when the cards sit on one row
            const tops = [...cards].map((c) => c.offsetTop);
            if (Math.max(...tops) - Math.min(...tops) > 4) return;

            const wrapRect = wrap.getBoundingClientRect();

            for (let i = 0; i < 3; i++) {
                const j = jacks[i].getBoundingClientRect();
                const c = cards[i].getBoundingClientRect();
                const x0 = (j.left + j.width / 2 - wrapRect.left) * dpr;
                const x1 = (c.left + c.width / 2 - wrapRect.left) * dpr;

                hctx.strokeStyle = COLORS[i];
                hctx.lineWidth = 1.5 * dpr;
                hctx.beginPath();
                hctx.moveTo(x0, 0);
                hctx.bezierCurveTo(x0, H * 0.75, x1, H * 0.25, x1, H);
                hctx.stroke();

                // probe tip at the card end
                hctx.fillStyle = COLORS[i];
                hctx.beginPath();
                hctx.arc(x1, H - 3 * dpr, 3.5 * dpr, 0, Math.PI * 2);
                hctx.fill();
            }
        }

        window.addEventListener('resize', drawHarness);
        window.addEventListener('load', drawHarness);
        drawHarness();
    }
})();
