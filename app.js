(() => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const tray = document.getElementById('tray');

  const boardThickness = 26;
  const MIN_GRID = 8;
  const MAX_GRID = 120;

  const hslToHex = (h, s, l) => {
    const sat = s / 100;
    const lig = l / 100;
    const c = (1 - Math.abs(2 * lig - 1)) * sat;
    const hh = h / 60;
    const x = c * (1 - Math.abs((hh % 2) - 1));
    let r = 0, g = 0, b = 0;
    if (hh >= 0 && hh < 1) [r, g, b] = [c, x, 0];
    else if (hh < 2) [r, g, b] = [x, c, 0];
    else if (hh < 3) [r, g, b] = [0, c, x];
    else if (hh < 4) [r, g, b] = [0, x, c];
    else if (hh < 5) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    const m = lig - c / 2;
    const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const generate221Palette = () => {
    const colors = [];
    const hues = Array.from({ length: 18 }, (_, i) => i * 20);
    const sats = [55, 70, 85];
    const lights = [35, 50, 65, 80];

    for (const h of hues) {
      for (const s of sats) {
        for (const l of lights) {
          colors.push(hslToHex(h, s, l));
        }
      }
    }

    colors.push('#111111', '#333333', '#666666', '#AAAAAA', '#EEEEEE');

    return colors.slice(0, 221).map((hex, i) => ({
      name: `颜色 ${String(i + 1).padStart(3, '0')}`,
      code: `C${String(i + 1).padStart(3, '0')}`,
      value: hex
    }));
  };

  const palette = [...generate221Palette(), { name: '橡皮擦', code: 'ER', value: null }];

  const paintColors = palette.filter((p) => p.value);
  const colorToCode = Object.fromEntries(paintColors.map((p) => [p.value, p.code]));

  const createGrid = (rows, cols, fill = null) => Array.from({ length: rows }, () => Array(cols).fill(fill));

  const state = {
    cols: 22,
    rows: 34,
    zoom: 1,
    selected: paintColors[0].value,
    grid: createGrid(34, 22),
    targetGrid: createGrid(34, 22),
    displayMode: 'code',
    dragging: false,
    pointer: { x: 0, y: 0, inside: false },
    yawAngle: 0,
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

  const projectionCache = { key: '', data: null };

  const getProjection = () => {
    const key = [state.cols, state.rows, state.zoom, state.yawAngle.toFixed(4), canvas.clientWidth, canvas.clientHeight].join('|');
    if (projectionCache.key === key && projectionCache.data) return projectionCache.data;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const base = Math.min(w / (state.cols + state.rows + 8), h / ((state.cols + state.rows) * 0.62 + 12));
    const s = base * state.zoom;
    const ct = Math.cos(state.yawAngle);
    const st = Math.sin(state.yawAngle);

    const raw = (u, v) => {
      const xr = u * ct - v * st;
      const yr = u * st + v * ct;
      return { x: (xr - yr) * s, y: (xr + yr) * s * 0.55 };
    };

    const corners = [raw(0, 0), raw(state.cols, 0), raw(state.cols, state.rows), raw(0, state.rows)];
    const minX = Math.min(...corners.map((p) => p.x));
    const maxX = Math.max(...corners.map((p) => p.x));
    const minY = Math.min(...corners.map((p) => p.y));
    const maxY = Math.max(...corners.map((p) => p.y));
    const offX = canvas.clientWidth / 2 - (minX + maxX) / 2;
    const offY = canvas.clientHeight / 2 - (minY + maxY) / 2;

    projectionCache.key = key;
    projectionCache.data = { s, ct, st, offX, offY };
    return projectionCache.data;
  };

  const unit = () => getProjection().s;

  const project = (u, v) => {
    const { s, ct, st, offX, offY } = getProjection();
    const xr = u * ct - v * st;
    const yr = u * st + v * ct;
    return { x: (xr - yr) * s + offX, y: (xr + yr) * s * 0.55 + offY };
  };

  const unproject = (px, py) => {
    const { s, ct, st, offX, offY } = getProjection();
    const A = (px - offX) / s;
    const B = (py - offY) / (s * 0.55);
    const xr = (A + B) / 2;
    const yr = (B - A) / 2;
    return { u: xr * ct + yr * st, v: -xr * st + yr * ct };
  };

  const toCell = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const { u, v } = unproject(clientX - rect.left, clientY - rect.top);
    const c = Math.floor(u);
    const r = Math.floor(v);
    if (r < 0 || r >= state.rows || c < 0 || c >= state.cols) return null;
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

  const drawProjectedCell = (u, v) => {
    const p1 = project(u, v);
    const p2 = project(u + 1, v);
    const p3 = project(u + 1, v + 1);
    const p4 = project(u, v + 1);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
  };

  const drawBoardBase = () => {
    const p00 = project(0, 0), p10 = project(state.cols, 0), p11 = project(state.cols, state.rows), p01 = project(0, state.rows);
    ctx.fillStyle = '#e4c894';
    ctx.beginPath();
    ctx.moveTo(p00.x, p00.y + boardThickness);
    ctx.lineTo(p10.x, p10.y + boardThickness);
    ctx.lineTo(p11.x, p11.y + boardThickness);
    ctx.lineTo(p01.x, p01.y + boardThickness);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#d6b980';
    ctx.beginPath();
    ctx.moveTo(p10.x, p10.y);
    ctx.lineTo(p11.x, p11.y);
    ctx.lineTo(p11.x, p11.y + boardThickness);
    ctx.lineTo(p10.x, p10.y + boardThickness);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ccb174';
    ctx.beginPath();
    ctx.moveTo(p01.x, p01.y);
    ctx.lineTo(p11.x, p11.y);
    ctx.lineTo(p11.x, p11.y + boardThickness);
    ctx.lineTo(p01.x, p01.y + boardThickness);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f6e9ca';
    ctx.beginPath();
    ctx.moveTo(p00.x, p00.y);
    ctx.lineTo(p10.x, p10.y);
    ctx.lineTo(p11.x, p11.y);
    ctx.lineTo(p01.x, p01.y);
    ctx.closePath();
    ctx.fill();
  };

  const drawTargetGrid = () => {
    const s = unit();
    const axisU = project(1, 0);
    const axisO = project(0, 0);
    const textAngle = Math.atan2(axisU.y - axisO.y, axisU.x - axisO.x);

    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const centerP = project(c + 0.5, r + 0.5);
        const t = state.targetGrid[r]?.[c];

        if (t) {
          drawProjectedCell(c + 0.06, r + 0.06);
          // 内层引导块用缩小单元格（通过缩放到中心点实现）
          ctx.save();
          ctx.translate(centerP.x, centerP.y);
          const p1 = project(c, r); const p2 = project(c + 1, r); const p3 = project(c + 1, r + 1); const p4 = project(c, r + 1);
          ctx.beginPath();
          ctx.moveTo((p1.x - centerP.x) * 0.92, (p1.y - centerP.y) * 0.92);
          ctx.lineTo((p2.x - centerP.x) * 0.92, (p2.y - centerP.y) * 0.92);
          ctx.lineTo((p3.x - centerP.x) * 0.92, (p3.y - centerP.y) * 0.92);
          ctx.lineTo((p4.x - centerP.x) * 0.92, (p4.y - centerP.y) * 0.92);
          ctx.closePath();
          if (state.displayMode === 'color') {
            ctx.fillStyle = `${t}55`;
            ctx.fill();
          } else {
            ctx.fillStyle = 'rgba(255,255,255,0.78)';
            ctx.fill();
          }
          ctx.restore();

          if (state.displayMode === 'code') {
            ctx.save();
            ctx.translate(centerP.x, centerP.y + 1);
            ctx.rotate(textAngle);
            ctx.fillStyle = '#5f4f47';
            ctx.font = `${Math.max(8, s * 0.42)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(colorToCode[t] || '--', 0, 0);
            ctx.restore();
          }
        }

        drawProjectedCell(c, r);
        ctx.strokeStyle = 'rgba(183,146,104,0.45)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 中央孔位：使用与当前单元一致的方向矢量绘制小菱形
        const px = project(c + 0.5, r + 0.5);
        const pu = project(c + 0.58, r + 0.5);
        const pv = project(c + 0.5, r + 0.58);
        const vx = { x: pu.x - px.x, y: pu.y - px.y };
        const vy = { x: pv.x - px.x, y: pv.y - px.y };
        ctx.beginPath();
        ctx.moveTo(px.x + vx.x, px.y + vx.y);
        ctx.lineTo(px.x + vy.x, px.y + vy.y);
        ctx.lineTo(px.x - vx.x, px.y - vx.y);
        ctx.lineTo(px.x - vy.x, px.y - vy.y);
        ctx.closePath();
        ctx.fillStyle = '#efc59d';
        ctx.fill();
        ctx.strokeStyle = 'rgba(145,115,90,0.25)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  };

  const drawBeadAtCell = (c, r, color) => {
    const p1 = project(c, r);
    const p2 = project(c + 1, r);
    const p3 = project(c + 1, r + 1);
    const p4 = project(c, r + 1);
    const center = project(c + 0.5, r + 0.5);

    const drawInsetCell = (scale, yOffset = 0) => {
      ctx.beginPath();
      ctx.moveTo(center.x + (p1.x - center.x) * scale, center.y + (p1.y - center.y) * scale + yOffset);
      ctx.lineTo(center.x + (p2.x - center.x) * scale, center.y + (p2.y - center.y) * scale + yOffset);
      ctx.lineTo(center.x + (p3.x - center.x) * scale, center.y + (p3.y - center.y) * scale + yOffset);
      ctx.lineTo(center.x + (p4.x - center.x) * scale, center.y + (p4.y - center.y) * scale + yOffset);
      ctx.closePath();
    };

    drawInsetCell(0.9, -4);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.stroke();

    drawInsetCell(0.78, -1);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;

    drawInsetCell(0.2, -3);
    ctx.fillStyle = 'rgba(120,100,90,0.3)';
    ctx.fill();
  };

  const drawTweezers = () => {
    if (!state.pointer.inside) return;
    const { x, y } = state.pointer;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(109,149,201,.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 40, y - 66);
    ctx.lineTo(x - 7, y + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 26, y - 78);
    ctx.lineTo(x + 7, y - 6);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(180,120,220,.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 46, y - 72);
    ctx.lineTo(x - 12, y - 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 32, y - 84);
    ctx.lineTo(x + 1, y - 10);
    ctx.stroke();

    if (state.selected) {
      drawDiamond(x + 8, y + 8, 12, 7);
      ctx.fillStyle = state.selected;
      ctx.fill();
    }
    ctx.restore();
  };

  let cachedBaseImage = null;
  let sceneDirty = true;

  const drawScene = () => {
    ctx.fillStyle = '#efe4c6';
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawBoardBase();
    drawTargetGrid();
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        if (state.grid[r]?.[c]) drawBeadAtCell(c, r, state.grid[r][c]);
      }
    }
  };

  const renderFrame = () => {
    if (sceneDirty || !cachedBaseImage) {
      drawScene();
      cachedBaseImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      sceneDirty = false;
    } else {
      ctx.putImageData(cachedBaseImage, 0, 0);
    }
    drawTweezers();
  };

  let drawQueued = false;
  const requestDraw = (full = true) => {
    if (full) sceneDirty = true;
    if (drawQueued) return;
    drawQueued = true;
    requestAnimationFrame(() => {
      drawQueued = false;
      renderFrame();
    });
  };

  const paintAt = (clientX, clientY, erase = false) => {
    const cell = toCell(clientX, clientY);
    if (!cell) return;
    if (erase || state.selected === null) state.grid[cell.r][cell.c] = null;
    else if (!state.grid[cell.r][cell.c]) state.grid[cell.r][cell.c] = state.selected;
    requestDraw();
  };

  const runKMeans = (pixels, k, iterations = 10) => {
    const centers = [];
    const step = Math.max(1, Math.floor(pixels.length / k));
    for (let i = 0; i < k; i++) centers.push([...pixels[Math.min(i * step, pixels.length - 1)]]);
    const labels = new Array(pixels.length).fill(0);

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < pixels.length; i++) {
        let best = 0;
        let bestD = Infinity;
        for (let c = 0; c < centers.length; c++) {
          const d = colorDist(pixels[i], centers[c]);
          if (d < bestD) {
            bestD = d;
            best = c;
          }
        }
        labels[i] = best;
      }

      const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
      for (let i = 0; i < pixels.length; i++) {
        const l = labels[i];
        sums[l][0] += pixels[i][0];
        sums[l][1] += pixels[i][1];
        sums[l][2] += pixels[i][2];
        sums[l][3]++;
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
    off.width = state.cols;
    off.height = state.rows;
    const octx = off.getContext('2d');
    octx.clearRect(0, 0, state.cols, state.rows);

    const scale = Math.min(state.cols / img.width, state.rows / img.height);
    const dw = Math.max(1, Math.floor(img.width * scale));
    const dh = Math.max(1, Math.floor(img.height * scale));
    const dx = Math.floor((state.cols - dw) / 2);
    const dy = Math.floor((state.rows - dh) / 2);

    octx.fillStyle = '#f5f1e9';
    octx.fillRect(0, 0, state.cols, state.rows);
    octx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);

    const imgData = octx.getImageData(0, 0, state.cols, state.rows).data;
    const pixels = [];
    for (let i = 0; i < imgData.length; i += 4) pixels.push([imgData[i], imgData[i + 1], imgData[i + 2]]);

    const { centers, labels } = runKMeans(pixels, k, 12);
    const centerToHex = centers.map((c) => nearestPaletteHex(c));

    state.targetGrid = createGrid(state.rows, state.cols);
    let idx = 0;
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        state.targetGrid[r][c] = centerToHex[labels[idx++]];
      }
    }
    requestDraw();
  };

  const loadCatPattern = () => {
    const pattern = [
      '.................11111', '..................1....', '......1...........1....', '.....11.1..............',
      '....111111111.....1....', '....11.1...............', '....11..................', '....11..1......11....11',
      '....11.....1...11....11', '....111..1....111....11', '....111...1..1111....11', '....1111111111111111111',
      '....1111111111111111111', '....1111111111111111111', '....2111111111111111111', '.....211111111111111111',
      '......21111111111111111', '.......2222222222111111'
    ];

    state.targetGrid = createGrid(state.rows, state.cols);
    const rowOffset = Math.max(0, Math.floor((state.rows - pattern.length) / 2));
    const colOffset = Math.max(0, Math.floor((state.cols - 22) / 2));

    pattern.forEach((row, r) => {
      [...row].forEach((ch, c) => {
        const rr = r + rowOffset;
        const cc = c + colOffset;
        if (rr >= state.rows || cc >= state.cols) return;
        if (ch === '1') state.targetGrid[rr][cc] = '#F5F1E9';
        if (ch === '2') state.targetGrid[rr][cc] = '#D7D7D7';
      });
    });
    requestDraw();
  };

  const applyBoardSize = () => {
    const colsInput = Number(document.getElementById('boardCols').value);
    const rowsInput = Number(document.getElementById('boardRows').value);
    const cols = Math.max(MIN_GRID, Math.min(MAX_GRID, colsInput || state.cols));
    const rows = Math.max(MIN_GRID, Math.min(MAX_GRID, rowsInput || state.rows));

    state.cols = cols;
    state.rows = rows;
    state.grid = createGrid(rows, cols);
    state.targetGrid = createGrid(rows, cols);
    loadCatPattern();
    requestDraw();
  };

  const rotateBySmallStep = (dir) => {
    const step = Math.PI / 36; // 5度/次
    state.yawAngle += dir * step;
    requestDraw();
  };

  const mountPalette = () => {
    tray.innerHTML = '';
    palette.forEach((p) => {
      const btn = document.createElement('button');
      btn.className = 'color-bin';
      btn.title = p.name;
      if (p.value === state.selected) btn.classList.add('active');
      btn.innerHTML = `<div class="bead-sample" style="--c:${p.value || '#888'}"></div>`;
      btn.onclick = () => {
        state.selected = p.value;
        mountPalette();
        requestDraw();
      };
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
    cachedBaseImage = null;
    sceneDirty = true;
    requestDraw();
  };

  document.getElementById('clearBtn').onclick = () => {
    state.grid = createGrid(state.rows, state.cols);
    requestDraw();
  };
  document.getElementById('catBtn').onclick = loadCatPattern;
  document.getElementById('rotLBtn').onclick = () => rotateBySmallStep(-1);
  document.getElementById('rotRBtn').onclick = () => rotateBySmallStep(1);
  document.getElementById('resizeBoardBtn').onclick = applyBoardSize;

  document.getElementById('modeBtn').onclick = (e) => {
    state.displayMode = state.displayMode === 'code' ? 'color' : 'code';
    e.currentTarget.textContent = `模式：${state.displayMode === 'code' ? '色号' : '目标颜色'}`;
    requestDraw();
  };

  document.getElementById('imageInput').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      state.sourceImage = img;
    };
    img.src = URL.createObjectURL(file);
  });

  document.getElementById('convertBtn').onclick = () => {
    if (!state.sourceImage) return alert('请先上传图片');
    const k = Number(document.getElementById('kInput').value) || 6;
    imageToTemplate(state.sourceImage, Math.min(12, Math.max(2, k)));
  };

  document.getElementById('fitBtn').onclick = () => {
    if (!state.sourceImage) return alert('请先上传图片');
    state.grid = createGrid(state.rows, state.cols);
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
    else requestDraw(false);
  });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    state.zoom = Math.max(0.4, Math.min(2.4, state.zoom + delta));
    requestDraw();
  }, { passive: false });

  window.addEventListener('pointerup', () => {
    state.dragging = false;
  });
  canvas.addEventListener('pointerleave', () => {
    state.pointer.inside = false;
    requestDraw(false);
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('resize', resize);

  mountPalette();
  loadCatPattern();
  resize();
})();
