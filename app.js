(() => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const tray = document.getElementById('tray');
  const targetLegend = document.getElementById('targetLegend');

  const boardThickness = 26;
  const MIN_GRID = 8;
  const MAX_GRID = 120;

  const hexToRgb = (hex) => {
    const v = hex.replace('#', '');
    return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
  };

  const paletteEntries = [
    ['A1', '#FAF4C8'], ['A2', '#FFFFD5'], ['A3', '#FEFF8B'], ['A4', '#FBED56'], ['A5', '#F4D738'], ['A6', '#FEAC4C'], ['A7', '#FE8B4C'], ['A8', '#FFDA45'], ['A9', '#FF995B'],
    ['A10', '#F77C31'], ['A11', '#FFDD99'], ['A12', '#FE9F72'], ['A13', '#FFC365'], ['A14', '#FD543D'], ['A15', '#FFF365'], ['A16', '#FFFF9F'], ['A17', '#FFE36E'], ['A18', '#FEBE7D'], ['A19', '#FD7C72'],
    ['A20', '#FFD568'], ['A21', '#FFE395'], ['A22', '#F4F57D'], ['A23', '#E6C9B7'], ['A24', '#F7F8A2'], ['A25', '#FFD67D'], ['A26', '#FFC830'],
    ['B1', '#E6EE31'], ['B2', '#63F347'], ['B3', '#9EF780'], ['B4', '#5DE035'], ['B5', '#35E352'], ['B6', '#65E2A6'], ['B7', '#3DAF80'], ['B8', '#1C9C4F'], ['B9', '#27523A'], ['B10', '#95D3C2'],
    ['B11', '#5D722A'], ['B12', '#166F41'], ['B13', '#CAEB7B'], ['B14', '#ADE946'], ['B15', '#2E5132'], ['B16', '#C5ED9C'], ['B17', '#9BB13A'], ['B18', '#E6EE49'], ['B19', '#24B88C'], ['B20', '#C2F0CC'],
    ['B21', '#156A6B'], ['B22', '#0B3C43'], ['B23', '#303A21'], ['B24', '#EEFCA5'], ['B25', '#4E846D'], ['B26', '#8D7A35'], ['B27', '#CCE1AF'], ['B28', '#9EE5B9'], ['B29', '#C5E254'], ['B30', '#E2FCB1'], ['B31', '#B0E792'], ['B32', '#9CAB5A'],
    ['C1', '#E8FFE7'], ['C2', '#A9F9FC'], ['C3', '#A0E2FB'], ['C4', '#41CCFF'], ['C5', '#01ACEB'], ['C6', '#50AAF0'], ['C7', '#3677D2'], ['C8', '#0F54C0'], ['C9', '#324BCA'], ['C10', '#3EBCE2'],
    ['C11', '#28DDDE'], ['C12', '#1C334D'], ['C13', '#CDE8FF'], ['C14', '#D5FDFF'], ['C15', '#22C4C6'], ['C16', '#1557A8'], ['C17', '#04D1F6'], ['C18', '#1D3344'], ['C19', '#1887A2'], ['C20', '#176DAF'],
    ['C21', '#BEDDFF'], ['C22', '#67B4BE'], ['C23', '#C8E2FF'], ['C24', '#7CC4FF'], ['C25', '#A9E5E5'], ['C26', '#3CAED8'], ['C27', '#D3DFFA'], ['C28', '#BBCFED'], ['C29', '#34488E'],
    ['D1', '#AEB4F2'], ['D2', '#858EDD'], ['D3', '#2F54AF'], ['D4', '#182A84'], ['D5', '#B843C5'], ['D6', '#AC7BDE'], ['D7', '#8854B3'], ['D8', '#E2D3FF'], ['D9', '#D5B9F8'], ['D10', '#361851'],
    ['D11', '#B9BAE1'], ['D12', '#DE9AD4'], ['D13', '#B90095'], ['D14', '#8B279B'], ['D15', '#2F1F90'], ['D16', '#E3E1EE'], ['D17', '#C4D4F6'], ['D18', '#A45EC7'], ['D19', '#D8C3D7'], ['D20', '#9C32B2'],
    ['D21', '#9A009B'], ['D22', '#333A95'], ['D23', '#EBDAFC'], ['D24', '#7786E5'], ['D25', '#494FC7'], ['D26', '#DFC2F8'],
    ['E1', '#FDD3CC'], ['E2', '#FEC0DF'], ['E3', '#FFB7E7'], ['E4', '#E8649E'], ['E5', '#F551A2'], ['E6', '#F13D74'], ['E7', '#C63478'], ['E8', '#FFDBE9'], ['E9', '#E970CC'], ['E10', '#D33793'],
    ['E11', '#FCDDD2'], ['E12', '#F78FC3'], ['E13', '#B5006D'], ['E14', '#FFD1BA'], ['E15', '#F8C7C9'], ['E16', '#FFF3EB'], ['E17', '#FFE2EA'], ['E18', '#FFC7DB'], ['E19', '#FEBAD5'], ['E20', '#D8C7D1'],
    ['E21', '#BD9DA1'], ['E22', '#B785A1'], ['E23', '#937A8D'], ['E24', '#E1BCE8'],
    ['F1', '#FD957B'], ['F2', '#FC3D46'], ['F3', '#F74941'], ['F4', '#FC283C'], ['F5', '#E7002F'], ['F6', '#943630'], ['F7', '#971937'], ['F8', '#BC0028'], ['F9', '#E2677A'], ['F10', '#8A4526'],
    ['F11', '#5A2121'], ['F12', '#FD4E6A'], ['F13', '#F35744'], ['F14', '#FFA9AD'], ['F15', '#D30022'], ['F16', '#FEC2A6'], ['F17', '#E69C79'], ['F18', '#D37C46'], ['F19', '#C1444A'], ['F20', '#CD9391'],
    ['F21', '#F7B4C6'], ['F22', '#FDC0D0'], ['F23', '#F67E66'], ['F24', '#E698AA'], ['F25', '#E54B4F'],
    ['G1', '#FFE2CE'], ['G2', '#FFC4AA'], ['G3', '#F4C3A5'], ['G4', '#E1B383'], ['G5', '#EDB045'], ['G6', '#E99C17'], ['G7', '#9D5B3E'], ['G8', '#753832'], ['G9', '#E6B483'], ['G10', '#D98C39'],
    ['G11', '#E0C593'], ['G12', '#FFC890'], ['G13', '#B7714A'], ['G14', '#8D614C'], ['G15', '#FCF9E0'], ['G16', '#F2D9BA'], ['G17', '#78524B'], ['G18', '#FFE4CC'], ['G19', '#E07935'], ['G20', '#A94023'], ['G21', '#B88558'],
    ['H1', '#FDFBFF'], ['H2', '#FEFFFF'], ['H3', '#B6B1BA'], ['H4', '#89858C'], ['H5', '#48464E'], ['H6', '#2F2B2F'], ['H7', '#000000'], ['H8', '#E7D6DB'], ['H9', '#EDEDED'], ['H10', '#EEE9EA'],
    ['H11', '#CECDD5'], ['H12', '#FFF5ED'], ['H13', '#F5ECD2'], ['H14', '#CFD7D3'], ['H15', '#98A6A8'], ['H16', '#1D1414'], ['H17', '#F1EDED'], ['H18', '#FFFDF0'], ['H19', '#F6EFE2'], ['H20', '#949FA3'], ['H21', '#FFFBE1'], ['H22', '#CACAD4'], ['H23', '#9A9D94'],
    ['M1', '#BCC6B8'], ['M2', '#8AA386'], ['M3', '#697D80'], ['M4', '#E3D2BC'], ['M5', '#D0CCAA'], ['M6', '#B0A782'], ['M7', '#B4A497'], ['M8', '#B38281'], ['M9', '#A58767'], ['M10', '#C5B2BC'], ['M11', '#9F7594'], ['M12', '#644749'], ['M13', '#D19066'], ['M14', '#C77362'], ['M15', '#757D78'],
    ['P1', '#FCF7F8'], ['P2', '#B0A9AC'], ['P3', '#AFDCAB'], ['P4', '#FEA49F'], ['P5', '#EE8C3E'], ['P6', '#5FD0A7'], ['P7', '#EB9270'], ['P8', '#F0D958'], ['P9', '#D9D9D9'], ['P10', '#D9C7EA'],
    ['P11', '#F3ECC9'], ['P12', '#E6EEF2'], ['P13', '#AACBEF'], ['P14', '#337680'], ['P15', '#668575'], ['P16', '#FEBF45'], ['P17', '#FEA324'], ['P18', '#FEB89F'], ['P19', '#FFFEEC'], ['P20', '#FEBECF'], ['P21', '#ECBEBF'], ['P22', '#E4A89F'], ['P23', '#A56268'],
    ['Q1', '#F2A5E8'], ['Q2', '#E9EC91'], ['Q3', '#FFFF00'], ['Q4', '#FFEBFA'], ['Q5', '#76CEDE'],
    ['R1', '#D50D21'], ['R2', '#F92F83'], ['R3', '#FD8324'], ['R4', '#F8EC31'], ['R5', '#35C75B'], ['R6', '#238891'], ['R7', '#19779D'], ['R8', '#1A60C3'], ['R9', '#9A56B4'], ['R10', '#FFDB4C'],
    ['R11', '#FFEBFA'], ['R12', '#D8D5CE'], ['R13', '#55514C'], ['R14', '#9FE4DF'], ['R15', '#77CEE9'], ['R16', '#3ECFCA'], ['R17', '#4A867A'], ['R18', '#7FCD9D'], ['R19', '#CDE55D'], ['R20', '#E8C7B4'],
    ['R21', '#AD6F3C'], ['R22', '#6C372F'], ['R23', '#FEB872'], ['R24', '#F3C1C0'], ['R25', '#C9675E'], ['R26', '#D293BE'], ['R27', '#EA8CB1'], ['R28', '#9C87D6'],
    ['T1', '#FFFFFF'],
    ['Y1', '#FD6FB4'], ['Y2', '#FEB481'], ['Y3', '#D7FAA0'], ['Y4', '#8BDBFA'], ['Y5', '#E987EA'],
    ['ZG1', '#DAABB3'], ['ZG2', '#D6AA87'], ['ZG3', '#C1BD8D'], ['ZG4', '#96869F'], ['ZG5', '#8490A6'], ['ZG6', '#94BFE2'], ['ZG7', '#E2A9D2'], ['ZG8', '#AB91C0']
  ];

  const colorFamilies = [];
  const familyMap = new Map();
  paletteEntries.forEach(([code, value]) => {
    const m = code.match(/^([A-Z]+)(\d+)$/);
    if (!m) return;
    const prefix = m[1];
    if (!familyMap.has(prefix)) {
      const family = { prefix, name: `${prefix}色系` };
      familyMap.set(prefix, family);
      colorFamilies.push(family);
    }
  });

  const generatePalette = () => paletteEntries.map(([code, value]) => {
    const m = code.match(/^([A-Z]+)(\d+)$/);
    const prefix = m ? m[1] : '';
    const family = familyMap.get(prefix);
    return {
      name: `${family?.name || '颜色'} ${code}`,
      code,
      value
    };
  });

  const palette = [...generatePalette(), { name: '橡皮擦', code: 'ER', value: null }];

  const paintColors = palette.filter((p) => p.value);
  const colorToCode = Object.fromEntries(paintColors.map((p) => [p.value, p.code]));

  const createGrid = (rows, cols, fill = null) => Array.from({ length: rows }, () => Array(cols).fill(fill));

  const firstFamily = colorFamilies[0].prefix;
  const familySelections = Object.fromEntries(colorFamilies.map((family) => {
    const firstColor = paintColors.find((item) => item.code.startsWith(family.prefix));
    return [family.prefix, firstColor?.code || null];
  }));

  const state = {
    cols: 22,
    rows: 34,
    zoom: 1,
    selected: paintColors[0].value,
    activeFamily: firstFamily,
    familySelections,
    grid: createGrid(34, 22),
    targetGrid: createGrid(34, 22),
    displayMode: 'code',
    dragging: false,
    pointer: { x: 0, y: 0, inside: false },
    yawAngle: 0,
    sourceImage: null
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

  const getTargetUsedColors = () => {
    const set = new Set();
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const t = state.targetGrid[r]?.[c];
        if (t) set.add(t);
      }
    }
    return [...set];
  };

  const drawTargetBlinkOverlay = () => {
    if (!state.selected) return false;
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 220);
    const fillAlpha = 0.1 + pulse * 0.25;
    const strokeAlpha = 0.35 + pulse * 0.55;
    let hasMatch = false;

    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const t = state.targetGrid[r]?.[c];
        if (!t || t !== state.selected) continue;
        // 已正确填充的格子不再高亮闪烁
        if (state.grid[r]?.[c] === t) continue;
        hasMatch = true;
        drawProjectedCell(c + 0.03, r + 0.03);
        ctx.fillStyle = `rgba(255, 243, 122, ${fillAlpha.toFixed(3)})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 125, 60, ${strokeAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    }

    return hasMatch;
  };

  const renderTargetLegend = () => {
    const usedColors = getTargetUsedColors();
    const showLegend = state.displayMode === 'color' && usedColors.length > 0;
    targetLegend.classList.toggle('hidden', !showLegend);
    if (!showLegend) {
      targetLegend.innerHTML = '';
      return;
    }

    const sorted = usedColors
      .map((value) => ({ value, code: colorToCode[value] || '--' }))
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

    targetLegend.innerHTML = '';
    const title = document.createElement('span');
    title.className = 'legend-title';
    title.textContent = '目标图例：';
    targetLegend.appendChild(title);

    sorted.forEach((item) => {
      const chip = document.createElement('button');
      chip.className = 'legend-chip';
      if (state.selected === item.value) chip.classList.add('active');
      chip.innerHTML = `<span class="legend-dot" style="background:${item.value}"></span><span class="legend-code">${item.code}</span>`;
      chip.onclick = () => {
        state.selected = item.value;
        mountPalette();
        renderTargetLegend();
        requestDraw(false);
      };
      targetLegend.appendChild(chip);
    });
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

    const blinking = drawTargetBlinkOverlay();
    drawTweezers();
    if (blinking) requestDraw(false);
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
    renderTargetLegend();
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
        if (ch === '1') state.targetGrid[rr][cc] = paintColors.find((p) => p.code === 'H2')?.value || '#F2F2EE';
        if (ch === '2') state.targetGrid[rr][cc] = paintColors.find((p) => p.code === 'H10')?.value || '#B4B6AB';
      });
    });
    renderTargetLegend();
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

    colorFamilies.forEach((family) => {
      const familyColors = paintColors.filter((item) => item.code.startsWith(family.prefix));
      if (!familyColors.length) return;

      const selectedCode = state.familySelections[family.prefix] || familyColors[0].code;
      const activeColor = familyColors.find((item) => item.code === selectedCode) || familyColors[0];
      state.familySelections[family.prefix] = activeColor.code;

      const block = document.createElement('div');
      block.className = 'family-bin';
      if (state.selected === activeColor.value) block.classList.add('active');

      const swatch = document.createElement('button');
      swatch.className = 'family-swatch';
      swatch.title = `${family.name}（${activeColor.code}）`;
      swatch.innerHTML = `<div class="bead-sample" style="--c:${activeColor.value}"></div><span>${family.prefix}</span>`;
      swatch.onclick = () => {
        state.selected = activeColor.value;
        state.activeFamily = family.prefix;
        mountPalette();
        renderTargetLegend();
        requestDraw();
      };

      const selector = document.createElement('select');
      selector.className = 'family-select';
      familyColors.forEach((item) => {
        const op = document.createElement('option');
        op.value = item.code;
        op.textContent = item.code.replace(family.prefix, '');
        selector.appendChild(op);
      });
      selector.value = activeColor.code;
      selector.onchange = (e) => {
        const picked = familyColors.find((item) => item.code === e.target.value);
        if (!picked) return;
        state.familySelections[family.prefix] = picked.code;
        state.selected = picked.value;
        state.activeFamily = family.prefix;
        mountPalette();
        renderTargetLegend();
        requestDraw();
      };

      const tag = document.createElement('div');
      tag.className = 'family-tag';
      tag.textContent = `${family.prefix} ${family.name}`;

      block.appendChild(swatch);
      block.appendChild(selector);
      block.appendChild(tag);
      tray.appendChild(block);
    });

    const eraserBtn = document.createElement('button');
    eraserBtn.className = 'family-bin eraser-bin';
    if (state.selected === null) eraserBtn.classList.add('active');
    eraserBtn.innerHTML = '<span class="eraser-mark">橡皮擦</span>';
    eraserBtn.onclick = () => {
      state.selected = null;
      mountPalette();
      renderTargetLegend();
      requestDraw();
    };
    tray.appendChild(eraserBtn);
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
    renderTargetLegend();
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
  renderTargetLegend();
  resize();
})();
