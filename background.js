(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:0;';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');

    // --- Perlin gradient noise ---
    const PERM = new Uint8Array(512);
    const GX   = new Float32Array(512);
    const GY   = new Float32Array(512);

    (function () {
        const p = Array.from({ length: 256 }, (_, i) => i);
        for (let i = 255; i > 0; i--) {
            const j = (Math.random() * (i + 1)) | 0;
            [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < 512; i++) {
            PERM[i] = p[i & 255];
            const a = (PERM[i] / 128.0) * Math.PI;
            GX[i] = Math.cos(a);
            GY[i] = Math.sin(a);
        }
    })();

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(a, b, t) { return a + (b - a) * t; }

    function perlin2(x, y) {
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const u  = fade(xf);
        const v  = fade(yf);
        const aa = PERM[PERM[xi]     + yi];
        const ab = PERM[PERM[xi]     + yi + 1];
        const ba = PERM[PERM[xi + 1] + yi];
        const bb = PERM[PERM[xi + 1] + yi + 1];
        return lerp(
            lerp(GX[aa] * xf       + GY[aa] * yf,
                 GX[ba] * (xf - 1) + GY[ba] * yf,       u),
            lerp(GX[ab] * xf       + GY[ab] * (yf - 1),
                 GX[bb] * (xf - 1) + GY[bb] * (yf - 1), u),
            v
        );
    }

    // Fractal Brownian Motion — three octaves
    function fbm(x, y, t) {
        return (
            perlin2(x          + t * 0.11, y          + t * 0.07) * 0.600 +
            perlin2(x * 2.1    + t * 0.19, y * 2.1    + t * 0.13) * 0.280 +
            perlin2(x * 4.5    + t * 0.35, y * 4.5    + t * 0.23) * 0.120
        );
    }

    // Marching squares segment table
    // Corners: TL=8, TR=4, BR=2, BL=1
    // Edges:   0=top(TL→TR), 1=right(TR→BR), 2=bottom(BR→BL), 3=left(BL→TL)
    const MS = [
        [],               // 0  0000
        [[3, 2]],         // 1  0001
        [[2, 1]],         // 2  0010
        [[3, 1]],         // 3  0011
        [[0, 1]],         // 4  0100
        [[0, 3], [1, 2]], // 5  0101 ambiguous
        [[0, 2]],         // 6  0110
        [[3, 0]],         // 7  0111
        [[0, 3]],         // 8  1000
        [[0, 2]],         // 9  1001
        [[0, 1], [2, 3]], // 10 1010 ambiguous
        [[0, 1]],         // 11 1011
        [[3, 1]],         // 12 1100
        [[1, 2]],         // 13 1101
        [[2, 3]],         // 14 1110
        [],               // 15 1111
    ];

    const CELL   = 18;    // grid cell size in pixels
    const LEVELS = 10;    // number of contour threshold levels
    const SCALE  = 0.003; // noise coordinate scale — larger = bigger terrain features

    let W, H, cols, rows, field;
    const ePts = new Float32Array(8); // reusable [x0,y0, x1,y1, x2,y2, x3,y3] edge buffer

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cols  = Math.ceil(W / CELL) + 2;
        rows  = Math.ceil(H / CELL) + 2;
        field = new Float32Array(cols * rows);
    }

    // Write interpolated edge points into ePts for the current cell and threshold
    function fillEdges(x0, y0, v00, v10, v11, v01, th) {
        let s;
        // top   (TL → TR)
        s = (th - v00) / (v10 - v00); ePts[0] = x0 + s * CELL; ePts[1] = y0;
        // right (TR → BR)
        s = (th - v10) / (v11 - v10); ePts[2] = x0 + CELL;     ePts[3] = y0 + s * CELL;
        // bottom(BR → BL)
        s = (th - v11) / (v01 - v11); ePts[4] = x0 + CELL - s * CELL; ePts[5] = y0 + CELL;
        // left  (BL → TL)
        s = (th - v01) / (v00 - v01); ePts[6] = x0;             ePts[7] = y0 + CELL - s * CELL;
    }

    function draw(ts) {
        requestAnimationFrame(draw);

        const t = ts * 0.000025; // drift speed — full pattern cycle ~2 minutes

        // Fill scalar noise field
        for (let r = 0; r < rows; r++) {
            const wy = r * CELL * SCALE;
            for (let c = 0; c < cols; c++) {
                field[r * cols + c] = fbm(c * CELL * SCALE, wy, t);
            }
        }

        ctx.clearRect(0, 0, W, H);

        // Draw contour lines for each threshold level
        for (let li = 0; li < LEVELS; li++) {
            const th          = -0.40 + (li / (LEVELS - 1)) * 0.80;
            const centrality  = 1 - Math.abs((li / (LEVELS - 1)) - 0.5) * 2;
            ctx.strokeStyle   = `rgba(151, 71, 255, ${(0.13 + centrality * 0.14).toFixed(3)})`;
            ctx.lineWidth     = 1.0 + centrality * 0.8;
            ctx.beginPath();

            for (let r = 0; r < rows - 1; r++) {
                for (let c = 0; c < cols - 1; c++) {
                    const v00 = field[r * cols + c];
                    const v10 = field[r * cols + c + 1];
                    const v11 = field[(r + 1) * cols + c + 1];
                    const v01 = field[(r + 1) * cols + c];

                    const idx =
                        (v00 > th ? 8 : 0) |
                        (v10 > th ? 4 : 0) |
                        (v11 > th ? 2 : 0) |
                        (v01 > th ? 1 : 0);

                    const segs = MS[idx];
                    if (!segs.length) continue;

                    fillEdges(c * CELL, r * CELL, v00, v10, v11, v01, th);

                    for (let si = 0; si < segs.length; si++) {
                        const a = segs[si][0] << 1;
                        const b = segs[si][1] << 1;
                        ctx.moveTo(ePts[a], ePts[a + 1]);
                        ctx.lineTo(ePts[b], ePts[b + 1]);
                    }
                }
            }

            ctx.stroke();
        }
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
})();
