let state = JSON.parse(localStorage.getItem('liferpg') || 'null') || {
  level:1, xp:0, xpNeeded:100, totalXP:0, totalQuests:0,
  totalPenalties:0, streak:0, lastActive:null,
  stats:{ strength:1, intelligence:1, agility:1, vitality:1, perception:1 },
  quests:[], penaltyQuests:[], history:[]
};

const RANKS = ['E','E','D','D','C','C','B','B','A','A','S','S','S+','SS','SSS','MONARCH'];
const STAT_XP = { strength:20, intelligence:20, agility:20, vitality:20, perception:20 };
const TYPE_ICONS = { strength:'💪', intelligence:'🧠', agility:'⚡', vitality:'❤️', perception:'👁️' };
const STAT_COLORS = { strength:'#ff6060', intelligence:'#60c0ff', agility:'#60ffb0', vitality:'#ffd060', perception:'#cc80ff' };

const PENALTY_QUEST_POOL = [
  { name:'100 Push-ups', type:'strength' },
  { name:'100 Sit-ups', type:'strength' },
  { name:'10km Run', type:'agility' },
  { name:'Read 30 pages', type:'intelligence' },
  { name:'1 Hour of deep focus', type:'intelligence' },
  { name:'30 min cold shower', type:'vitality' },
  { name:'50 Squats', type:'strength' },
  { name:'Meditate 20 mins', type:'perception' },
  { name:'5km Jog', type:'agility' },
  { name:'Write a daily journal', type:'perception' },
];

function save() { localStorage.setItem('liferpg', JSON.stringify(state)); }

(function spawnParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (8 + Math.random() * 15) + 's';
    p.style.animationDelay = (Math.random() * 15) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
    container.appendChild(p);
  }
})();

function notify(msg, type) {
  const container = document.getElementById('notifContainer');
  const n = document.createElement('div');
  n.className = 'notif' + (type === 'levelup' ? ' level-up' : '');
  n.textContent = msg;
  container.appendChild(n);
  setTimeout(() => n.remove(), 3100);
}

function checkLevelUp() {
  while (state.xp >= state.xpNeeded) {
    state.xp -= state.xpNeeded;
    state.level++;
    state.xpNeeded = Math.floor(state.xpNeeded * 1.4);
    showLevelUpOverlay();
  }
}

function showLevelUpOverlay() {
  document.getElementById('levelupNewLevel').textContent = 'LEVEL ' + state.level;
  document.getElementById('levelupOverlay').classList.add('active');
  notify('⚡ LEVEL UP! NOW LEVEL ' + state.level, 'levelup');
  setTimeout(() => document.getElementById('levelupOverlay').classList.remove('active'), 2800);
}

document.getElementById('levelupOverlay').addEventListener('click', function() {
  this.classList.remove('active');
});

function openReboot() { document.getElementById('rebootOverlay').classList.add('active'); }
function closeReboot() { document.getElementById('rebootOverlay').classList.remove('active'); }

function confirmReboot() {
  localStorage.removeItem('liferpg');
  state = {
    level:1, xp:0, xpNeeded:100, totalXP:0, totalQuests:0,
    totalPenalties:0, streak:0, lastActive:null,
    stats:{ strength:1, intelligence:1, agility:1, vitality:1, perception:1 },
    quests:[], penaltyQuests:[], history:[]
  };
  closeReboot();
  save();
  renderAll();
  notify('⟳ SYSTEM REBOOTED — WELCOME BACK, HUNTER');
}

function failQuest(id) {
  const quest = state.quests.find(q => q.id === id);
  if (!quest || quest.completed) return;

  const xpLoss = quest.xp;
  state.xp = Math.max(0, state.xp - xpLoss);
  state.stats[quest.type] = Math.max(1, state.stats[quest.type] - 1);
  const oldStreak = state.streak;
  state.streak = 0;
  state.lastActive = null;
  state.totalPenalties++;
  state.quests = state.quests.filter(q => q.id !== id);

  const pool = PENALTY_QUEST_POOL.filter(p => p.type === quest.type);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  state.penaltyQuests.push({ id:Date.now(), name:pick.name, type:pick.type, completed:false, isPenalty:true });

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  state.history.unshift({ time:timeStr, msg:'☠ FAILED: ' + quest.name, xp:'-' + xpLoss + ' XP', type:'penalty' });
  if (state.history.length > 20) state.history.pop();

  document.getElementById('penaltyDetails').textContent =
    '-' + xpLoss + ' XP  ·  ' + quest.type.toUpperCase() + ' -1  ·  STREAK LOST (' + oldStreak + ' days)';
  document.getElementById('penaltyOverlay').classList.add('active');
  document.body.classList.add('red-flash');
  setTimeout(() => document.body.classList.remove('red-flash'), 600);

  save(); renderAll();
}

