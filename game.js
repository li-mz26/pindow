// pindow - 拼豆设计师 微信小游戏
// 基于 Web 版移植

const CONFIG = {
  boardWidth: 22,
  boardHeight: 34,
  beadSize: 20,
};

const PALETTE = [
  ['A1', '#FAF4C8'], ['A2', '#FFFFD5'], ['A3', '#FEFF8B'], ['A4', '#FBED56'], ['A5', '#F4D738'], ['A6', '#FEAC4C'], ['A7', '#FE8B4C'], ['A8', '#FFDA45'], ['A9', '#FF995B'],
  ['A10', '#F77C31'], ['A11', '#FFDD99'], ['A12', '#FE9F72'], ['A13', '#FFC365'], ['A14', '#FD543D'], ['A15', '#FFF365'], ['A16', '#FFFF9F'], ['A17', '#FFE36E'], ['A18', '#FEBE7D'], ['A19', '#FD7C72'],
  ['A20', '#FFD568'], ['A21', '#FFE395'], ['A22', '#F4F57D'], ['A23', '#E6C9B7'], ['A24', '#F7F8A2'], ['A25', '#FFD67D'], ['A26', '#FFC830'],
  ['B1', '#E6EE31'], ['B2', '#63F347'], ['B3', '#9EF780'], ['B4', '#5DE035'], ['B5', '#35E352'], ['B6', '#65E2A6'], ['B7', '#3DAF80'], ['B8', '#1C9C4F'], ['B9', '#27523A'], ['B10', '#95D3C2'],
  ['B11', '#5D722A'], ['B12', '#166F41'], ['B13', '#CAEB7B'], ['B14', '#ADE946'], ['B15', '#2E5132'], ['B16', '#C5ED9C'], ['B17', '#9BB13A'], ['B18', '#E6EE49'], ['B19', '#24B88C'], ['B20', '#C2F0CC'],
  ['C1', '#BADDE6'], ['C2', '#A6D4E8'], ['C3', '#DDEBF2'], ['C4', '#A4D8D8'], ['C5', '#85C1CB'], ['C6', '#8FCAD8'], ['C7', '#A3C9D9'], ['C8', '#6EA7B2'], ['C9', '#7FB0BF'],
  ['C10', '#99C2D9'], ['C11', '#E5EFF5'], ['C12', '#7BA9B9'], ['C13', '#6B9CAA'], ['C14', '#A9CEDA'], ['C15', '#98B4C4'], ['C16', '#C2DDE7'], ['C17', '#C7DCE8'], ['C18', '#ABC8DB'], ['C19', '#ABC5D2'],
  ['C20', '#B6D2DB'], ['C21', '#BEDDFF'], ['C22', '#67B4BE'], ['C23', '#C8E2FF'], ['C24', '#7CC4FF'], ['C25', '#A9E5E5'], ['C26', '#3CAED8'], ['C27', '#D3DFFA'], ['C28', '#BBCFED'], ['C29', '#34488E'],
  ['D1', '#F8F3D4'], ['D2', '#F3E7C4'], ['D3', '#F7E2B8'], ['D4', '#F6D995'], ['D5', '#EED282'], ['D6', '#EBC273'], ['D7', '#E2B36D'], ['D8', '#DDA36D'], ['D9', '#D68E59'],
  ['D10', '#C97D4D'], ['D11', '#F4E6C8'], ['D12', '#EEDCBE'], ['D13', '#EBD3B3'], ['D14', '#E2C9A4'], ['D15', '#D7BC94'], ['D16', '#D1B08C'], ['D17', '#CAA679'], ['D18', '#BE9466'], ['D19', '#B18654'],
  ['D20', '#9C6F45'], ['D21', '#F0E2C5'], ['D22', '#EBD6B6'], ['D23', '#DBC7A8'], ['D24', '#CDB691'], ['D25', '#C0A57C'], ['D26', '#B69268'], ['D27', '#A98255'], ['D28', '#947048'],
  ['E1', '#EBC2B1'], ['E2', '#F0CFC2'], ['E3', '#EFD8CE'], ['E4', '#E9C4B3'], ['E5', '#DDB39E'], ['E6', '#D2A18C'], ['E7', '#C88F79'], ['E8', '#BD7C66'], ['E9', '#B16A54'],
  ['E10', '#A65843'], ['E11', '#F2DDD6'], ['E12', '#EAD1C8'], ['E13', '#E3C4B8'], ['E14', '#DBB5A6'], ['E15', '#D2A492'], ['E16', '#C9947E'], ['E17', '#BE846B'], ['E18', '#B37359'], ['E19', '#A66348'],
  ['E20', '#96533B'], ['E21', '#EDE4DB'], ['E22', '#E4D6CC'], ['E23', '#DAC8BA'], ['E24', '#CEB8A5'], ['E25', '#C1A78F'], ['E26', '#B5967A'], ['E27', '#A78566'], ['E28', '#987453'],
  ['F1', '#DDE3D9'], ['F2', '#CED6D0'], ['F3', '#BEC9C1'], ['F4', '#ADBCB1'], ['F5', '#9CAFA1'], ['F6', '#8CA291'], ['F7', '#7B9582'], ['F8', '#6A8872'], ['F9', '#5A7B63'],
  ['F10', '#496E53'], ['F11', '#D1DDD2'], ['F12', '#C0D1C3'], ['F13', '#ADC4B3'], ['F14', '#9BB6A2'], ['F15', '#89A892'], ['F16', '#779A81'], ['F17', '#668C71'], ['F18', '#557E60'], ['F19', '#447050'],
  ['F20', '#336240'], ['F21', '#E3E9E1'], ['F22', '#D4DED5'], ['F23', '#C4D2C8'], ['F24', '#B3C6BA'], ['F25', '#A3B9AC'], ['F26', '#92AD9E'], ['F27', '#81A18F'], ['F28', '#719581'],
  ['G1', '#FCDFD5'], ['G2', '#FBD4CC'], ['G3', '#FAC9C2'], ['G4', '#F8BDB7'], ['G5', '#F6B2AC'], ['G6', '#F3A09D'], ['G7', '#EE8E89'], ['G8', '#E87C75'], ['G9', '#E06A62'],
  ['G10', '#D8584E'], ['G11', '#FBD9D3'], ['G12', '#F8CCC4'], ['G13', '#F4BDB4'], ['G14', '#F0ADA3'], ['G15', '#EB9E93'], ['G16', '#E68E82'], ['G17', '#E07F72'], ['G18', '#DB6F61'], ['G19', '#D55F51'],
  ['G20', '#C54F41'], ['G21', '#FBD8D1'], ['G22', '#F8C8BE'], ['G23', '#F4B7AA'], ['G24', '#F0A697'], ['G25', '#EB9584'], ['G26', '#E68472'], ['G27', '#E0735F'], ['G28', '#DB624D'],
  ['H1', '#F2F2EE'], ['H2', '#EBECE8'], ['H3', '#E2E4E2'], ['H4', '#D7DAD8'], ['H5', '#CDD0CE'], ['H6', '#C2C6C4'], ['H7', '#B6BABB'], ['H8', '#ABAFAD'], ['H9', '#9FA39E'],
  ['H10', '#B4B6AB'], ['H11', '#A8ABA9'], ['H12', '#9B9F9D'], ['H13', '#8E9290'], ['H14', '#818584'], ['H15', '#747878'], ['H16', '#676B6B'], ['H17', '#5A5E5E'], ['H18', '#4D5151'], ['H19', '#404445'],
  ['H20', '#333738'], ['H21', '#D1D3D1'], ['H22', '#C4C7C4'], ['H23', '#B6BAB6'], ['H24', '#A8ADA8'], ['H25', '#9AA09B'], ['H26', '#8C938D'], ['H27', '#7E8680'], ['H28', '#707973'],
  ['I1', '#FBF8F0'], ['I2', '#F5F1E8'], ['I3', '#EEEAE0'], ['I4', '#E7E3D7'], ['I5', '#DFDCCE'], ['I6', '#D8D4C6'], ['I7', '#D0CCBD'], ['I8', '#C8C4B5'], ['I9', '#C0BCAC'],
  ['I10', '#B8B4A3'], ['I11', '#F0EDE6'], ['I12', '#E8E4DB'], ['I13', '#E0DBD1'], ['I14', '#D7D2C6'], ['I15', '#CFC8BC'], ['I16', '#C7BFB1'], ['I17', '#BFB5A7'], ['I18', '#B7AC9C'], ['I19', '#AFA292'],
  ['I20', '#A79887'], ['I21', '#EBE8E0'], ['I22', '#E3E0D7'], ['I23', '#DBD7CE'], ['I24', '#D2CEC4'], ['I25', '#CAC5BB'], ['I26', '#C1BCB1'], ['I27', '#B9B3A8'], ['I28', '#B0AA9E'],
  ['J1', '#F3F1E9'], ['J2', '#EBE9E1'], ['J3', '#E3E0D9'], ['J4', '#DBD8D0'], ['J5', '#D3CFC7'], ['J6', '#CCC6BE'], ['J7', '#C4BDB5'], ['J8', '#BCB4AC'], ['J9', '#B4ABA3'],
  ['J10', '#ACA29A'], ['J11', '#EFEDE7'], ['J12', '#E7E5DD'], ['J13', '#DFDCD4'], ['J14', '#D7D4CB'], ['J15', '#CFCCC2'], ['J16', '#C7C3BA'], ['J17', '#BFBAB1'], ['J18', '#B7B1A8'], ['J19', '#AFA89F'],
  ['J20', '#A79F96'], ['K1', '#E9E3D4'], ['K2', '#DDD6C5'], ['K3', '#D2C9B6'], ['K4', '#C6BBA7'], ['K5', '#BBAD99'], ['K6', '#AF9F8B'], ['K7', '#A3917D'], ['K8', '#97836F'], ['K9', '#8B7561'],
  ['K10', '#7F6754'], ['K11', '#E8DFD0'], ['K12', '#DBD3C2'], ['K13', '#CFC6B4'], ['K14', '#C3B9A6'], ['K15', '#B7AC98'], ['K16', '#AB9F8A'], ['K17', '#9F927C'], ['K18', '#93856E'], ['K19', '#877860'],
  ['K20', '#7B6B52'], ['K21', '#E5DCC9'], ['K22', '#D8D0BC'], ['K23', '#CCC4AF'], ['K24', '#C0B7A2'], ['K25', '#B4AA95'], ['K26', '#A89D88'], ['K27', '#9C907B'], ['K28', '#90836E'],
  ['L1', '#F1EEE5'], ['L2', '#E9E6DD'], ['L3', '#E0DDD5'], ['L4', '#D7D4CC'], ['L5', '#CECBC3'], ['L6', '#C5C2BA'], ['L7', '#BCB9B1'], ['L8', '#B3B0A8'], ['L9', '#AAA79F'],
  ['L10', '#A19E96'], ['L11', '#F0EDE6'], ['L12', '#E8E5DD'], ['L13', '#E0DCD4'], ['L14', '#D8D4CB'], ['L15', '#D0CCC3'], ['L16', '#C8C4BB'], ['L17', '#C0BCB3'], ['L18', '#B8B4AB'], ['L19', '#B0ACA3'],
  ['L20', '#A8A49B'], ['M1', '#D8E6EE'], ['M2', '#CEDBE4'], ['M3', '#C3D0D9'], ['M4', '#B8C5CF'], ['M5', '#ADBAC5'], ['M6', '#A2AFBA'], ['M7', '#97A4AF'], ['M8', '#8C99A4'], ['M9', '#818E99'],
  ['M10', '#76838E'], ['M11', '#D3E1E8'], ['M12', '#C8D5DE'], ['M13', '#BDCAD4'], ['M14', '#B2BECA'], ['M15', '#A7B3C0'], ['M16', '#9CA7B5'], ['M17', '#919CAB'], ['M18', '#8690A0'], ['M19', '#7B8596'],
  ['M20', '#70798C'], ['N1', '#E7E4E1'], ['N2', '#DDDBD7'], ['N3', '#D2D0CC'], ['N4', '#C8C5C1'], ['N5', '#BDBAB6'], ['N6', '#B3AFAB'], ['N7', '#A8A4A0'], ['N8', '#9D9995'], ['N9', '#928E8A'],
  ['N10', '#878380'], ['N11', '#E2E0DD'], ['N12', '#D8D5D1'], ['N13', '#CDCAC6'], ['N14', '#C3C0BC'], ['N15', '#B8B5B1'], ['N16', '#AEABA7'], ['N17', '#A3A09C'], ['N18', '#989592'], ['N19', '#8D8A87'],
  ['N20', '#827F7C'], ['O1', '#F0F1F0'], ['O2', '#E8E9E8'], ['O3', '#E0E1E0'], ['O4', '#D8D9D8'], ['O5', '#D0D1D0'], ['O6', '#C8C9C8'], ['O7', '#C0C1C0'], ['O8', '#B8B9B8'], ['O9', '#B0B1B0'],
  ['O10', '#A8A9A8'], ['O11', '#ECEDEC'], ['O12', '#E3E4E3'], ['O13', '#DBDCDB'], ['O14', '#D2D3D2'], ['O15', '#CACBCA'], ['O16', '#C1C2C1'], ['O17', '#B9BAB9'], ['O18', '#B0B1B0'], ['O19', '#A8A9A8'],
  ['O20', '#9FA0A0'], ['P1', '#F3F1EA'], ['P2', '#EBE9E1'], ['P3', '#E4E1D9'], ['P4', '#DCD9D0'], ['P5', '#D5D1C7'], ['P6', '#CDC9BE'], ['P7', '#C6C1B6'], ['P8', '#BEB9AD'], ['P9', '#B7B1A5'],
  ['P10', '#AFA99D'], ['P11', '#F3ECC9'], ['P12', '#E6EEF2'], ['P13', '#AACBEF'], ['P14', '#337680'], ['P15', '#668575'], ['P16', '#FEBF45'], ['P17', '#FEA324'], ['P18', '#FEB89F'], ['P19', '#FFFEEC'], ['P20', '#FEBECF'], ['P21', '#ECBEBF'], ['P22', '#E4A89F'], ['P23', '#A56268'],
];

