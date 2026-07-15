// Training monitor: draws a simulated training run on the panel screen —
// train/val loss on a log scale, plotted progressively like a live run, with
// step and loss readouts ticking in the panel header. When a run converges it
// pauses briefly, then a new run starts with a different seed.
(function () {
    const canvas = document.getElementById('loss-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const rootStyle = getComputedStyle(document.documentElement);
    const CH1  = (rootStyle.getPropertyValue('--ch1') || '#f2b63d').trim();  // train
    const CH2  = (rootStyle.getPropertyValue('--ch2') || '#4fc3dc').trim();  // val
    const DIM  = (rootStyle.getPropertyValue('--dim') || '#8b98a5').trim();
    const AXIS = (rootStyle.getPropertyValue('--line') || 'rgba(148,170,186,0.16)').trim();

    const stepEl = document.getElementById('run-step');
    const lossEl = document.getElementById('run-loss');

    const TOTAL_STEPS = 60000;
    const RUN_SECONDS = 40;   // wall time for one full run
    const HOLD_SECONDS = 5;   // pause on the converged chart between runs

    let seed = 7;

    // deterministic smooth 1-D value noise, varies per seed
    function rand(n) {
        const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
        return x - Math.floor(x);
    }

    function noise(u) {
        const i = Math.floor(u);
        const f = u - i;
        const a = rand(i);
        const b = rand(i + 1);
        return a + (b - a) * (f * f * (3 - 2 * f));
    }

    function trainLoss(s) {
        const p = s / TOTAL_STEPS;
        const base = 2.4 * Math.exp(-p * 5.2) + 0.012;
        const jitter = (noise(s / 900) - 0.5) * 0.5 * base +
                       (noise(s / 90) - 0.5) * 0.18 * base;
        return Math.max(0.008, base + jitter);
    }

    function valLoss(s) {
        const p = s / TOTAL_STEPS;
        const base = 2.5 * Math.exp(-p * 4.6) + 0.017;
        const jitter = (noise(s / 1400 + 40) - 0.5) * 0.35 * base;
        return Math.max(0.01, base + jitter);
    }

    const LOG_MIN = Math.log10(0.008);
    const LOG_MAX = Math.log10(3.2);
    const PAD_L = 46, PAD_R = 14, PAD_T = 12, PAD_B = 22;

    let W, H, dpr;

    function resize() {
        dpr = window.devicePixelRatio || 1;
        W = canvas.width  = canvas.offsetWidth * dpr;
        H = canvas.height = canvas.offsetHeight * dpr;
    }

    function xFor(s) {
        return PAD_L * dpr + (s / TOTAL_STEPS) * (W - (PAD_L + PAD_R) * dpr);
    }

    function yFor(loss) {
        const t = (Math.log10(loss) - LOG_MIN) / (LOG_MAX - LOG_MIN);
        return PAD_T * dpr + (1 - t) * (H - (PAD_T + PAD_B) * dpr);
    }

    function curve(fn, color, upToStep) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        const STRIDE = 250;
        for (let s = 0; s <= upToStep; s += STRIDE) {
            const x = xFor(s);
            const y = yFor(fn(s));
            s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    function render(progress) {
        ctx.clearRect(0, 0, W, H);
        ctx.font = `${9.5 * dpr}px "IBM Plex Mono", ui-monospace, monospace`;

        // y grid: decades
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        [[1, '1e0'], [0.1, '1e-1'], [0.01, '1e-2']].forEach(([v, label]) => {
            const y = yFor(v);
            ctx.strokeStyle = AXIS;
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            ctx.moveTo(PAD_L * dpr, y);
            ctx.lineTo(W - PAD_R * dpr, y);
            ctx.stroke();
            ctx.fillStyle = DIM;
            ctx.fillText(label, (PAD_L - 6) * dpr, y);
        });

        // x ticks
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        [[0, '0'], [15000, '15k'], [30000, '30k'], [45000, '45k'], [60000, '60k']].forEach(([s, label]) => {
            ctx.fillStyle = DIM;
            ctx.fillText(label, xFor(s), H - (PAD_B - 8) * dpr);
        });

        const upTo = Math.floor(progress * TOTAL_STEPS);
        curve(valLoss, CH2, upTo);
        curve(trainLoss, CH1, upTo);

        // head marker on the train curve
        if (progress < 1) {
            ctx.fillStyle = CH1;
            ctx.beginPath();
            ctx.arc(xFor(upTo), yFor(trainLoss(upTo)), 3 * dpr, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.textAlign = 'right';
            ctx.fillStyle = DIM;
            ctx.fillText(`converged · best val ${valLoss(TOTAL_STEPS).toFixed(3)}`, W - PAD_R * dpr, PAD_T * dpr);
        }

        if (stepEl) stepEl.textContent = `step ${upTo.toLocaleString('en-US')}`;
        if (lossEl) lossEl.textContent = `loss ${trainLoss(upTo).toFixed(4)}`;
    }

    const CYCLE = RUN_SECONDS + HOLD_SECONDS;
    let lastCycle = 0;

    function loop(ms) {
        requestAnimationFrame(loop);
        const t = ms * 0.001;
        const cycleIndex = Math.floor(t / CYCLE);
        if (cycleIndex !== lastCycle) {
            lastCycle = cycleIndex;
            seed = 7 + cycleIndex; // new run, new trajectory
        }
        const progress = Math.min(1, (t - cycleIndex * CYCLE) / RUN_SECONDS);
        render(progress);
    }

    if (reducedMotion) {
        resize();
        render(1);
        window.addEventListener('resize', () => {
            resize();
            render(1);
        });
    } else {
        window.addEventListener('resize', resize);
        resize();
        requestAnimationFrame(loop);
    }
})();