function closePenalty() { document.getElementById('penaltyOverlay').classList.remove('active'); }

function completePenaltyQuest(id) {
  const quest = state.penaltyQuests.find(q => q.id === id);
  if (!quest || quest.completed) return;
  quest.completed = true;
  const reward = 10;
  state.xp += reward; state.totalXP += reward;
  state.stats[quest.type] = Math.min(99, state.stats[quest.type] + 1);

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  state.history.unshift({ time:timeStr, msg:'⚔ PENALTY CLEARED: ' + quest.name, xp:'+' + reward + ' XP', type:quest.type });
  if (state.history.length > 20) state.history.pop();

  setTimeout(() => { state.penaltyQuests = state.penaltyQuests.filter(q => q.id !== id); save(); renderAll(); }, 800);
  checkLevelUp(); save(); renderAll();
  notify('⚔ PUNISHMENT ENDURED! REDEMPTION: +' + reward + ' XP');
}

function addQuest() {
  const input = document.getElementById('questInput');
  const type  = document.getElementById('questType').value;
  const name  = input.value.trim();
  if (!name) { input.focus(); return; }
  state.quests.push({ id:Date.now(), name, type, completed:false, xp:STAT_XP[type] });
  input.value = '';
  save(); renderQuests();
  notify('📋 NEW QUEST REGISTERED: ' + name.toUpperCase());
}

document.getElementById('questInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addQuest();
});

function completeQuest(id) {
  const quest = state.quests.find(q => q.id === id);
  if (!quest || quest.completed) return;
  quest.completed = true;
  state.xp += quest.xp; state.totalXP += quest.xp; state.totalQuests++;
  state.stats[quest.type] = Math.min(99, state.stats[quest.type] + 1);

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  state.history.unshift({ time:timeStr, msg:quest.name, xp:'+' + quest.xp + ' XP', type:quest.type });
  if (state.history.length > 20) state.history.pop();

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (state.lastActive !== today) {
    state.streak = (state.lastActive === yesterday) ? state.streak + 1 : 1;
    state.lastActive = today;
  }
  checkLevelUp(); save(); renderAll();
  notify('✅ QUEST COMPLETE! +' + quest.xp + ' XP [' + quest.type.toUpperCase() + ']');
}

function deleteQuest(id) {
  state.quests = state.quests.filter(q => q.id !== id);
  save(); renderQuests();
}

function renderQuests() {
  const list = document.getElementById('questList');
  const all = [...state.quests.filter(q => !q.completed), ...state.quests.filter(q => q.completed)];

  if (all.length === 0) {
    list.innerHTML = '<div class="empty-state">[ NO ACTIVE QUESTS — ADD YOUR FIRST QUEST ]</div>';
  } else {
    list.innerHTML = all.map(q => `
      <div class="quest-item ${q.completed ? 'completed' : ''}">
        <div class="quest-icon">${TYPE_ICONS[q.type]}</div>
        <div class="quest-info">
          <div class="quest-name">${q.name}</div>
          <div class="quest-meta">
            <span class="quest-type-badge badge-${q.type}">${q.type}</span>
            <span class="quest-xp">+${q.xp} XP</span>
          </div>
        </div>
        <div class="quest-actions">
          ${!q.completed
            ? `<button class="btn btn-success" onclick="completeQuest(${q.id})">✓ DONE</button>
               <button class="btn btn-fail" onclick="failQuest(${q.id})">☠ FAIL</button>`
            : `<span style="color:var(--success);font-size:11px;font-family:'Share Tech Mono'">✓ CLEARED</span>`
          }
          <button class="btn btn-danger" onclick="deleteQuest(${q.id})" style="padding:6px 10px;font-size:12px;">✕</button>
        </div>
      </div>`).join('');
  }

  const penaltyPanel = document.getElementById('penaltyQuestPanel');
  const penaltyList  = document.getElementById('penaltyQuestList');
  const activePenalties = state.penaltyQuests.filter(q => !q.completed);

  if (activePenalties.length > 0) {
    penaltyPanel.style.display = 'block';
    penaltyList.innerHTML = activePenalties.map(q => `
      <div class="quest-item penalty-quest">
        <div class="quest-icon">☠</div>
        <div class="quest-info">
          <div class="quest-name">${q.name}</div>
          <div class="quest-meta">
            <span class="quest-type-badge badge-${q.type}">${q.type}</span>
            <span style="color:var(--danger);font-size:11px;font-family:'Share Tech Mono'">MANDATORY</span>
          </div>
        </div>
        <div class="quest-actions">
          <button class="btn btn-success" onclick="completePenaltyQuest(${q.id})">✓ DONE</button>
        </div>
      </div>`).join('');
  } else {
    penaltyPanel.style.display = 'none';
  }
}