const paintColors = PALETTE.filter(p => p[1]);

let canvas, ctx;
let state = {
  grid: [],
  targetGrid: null,
  selectedColor: '#F2F2EE',
  selectedCode: 'H1',
  scale: 1,
  panX: 0,
  panY: 0,
  displayMode: 'color', // 'color' | 'code'
  isPanning: false,
  lastPanX: 0,
  lastPanY: 0,
};

function createGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}

function init() {
  // 创建 Canvas
  canvas = wx.createCanvas('canvas', 'game');
  canvas.width = 375 * 2;
  canvas.height = 667 * 2;
  ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  
  // 初始化画板
  state.grid = createGrid(CONFIG.boardHeight, CONFIG.boardWidth);
  
  // 开始渲染循环
  draw();
}

function draw() {
  const w = canvas.width / 2;
  const h = canvas.height / 2;
  
  // 背景
  ctx.fillStyle = '#f5f1e9';
  ctx.fillRect(0, 0, w, h);
  
  // 标题
  ctx.fillStyle = '#5A5E5E';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('拼豆设计师', w / 2, 28);
  
  // 画板区域
  const boardW = CONFIG.boardWidth * CONFIG.beadSize * state.scale;
  const boardH = CONFIG.boardHeight * CONFIG.beadSize * state.scale;
  const startX = (w - boardW) / 2 + state.panX;
  const startY = 50 + state.panY;
  
  // 画板背景
  ctx.fillStyle = '#e8e4db';
  ctx.fillRect(startX, startY, boardW, boardH);
  
  // 绘制目标图案（半透明）
  if (state.targetGrid) {
    for (let r = 0; r < state.targetGrid.length; r++) {
      for (let c = 0; c < state.targetGrid[r].length; c++) {
        const color = state.targetGrid[r][c];
        if (color) {
          const x = startX + c * CONFIG.beadSize * state.scale + CONFIG.beadSize * state.scale / 2;
          const y = startY + r * CONFIG.beadSize * state.scale + CONFIG.beadSize * state.scale / 2;
          ctx.globalAlpha = 0.25;
          drawBead(x, y, color);
          ctx.globalAlpha = 1;
        }
      }
    }
  }
  
  // 绘制珠子
  for (let r = 0; r < state.grid.length; r++) {
    for (let c = 0; c < state.grid[r].length; c++) {
      const color = state.grid[r][c];
      if (color) {
        const x = startX + c * CONFIG.beadSize * state.scale + CONFIG.beadSize * state.scale / 2;
        const y = startY + r * CONFIG.beadSize * state.scale + CONFIG.beadSize * state.scale / 2;
        drawBead(x, y, color);
      }
    }
  }
  
  // 网格线
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  for (let r = 0; r <= CONFIG.boardHeight; r++) {
    ctx.beginPath();
    ctx.moveTo(startX, startY + r * CONFIG.beadSize * state.scale);
    ctx.lineTo(startX + boardW, startY + r * CONFIG.beadSize * state.scale);
    ctx.stroke();
  }
  for (let c = 0; c <= CONFIG.boardWidth; c++) {
    ctx.beginPath();
    ctx.moveTo(startX + c * CONFIG.beadSize * state.scale, startY);
    ctx.lineTo(startX + c * CONFIG.beadSize * state.scale, startY + boardH);
    ctx.stroke();
  }
  
  // 渲染颜色按钮
  renderColorButtons(w, h);
  
  // 渲染功能按钮
  renderActionButtons(w, h);
  
  // 底部提示
  ctx.fillStyle = '#999';
  ctx.font = '10px sans-serif';
  ctx.fillText('单指放置 | 双指移动 | 点击颜色切换 | 长按颜色打开色板', w / 2, h - 25);
  
  requestAnimationFrame(draw);
}

