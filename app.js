(() => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const tray = document.getElementById('tray');

  const COLS = 22;
  const ROWS = 34;
  const boardThickness = 26;

  const palette = [
    { name: '深棕 BR', code: 'BR', value: '#4B2208' },
    { name: '橙红 OR', code: 'OR', value: '#E84B0F' },
    { name: '绿色 GN', code: 'GN', value: '#0B8E3E' },
    { name: '浅绿 LG', code: 'LG', value: '#2EA643' },
    { name: '黄橙 YL', code: 'YL', value: '#F29A2E' },
    { name: '米白 IV', code: 'IV', value: '#F5F1E9' },
    { name: '蓝灰 BL', code: 'BL', value: '#AAB2D0' },
    { name: '橡皮擦', code: 'ER', value: null }
  ];

  const paintColors = palette.filter((p) => p.value);
  const colorToCode = Object.fromEntries(paintColors.map((p) => [p.value, p.code]));

  const state = {
    selected: '#F5F1E9',
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    targetGrid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    displayMode: 'code',
    dragging: false,
    pointer: { x: 0, y: 0, inside: false },
    yawAngle: 0,
    targetYawAngle: 0,
    rotationAnimating: false,
    sourceImage: null
  };

  const hexToRgb = (hex) => {
    const v = hex.replace('#', '');
    return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
  };

  const colorDist = (a, b) => {
    const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
    return dr * dr + dg * dg + db * db;
  };

  const nearestPaletteHex = (rgb) => {
    let best = paintColors[0].value;
    let bestD = Infinity;
    paintColors.forEach((p) => {
      const d = colorDist(rgb, hexToRgb(p.value));
      if (d < bestD) {
        bestD = d;
        best = p.value;
      }
    });
    return best;
  };

  const normalizeAngle = (a) => {
    const t = Math.PI * 2;
    return ((a % t) + t) % t;
  };

  const shortestDelta = (from, to) => {
    const t = Math.PI * 2;
    let d = (to - from) % t;
    if (d > Math.PI) d -= t;
    if (d < -Math.PI) d += t;
    return d;
  };

  const basis = () => {
    const t = state.yawAngle;
    return { ct: Math.cos(t), st: Math.sin(t) };
  };

  const unit = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    return Math.min(w / (COLS + ROWS + 8), h / ((COLS + ROWS) * 0.62 + 12));
  };

  const projectRaw = (u, v) => {
    const { ct, st } = basis();
    const xr = u * ct - v * st;
    const yr = u * st + v * ct;
    const s = unit();
    return { x: (xr - yr) * s, y: (xr + yr) * s * 0.55 };
  };

  const boardCenterOffset = () => {
    const corners = [projectRaw(0, 0), projectRaw(COLS, 0), projectRaw(COLS, ROWS), projectRaw(0, ROWS)];
    const minX = Math.min(...corners.map((p) => p.x));
    const maxX = Math.max(...corners.map((p) => p.x));
    const minY = Math.min(...corners.map((p) => p.y));
    const maxY = Math.max(...corners.map((p) => p.y));
    return { x: canvas.clientWidth / 2 - (minX + maxX) / 2, y: canvas.clientHeight / 2 - (minY + maxY) / 2 };
  };

  const project = (u, v) => {
    const p = projectRaw(u, v);
    const c = boardCenterOffset();
    return { x: p.x + c.x, y: p.y + c.y };
  };

  const unproject = (px, py) => {
    const c = boardCenterOffset();
    const s = unit();
    const A = (px - c.x) / s;
    const B = (py - c.y) / (s * 0.55);
    const xr = (A + B) / 2;
    const yr = (B - A) / 2;
    const { ct, st } = basis();
    return { u: xr * ct + yr * st, v: -xr * st + yr * ct };
  };

  const toCell = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const { u, v } = unproject(clientX - rect.left, clientY - rect.top);
    const c = Math.floor(u);
    const r = Math.floor(v);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return null;
    return { r, c };
  };

  const drawDiamond = (cx, cy, rx, ry) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - ry);
    ctx.lineTo(cx + rx, cy);
    ctx.lineTo(cx, cy + ry);
    ctx.lineTo(cx - rx, cy);
    ctx.closePath();
  };

  const drawBoardBase = () => {
    const p00 = project(0, 0), p10 = project(COLS, 0), p11 = project(COLS, ROWS), p01 = project(0, ROWS);
    ctx.fillStyle = '#e4c894';
    ctx.beginPath();
    ctx.moveTo(p00.x, p00.y + boardThickness); ctx.lineTo(p10.x, p10.y + boardThickness);
    ctx.lineTo(p11.x, p11.y + boardThickness); ctx.lineTo(p01.x, p01.y + boardThickness); ctx.closePath(); ctx.fill();

    ctx.fillStyle = '#d6b980';
    ctx.beginPath();
    ctx.moveTo(p10.x, p10.y); ctx.lineTo(p11.x, p11.y); ctx.lineTo(p11.x, p11.y + boardThickness); ctx.lineTo(p10.x, p10.y + boardThickness);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = '#ccb174';
    ctx.beginPath();
    ctx.moveTo(p01.x, p01.y); ctx.lineTo(p11.x, p11.y); ctx.lineTo(p11.x, p11.y + boardThickness); ctx.lineTo(p01.x, p01.y + boardThickness);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = '#f6e9ca';
    ctx.beginPath();
    ctx.moveTo(p00.x, p00.y); ctx.lineTo(p10.x, p10.y); ctx.lineTo(p11.x, p11.y); ctx.lineTo(p01.x, p01.y);
    ctx.closePath(); ctx.fill();
  };

  const drawTargetGrid = () => {
    const s = unit();
    const rx = s, ry = s * 0.55;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const centerP = project(c + 0.5, r + 0.5);
        const t = state.targetGrid[r][c];
        if (t) {
          drawDiamond(centerP.x, centerP.y, rx * 0.95, ry * 0.95);
          if (state.displayMode === 'color') {
            ctx.fillStyle = `${t}55`;
            ctx.fill();
          } else {
            ctx.fillStyle = 'rgba(255,255,255,0.78)';
            ctx.fill();
            ctx.fillStyle = '#5f4f47';
            ctx.font = `${Math.max(8, s * 0.42)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(colorToCode[t] || '--', centerP.x, centerP.y + 1);
          }
        }
        drawDiamond(centerP.x, centerP.y, rx, ry);
        ctx.strokeStyle = 'rgba(183,146,104,0.45)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = '#efc59d';
        ctx.arc(centerP.x, centerP.y, s * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawBeadAtCell = (c, r, color) => {
    const p = project(c + 0.5, r + 0.5);
    const s = unit();
    drawDiamond(p.x, p.y - 4, s * 0.85, s * 0.47);
    ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.stroke();
    drawDiamond(p.x, p.y - 1, s * 0.78, s * 0.43);
    ctx.fillStyle = color; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(p.x, p.y - 3, s * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120,100,90,0.3)'; ctx.fill();
  };

  const drawTweezers = () => {
    if (!state.pointer.inside) return;
    const { x, y } = state.pointer;
    ctx.save();
    ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(109,149,201,.85)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x - 40, y - 66); ctx.lineTo(x - 7, y + 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 26, y - 78); ctx.lineTo(x + 7, y - 6); ctx.stroke();
    ctx.strokeStyle = 'rgba(180,120,220,.9)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 46, y - 72); ctx.lineTo(x - 12, y - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 32, y - 84); ctx.lineTo(x + 1, y - 10); ctx.stroke();
    if (state.selected) {
      drawDiamond(x + 8, y + 8, 12, 7);
      ctx.fillStyle = state.selected;
      ctx.fill();
    }
    ctx.restore();
  };

  const draw = () => {
    ctx.fillStyle = '#efe4c6';
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawBoardBase();
    drawTargetGrid();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (state.grid[r][c]) drawBeadAtCell(c, r, state.grid[r][c]);
    drawTweezers();
  };

  const paintAt = (clientX, clientY, erase = false) => {
    const cell = toCell(clientX, clientY);
    if (!cell) return;
    if (erase || state.selected === null) state.grid[cell.r][cell.c] = null;
    else if (!state.grid[cell.r][cell.c]) state.grid[cell.r][cell.c] = state.selected;
    draw();
  };

  const runKMeans = (pixels, k, iterations = 10) => {
    const centers = [];
    const step = Math.max(1, Math.floor(pixels.length / k));
    for (let i = 0; i < k; i++) centers.push([...pixels[Math.min(i * step, pixels.length - 1)]]);
    const labels = new Array(pixels.length).fill(0);

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < pixels.length; i++) {
        let best = 0, bestD = Infinity;
        for (let c = 0; c < centers.length; c++) {
          const d = colorDist(pixels[i], centers[c]);
          if (d < bestD) { bestD = d; best = c; }
        }
        labels[i] = best;
      }

      const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
      for (let i = 0; i < pixels.length; i++) {
        const l = labels[i];
        sums[l][0] += pixels[i][0]; sums[l][1] += pixels[i][1]; sums[l][2] += pixels[i][2]; sums[l][3]++;
      }
      for (let c = 0; c < k; c++) {
        if (!sums[c][3]) continue;
        centers[c] = [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]];
      }
    }

    return { centers, labels };
  };

  const imageToTemplate = (img, k) => {
    const off = document.createElement('canvas');
    off.width = COLS;
    off.height = ROWS;
    const octx = off.getContext('2d');
    octx.clearRect(0, 0, COLS, ROWS);

    const scale = Math.min(COLS / img.width, ROWS / img.height);
    const dw = Math.max(1, Math.floor(img.width * scale));
    const dh = Math.max(1, Math.floor(img.height * scale));
    const dx = Math.floor((COLS - dw) / 2);
    const dy = Math.floor((ROWS - dh) / 2);

    octx.fillStyle = '#f5f1e9';
    octx.fillRect(0, 0, COLS, ROWS);
    octx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);

    const imgData = octx.getImageData(0, 0, COLS, ROWS).data;
    const pixels = [];
    for (let i = 0; i < imgData.length; i += 4) pixels.push([imgData[i], imgData[i + 1], imgData[i + 2]]);

    const { centers, labels } = runKMeans(pixels, k, 12);
    const centerToHex = centers.map((c) => nearestPaletteHex(c));

    const nextTarget = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    let idx = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        nextTarget[r][c] = centerToHex[labels[idx++]];
      }
    }
    state.targetGrid = nextTarget;
    draw();
  };

  const loadCatPattern = () => {
    const pattern = [
      '.................11111','..................1....','......1...........1....','.....11.1..............',
      '....111111111.....1....','....11.1...............','....11..................','....11..1......11....11',
      '....11.....1...11....11','....111..1....111....11','....111...1..1111....11','....1111111111111111111',
      '....1111111111111111111','....1111111111111111111','....2111111111111111111','.....211111111111111111',
      '......21111111111111111','.......2222222222111111'
    ];
    state.targetGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    pattern.forEach((row, r) => [...row].forEach((ch, c) => {
      const rr = r + 7, cc = c + 2;
      if (rr >= ROWS || cc >= COLS) return;
      if (ch === '1') state.targetGrid[rr][cc] = '#F5F1E9';
      if (ch === '2') state.targetGrid[rr][cc] = '#D7D7D7';
    }));
    draw();
  };

  const animateRotation = () => {
    const delta = shortestDelta(state.yawAngle, state.targetYawAngle);
    if (Math.abs(delta) < 0.002) {
      state.yawAngle = normalizeAngle(state.targetYawAngle);
      state.rotationAnimating = false;
      draw();
      return;
    }
    state.yawAngle = normalizeAngle(state.yawAngle + delta * 0.18);
    draw();
    requestAnimationFrame(animateRotation);
  };

  const rotateBy = (step) => {
    state.targetYawAngle = normalizeAngle(state.targetYawAngle + step * (Math.PI / 2));
    if (!state.rotationAnimating) {
      state.rotationAnimating = true;
      requestAnimationFrame(animateRotation);
    }
  };

  const mountPalette = () => {
    tray.innerHTML = '';
    palette.forEach((p) => {
      const btn = document.createElement('button');
      btn.className = 'color-bin';
      btn.title = p.name;
      if (p.value === state.selected) btn.classList.add('active');
      btn.innerHTML = `<div class="bead-sample" style="--c:${p.value || '#888'}"></div>`;
      btn.onclick = () => { state.selected = p.value; mountPalette(); draw(); };
      tray.appendChild(btn);
    });
  };

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * ratio);
    canvas.height = Math.floor(h * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  };

  document.getElementById('clearBtn').onclick = () => {
    state.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    draw();
  };
  document.getElementById('catBtn').onclick = loadCatPattern;
  document.getElementById('rotLBtn').onclick = () => rotateBy(-1);
  document.getElementById('rotRBtn').onclick = () => rotateBy(1);

  document.getElementById('modeBtn').onclick = (e) => {
    state.displayMode = state.displayMode === 'code' ? 'color' : 'code';
    e.currentTarget.textContent = `模式：${state.displayMode === 'code' ? '色号' : '目标颜色'}`;
    draw();
  };

  document.getElementById('imageInput').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { state.sourceImage = img; };
    img.src = URL.createObjectURL(file);
  });

  document.getElementById('convertBtn').onclick = () => {
    if (!state.sourceImage) return alert('请先上传图片');
    const k = Number(document.getElementById('kInput').value) || 6;
    imageToTemplate(state.sourceImage, Math.min(12, Math.max(2, k)));
  };

  document.getElementById('fitBtn').onclick = () => {
    if (!state.sourceImage) return alert('请先上传图片');
    state.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    const k = Number(document.getElementById('kInput').value) || 6;
    imageToTemplate(state.sourceImage, Math.min(12, Math.max(2, k)));
  };

  canvas.addEventListener('pointerdown', (e) => {
    state.dragging = true;
    paintAt(e.clientX, e.clientY, e.button === 2);
  });

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    state.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
    if (state.dragging) paintAt(e.clientX, e.clientY, e.buttons === 2);
    else draw();
  });

  window.addEventListener('pointerup', () => { state.dragging = false; });
  canvas.addEventListener('pointerleave', () => { state.pointer.inside = false; draw(); });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('resize', resize);

  mountPalette();
  loadCatPattern();
  resize();
})();