function renderPlayer() {
  const pct = Math.min(100, (state.xp / state.xpNeeded) * 100);
  document.getElementById('xpBar').style.width = pct + '%';
  document.getElementById('xpLabel').textContent = state.xp + ' / ' + state.xpNeeded + ' XP';
  document.getElementById('levelDisplay').innerHTML = state.level + '<span>LEVEL</span>';
  const rankIdx = Math.min(RANKS.length - 1, Math.floor((state.level - 1) / 2));
  document.getElementById('rankBadge').textContent = 'RANK ' + RANKS[rankIdx];
  document.getElementById('totalQuests').textContent = state.totalQuests;
  document.getElementById('totalXP').textContent = state.totalXP;
  document.getElementById('totalDays').textContent = state.streak;
}

function renderStats() {
  const stats = state.stats;
  Object.keys(stats).forEach(key => {
    const el  = document.getElementById('stat-' + key);
    const bar = document.getElementById('bar-' + key);
    if (el) el.textContent = stats[key];
    if (bar) bar.style.width = Math.min(100, stats[key]) + '%';
  });

  const container = document.getElementById('statBars');
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  container.innerHTML = Object.entries(stats).map(([key, val]) => {
    const pct = Math.max(1, Math.round((val / Math.max(total, 1)) * 100));
    return `<div style="display:flex;align-items:center;gap:10px;">
      <div style="font-size:11px;color:var(--muted);font-family:'Share Tech Mono';min-width:90px;text-transform:uppercase;">${TYPE_ICONS[key]} ${key}</div>
      <div style="flex:1;height:6px;background:rgba(0,40,80,0.8);border:1px solid var(--border);">
        <div style="height:100%;width:${pct}%;background:${STAT_COLORS[key]};box-shadow:0 0 6px ${STAT_COLORS[key]};transition:width 0.6s ease;"></div>
      </div>
      <div style="font-family:'Orbitron';font-size:12px;color:#fff;min-width:24px;text-align:right;">${val}</div>
    </div>`;
  }).join('');
}

function renderHistory() {
  const container = document.getElementById('historyList');
  if (state.history.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--muted);font-family:'Share Tech Mono';font-size:11px;padding:20px;">[ AWAITING FIRST ACTIVITY ]</div>`;
    return;
  }
  container.innerHTML = state.history.map(h => `
    <div class="history-item">
      <span class="h-time">${h.time}</span>
      <span class="h-msg" style="${h.type === 'penalty' ? 'color:var(--danger);opacity:1;' : ''}">${h.msg}</span>
      <span class="h-xp" style="${h.type === 'penalty' ? 'color:var(--danger);' : ''}">${h.xp}</span>
    </div>`).join('');
}

function renderRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const maxRadius = 100, maxVal = 99;
  const statKeys   = ['intelligence','agility','vitality','strength','perception'];
  const statLabels = ['INT','AGI','VIT','STR','PER'];
  const numAxes = statKeys.length;

  ctx.clearRect(0, 0, W, H);

  function getPoint(i, fraction) {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    return { x: cx + Math.cos(angle) * maxRadius * fraction, y: cy + Math.sin(angle) * maxRadius * fraction };
  }

  for (let lvl = 1; lvl <= 4; lvl++) {
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const p = getPoint(i, lvl / 4);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,170,255,0.15)'; ctx.lineWidth = 1; ctx.stroke();
  }

  for (let i = 0; i < numAxes; i++) {
    const p = getPoint(i, 1);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = 'rgba(0,170,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();
  }

  const values = statKeys.map(k => state.stats[k] / maxVal);
  ctx.beginPath();
  for (let i = 0; i < numAxes; i++) {
    const p = getPoint(i, values[i]);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
  grad.addColorStop(0, 'rgba(0,212,255,0.35)');
  grad.addColorStop(1, 'rgba(0,68,204,0.15)');
  ctx.fillStyle = grad; ctx.fill();
  ctx.strokeStyle = 'rgba(0,212,255,0.9)'; ctx.lineWidth = 2;
  ctx.shadowColor = '#00aaff'; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;

  for (let i = 0; i < numAxes; i++) {
    const p = getPoint(i, values[i]);
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00d4ff'; ctx.shadowColor = '#00aaff';
    ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
  }

  ctx.font = '600 11px Orbitron, monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < numAxes; i++) {
    const p = getPoint(i, 1.22);
    ctx.fillStyle = '#3a5a7a'; ctx.fillText(statLabels[i], p.x, p.y);
  }

  const avg = statKeys.reduce((sum, k) => sum + state.stats[k], 0) / numAxes;
  document.getElementById('radarScore').textContent = avg.toFixed(2);
}

function renderAll() {
  renderPlayer(); renderStats(); renderQuests(); renderHistory(); renderRadar();
}

renderAll();