function drawBead(x, y, color) {
  const size = CONFIG.beadSize * state.scale;
  
  // 珠子主体
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size / 2 - 1, 0, Math.PI * 2);
  ctx.fill();
  
  // 高光
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.arc(x - size / 6, y - size / 6, size / 6, 0, Math.PI * 2);
  ctx.fill();
  
  // 边框
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, size / 2 - 1, 0, Math.PI * 2);
  ctx.stroke();
}

function renderColorButtons(w, h) {
  const colors = ['#F2F2EE', '#34488E', '#496E53', '#C54F41', '#F4D738', '#BEDDFF'];
  const codes = ['H1', 'C29', 'F10', 'G20', 'A5', 'C21'];
  
  colors.forEach((color, i) => {
    const x = 15 + i * 58;
    const y = h - 110;
    const size = 44;
    
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = state.selectedColor === color ? '#333' : '#ccc';
    ctx.lineWidth = state.selectedColor === color ? 2 : 1;
    ctx.strokeRect(x, y, size, size);
  });
}

function renderActionButtons(w, h) {
  const btnY = h - 58;
  const btns = [
    { label: '清空', x: 15 },
    { label: '模式', x: 90 },
    { label: '导出', x: 165 },
  ];
  
  btns.forEach(btn => {
    ctx.fillStyle = '#e0dcd4';
    ctx.fillRect(btn.x, btnY, 65, 28);
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(btn.x, btnY, 65, 28);
    
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(btn.label, btn.x + 32.5, btnY + 18);
  });
  
  // 当前选中颜色
  ctx.fillStyle = state.selectedColor;
  ctx.fillRect(245, btnY, 115, 28);
  ctx.strokeStyle = '#333';
  ctx.strokeRect(245, btnY, 115, 28);
  
  ctx.fillStyle = '#333';
  ctx.fillText('当前: ' + state.selectedCode, 302, btnY + 18);
}

function screenToGrid(sx, sy) {
  const w = canvas.width / 2;
  const boardW = CONFIG.boardWidth * CONFIG.beadSize * state.scale;
  const boardH = CONFIG.boardHeight * CONFIG.beadSize * state.scale;
  const startX = (w - boardW) / 2 + state.panX;
  const startY = 50 + state.panY;
  
  const c = Math.floor((sx - startX) / (CONFIG.beadSize * state.scale));
  const r = Math.floor((sy - startY) / (CONFIG.beadSize * state.scale));
  
  if (c >= 0 && c < CONFIG.boardWidth && r >= 0 && r < CONFIG.boardHeight) {
    return { r, c };
  }
  return null;
}

function checkColorButtonClick(x, y) {
  const w = canvas.width / 2;
  const h = canvas.height / 2;
  const colors = ['#F2F2EE', '#34488E', '#496E53', '#C54F41', '#F4D738', '#BEDDFF'];
  const codes = ['H1', 'C29', 'F10', 'G20', 'A5', 'C21'];
  const btnY = h - 110;
  const size = 44;
  
  for (let i = 0; i < colors.length; i++) {
    const bx = 15 + i * 58;
    if (x >= bx && x <= bx + size && y >= btnY && y <= btnY + size) {
      state.selectedColor = colors[i];
      state.selectedCode = codes[i];
      return true;
    }
  }
  return false;
}

function checkActionButtonClick(x, y) {
  const w = canvas.width / 2;
  const h = canvas.height / 2;
  const btnY = h - 58;
  const btns = [
    { action: 'clear', x: 15 },
    { action: 'mode', x: 90 },
    { action: 'export', x: 165 },
  ];
  
  for (let i = 0; i < btns.length; i++) {
    const btn = btns[i];
    if (x >= btn.x && x <= btn.x + 65 && y >= btnY && y <= btnY + 28) {
      return btn.action;
    }
  }
  return null;
}

let lastPlace = null;
let touchStartTime = 0;
let lastTouchX = 0;
let lastTouchY = 0;

canvas && canvas.addEventListener('touchstart', (e) => {
  e.preventBackground && e.preventBackground();
  touchStartTime = Date.now();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  lastTouchX = x;
  lastTouchY = y;
  
  // 检查功能按钮
  const action = checkActionButtonClick(x, y);
  if (action) {
    if (action === 'clear') {
      state.grid = createGrid(CONFIG.boardHeight, CONFIG.boardWidth);
    } else if (action === 'mode') {
      state.displayMode = state.displayMode === 'color' ? 'code' : 'color';
    } else if (action === 'export') {
      canvas.canvasToTempFilePath({
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({ title: '已保存到相册', icon: 'success' });
            }
          });
        }
      });
    }
    return;
  }
  
  // 检查颜色按钮
  if (checkColorButtonClick(x, y)) return;
  
  // 双指模式 - 平移
  if (e.touches.length >= 2) {
    state.isPanning = true;
    return;
  }
  
  // 单指 - 放置珠子
  const grid = screenToGrid(x, y);
  if (grid) {
    if (!state.grid[grid.r][grid.c]) {
      state.grid[grid.r][grid.c] = state.selectedColor;
    }
    lastPlace = grid;
  }
});

canvas && canvas.addEventListener('touchmove', (e) => {
  e.preventDefault && e.preventDefault();
  
  // 双指平移
  if (e.touches.length >= 2) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (state.isPanning) {
      state.panX += x - lastTouchX;
      state.panY += y - lastTouchY;
    }
    lastTouchX = x;
    lastTouchY = y;
    return;
  }
  
  // 单指拖动连续放置
  if (lastPlace) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const grid = screenToGrid(x, y);
    if (grid && (grid.r !== lastPlace.r || grid.c !== lastPlace.c)) {
      if (!state.grid[grid.r][grid.c]) {
        state.grid[grid.r][grid.c] = state.selectedColor;
      }
      lastPlace = grid;
    }
  }
});

canvas && canvas.addEventListener('touchend', () => {
  lastPlace = null;
  state.isPanning = false;
});

// 启动
init();
