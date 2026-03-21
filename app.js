// ================================
//     LIFE SYSTEM — app.js v4.0
// ================================

let state = JSON.parse(localStorage.getItem('liferpg')||'null') || {
  level:1,xp:0,xpNeeded:100,totalXP:0,totalQuests:0,totalPenalties:0,
  streak:0,lastActive:null,theme:'normal',hunterName:'HUNTER',avatarImg:null,playerCode:null,
  stats:{strength:1,intelligence:1,agility:1,vitality:1,perception:1},
  statHistory:{},quests:[],penaltyQuests:[],mandatoryQuests:[],shadowExtractions:[],
  history:[],skills:[],questHistory:{},weeklyQuests:0,weeklyReset:null,weeklyXPHistory:[],
  bossDefeated:false,milestonesAchieved:[],currentBoss:null,
  gear:[],equippedGear:[],gearBonuses:{strength:0,intelligence:0,agility:0,vitality:0,perception:0},
  badges:[],templates:[],habits:[],habitLogs:{},chains:[],guild:null,
  dungeon:null,dailyScores:{},prevRankIdx:-1,noteModal:{questId:null},
  prestige:0,prestigeBonus:0,prestigeHistory:[],
  combo:0,comboTimer:null,lastQuestTime:0,
  dailyChallenge:null,dailyChallengeDate:null,doublXPDay:false,
  goals:{},customRankTitles:{},questCustom:{},soundOn:true,
  seasonalEventSeen:false,startDate:Date.now()
};

// ====== CONSTANTS ======
const RANKS=['E','E','D','D','C','C','B','B','A','A','S','S','S+','SS','SSS','MONARCH'];
const DEFAULT_RANK_TITLES=['Shadow Novice','Shadow Novice','Iron Hunter','Iron Hunter','Steel Hunter','Steel Hunter','Elite Hunter','Elite Hunter','Master Hunter','Master Hunter','S-Rank Hunter','S-Rank Hunter','National Level','National Level','Shadow Monarch','ARISE'];
const AVATARS=['⚔️','🗡️','💀','👑'];
const TYPE_ICONS={strength:'💪',intelligence:'🧠',agility:'⚡',vitality:'❤️',perception:'👁️'};
const STAT_COLORS={strength:'#ff6060',intelligence:'#60c0ff',agility:'#60ffb0',vitality:'#ffd060',perception:'#cc80ff'};
const MAX_LEVEL=30; // Level to unlock Prestige

const SKILLS=[
  {id:'str10',stat:'strength',req:10,icon:'💪',name:'IRON FIST',desc:'STR 10'},
  {id:'str25',stat:'strength',req:25,icon:'🔥',name:'BERSERKER',desc:'STR 25'},
  {id:'int10',stat:'intelligence',req:10,icon:'📖',name:'SCHOLAR',desc:'INT 10'},
  {id:'int25',stat:'intelligence',req:25,icon:'🧬',name:'GENIUS MIND',desc:'INT 25'},
  {id:'agi10',stat:'agility',req:10,icon:'⚡',name:'SHADOW STEP',desc:'AGI 10'},
  {id:'agi25',stat:'agility',req:25,icon:'🌪️',name:'WIND BREAKER',desc:'AGI 25'},
  {id:'vit10',stat:'vitality',req:10,icon:'🛡️',name:'IRON BODY',desc:'VIT 10'},
  {id:'vit25',stat:'vitality',req:25,icon:'💉',name:'REGENERATION',desc:'VIT 25'},
  {id:'per10',stat:'perception',req:10,icon:'👁️',name:'THIRD EYE',desc:'PER 10'},
  {id:'per25',stat:'perception',req:25,icon:'🔮',name:'FUTURE SIGHT',desc:'PER 25'},
];

const MILESTONES=[
  {id:'streak7',icon:'🔥',name:'WEEK WARRIOR',desc:'7 day streak',type:'streak',val:7},
  {id:'streak30',icon:'⚡',name:'IRON WILL',desc:'30 day streak',type:'streak',val:30},
  {id:'streak100',icon:'👑',name:'SHADOW MONARCH',desc:'100 day streak',type:'streak',val:100},
  {id:'quest50',icon:'⚔️',name:'VETERAN HUNTER',desc:'50 quests',type:'quests',val:50},
  {id:'quest100',icon:'💀',name:'ELITE HUNTER',desc:'100 quests',type:'quests',val:100},
  {id:'level10',icon:'🌟',name:'RISING HUNTER',desc:'Level 10',type:'level',val:10},
  {id:'level25',icon:'🏆',name:'S-RANK AWAKENED',desc:'Level 25',type:'level',val:25},
];

const BOSS_BATTLES=[
  {name:'IRON GOLEM',desc:'Complete 20 quests this week',goal:20,reward:200},
  {name:'SHADOW DRAGON',desc:'Complete 30 quests this week',goal:30,reward:350},
  {name:'FROST GIANT',desc:'Complete 15 quests this week',goal:15,reward:150},
  {name:'DARK KNIGHT',desc:'Complete 25 quests this week',goal:25,reward:300},
];

const MANDATORY_POOL=[
  {name:'Morning Stretch 10 mins',type:'vitality'},
  {name:'Drink 8 glasses of water',type:'vitality'},
  {name:'Read for 20 minutes',type:'intelligence'},
  {name:'Walk 30 minutes',type:'agility'},
  {name:'Write in your journal',type:'perception'},
  {name:'Do 20 push-ups',type:'strength'},
  {name:'Meditate 10 minutes',type:'perception'},
  {name:'Study something new',type:'intelligence'},
  {name:'10 minute jog',type:'agility'},
  {name:'No junk food today',type:'vitality'},
];

const PENALTY_POOL=[
  {name:'100 Push-ups',type:'strength'},{name:'100 Sit-ups',type:'strength'},
  {name:'10km Run',type:'agility'},{name:'Read 30 pages',type:'intelligence'},
  {name:'1 Hour deep focus',type:'intelligence'},{name:'30 min cold shower',type:'vitality'},
  {name:'50 Squats',type:'strength'},{name:'Meditate 20 mins',type:'perception'},
  {name:'5km Jog',type:'agility'},{name:'Write daily journal',type:'perception'},
];

const DAILY_CHALLENGES=[
  {name:'Drink 10 glasses of water',type:'vitality',xp:40,icon:'💧'},
  {name:'No phone for 2 hours',type:'perception',xp:60,icon:'📵'},
  {name:'Do 50 push-ups',type:'strength',xp:50,icon:'💪'},
  {name:'Read 30 pages of a book',type:'intelligence',xp:50,icon:'📖'},
  {name:'Run 3km without stopping',type:'agility',xp:60,icon:'🏃'},
  {name:'Sleep before 10pm',type:'vitality',xp:40,icon:'😴'},
  {name:'Meditate for 15 minutes',type:'perception',xp:45,icon:'🧘'},
  {name:'Write 500 words in your journal',type:'intelligence',xp:55,icon:'✍️'},
  {name:'Complete 5 quests today',type:'strength',xp:80,icon:'⚡'},
  {name:'No social media for 4 hours',type:'perception',xp:70,icon:'🚫'},
  {name:'Do 100 squats',type:'strength',xp:55,icon:'🦵'},
  {name:'Cook a healthy meal',type:'vitality',xp:45,icon:'🥗'},
];

const SEASONAL_EVENTS=[
  {month:0,name:'NEW YEAR RESOLUTION',icon:'🎆',desc:'Start the year strong! All XP doubled for quests this month!',color:'#ffd700'},
  {month:2,name:'SPRING AWAKENING',icon:'🌸',desc:'New season new you! Intelligence quests give bonus XP!',color:'#ff88cc'},
  {month:5,name:'SUMMER GRIND',icon:'☀️',desc:'Summer body season! Strength & Agility quests doubled!',color:'#ffaa00'},
  {month:8,name:'AUTUMN FOCUS',icon:'🍂',desc:'Back to learning season! Intelligence bonus active!',color:'#ff6600'},
  {month:11,name:'WINTER WARRIOR',icon:'❄️',desc:'End the year strong! All stats gain double this month!',color:'#00aaff'},
];

const GEAR_TABLE=[
  {id:'wood_sword',icon:'🗡️',name:'WOODEN SWORD',rarity:'common',stat:'strength',bonus:1,dropChance:0.25},
  {id:'iron_sword',icon:'⚔️',name:'IRON SWORD',rarity:'rare',stat:'strength',bonus:3,dropChance:0.12},
  {id:'shadow_blade',icon:'🌑',name:'SHADOW BLADE',rarity:'epic',stat:'strength',bonus:6,dropChance:0.05},
  {id:'death_scythe',icon:'💀',name:'DEATH SCYTHE',rarity:'legendary',stat:'strength',bonus:12,dropChance:0.015},
  {id:'leather_armor',icon:'🧥',name:'LEATHER ARMOR',rarity:'common',stat:'vitality',bonus:1,dropChance:0.25},
  {id:'iron_armor',icon:'🛡️',name:'IRON ARMOR',rarity:'rare',stat:'vitality',bonus:3,dropChance:0.12},
  {id:'shadow_cloak',icon:'🌑',name:'SHADOW CLOAK',rarity:'epic',stat:'agility',bonus:5,dropChance:0.05},
  {id:'monarch_robe',icon:'👑',name:'MONARCH ROBE',rarity:'legendary',stat:'vitality',bonus:10,dropChance:0.015},
  {id:'focus_ring',icon:'💍',name:'FOCUS RING',rarity:'common',stat:'intelligence',bonus:1,dropChance:0.25},
  {id:'wisdom_amulet',icon:'📿',name:'WISDOM AMULET',rarity:'rare',stat:'intelligence',bonus:3,dropChance:0.12},
  {id:'eye_of_shadow',icon:'👁️',name:'EYE OF SHADOW',rarity:'epic',stat:'perception',bonus:5,dropChance:0.05},
  {id:'arise_crown',icon:'💎',name:'ARISE CROWN',rarity:'legendary',stat:'perception',bonus:10,dropChance:0.015},
];

const BADGES_LIST=[
  {id:'first_quest',icon:'⚔️',name:'FIRST BLOOD',desc:'Complete first quest',check:s=>s.totalQuests>=1},
  {id:'no_penalty',icon:'🛡️',name:'CLEAN RECORD',desc:'10 quests, 0 penalties',check:s=>s.totalQuests>=10&&s.totalPenalties===0},
  {id:'streak7',icon:'🔥',name:'WEEK WARRIOR',desc:'7 day streak',check:s=>s.streak>=7},
  {id:'boss_slayer',icon:'👑',name:'BOSS SLAYER',desc:'Defeat first boss',check:s=>s.bossDefeated},
  {id:'gear_collector',icon:'🎒',name:'GEAR COLLECTOR',desc:'Collect 5 gear items',check:s=>(s.gear||[]).length>=5},
  {id:'shadow_army10',icon:'💀',name:'SHADOW GENERAL',desc:'Army of 10',check:s=>Math.floor(s.totalQuests/10)>=10},
  {id:'all_skills',icon:'🌟',name:'SKILL MASTER',desc:'Unlock all skills',check:s=>s.skills.length>=SKILLS.length},
  {id:'level20',icon:'🏆',name:'LEGEND',desc:'Reach level 20',check:s=>s.level>=20},
  {id:'prestige1',icon:'⭐',name:'PRESTIGE HUNTER',desc:'First prestige',check:s=>s.prestige>=1},
  {id:'combo10',icon:'💥',name:'COMBO MASTER',desc:'10x combo',check:s=>s.maxCombo>=10},
  {id:'chain_done',icon:'🔗',name:'CHAIN MASTER',desc:'Complete a quest chain',check:s=>(s.chains||[]).some(c=>c.steps.every(st=>st.done))},
  {id:'daily_done',icon:'⚡',name:'CHALLENGER',desc:'Complete daily challenge',check:s=>s.dailyChallengesDone>=1},
];

const QUEST_ICONS=['💪','🧠','⚡','❤️','👁️','⚔️','📖','🏃','🎯','🌟','🔥','💡','🎮','📝','🏋️','🧘','🎵','🍎'];
const QUEST_COLORS=['#0a2a4a','#3a001a','#001a3a','#1a2a00','#2a0a3a','#3a1a00','#003a1a','#1a003a'];

// Sound Engine
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let audioCtx=null;
function getAudioCtx(){if(!audioCtx&&AudioCtx)audioCtx=new AudioCtx();return audioCtx;}

function playSound(type){
  if(!state.soundOn) return;
  try{
    const ctx=getAudioCtx();if(!ctx) return;
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    if(type==='complete'){
      o.frequency.setValueAtTime(523,ctx.currentTime);
      o.frequency.setValueAtTime(659,ctx.currentTime+0.1);
      o.frequency.setValueAtTime(784,ctx.currentTime+0.2);
      g.gain.setValueAtTime(0.3,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.5);
      o.start(ctx.currentTime);o.stop(ctx.currentTime+0.5);
    } else if(type==='levelup'){
      [523,659,784,1047].forEach((f,i)=>{
        const o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.connect(g2);g2.connect(ctx.destination);
        o2.frequency.value=f;
        g2.gain.setValueAtTime(0.4,ctx.currentTime+i*0.15);
        g2.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.15+0.3);
        o2.start(ctx.currentTime+i*0.15);o2.stop(ctx.currentTime+i*0.15+0.3);
      });
    } else if(type==='penalty'){
      o.type='sawtooth';
      o.frequency.setValueAtTime(200,ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(50,ctx.currentTime+0.5);
      g.gain.setValueAtTime(0.4,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.5);
      o.start(ctx.currentTime);o.stop(ctx.currentTime+0.5);
    } else if(type==='combo'){
      o.frequency.setValueAtTime(800,ctx.currentTime);
      g.gain.setValueAtTime(0.2,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.2);
      o.start(ctx.currentTime);o.stop(ctx.currentTime+0.2);
    } else if(type==='prestige'){
      [261,329,392,523,659,784,1047].forEach((f,i)=>{
        const o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.connect(g2);g2.connect(ctx.destination);
        o2.frequency.value=f;o2.type='triangle';
        g2.gain.setValueAtTime(0.3,ctx.currentTime+i*0.1);
        g2.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.1+0.4);
        o2.start(ctx.currentTime+i*0.1);o2.stop(ctx.currentTime+i*0.1+0.4);
      });
    }
  }catch(e){}
}

function toggleSound(){
  state.soundOn=!state.soundOn;
  document.getElementById('soundBtn').textContent=(state.soundOn?'🔊 SOUND ON':'🔇 SOUND OFF');
  save();
}

function save(){localStorage.setItem('liferpg',JSON.stringify(state));}

// PARTICLES
(function(){
  const c=document.getElementById('particles');
  for(let i=0;i<30;i++){
    const p=document.createElement('div');p.className='particle';
    p.style.left=Math.random()*100+'vw';
    p.style.animationDuration=(8+Math.random()*15)+'s';
    p.style.animationDelay=(Math.random()*15)+'s';
    p.style.width=p.style.height=(1+Math.random()*2)+'px';
    c.appendChild(p);
  }
})();

function notify(msg,type){
  const c=document.getElementById('notifContainer');
  const n=document.createElement('div');
  n.className='notif'+(type==='levelup'?' level-up':'');
  n.textContent=msg;c.appendChild(n);
  setTimeout(()=>n.remove(),3100);
}

function switchTab(name,btn){
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  btn.classList.add('active');
  if(name==='stats') renderEvolutionChart();
  if(name==='badges') renderBadges();
  if(name==='gear') renderGear();
  if(name==='habits') renderHabits();
  if(name==='chains') renderChains();
  if(name==='dashboard') renderDashboard();
}

// ====== HUNTER NAME ======
function setHunterName(){
  const input=document.getElementById('nameInput');
  const name=input.value.trim().toUpperCase();
  if(!name){input.focus();return;}
  state.hunterName=name;
  document.getElementById('nameModal').classList.remove('active');
  save();renderAll();generateMandatoryQuests();initWeeklyBoss();generateDailyChallenge();
  notify('⚔ WELCOME, '+name+'! YOUR JOURNEY BEGINS!');
  checkSeasonalEvent();
}
document.getElementById('nameInput').addEventListener('keydown',e=>{if(e.key==='Enter')setHunterName();});
if(state.hunterName!=='HUNTER') document.getElementById('nameModal').classList.remove('active');

// ====== AVATAR ======
function handleAvatarUpload(event){
  const file=event.target.files[0];if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    state.avatarImg=e.target.result;
    const p=document.getElementById('avatarPreview'),pi=document.getElementById('avatarPreviewImg');
    if(p&&pi){p.style.display='block';pi.src=state.avatarImg;}
    updateAvatarDisplay();save();
  };
  reader.readAsDataURL(file);
}
function updateAvatarDisplay(){
  const ring=document.getElementById('avatarRing');if(!ring) return;
  if(state.avatarImg) ring.innerHTML='<img src="'+state.avatarImg+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>';
  else ring.textContent=AVATARS[Math.min(AVATARS.length-1,Math.floor((state.level-1)/10))];
}

// ====== THEME ======
function toggleTheme(){state.theme=state.theme==='normal'?'arise':'normal';applyTheme();save();}
function applyTheme(){
  const arise=state.theme==='arise';
  document.body.classList.toggle('arise-mode',arise);
  document.getElementById('themeBtn').textContent=arise?'☀ NORMAL MODE':'🌑 ARISE MODE';
  document.querySelectorAll('.particle').forEach(p=>p.style.background=arise?'#cc00ff':'#00aaff');
}

// ====== PLAYER CODE ======
function generatePlayerCode(){
  if(!state.playerCode){
    const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    state.playerCode=Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
    save();
  }
  return state.playerCode;
}
function copyPlayerCode(){
  const code=state.playerCode||generatePlayerCode();
  const full=state.hunterName+':'+code+':'+state.weeklyQuests;
  navigator.clipboard.writeText(full).catch(()=>{
    const el=document.createElement('textarea');el.value=full;document.body.appendChild(el);el.select();document.execCommand('copy');document.body.removeChild(el);
  });
  notify('📋 CODE COPIED: '+full);
}
function updatePlayerCodeDisplay(){
  const code=generatePlayerCode();
  ['playerCodeDisplay','rebootPlayerCode'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=code;});
}

// ====== REBOOT ======
function openReboot(){updatePlayerCodeDisplay();document.getElementById('rebootNameInput').value='';document.getElementById('rebootOverlay').classList.add('active');}
function closeReboot(){document.getElementById('rebootOverlay').classList.remove('active');}
function confirmReboot(){
  const nameInput=document.getElementById('rebootNameInput').value.trim().toUpperCase();
  const newName=nameInput||state.hunterName;
  const theme=state.theme,playerCode=state.playerCode||generatePlayerCode();
  localStorage.removeItem('liferpg');
  state={level:1,xp:0,xpNeeded:100,totalXP:0,totalQuests:0,totalPenalties:0,streak:0,lastActive:null,theme,hunterName:newName,avatarImg:null,playerCode,stats:{strength:1,intelligence:1,agility:1,vitality:1,perception:1},statHistory:{},quests:[],penaltyQuests:[],mandatoryQuests:[],shadowExtractions:[],history:[],skills:[],questHistory:{},weeklyQuests:0,weeklyReset:null,weeklyXPHistory:[],bossDefeated:false,milestonesAchieved:[],currentBoss:null,gear:[],equippedGear:[],gearBonuses:{strength:0,intelligence:0,agility:0,vitality:0,perception:0},badges:[],templates:[],habits:[],habitLogs:{},chains:[],guild:null,dungeon:null,dailyScores:{},prevRankIdx:-1,noteModal:{questId:null},prestige:0,prestigeBonus:0,prestigeHistory:[],combo:0,comboTimer:null,lastQuestTime:0,dailyChallenge:null,dailyChallengeDate:null,doublXPDay:false,goals:{},customRankTitles:{},questCustom:{},soundOn:true,seasonalEventSeen:false,startDate:Date.now()};
  closeReboot();save();renderAll();generateMandatoryQuests();initWeeklyBoss();generateDailyChallenge();
  notify('⟳ SYSTEM REBOOTED — WELCOME, '+newName+'!');
}

// ====== PRESTIGE ======
function doPrestige(){
  if(state.level<MAX_LEVEL){notify('Reach Level '+MAX_LEVEL+' to Prestige!');return;}
  state.prestige++;
  state.prestigeBonus=state.prestige*2;
  state.prestigeHistory.push({prestige:state.prestige,date:new Date().toLocaleDateString(),totalXP:state.totalXP});
  const oldPrestige=state.prestige;
  // Reset level but keep quests, gear, skills, history
  state.level=1;state.xp=0;state.xpNeeded=100;
  document.getElementById('prestigeOverlay').classList.add('active');
  document.getElementById('prestigeLevel').textContent='PRESTIGE '+toRoman(oldPrestige);
  setTimeout(()=>document.getElementById('prestigeOverlay').classList.remove('active'),4000);
  playSound('prestige');
  notify('⭐ PRESTIGE '+toRoman(state.prestige)+'! +'+state.prestigeBonus+' PERMANENT STAT BONUS!','levelup');
  save();renderAll();
}
function toRoman(n){const r=['','I','II','III','IV','V','VI','VII','VIII','IX','X'];return r[Math.min(n,10)];}

// ====== COMBO SYSTEM ======
function updateCombo(){
  const now=Date.now();
  const timeSinceLast=(now-state.lastQuestTime)/1000;
  if(state.lastQuestTime>0&&timeSinceLast>300){ // 5 min reset
    state.combo=0;
  }
  state.combo++;
  state.lastQuestTime=now;
  state.maxCombo=Math.max(state.maxCombo||0,state.combo);
  if(state.combo>=3) showComboEffect();
  save();
}
function getComboMultiplier(){
  if(state.combo<3) return 1;
  if(state.combo<5) return 1.5;
  if(state.combo<10) return 2;
  return 3;
}
function showComboEffect(){
  const el=document.getElementById('comboDisplay');
  const mult=getComboMultiplier();
  el.textContent='🔥 '+state.combo+'x COMBO! ('+mult+'x XP)';
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),1500);
  playSound('combo');
  renderComboPanel();
}
function renderComboPanel(){
  const panel=document.getElementById('comboPanel');
  const count=document.getElementById('comboCount');
  if(state.combo>=3){
    panel.style.display='block';
    count.textContent='x'+getComboMultiplier()+' ('+state.combo+' streak)';
  } else panel.style.display='none';
}

// ====== DAILY CHALLENGE ======
function generateDailyChallenge(){
  const today=new Date().toDateString();
  if(state.dailyChallengeDate===today&&state.dailyChallenge) return;
  state.dailyChallenge={...DAILY_CHALLENGES[Math.floor(Math.random()*DAILY_CHALLENGES.length)],completed:false,id:Date.now()};
  state.dailyChallengeDate=today;
  state.doublXPDay=false;
  save();
}
function completeDailyChallenge(){
  if(!state.dailyChallenge||state.dailyChallenge.completed) return;
  state.dailyChallenge.completed=true;
  state.doublXPDay=true; // double XP for rest of day
  const xp=state.dailyChallenge.xp*2; // double XP for completing challenge itself
  state.xp+=xp;state.totalXP+=xp;
  state.dailyChallengesDone=(state.dailyChallengesDone||0)+1;
  logActivity('⚡ DAILY CHALLENGE: '+state.dailyChallenge.name,'+'+xp+' XP','vitality');
  updateStreakAndHistory('',0,'');
  checkLevelUp();checkBadges();
  playSound('complete');
  notify('⚡ DAILY CHALLENGE COMPLETE! DOUBLE XP ACTIVE ALL DAY! +'+xp+' XP','levelup');
  save();renderAll();
}

// ====== SEASONAL EVENTS ======
function getCurrentSeason(){
  const month=new Date().getMonth();
  return SEASONAL_EVENTS.find(e=>e.month===month)||null;
}
function checkSeasonalEvent(){
  const event=getCurrentSeason();
  if(!event) return;
  const banner=document.getElementById('seasonalBanner');
  const panel=document.getElementById('seasonalPanel');
  banner.style.display='block';
  document.getElementById('seasonalBannerIcon').textContent=event.icon;
  document.getElementById('seasonalBannerText').textContent=event.name+' — EVENT ACTIVE!';
  panel.style.display='block';
  document.getElementById('seasonalPanelTitle').textContent=event.icon+' '+event.name;
  const daysLeft=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()-new Date().getDate();
  document.getElementById('seasonalPanelContent').innerHTML=`
    <div style="font-family:'Share Tech Mono';font-size:12px;color:var(--muted);margin-bottom:10px;">${event.desc}</div>
    <div style="font-family:'Orbitron';font-size:14px;color:var(--danger);">${daysLeft} DAYS REMAINING</div>`;
  if(!state.seasonalEventSeen){
    state.seasonalEventSeen=true;
    document.getElementById('seasonalIcon').textContent=event.icon;
    document.getElementById('seasonalTitle').textContent=event.name+'!';
    document.getElementById('seasonalDesc').textContent=event.desc;
    document.getElementById('seasonalOverlay').classList.add('active');
    save();
  }
  // Update banner countdown
  setInterval(()=>{
    const d=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()-new Date().getDate();
    const el=document.getElementById('seasonalBannerTimer');
    if(el) el.textContent=d+' DAYS LEFT';
  },60000);
  document.getElementById('seasonalBannerTimer').textContent=daysLeft+' DAYS LEFT';
}
function getSeasonalXPBonus(type){
  const event=getCurrentSeason();if(!event) return 1;
  const month=new Date().getMonth();
  if(month===0||month===11) return 2; // New Year / Winter = double all
  if(month===5&&(type==='strength'||type==='agility')) return 2; // Summer
  if((month===2||month===8)&&type==='intelligence') return 2; // Spring/Autumn
  return 1;
}

// ====== RANK BG EFFECT ======
function updateRankBgEffect(){
  const rankIdx=Math.min(RANKS.length-1,Math.floor((state.level-1)/2));
  const el=document.getElementById('rankBgEffect');
  el.className='rank-bg-effect';
  if(rankIdx>=10) el.classList.add('rank-s');
  if(RANKS[rankIdx]==='MONARCH') el.classList.add('rank-monarch');
}

// ====== LEVEL UP ======
function checkLevelUp(){
  while(state.xp>=state.xpNeeded){
    state.xp-=state.xpNeeded;state.level++;
    state.xpNeeded=Math.floor(state.xpNeeded*1.4);
    document.getElementById('levelupNewLevel').textContent='LEVEL '+state.level;
    document.getElementById('levelupOverlay').classList.add('active');
    notify('⚡ LEVEL UP! NOW LEVEL '+state.level,'levelup');
    playSound('levelup');
    setTimeout(()=>document.getElementById('levelupOverlay').classList.remove('active'),2800);
    checkRankCeremony();
    updateRankBgEffect();
    // Show prestige button
    if(state.level>=MAX_LEVEL) document.getElementById('prestigeBtn').style.display='block';
  }
}
document.getElementById('levelupOverlay').addEventListener('click',function(){this.classList.remove('active');});
document.getElementById('prestigeOverlay').addEventListener('click',function(){this.classList.remove('active');});

function checkRankCeremony(){
  const newRankIdx=Math.min(RANKS.length-1,Math.floor((state.level-1)/2));
  if(newRankIdx>state.prevRankIdx&&state.prevRankIdx>=0){
    document.getElementById('rankCeremonyOld').textContent='RANK '+RANKS[state.prevRankIdx];
    document.getElementById('rankCeremonyNew').textContent='RANK '+RANKS[newRankIdx];
    document.getElementById('rankCeremonyTitle').textContent=getRankTitle(newRankIdx);
    document.getElementById('rankCeremonyOverlay').classList.add('active');
    setTimeout(()=>document.getElementById('rankCeremonyOverlay').classList.remove('active'),4000);
  }
  state.prevRankIdx=newRankIdx;
}
document.getElementById('rankCeremonyOverlay').addEventListener('click',function(){this.classList.remove('active');});

function getRankTitle(idx){
  return state.customRankTitles&&state.customRankTitles[idx]?state.customRankTitles[idx]:DEFAULT_RANK_TITLES[idx]||DEFAULT_RANK_TITLES[0];
}

// ====== CUSTOM RANK TITLE ======
function openRankTitleModal(){
  const rankIdx=Math.min(RANKS.length-1,Math.floor((state.level-1)/2));
  document.getElementById('currentRankDisplay').textContent='CURRENT RANK: '+RANKS[rankIdx]+' — '+getRankTitle(rankIdx);
  document.getElementById('rankTitleInput').value=state.customRankTitles&&state.customRankTitles[rankIdx]?state.customRankTitles[rankIdx]:'';
  document.getElementById('rankTitleModal').classList.add('active');
}
function saveRankTitle(){
  const rankIdx=Math.min(RANKS.length-1,Math.floor((state.level-1)/2));
  const val=document.getElementById('rankTitleInput').value.trim().toUpperCase();
  if(!state.customRankTitles) state.customRankTitles={};
  state.customRankTitles[rankIdx]=val||DEFAULT_RANK_TITLES[rankIdx];
  closeRankTitleModal();save();renderPlayer();
  notify('✏ RANK TITLE UPDATED: '+state.customRankTitles[rankIdx]);
}
function resetRankTitle(){
  const rankIdx=Math.min(RANKS.length-1,Math.floor((state.level-1)/2));
  if(state.customRankTitles) delete state.customRankTitles[rankIdx];
  closeRankTitleModal();save();renderPlayer();
}
function closeRankTitleModal(){document.getElementById('rankTitleModal').classList.remove('active');}

// ====== SHADOW MARCH ======
function triggerShadowMarch(){
  const count=Math.min(Math.floor(state.totalQuests/10),20);
  if(!count){notify('Complete 10 quests to build your army!');return;}
  const el=document.getElementById('shadowMarch');
  el.innerHTML=Array.from({length:count},()=>'<span class="march-soldier">💀</span>').join('');
  el.style.display='flex';el.classList.remove('marching');
  void el.offsetWidth;el.classList.add('marching');
  setTimeout(()=>{el.classList.remove('marching');el.style.display='none';},3100);
}

// ====== PENALTY ======
function failQuest(id){
  const q=state.quests.find(q=>q.id===id);if(!q||q.completed) return;
  const xpLoss=q.xp;
  state.xp=Math.max(0,state.xp-xpLoss);
  state.stats[q.type]=Math.max(1,state.stats[q.type]-1);
  const oldStreak=state.streak;
  state.streak=0;state.lastActive=null;state.totalPenalties++;
  state.quests=state.quests.filter(x=>x.id!==id);
  state.combo=0;
  // Shadow Extraction instead of just penalty
  const pool=PENALTY_POOL.filter(p=>p.type===q.type);
  const pick=pool[Math.floor(Math.random()*pool.length)];
  const shadow={id:Date.now(),name:'[SHADOW] '+pick.name,type:q.type,xp:q.xp*2,completed:false,isShadow:true,originalQuest:q.name};
  document.getElementById('shadowExtractDetails').textContent='EXTRACTED FROM: '+q.name+' | REWARD: +'+shadow.xp+' XP (DOUBLE!)';
  document.getElementById('shadowExtractOverlay').classList.add('active');
  state._pendingShadow=shadow;
  logActivity('☠ FAILED: '+q.name,'-'+xpLoss+' XP','penalty');
  document.getElementById('penaltyDetails').textContent='-'+xpLoss+' XP  ·  '+q.type.toUpperCase()+' -1  ·  STREAK LOST ('+oldStreak+' days)';
  document.getElementById('penaltyOverlay').classList.add('active');
  document.body.classList.add('red-flash');
  setTimeout(()=>document.body.classList.remove('red-flash'),600);
  playSound('penalty');
  save();renderAll();
}
function acceptShadowExtraction(){
  if(state._pendingShadow){
    if(!state.shadowExtractions) state.shadowExtractions=[];
    state.shadowExtractions.push(state._pendingShadow);
    state._pendingShadow=null;
    notify('☠ SHADOW EXTRACTED! DEFEAT IT FOR +'+state.shadowExtractions[state.shadowExtractions.length-1].xp+' XP!');
  }
  closeShadowExtract();save();renderAll();
}
function closeShadowExtract(){document.getElementById('shadowExtractOverlay').classList.remove('active');}
function closePenalty(){document.getElementById('penaltyOverlay').classList.remove('active');}

function completeShadowExtraction(id){
  const q=(state.shadowExtractions||[]).find(q=>q.id===id);if(!q||q.completed) return;
  q.completed=true;
  state.xp+=q.xp;state.totalXP+=q.xp;state.totalQuests++;
  state.stats[q.type]=Math.min(99,state.stats[q.type]+1);
  logActivity('☠ SHADOW EXTRACTED: '+q.name,'+'+q.xp+' XP',q.type);
  setTimeout(()=>{state.shadowExtractions=state.shadowExtractions.filter(x=>x.id!==id);save();renderAll();},800);
  checkLevelUp();save();renderAll();
  notify('☠ SHADOW DEFEATED! +'+q.xp+' XP!');
}

function completePenaltyQuest(id){
  const q=state.penaltyQuests.find(q=>q.id===id);if(!q||q.completed) return;
  q.completed=true;state.xp+=10;state.totalXP+=10;
  state.stats[q.type]=Math.min(99,state.stats[q.type]+1);
  logActivity('⚔ PENALTY CLEARED: '+q.name,'+10 XP',q.type);
  setTimeout(()=>{state.penaltyQuests=state.penaltyQuests.filter(x=>x.id!==id);save();renderAll();},800);
  checkLevelUp();save();renderAll();notify('⚔ PUNISHMENT ENDURED! +10 XP');
}

// ====== MANDATORY ======
function generateMandatoryQuests(){
  const today=new Date().toDateString();
  if(state.mandatoryQuests.length>0&&state.mandatoryQuests[0].date===today) return;
  const shuffled=[...MANDATORY_POOL].sort(()=>Math.random()-0.5);
  state.mandatoryQuests=shuffled.slice(0,3).map((q,i)=>({id:Date.now()+i,name:q.name,type:q.type,completed:false,date:today,xp:15}));
  save();
}
function completeMandatory(id){
  const q=state.mandatoryQuests.find(q=>q.id===id);if(!q||q.completed) return;
  q.completed=true;
  const xp=state.doublXPDay?q.xp*2:q.xp;
  state.xp+=xp;state.totalXP+=xp;state.totalQuests++;
  state.stats[q.type]=Math.min(99,state.stats[q.type]+1);
  updateStreakAndHistory(q.name,xp,q.type);updateWeeklyProgress();
  updateCombo();updateDailyScore(xp);checkLevelUp();checkSkills();checkMilestones();checkBadges();
  playSound('complete');save();renderAll();
  notify('⚡ MANDATORY DONE! +'+xp+' XP'+(state.doublXPDay?' 🔥 DOUBLE XP!':''));
}

// ====== ADD QUEST ======
function addQuest(){
  const input=document.getElementById('questInput');
  const type=document.getElementById('questType').value;
  const xp=parseInt(document.getElementById('questDifficulty').value);
  const name=input.value.trim();
  if(!name){input.focus();return;}
  state.quests.push({id:Date.now(),name,type,completed:false,xp,note:'',icon:TYPE_ICONS[type],color:null});
  input.value='';save();renderQuests();
  notify('📋 QUEST REGISTERED: '+name.toUpperCase());
}
document.getElementById('questInput').addEventListener('keydown',e=>{if(e.key==='Enter')addQuest();});

function completeQuest(id){
  const q=state.quests.find(q=>q.id===id);if(!q||q.completed) return;
  q.completed=true;
  const mult=getComboMultiplier();
  const seasonBonus=getSeasonalXPBonus(q.type);
  const dayBonus=state.doublXPDay?2:1;
  const totalMult=mult*seasonBonus*dayBonus;
  const xp=Math.round(q.xp*totalMult);
  state.xp+=xp;state.totalXP+=xp;state.totalQuests++;
  state.stats[q.type]=Math.min(99,state.stats[q.type]+state.prestigeBonus+1);
  updateStreakAndHistory(q.name,xp,q.type);updateWeeklyProgress();
  updateCombo();updateDailyScore(xp);
  checkGearDrop(q.type);checkLevelUp();checkSkills();checkMilestones();checkBadges();updateChainProgress(q.name);
  playSound('complete');save();renderAll();
  let msg='✅ +'+xp+' XP';
  if(totalMult>1) msg+=' ('+totalMult.toFixed(1)+'x BONUS!)';
  notify(msg);
}
function deleteQuest(id){state.quests=state.quests.filter(q=>q.id!==id);save();renderQuests();}

// ====== CUSTOM QUEST ICON/COLOR ======
let _customQuestId=null,_selectedIcon=null,_selectedColor=null;
function openIconModal(id){
  _customQuestId=id;
  const q=state.quests.find(q=>q.id===id);if(!q) return;
  _selectedIcon=q.icon||TYPE_ICONS[q.type];
  _selectedColor=q.color||null;
  document.getElementById('iconModalQuestName').textContent=q.name;
  // Icons
  document.getElementById('iconPicker').innerHTML=QUEST_ICONS.map(icon=>`
    <div class="icon-option ${_selectedIcon===icon?'selected':''}" onclick="selectIcon('${icon}')">${icon}</div>`).join('');
  // Colors
  document.getElementById('colorPicker').innerHTML=QUEST_COLORS.map(color=>`
    <div class="color-option ${_selectedColor===color?'selected':''}" style="background:${color}" onclick="selectColor('${color}')"></div>`).join('');
  document.getElementById('iconModal').classList.add('active');
}
function selectIcon(icon){_selectedIcon=icon;document.querySelectorAll('.icon-option').forEach(el=>{el.classList.toggle('selected',el.textContent===icon);});}
function selectColor(color){_selectedColor=color;document.querySelectorAll('.color-option').forEach(el=>{el.classList.toggle('selected',el.style.background===color);});}
function saveQuestCustom(){
  const q=state.quests.find(q=>q.id===_customQuestId);
  if(q){q.icon=_selectedIcon;q.color=_selectedColor;}
  closeIconModal();save();renderQuests();
}
function closeIconModal(){document.getElementById('iconModal').classList.remove('active');}

// ====== NOTES ======
function openNote(id){
  const q=state.quests.find(q=>q.id===id);if(!q) return;
  state.noteModal={questId:id};
  document.getElementById('noteQuestName').textContent=q.name;
  document.getElementById('noteTextarea').value=q.note||'';
  document.getElementById('noteModal').classList.add('active');
}
function saveNote(){
  const q=state.quests.find(q=>q.id===state.noteModal.questId);
  if(q) q.note=document.getElementById('noteTextarea').value;
  document.getElementById('noteModal').classList.remove('active');save();renderQuests();
}
function closeNote(){document.getElementById('noteModal').classList.remove('active');}

// ====== POMODORO ======
let pomodoroInterval=null,pomodoroSeconds=1500,pomodoroQuestId=null,pomodoroRunning=false;
function startPomodoroForQuest(id){
  const q=state.quests.find(q=>q.id===id);if(!q) return;
  pomodoroQuestId=id;pomodoroSeconds=1500;pomodoroRunning=false;
  document.getElementById('pomodoroQuestName').textContent=q.name;
  document.getElementById('pomodoroTime').textContent='25:00';
  document.getElementById('pomodoroBar').style.width='100%';
  document.getElementById('pomodoroBtn').textContent='▶ START';
  document.getElementById('pomodoroOverlay').classList.add('active');
}
function togglePomodoro(){
  if(pomodoroRunning){clearInterval(pomodoroInterval);pomodoroRunning=false;document.getElementById('pomodoroBtn').textContent='▶ RESUME';}
  else{
    pomodoroRunning=true;document.getElementById('pomodoroBtn').textContent='⏸ PAUSE';
    pomodoroInterval=setInterval(()=>{
      pomodoroSeconds--;
      const m=Math.floor(pomodoroSeconds/60).toString().padStart(2,'0'),s=(pomodoroSeconds%60).toString().padStart(2,'0');
      document.getElementById('pomodoroTime').textContent=m+':'+s;
      document.getElementById('pomodoroBar').style.width=(pomodoroSeconds/1500*100)+'%';
      if(pomodoroSeconds<=0){clearInterval(pomodoroInterval);document.getElementById('pomodoroOverlay').classList.remove('active');completeQuest(pomodoroQuestId);notify('⏰ FOCUS COMPLETE! QUEST AUTO-CLEARED!');}
    },1000);
  }
}
function cancelPomodoro(){clearInterval(pomodoroInterval);pomodoroRunning=false;document.getElementById('pomodoroOverlay').classList.remove('active');}

// ====== TEMPLATES ======
function saveAsTemplate(){
  const name=document.getElementById('questInput').value.trim();
  const type=document.getElementById('questType').value;
  const xp=parseInt(document.getElementById('questDifficulty').value);
  if(!name){notify('Type a quest name first!');return;}
  if(state.templates.find(t=>t.name===name)) return;
  state.templates.push({name,type,xp});save();renderTemplates();notify('📌 TEMPLATE SAVED: '+name.toUpperCase());
}
function useTemplate(idx){const t=state.templates[idx];document.getElementById('questInput').value=t.name;document.getElementById('questType').value=t.type;document.getElementById('questDifficulty').value=t.xp;}
function renderTemplates(){
  const el=document.getElementById('templateBtns');if(!el) return;
  el.innerHTML=state.templates.map((t,i)=>`<button class="template-btn" onclick="useTemplate(${i})" title="${t.type} +${t.xp}XP">${t.name}</button>`).join('');
}

// ====== GOAL SETTING ======
let _goalStat=null;
function openGoalModal(stat){
  _goalStat=stat;
  document.getElementById('goalStatName').textContent=TYPE_ICONS[stat]+' '+stat.toUpperCase()+' GOAL';
  const existing=state.goals&&state.goals[stat];
  document.getElementById('goalTargetInput').value=existing?existing.target:'';
  document.getElementById('goalDateInput').value=existing?existing.date:'';
  document.getElementById('goalModal').classList.add('active');
}
function saveGoal(){
  const target=parseInt(document.getElementById('goalTargetInput').value);
  const date=document.getElementById('goalDateInput').value;
  if(!target||!date){notify('Fill in both fields!');return;}
  if(!state.goals) state.goals={};
  state.goals[_goalStat]={target,date};
  closeGoalModal();save();renderStatsGrid();renderDashboard();
  notify('🎯 GOAL SET: '+_goalStat.toUpperCase()+' → '+target+' by '+date);
}
function closeGoalModal(){document.getElementById('goalModal').classList.remove('active');}

// ====== HELPERS ======
function logActivity(msg,xp,type){
  const now=new Date();
  const t=now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  state.history.unshift({time:t,msg,xp,type});if(state.history.length>30) state.history.pop();
}
function updateStreakAndHistory(name,xp,type){
  if(name) logActivity(name,'+'+xp+' XP',type);
  const today=new Date().toDateString(),yesterday=new Date(Date.now()-86400000).toDateString();
  if(state.lastActive!==today){state.streak=(state.lastActive===yesterday)?state.streak+1:1;state.lastActive=today;}
  const key=new Date().toISOString().split('T')[0];
  if(name) state.questHistory[key]=(state.questHistory[key]||0)+1;
  if(!state.statHistory) state.statHistory={};
  state.statHistory[key]={...state.stats};
}
function updateDailyScore(xp){
  const today=new Date().toISOString().split('T')[0];
  state.dailyScores=state.dailyScores||{};
  state.dailyScores[today]=(state.dailyScores[today]||0)+xp;
}
function updateWeeklyProgress(){
  state.weeklyQuests=(state.weeklyQuests||0)+1;
  if(!state.bossDefeated&&state.currentBoss&&state.weeklyQuests>=state.currentBoss.goal){
    state.bossDefeated=true;state.xp+=state.currentBoss.reward;state.totalXP+=state.currentBoss.reward;
    document.getElementById('bossReward').textContent='+'+state.currentBoss.reward+' XP REWARD!';
    document.getElementById('bossVictoryOverlay').classList.add('active');
    setTimeout(()=>document.getElementById('bossVictoryOverlay').classList.remove('active'),3000);
    notify('👑 BOSS DEFEATED! +'+state.currentBoss.reward+' XP!','levelup');
    checkBadges();
  }
}
function initWeeklyBoss(){
  const wk=getWeekKey();
  if(state.weeklyReset!==wk){
    // Save last week XP to history
    if(state.weeklyReset){
      if(!state.weeklyXPHistory) state.weeklyXPHistory=[];
      state.weeklyXPHistory.unshift({week:state.weeklyReset,xp:state.weeklyXP||0,quests:state.weeklyQuests||0});
      if(state.weeklyXPHistory.length>8) state.weeklyXPHistory.pop();
    }
    state.weeklyReset=wk;state.weeklyQuests=0;state.weeklyXP=0;state.bossDefeated=false;
    state.currentBoss=BOSS_BATTLES[Math.floor(Math.random()*BOSS_BATTLES.length)];save();
  }
  if(!state.currentBoss) state.currentBoss=BOSS_BATTLES[0];
}
function getWeekKey(){const d=new Date();const jan1=new Date(d.getFullYear(),0,1);const wk=Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7);return d.getFullYear()+'-W'+wk;}
function checkGearDrop(type){
  let cum=0;const roll=Math.random();
  for(const g of GEAR_TABLE){cum+=g.dropChance;if(roll<cum){dropGear(g);return;}}
}
function dropGear(gear){
  if(!state.gear) state.gear=[];
  state.gear.push({...gear,uid:Date.now()});
  document.getElementById('gearDropIcon').textContent=gear.icon;
  document.getElementById('gearDropName').textContent=gear.name;
  document.getElementById('gearDropBonus').textContent='+'+gear.bonus+' '+gear.stat.toUpperCase()+' | '+gear.rarity.toUpperCase();
  document.getElementById('gearDropOverlay').classList.add('active');
  setTimeout(()=>document.getElementById('gearDropOverlay').classList.remove('active'),2500);
  notify('🎒 GEAR DROPPED: '+gear.name+'!');save();
}
function equipGear(uid){
  const item=state.gear.find(g=>g.uid===uid);if(!item) return;
  state.equippedGear=state.equippedGear.filter(id=>{const g=state.gear.find(x=>x.uid===id);return g&&g.stat!==item.stat;});
  state.equippedGear.push(uid);recalcGearBonuses();save();renderGear();notify('🛡️ EQUIPPED: '+item.name);
}
function recalcGearBonuses(){
  state.gearBonuses={strength:0,intelligence:0,agility:0,vitality:0,perception:0};
  state.equippedGear.forEach(uid=>{const g=state.gear.find(x=>x.uid===uid);if(g) state.gearBonuses[g.stat]=(state.gearBonuses[g.stat]||0)+g.bonus;});
}
function checkSkills(){
  SKILLS.forEach(s=>{
    if(state.skills.includes(s.id)) return;
    if(state.stats[s.stat]>=s.req){
      state.skills.push(s.id);
      document.getElementById('skillEmoji').textContent=s.icon;
      document.getElementById('skillName').textContent=s.name;
      document.getElementById('skillOverlay').classList.add('active');
      setTimeout(()=>document.getElementById('skillOverlay').classList.remove('active'),2500);
      notify('⚡ SKILL UNLOCKED: '+s.name);
    }
  });
}
function checkMilestones(){
  MILESTONES.forEach(m=>{
    if(state.milestonesAchieved.includes(m.id)) return;
    let ok=(m.type==='streak'&&state.streak>=m.val)||(m.type==='quests'&&state.totalQuests>=m.val)||(m.type==='level'&&state.level>=m.val);
    if(ok){
      state.milestonesAchieved.push(m.id);
      document.getElementById('milestoneEmoji').textContent=m.icon;
      document.getElementById('milestoneName').textContent=m.name;
      document.getElementById('milestoneOverlay').classList.add('active');
      setTimeout(()=>document.getElementById('milestoneOverlay').classList.remove('active'),2500);
      notify('🏆 MILESTONE: '+m.name);
    }
  });
}
function checkBadges(){BADGES_LIST.forEach(b=>{if(!state.badges.includes(b.id)&&b.check(state)){state.badges.push(b.id);notify('🏅 BADGE EARNED: '+b.name);}});}

// ====== GUILD ======
function openGuild(){
  const el=document.getElementById('guildContent');
  if(!state.guild){
    el.innerHTML=`
      <input class="quest-input" id="guildNameInput" placeholder="Guild name..." style="width:100%;margin-bottom:8px;"/>
      <button class="btn" onclick="createGuild()" style="width:100%;border-color:var(--gold);color:var(--gold);margin-bottom:10px;">⚜ CREATE GUILD</button>
      <div style="font-family:'Share Tech Mono';font-size:10px;color:var(--muted);text-align:center;margin:8px 0;">— OR —</div>
      <input class="quest-input" id="guildJoinInput" placeholder="Enter guild code to join..." style="width:100%;margin-bottom:8px;"/>
      <button class="btn" onclick="joinGuild()" style="width:100%;margin-bottom:8px;">JOIN GUILD</button>
      <button class="btn btn-danger" onclick="closeGuild()" style="width:100%;margin-top:4px;">✕ CANCEL</button>`;
  } else {
    const members=JSON.parse(localStorage.getItem('guild_'+state.guild.id)||'[]');
    const sorted=[...members].sort((a,b)=>b.xp-a.xp);
    el.innerHTML=`
      <div style="font-family:'Orbitron';font-size:18px;color:var(--gold);margin-bottom:4px;">⚜ ${state.guild.name}</div>
      <div style="font-family:'Share Tech Mono';font-size:10px;color:var(--muted);margin-bottom:12px;">CODE: ${state.guild.id}</div>
      <div style="font-family:'Orbitron';font-size:11px;color:var(--glow);margin-bottom:8px;">LEADERBOARD</div>
      ${sorted.map((m,i)=>`<div class="guild-member"><div class="guild-rank-num">#${i+1}</div><div class="guild-member-name">${m.name}</div><div class="guild-member-xp">${m.xp} XP</div></div>`).join('')}
      <button class="btn btn-danger" onclick="leaveGuild();closeGuild();" style="width:100%;margin-top:12px;">LEAVE GUILD</button>
      <button class="btn" onclick="closeGuild()" style="width:100%;margin-top:8px;">✕ CLOSE</button>`;
  }
  document.getElementById('guildModal').classList.add('active');
}
function closeGuild(){document.getElementById('guildModal').classList.remove('active');}
function createGuild(){
  const name=document.getElementById('guildNameInput').value.trim();if(!name) return;
  const id='G'+Math.random().toString(36).substr(2,6).toUpperCase();
  state.guild={id,name};localStorage.setItem('guild_'+id,JSON.stringify([{name:state.hunterName,xp:state.totalXP}]));
  save();openGuild();notify('⚜ GUILD CREATED: '+name);
}
function joinGuild(){
  const id=document.getElementById('guildJoinInput').value.trim().toUpperCase();
  const data=localStorage.getItem('guild_'+id);if(!data){notify('Guild not found!');return;}
  state.guild={id,name:'Guild '+id};
  const members=JSON.parse(data);
  if(!members.find(m=>m.name===state.hunterName)) members.push({name:state.hunterName,xp:state.totalXP});
  localStorage.setItem('guild_'+id,JSON.stringify(members));save();openGuild();notify('⚜ JOINED GUILD!');
}
function leaveGuild(){state.guild=null;save();}

// ====== PVP ======
function openPvP(){
  const code=generatePlayerCode();
  document.getElementById('pvpCodeInput').value=state.hunterName+':'+code+':'+state.weeklyQuests;
  document.getElementById('pvpOpponentInput').value='';
  document.getElementById('pvpOverlay').classList.add('active');
}
function closePvP(){document.getElementById('pvpOverlay').classList.remove('active');}
function startPvP(){
  const opp=document.getElementById('pvpOpponentInput').value.trim();
  if(!opp){notify('Enter opponent code!');return;}
  const parts=opp.split(':');if(parts.length<2){notify('Invalid code!');return;}
  const oppName=parts[0],oppScore=parseInt(parts[2])||0,myScore=state.weeklyQuests||0;
  closePvP();
  if(myScore>oppScore){state.xp+=50;state.totalXP+=50;checkLevelUp();notify('⚔ PVP WIN vs '+oppName+'! +50 XP!','levelup');}
  else if(myScore===oppScore) notify('⚔ PVP DRAW vs '+oppName+'!');
  else{const p=PENALTY_POOL[Math.floor(Math.random()*PENALTY_POOL.length)];state.penaltyQuests.push({id:Date.now(),name:'PVP LOSS PENALTY: '+p.name,type:p.type,completed:false});notify('☠ PVP LOSS vs '+oppName+'! PENALTY ASSIGNED!');}
  save();renderAll();
}

// ====== HABITS ======
function addHabit(){
  const name=document.getElementById('habitInput').value.trim();
  const type=document.getElementById('habitType').value;
  if(!name) return;
  if(!state.habits) state.habits=[];
  state.habits.push({id:Date.now(),name,type});
  document.getElementById('habitInput').value='';save();renderHabits();
}
function toggleHabitDay(habitId,day){
  if(!state.habitLogs) state.habitLogs={};
  const key=habitId+'_'+day;state.habitLogs[key]=!state.habitLogs[key];
  if(state.habitLogs[key]){state.xp+=5;state.totalXP+=5;logActivity('📋 HABIT: '+(state.habits||[]).find(h=>h.id===habitId)?.name,'+5 XP','vitality');}
  save();renderHabits();
}
function renderHabits(){
  const el=document.getElementById('habitTrackerGrid');if(!el) return;
  if(!state.habits||!state.habits.length){el.innerHTML='<div class="empty-state">[ NO HABITS YET ]</div>';return;}
  const days=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
  el.innerHTML=state.habits.map(h=>{
    const count=Object.keys(state.habitLogs||{}).filter(k=>k.startsWith(h.id+'_')&&state.habitLogs[k]).length;
    return `<div class="habit-tracker-row">
      <div class="habit-name"><span>${TYPE_ICONS[h.type]} ${h.name}</span><span style="font-family:'Share Tech Mono';font-size:10px;color:var(--success)">${count}/${days}</span></div>
      <div class="habit-days">${Array.from({length:days},(_,i)=>{const k=h.id+'_'+(i+1),done=state.habitLogs&&state.habitLogs[k];return `<div class="habit-day ${done?'done':''}" onclick="toggleHabitDay(${h.id},${i+1})">${done?'✓':i+1}</div>`;}).join('')}</div>
    </div>`;
  }).join('');
}

// ====== CHAINS ======
function openChainModal(){document.getElementById('chainSteps').innerHTML='';document.getElementById('chainName').value='';addChainStep();addChainStep();addChainStep();document.getElementById('chainModal').classList.add('active');}
function closeChainModal(){document.getElementById('chainModal').classList.remove('active');}
function addChainStep(){
  const el=document.getElementById('chainSteps');const idx=el.children.length+1;
  const div=document.createElement('div');div.className='chain-step-input';
  div.innerHTML=`<span style="font-family:'Share Tech Mono';font-size:11px;color:var(--muted);min-width:30px;">S${idx}</span><input class="quest-input" placeholder="Step ${idx}..." style="flex:1;"/>`;
  el.appendChild(div);
}
function saveChain(){
  const name=document.getElementById('chainName').value.trim();if(!name){notify('Enter chain name!');return;}
  const steps=Array.from(document.querySelectorAll('#chainSteps input')).filter(i=>i.value.trim()).map((i,idx)=>({id:idx+1,name:i.value.trim(),done:false}));
  if(steps.length<2){notify('Add at least 2 steps!');return;}
  if(!state.chains) state.chains=[];
  state.chains.push({id:Date.now(),name,steps,bonus:steps.length*30});
  closeChainModal();save();renderChains();notify('🔗 CHAIN CREATED: '+name.toUpperCase());
}
function completeChainStep(chainId,stepId){
  const chain=state.chains.find(c=>c.id===chainId);if(!chain) return;
  const step=chain.steps.find(s=>s.id===stepId);if(!step||step.done) return;
  step.done=true;state.xp+=20;state.totalXP+=20;state.totalQuests++;
  logActivity('🔗 CHAIN STEP: '+step.name,'+20 XP','intelligence');
  if(chain.steps.every(s=>s.done)){state.xp+=chain.bonus;state.totalXP+=chain.bonus;notify('🔗 CHAIN COMPLETE: '+chain.name+'! +'+chain.bonus+' BONUS XP!','levelup');checkBadges();}
  checkLevelUp();save();renderChains();
}
function updateChainProgress(questName){
  (state.chains||[]).forEach(chain=>{chain.steps.forEach(step=>{if(!step.done&&step.name.toLowerCase()===questName.toLowerCase()){step.done=true;notify('🔗 CHAIN STEP AUTO-DONE: '+step.name);}});});
}
function renderChains(){
  const el=document.getElementById('chainsList');if(!el) return;
  if(!state.chains||!state.chains.length){el.innerHTML='<div class="empty-state">[ NO CHAINS YET ]</div>';return;}
  el.innerHTML=state.chains.map(chain=>{
    const done=chain.steps.filter(s=>s.done).length,total=chain.steps.length,pct=Math.round((done/total)*100);
    return `<div class="chain-card">
      <div class="chain-title"><span>🔗 ${chain.name}</span><span style="font-family:'Share Tech Mono';font-size:10px;color:var(--success)">${done}/${total} · +${chain.bonus} BONUS</span></div>
      <div class="bar-track" style="margin-bottom:10px;"><div class="bar-fill" style="width:${pct}%"></div></div>
      ${chain.steps.map(step=>`<div class="chain-step ${step.done?'done':''}">
        <div class="chain-step-num">${step.id}</div><div class="chain-step-name">${step.name}</div>
        ${!step.done?`<button class="btn btn-success" onclick="completeChainStep(${chain.id},${step.id})" style="font-size:9px;padding:3px 8px;">✓</button>`:'<span style="color:var(--success);font-size:10px;">✓</span>'}
      </div>`).join('')}
    </div>`;
  }).join('');
}

// ====== WEEKLY REPORT ======
function showFullReport(){
  const s=state.stats;const best=Object.entries(s).sort((a,b)=>b[1]-a[1])[0];const worst=Object.entries(s).sort((a,b)=>a[1]-b[1])[0];
  document.getElementById('reportContent').innerHTML=`
    <div class="report-row"><span class="report-label">QUESTS THIS WEEK</span><span class="report-value">${state.weeklyQuests||0}</span></div>
    <div class="report-row"><span class="report-label">BEST STAT</span><span class="report-value">${TYPE_ICONS[best[0]]} ${best[0].toUpperCase()} (${best[1]})</span></div>
    <div class="report-row"><span class="report-label">NEEDS WORK</span><span class="report-value" style="color:var(--danger);">${TYPE_ICONS[worst[0]]} ${worst[0].toUpperCase()} (${worst[1]})</span></div>
    <div class="report-row"><span class="report-label">STREAK</span><span class="report-value">${state.streak} 🔥</span></div>
    <div class="report-row"><span class="report-label">LEVEL</span><span class="report-value">LEVEL ${state.level}</span></div>
    <div class="report-row"><span class="report-label">PRESTIGE</span><span class="report-value">${state.prestige>0?toRoman(state.prestige):'NONE'}</span></div>
    <div class="report-row"><span class="report-label">TOTAL XP</span><span class="report-value">${state.totalXP}</span></div>
    <div class="report-row"><span class="report-label">COMBO BEST</span><span class="report-value">${state.maxCombo||0}x</span></div>
    <div class="report-row"><span class="report-label">GEAR ITEMS</span><span class="report-value">${(state.gear||[]).length}</span></div>`;
  document.getElementById('reportOverlay').classList.add('active');
}
function closeReport(){document.getElementById('reportOverlay').classList.remove('active');}

// ====== RENDER: DASHBOARD ======
function renderDashboard(){
  // Life Summary
  const startDate=new Date(state.startDate||Date.now());
  const daysActive=Math.floor((Date.now()-startDate)/86400000)+1;
  const avgQpD=daysActive>0?(state.totalQuests/daysActive).toFixed(1):0;
  const scores=Object.values(state.dailyScores||{});
  const bestDay=scores.length?Math.max(...scores):0;
  const worstDay=scores.length?Math.min(...scores):0;
  const s=state.stats;
  const best=Object.entries(s).sort((a,b)=>b[1]-a[1])[0];
  const worst=Object.entries(s).sort((a,b)=>a[1]-b[1])[0];
  document.getElementById('lifeSummaryContent').innerHTML=`
    <div class="summary-row"><span class="summary-label">DAYS ACTIVE</span><span class="summary-value">${daysActive}</span></div>
    <div class="summary-row"><span class="summary-label">AVG QUESTS/DAY</span><span class="summary-value">${avgQpD}</span></div>
    <div class="summary-row"><span class="summary-label">BEST DAY SCORE</span><span class="summary-value">${bestDay} XP</span></div>
    <div class="summary-row"><span class="summary-label">WORST DAY SCORE</span><span class="summary-value">${worstDay} XP</span></div>
    <div class="summary-row"><span class="summary-label">STRONGEST STAT</span><span class="summary-value">${TYPE_ICONS[best[0]]} ${best[0].toUpperCase()} (${best[1]})</span></div>
    <div class="summary-row"><span class="summary-label">WEAKEST STAT</span><span class="summary-value"style="color:var(--danger);">${TYPE_ICONS[worst[0]]} ${worst[0].toUpperCase()} (${worst[1]})</span></div>
    <div class="summary-row"><span class="summary-label">PRESTIGE LEVEL</span><span class="summary-value">${state.prestige>0?'⭐ '+toRoman(state.prestige):'NONE'}</span></div>
    <div class="summary-row"><span class="summary-label">MAX COMBO</span><span class="summary-value">${state.maxCombo||0}x 🔥</span></div>`;

  // Goals
  const goals=state.goals||{};
  const goalKeys=Object.keys(goals);
  document.getElementById('goalTrackerContent').innerHTML=goalKeys.length===0?'<div class="empty-state" style="padding:16px;">[ SET GOALS BY CLICKING EACH STAT ]</div>':goalKeys.map(stat=>{
    const g=goals[stat];const current=state.stats[stat];
    const pct=Math.min(100,Math.round((current/g.target)*100));
    const deadline=new Date(g.date);const today=new Date();
    const daysLeft=Math.ceil((deadline-today)/(1000*60*60*24));
    const needed=Math.ceil((g.target-current)/Math.max(1,daysLeft));
    const behind=daysLeft>0&&needed>2;
    return `<div class="goal-card">
      <div class="goal-stat-name"><span>${TYPE_ICONS[stat]} ${stat.toUpperCase()} → ${g.target}</span><span style="color:${behind?'var(--danger)':'var(--muted)'};">${daysLeft}d left</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%;${behind?'background:var(--danger);':''}"></div></div>
      <div class="goal-progress-text">${current}/${g.target} (${pct}%) · Need ${needed}/day · ${behind?'⚠ FALLING BEHIND!':'On track ✓'}</div>
    </div>`;
  }).join('');

  // XP Leaderboard
  const history=state.weeklyXPHistory||[];
  const currentWeek={week:'THIS WEEK',xp:state.weeklyXP||0,quests:state.weeklyQuests||0};
  const all=[currentWeek,...history].sort((a,b)=>b.xp-a.xp);
  const lastWeekXP=history.length>0?history[0].xp:0;
  const change=currentWeek.xp>0&&lastWeekXP>0?Math.round(((currentWeek.xp-lastWeekXP)/lastWeekXP)*100):0;
  document.getElementById('xpLeaderboardContent').innerHTML=`
    ${change!==0?`<div style="font-family:'Share Tech Mono';font-size:11px;color:${change>0?'var(--success)':'var(--danger)'};margin-bottom:12px;">${change>0?'↑':'↓'} ${Math.abs(change)}% vs LAST WEEK</div>`:''}
    ${all.slice(0,5).map((w,i)=>`<div class="lboard-row">
      <div class="lboard-rank">#${i+1}</div>
      <div class="lboard-week">${w.week||'Week '+i}</div>
      <div class="lboard-xp">${w.xp} XP</div>
    </div>`).join('')}`;

  // Prestige History
  document.getElementById('prestigeHistoryContent').innerHTML=state.prestige===0?'<div class="empty-state" style="padding:16px;">[ REACH LEVEL '+MAX_LEVEL+' TO PRESTIGE ]</div>':
    state.prestigeHistory.map((p,i)=>`<div class="prestige-entry"><span style="font-size:24px;">⭐</span><div><div style="font-family:'Orbitron';font-size:13px;color:var(--gold);">PRESTIGE ${toRoman(i+1)}</div><div style="font-family:'Share Tech Mono';font-size:10px;color:var(--muted);">${p.date} · ${p.totalXP} XP earned</div></div></div>`).join('');
}

// ====== RENDER: QUESTS ======
function renderQuests(){
  const list=document.getElementById('questList');
  const all=[...state.quests.filter(q=>!q.completed),...state.quests.filter(q=>q.completed)];
  list.innerHTML=all.length===0?'<div class="empty-state">[ NO ACTIVE QUESTS ]</div>':all.map(q=>{
    const custom=state.questCustom&&state.questCustom[q.id]||{};
    const icon=custom.icon||q.icon||TYPE_ICONS[q.type];
    const borderColor=custom.color||q.color||null;
    const mult=getComboMultiplier(),season=getSeasonalXPBonus(q.type),day=state.doublXPDay?2:1;
    const totalXp=Math.round(q.xp*mult*season*day);
    const bonusTag=totalXp!==q.xp?`<span style="color:#ffaa00;font-size:9px;">x${(mult*season*day).toFixed(1)}</span>`:'';
    return `<div class="quest-item ${q.completed?'completed':''}" ${borderColor?`style="border-left-color:${borderColor}"`:''}">
      <div class="quest-item-main">
        <div class="quest-icon">${icon}</div>
        <div class="quest-info">
          <div class="quest-name">${q.name}</div>
          <div class="quest-meta">
            <span class="quest-type-badge badge-${q.type}">${q.type}</span>
            <span class="quest-xp">+${totalXp} XP ${bonusTag}</span>
          </div>
        </div>
        <div class="quest-actions">
          ${!q.completed?`
            <button class="btn btn-success" onclick="completeQuest(${q.id})" title="Complete">✓</button>
            <button class="btn btn-fail" onclick="failQuest(${q.id})" title="Fail">☠</button>
            <button class="btn btn-timer" onclick="startPomodoroForQuest(${q.id})" title="Focus Timer">⏱</button>
            <button class="btn btn-note" onclick="openNote(${q.id})" title="Note">📝</button>
            <button class="btn btn-custom" onclick="openIconModal(${q.id})" title="Customize">🎨</button>`
          :`<span style="color:var(--success);font-size:10px;font-family:'Share Tech Mono'">✓ DONE</span>`}
          <button class="btn btn-danger" onclick="deleteQuest(${q.id})" style="padding:6px 8px;font-size:11px;">✕</button>
        </div>
      </div>
      ${q.note?`<div class="quest-note-text">📝 ${q.note}</div>`:''}
    </div>`;
  }).join('');

  // Penalty quests
  const pp=document.getElementById('penaltyQuestPanel'),pl=document.getElementById('penaltyQuestList');
  const ap=state.penaltyQuests.filter(q=>!q.completed);
  pp.style.display=ap.length>0?'block':'none';
  if(ap.length>0) pl.innerHTML=ap.map(q=>`<div class="quest-item penalty-quest"><div class="quest-item-main"><div class="quest-icon">☠</div><div class="quest-info"><div class="quest-name">${q.name}</div><div class="quest-meta"><span class="quest-type-badge badge-${q.type}">${q.type}</span></div></div><div class="quest-actions"><button class="btn btn-success" onclick="completePenaltyQuest(${q.id})">✓ DONE</button></div></div></div>`).join('');

  // Shadow extractions
  const sep=document.getElementById('shadowExtractPanel'),sel=document.getElementById('shadowExtractList');
  const ae=(state.shadowExtractions||[]).filter(q=>!q.completed);
  sep.style.display=ae.length>0?'block':'none';
  if(ae.length>0) sel.innerHTML=ae.map(q=>`<div class="quest-item shadow-quest"><div class="quest-item-main"><div class="quest-icon">☠</div><div class="quest-info"><div class="quest-name">${q.name}</div><div class="quest-meta"><span class="quest-type-badge badge-${q.type}">${q.type}</span><span class="quest-xp">+${q.xp} XP</span></div></div><div class="quest-actions"><button class="btn btn-success" onclick="completeShadowExtraction(${q.id})">✓ EXTRACT</button></div></div></div>`).join('');

  // Mandatory
  const mp=document.getElementById('mandatoryPanel'),ml=document.getElementById('mandatoryList');
  mp.style.display=state.mandatoryQuests&&state.mandatoryQuests.length>0?'block':'none';
  if(state.mandatoryQuests&&state.mandatoryQuests.length>0) ml.innerHTML=state.mandatoryQuests.map(q=>`<div class="quest-item mandatory-quest ${q.completed?'completed':''}"><div class="quest-item-main"><div class="quest-icon">${TYPE_ICONS[q.type]}</div><div class="quest-info"><div class="quest-name">${q.name}</div><div class="quest-meta"><span class="quest-type-badge badge-${q.type}">${q.type}</span><span class="quest-xp">+${q.xp} XP</span></div></div><div class="quest-actions">${!q.completed?`<button class="btn btn-success" onclick="completeMandatory(${q.id})">✓</button>`:'<span style="color:var(--success);font-size:10px;font-family:\'Share Tech Mono\'">✓ DONE</span>'}</div></div></div>`).join('');

  renderTemplates();
}

// ====== RENDER: DAILY CHALLENGE ======
function renderDailyChallenge(){
  const el=document.getElementById('dailyChallengeContent');
  if(!state.dailyChallenge){el.innerHTML='<div class="empty-state" style="padding:12px;">[ LOADING CHALLENGE... ]</div>';return;}
  const dc=state.dailyChallenge;
  el.innerHTML=`
    <div style="font-size:32px;text-align:center;margin-bottom:8px;">${dc.icon}</div>
    <div style="font-family:'Orbitron';font-size:14px;color:#fff;margin-bottom:4px;">${dc.name}</div>
    <div style="font-family:'Share Tech Mono';font-size:11px;color:var(--muted);margin-bottom:10px;">REWARD: +${dc.xp*2} XP (DOUBLE) + ALL DAY 2x XP</div>
    ${!dc.completed
      ?`<button class="btn" onclick="completeDailyChallenge()" style="width:100%;border-color:#ffaa00;color:#ffaa00;background:rgba(255,170,0,0.08);">⚡ COMPLETE CHALLENGE</button>`
      :`<div style="font-family:'Orbitron';font-size:12px;color:var(--success);text-align:center;">✓ COMPLETED — 2x XP ACTIVE!</div>`
    }`;
}

// ====== RENDER: STATS GRID WITH GOALS ======
function renderStatsGrid(){
  const grid=document.getElementById('statsGrid');if(!grid) return;
  const stats=state.stats;const bonuses=state.gearBonuses||{};const goals=state.goals||{};
  grid.innerHTML=Object.entries(stats).map(([key,val],i)=>{
    const safeVal=parseInt(val)||1;
    const safeBonus=parseInt(bonuses[key])||0;
    const safePrestige=parseInt(state.prestigeBonus)||0;
    const total=safeVal+safeBonus+safePrestige;
    const goal=goals[key];
    const pct=Math.min(100,total);
    const goalPct=goal?Math.min(100,Math.round((safeVal/goal.target)*100)):null;
    const span=i===4?'grid-column:span 2;':'';
    return `<div class="stat-item" style="${span}">
      <div class="stat-label">
        <span>${TYPE_ICONS[key]} ${key.toUpperCase()}</span>
        <span class="goal-set-btn" onclick="openGoalModal('${key}')" title="Set Goal">🎯</span>
      </div>
      <div class="stat-value">${safeVal}${safeBonus>0?`<span style="color:var(--success);font-size:12px;"> +${safeBonus}</span>`:''}${safePrestige>0?`<span style="color:var(--gold);font-size:12px;"> ⭐${safePrestige}</span>`:''}</div>
      <div class="stat-bar"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
      ${goal?`<div class="stat-goal-indicator ${goalPct<50?'stat-goal-warn':''}">🎯 ${safeVal}/${goal.target} (${goalPct}%)</div>`:''}
    </div>`;
  }).join('');
}

// ====== RENDER: PLAYER ======
function renderPlayer(){
  const pct=Math.min(100,(state.xp/state.xpNeeded)*100);
  document.getElementById('xpBar').style.width=pct+'%';
  document.getElementById('xpLabel').textContent=state.xp+' / '+state.xpNeeded+' XP';
  document.getElementById('levelDisplay').innerHTML=state.level+'<span>LEVEL</span>';
  const rankIdx=Math.min(RANKS.length-1,Math.floor((state.level-1)/2));
  document.getElementById('rankBadge').textContent='RANK '+RANKS[rankIdx];
  document.getElementById('playerName').textContent=state.hunterName;
  document.getElementById('playerTitle').textContent=getRankTitle(rankIdx)+' ✏️';
  document.getElementById('totalQuests').textContent=state.totalQuests;
  document.getElementById('totalXP').textContent=state.totalXP;
  document.getElementById('totalDays').textContent=state.streak;
  updateAvatarDisplay();updatePlayerCodeDisplay();
  // Prestige stars
  const stars=document.getElementById('prestigeStars');
  if(stars) stars.textContent=Array(state.prestige).fill('⭐').join('');
  // Prestige button
  const pb=document.getElementById('prestigeBtn');
  if(pb) pb.style.display=state.level>=MAX_LEVEL?'block':'none';
  // Guild badge
  const gb=document.getElementById('guildBadge');
  if(gb){gb.style.display=state.guild?'block':'none';if(state.guild)gb.textContent='⚜ '+state.guild.name;}
  // Daily score
  const today=new Date().toISOString().split('T')[0];
  const todayScore=(state.dailyScores||{})[today]||0;
  const scores=Object.values(state.dailyScores||{});
  document.getElementById('dailyScore').textContent=todayScore;
  document.getElementById('bestDayScore').textContent=scores.length?Math.max(...scores):0;
  document.getElementById('avgDayScore').textContent=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
  // Sound btn
  document.getElementById('soundBtn').textContent=state.soundOn?'🔊 SOUND ON':'🔇 SOUND OFF';
  renderComboPanel();
  updateRankBgEffect();
}

// ====== RENDER: STATS DISTRIBUTION ======
function renderStatsDist(){
  const stats=state.stats;const total=Object.values(stats).reduce((a,b)=>a+(parseInt(b)||0),0);
  const bonuses=state.gearBonuses||{};
  document.getElementById('statBars').innerHTML=Object.entries(stats).map(([key,val])=>{
    const safeVal=parseInt(val)||1;
    const safeBonus=parseInt(bonuses[key])||0;
    const pct=Math.max(1,Math.round((safeVal/Math.max(total,1))*100));
    return `<div style="display:flex;align-items:center;gap:10px;">
      <div style="font-size:11px;color:var(--muted);font-family:'Share Tech Mono';min-width:90px;text-transform:uppercase;">${TYPE_ICONS[key]} ${key}</div>
      <div style="flex:1;height:6px;background:rgba(0,40,80,0.8);border:1px solid var(--border);">
        <div style="height:100%;width:${pct}%;background:${STAT_COLORS[key]};box-shadow:0 0 6px ${STAT_COLORS[key]};transition:width 0.6s;"></div>
      </div>
      <div style="font-family:'Orbitron';font-size:12px;color:#fff;min-width:50px;text-align:right;">${safeVal}${safeBonus>0?`<span style="color:var(--success);font-size:9px;"> +${safeBonus}</span>`:''}</div>
    </div>`;
  }).join('');
}

// ====== RENDER: HISTORY ======
function renderHistory(){
  const c=document.getElementById('historyList');
  c.innerHTML=state.history.length===0?`<div style="text-align:center;color:var(--muted);font-family:'Share Tech Mono';font-size:11px;padding:20px;">[ AWAITING FIRST ACTIVITY ]</div>`:
    state.history.map(h=>`<div class="history-item"><span class="h-time">${h.time}</span><span class="h-msg" style="${h.type==='penalty'?'color:var(--danger);opacity:1;':''}">${h.msg}</span><span class="h-xp" style="${h.type==='penalty'?'color:var(--danger);':''}">${h.xp}</span></div>`).join('');
}

// ====== RENDER: RADAR ======
function renderRadar(){
  const canvas=document.getElementById('radarCanvas');if(!canvas) return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height,cx=W/2,cy=H/2,maxR=100,maxV=99;
  const keys=['intelligence','agility','vitality','strength','perception'],labels=['INT','AGI','VIT','STR','PER'],n=keys.length;
  ctx.clearRect(0,0,W,H);
  function pt(i,f){const a=(Math.PI*2*i)/n-Math.PI/2;return{x:cx+Math.cos(a)*maxR*f,y:cy+Math.sin(a)*maxR*f};}
  for(let l=1;l<=4;l++){ctx.beginPath();for(let i=0;i<n;i++){const p=pt(i,l/4);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}ctx.closePath();ctx.strokeStyle='rgba(0,170,255,0.15)';ctx.lineWidth=1;ctx.stroke();}
  for(let i=0;i<n;i++){const p=pt(i,1);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.x,p.y);ctx.strokeStyle='rgba(0,170,255,0.2)';ctx.lineWidth=1;ctx.stroke();}
  const vals=keys.map(k=>state.stats[k]/maxV);
  ctx.beginPath();for(let i=0;i<n;i++){const p=pt(i,vals[i]);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}ctx.closePath();
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,maxR);g.addColorStop(0,'rgba(0,212,255,0.35)');g.addColorStop(1,'rgba(0,68,204,0.15)');ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle='rgba(0,212,255,0.9)';ctx.lineWidth=2;ctx.shadowColor='#00aaff';ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
  for(let i=0;i<n;i++){const p=pt(i,vals[i]);ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='#00d4ff';ctx.shadowColor='#00aaff';ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;}
  ctx.font='600 11px Orbitron,monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=0;i<n;i++){const p=pt(i,1.22);ctx.fillStyle='#3a5a7a';ctx.fillText(labels[i],p.x,p.y);}
  const avg=keys.reduce((s,k)=>s+(parseInt(state.stats[k])||1),0)/n;
  document.getElementById('radarScore').textContent=isNaN(avg)?'1.00':avg.toFixed(2);
}

// ====== RENDER: SHADOW ARMY ======
function renderShadowArmy(){
  const count=Math.floor(state.totalQuests/10);
  document.getElementById('shadowCount').textContent=count;
  document.getElementById('shadowSoldiers').innerHTML=Array.from({length:Math.min(count,30)},()=>'<span class="shadow-soldier">💀</span>').join('');
}

// ====== RENDER: SKILLS ======
function renderSkills(){
  document.getElementById('skillList').innerHTML=SKILLS.map(s=>{
    const unlocked=state.skills.includes(s.id);
    return `<div class="skill-item ${unlocked?'unlocked':''}"><div class="skill-icon">${s.icon}</div><div><div class="skill-name">${s.name}</div><div class="skill-req">${s.desc} ${unlocked?'✓':'('+state.stats[s.stat]+'/'+s.req+')'}</div></div></div>`;
  }).join('');
}

// ====== RENDER: BOSS ======
function renderBoss(){
  if(!state.currentBoss) return;
  const b=state.currentBoss;
  document.getElementById('bossName').textContent=b.name;
  document.getElementById('bossDesc').textContent=b.desc;
  document.getElementById('bossRewardText').textContent='REWARD: +'+b.reward+' XP'+(state.bossDefeated?' ✓ DEFEATED!':'');
  const pct=Math.min(100,((state.weeklyQuests||0)/b.goal)*100);
  document.getElementById('bossBar').style.width=pct+'%';
  document.getElementById('bossProgressLabel').textContent=(state.weeklyQuests||0)+' / '+b.goal;
}

// ====== RENDER: CALENDAR ======
function renderCalendar(){
  const grid=document.getElementById('calendarGrid'),today=new Date();
  grid.innerHTML=Array.from({length:182},(_,i)=>{
    const d=new Date(today);d.setDate(d.getDate()-(181-i));
    const key=d.toISOString().split('T')[0],count=state.questHistory[key]||0;
    let bg='rgba(0,170,255,0.06)';
    if(count>=1)bg='rgba(0,170,255,0.2)';if(count>=3)bg='rgba(0,170,255,0.45)';if(count>=5)bg='rgba(0,170,255,0.7)';if(count>=8)bg='var(--glow)';
    return `<div class="cal-cell" style="background:${bg}" title="${key}: ${count}"></div>`;
  }).join('');
}

// ====== RENDER: WEEKLY PREVIEW ======
function renderWeeklyPreview(){
  const s=state.stats,best=Object.entries(s).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('weeklyReportPreview').innerHTML=`
    <div class="report-row"><span class="report-label">QUESTS THIS WEEK</span><span class="report-value">${state.weeklyQuests||0}</span></div>
    <div class="report-row"><span class="report-label">BEST STAT</span><span class="report-value">${TYPE_ICONS[best[0]]} ${best[0].toUpperCase()}</span></div>
    <div class="report-row"><span class="report-label">STREAK</span><span class="report-value">${state.streak} 🔥</span></div>
    <div class="report-row"><span class="report-label">COMBO BEST</span><span class="report-value">${state.maxCombo||0}x 💥</span></div>`;
}

// ====== RENDER: MILESTONES ======
function renderMilestones(){
  document.getElementById('milestoneList').innerHTML=MILESTONES.map(m=>{
    const done=state.milestonesAchieved.includes(m.id);
    return `<div class="milestone-item ${done?'achieved':''}"><div class="milestone-icon">${m.icon}</div><div><div class="milestone-name">${m.name}</div><div class="milestone-req">${m.desc} ${done?'✓':''}</div></div></div>`;
  }).join('');
}

// ====== RENDER: GEAR ======
function renderGear(){
  const inv=document.getElementById('gearInventory'),equip=document.getElementById('equippedGear'),bonusEl=document.getElementById('gearBonus');
  if(!inv||!equip) return;
  recalcGearBonuses();
  const bonuses=state.gearBonuses||{};
  if(bonusEl) bonusEl.textContent=Object.entries(bonuses).filter(([,v])=>v>0).map(([k,v])=>'+'+v+' '+k.toUpperCase()).join(', ')||'+0';
  const equipped=(state.gear||[]).filter(g=>state.equippedGear.includes(g.uid));
  equip.innerHTML=equipped.length===0?'<div class="empty-state" style="padding:12px;">[ NO GEAR EQUIPPED ]</div>':equipped.map(g=>`<div class="gear-slot"><div class="gear-slot-icon">${g.icon}</div><div><div class="gear-slot-name">${g.name}</div><div class="gear-slot-stat">+${g.bonus} ${g.stat.toUpperCase()}</div></div></div>`).join('');
  const unequipped=(state.gear||[]).filter(g=>!state.equippedGear.includes(g.uid));
  inv.innerHTML=unequipped.length===0?'<div class="empty-state">[ COMPLETE QUESTS FOR GEAR DROPS! ]</div>':unequipped.map(g=>`<div class="gear-item gear-rarity-${g.rarity}" onclick="equipGear(${g.uid})"><div style="font-size:24px;">${g.icon}</div><div><div class="gear-name">${g.name}</div><div class="gear-bonus-text">+${g.bonus} ${g.stat.toUpperCase()}</div></div><span style="font-family:'Share Tech Mono';font-size:9px;color:var(--muted);margin-left:auto;">${g.rarity.toUpperCase()}</span></div>`).join('');
}

// ====== RENDER: BADGES ======
function renderBadges(){
  checkBadges();
  document.getElementById('badgeGrid').innerHTML=BADGES_LIST.map(b=>{
    const earned=state.badges.includes(b.id);
    return `<div class="badge-card ${earned?'earned':'locked'}"><div class="badge-icon">${b.icon}</div><div class="badge-name">${b.name}</div><div class="badge-desc">${b.desc}</div>${earned?'<div style="font-family:\'Share Tech Mono\';font-size:10px;color:var(--success);margin-top:6px;">✓ EARNED</div>':''}</div>`;
  }).join('');
}

// ====== RENDER: EVOLUTION CHART ======
function renderEvolutionChart(){
  const canvas=document.getElementById('evolutionChart'),canvas2=document.getElementById('dailyScoreChart');
  if(!canvas||!canvas2) return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(0,20,40,0.5)';ctx.fillRect(0,0,W,H);
  const keys=['strength','intelligence','agility','vitality','perception'],colors=['#ff6060','#60c0ff','#60ffb0','#ffd060','#cc80ff'];
  const today=new Date(),dates=Array.from({length:30},(_,i)=>{const d=new Date(today);d.setDate(d.getDate()-(29-i));return d.toISOString().split('T')[0];});
  const statData={};
  keys.forEach(k=>{let last=state.stats[k];statData[k]=dates.map(d=>{if(state.statHistory&&state.statHistory[d])last=state.statHistory[d][k]||last;return last;});});
  const maxVal=Math.max(...Object.values(statData).flat())+2;
  const pL=40,pR=20,pT=20,pB=30,cW=W-pL-pR,cH=H-pT-pB;
  for(let i=0;i<=5;i++){const y=pT+cH-(i/5)*cH;ctx.strokeStyle='rgba(0,170,255,0.1)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pL,y);ctx.lineTo(W-pR,y);ctx.stroke();ctx.fillStyle='rgba(58,90,122,0.8)';ctx.font='10px Share Tech Mono';ctx.textAlign='right';ctx.fillText(Math.round((i/5)*maxVal),pL-4,y+4);}
  keys.forEach((k,ki)=>{const data=statData[k];ctx.beginPath();data.forEach((v,i)=>{const x=pL+(i/(dates.length-1))*cW,y=pT+cH-((v/maxVal)*cH);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});ctx.strokeStyle=colors[ki];ctx.lineWidth=2;ctx.shadowColor=colors[ki];ctx.shadowBlur=6;ctx.stroke();ctx.shadowBlur=0;});
  keys.forEach((k,i)=>{ctx.fillStyle=colors[i];ctx.fillRect(pL+i*120,H-18,10,10);ctx.fillStyle='rgba(200,230,255,0.7)';ctx.font='11px Share Tech Mono';ctx.textAlign='left';ctx.fillText(k.toUpperCase(),pL+i*120+14,H-8);});
  const ctx2=canvas2.getContext('2d'),W2=canvas2.width,H2=canvas2.height;
  ctx2.clearRect(0,0,W2,H2);ctx2.fillStyle='rgba(0,20,40,0.5)';ctx2.fillRect(0,0,W2,H2);
  const scoreData=dates.map(d=>(state.dailyScores||{})[d]||0),maxScore=Math.max(...scoreData,1);
  const bw=(W2-pL-pR)/dates.length-2;
  scoreData.forEach((v,i)=>{const x=pL+i*((W2-pL-pR)/dates.length)+1,bh=(v/maxScore)*(H2-pT-pB),y=pT+(H2-pT-pB)-bh;ctx2.fillStyle=v>0?'rgba(0,212,255,0.6)':'rgba(0,40,80,0.4)';ctx2.fillRect(x,y,Math.max(bw,2),bh);});
  ctx2.fillStyle='rgba(200,230,255,0.5)';ctx2.font='11px Share Tech Mono';ctx2.textAlign='left';ctx2.fillText('DAILY XP SCORE (LAST 30 DAYS)',pL,pT-6);
}

// ====== EXPORT CARD ======
function exportCard(){
  const canvas=document.getElementById('exportCanvas');canvas.width=500;canvas.height=640;
  const ctx=canvas.getContext('2d'),arise=state.theme==='arise',glow=arise?'#cc00ff':'#00aaff',accent=arise?'#ff44ff':'#00d4ff';
  ctx.fillStyle=arise?'#080005':'#020810';ctx.fillRect(0,0,500,640);
  ctx.strokeStyle=glow;ctx.lineWidth=2;ctx.shadowColor=glow;ctx.shadowBlur=15;ctx.strokeRect(10,10,480,620);ctx.shadowBlur=0;
  ctx.font='bold 12px monospace';ctx.fillStyle=glow;ctx.textAlign='center';
  ctx.fillText('◈ LIFE SYSTEM — HUNTER CARD ◈',250,40);
  const pStars=state.prestige>0?Array(state.prestige).fill('⭐').join(''):' ';
  ctx.font='16px serif';ctx.fillText(pStars,250,62);
  const avatarIdx=Math.min(AVATARS.length-1,Math.floor((state.level-1)/10));
  if(state.avatarImg){const img=new Image();img.src=state.avatarImg;ctx.save();ctx.beginPath();ctx.arc(250,115,45,0,Math.PI*2);ctx.clip();ctx.drawImage(img,205,70,90,90);ctx.restore();}
  else{ctx.font='56px serif';ctx.fillText(AVATARS[avatarIdx],250,130);}
  ctx.font='bold 26px monospace';ctx.fillStyle='#ffffff';ctx.fillText(state.hunterName,250,178);
  const rankIdx=Math.min(RANKS.length-1,Math.floor((state.level-1)/2));
  ctx.font='bold 12px monospace';ctx.fillStyle='#ffd700';ctx.fillText('RANK '+RANKS[rankIdx]+'  —  LEVEL '+state.level,250,200);
  ctx.font='11px monospace';ctx.fillStyle=accent;ctx.fillText(getRankTitle(rankIdx),250,218);
  ctx.strokeStyle=glow;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(50,232);ctx.lineTo(450,232);ctx.stroke();
  const stats=state.stats,statColors={strength:'#ff6060',intelligence:'#60c0ff',agility:'#60ffb0',vitality:'#ffd060',perception:'#cc80ff'};
  ctx.textAlign='left';
  Object.entries(stats).forEach(([key,val],i)=>{const y=250+i*36;ctx.font='10px monospace';ctx.fillStyle='#3a5a7a';ctx.fillText(key.toUpperCase(),50,y);ctx.font='bold 15px monospace';ctx.fillStyle='#fff';ctx.fillText(val+(state.prestigeBonus?'+':'')+state.prestigeBonus,50,y+14);ctx.fillStyle='rgba(0,40,80,0.8)';ctx.fillRect(130,y+2,280,7);ctx.fillStyle=statColors[key];ctx.shadowColor=statColors[key];ctx.shadowBlur=4;ctx.fillRect(130,y+2,Math.min(280,(val/99)*280),7);ctx.shadowBlur=0;});
  ctx.strokeStyle=glow;ctx.beginPath();ctx.moveTo(50,445);ctx.lineTo(450,445);ctx.stroke();
  ctx.textAlign='center';ctx.font='10px monospace';ctx.fillStyle='#3a5a7a';
  ['TOTAL XP','STREAK','QUESTS'].forEach((l,i)=>ctx.fillText(l,[110,250,390][i],465));
  ctx.font='bold 18px monospace';ctx.fillStyle=accent;ctx.shadowColor=glow;ctx.shadowBlur=8;
  [state.totalXP,state.streak+'🔥',state.totalQuests].forEach((v,i)=>ctx.fillText(v,[110,250,390][i],490));ctx.shadowBlur=0;
  ctx.font='10px monospace';ctx.fillStyle='#3a5a7a';ctx.fillText('COMBO BEST: '+( state.maxCombo||0)+'x  |  BADGES: '+state.badges.length,250,520);
  ctx.font='10px monospace';ctx.fillStyle='#3a5a7a';ctx.fillText('PRESTIGE: '+(state.prestige>0?toRoman(state.prestige):'NONE')+'  |  POWER: '+((Object.values(stats).reduce((a,b)=>a+b,0)/5).toFixed(2)),250,540);
  ctx.font='10px monospace';ctx.fillStyle=glow;ctx.fillText('life-system.github.io',250,565);
  const link=document.createElement('a');link.download=state.hunterName+'_card.png';link.href=canvas.toDataURL();link.click();
  notify('📤 HUNTER CARD EXPORTED!');
}

// ====== RENDER ALL ======
function renderAll(){
  renderPlayer();renderStatsGrid();renderStatsDist();renderQuests();renderHistory();renderRadar();
  renderShadowArmy();renderSkills();renderBoss();renderCalendar();renderWeeklyPreview();
  renderMilestones();renderDailyChallenge();renderTemplates();
}

// ====== INIT ======
// Sanitize stats — fix any NaN values from old saves
Object.keys(state.stats).forEach(k=>{
  if(isNaN(state.stats[k])||state.stats[k]===null||state.stats[k]===undefined) state.stats[k]=1;
  state.stats[k]=Math.max(1,parseInt(state.stats[k])||1);
});
if(isNaN(state.prestigeBonus)||!state.prestigeBonus) state.prestigeBonus=0;
if(isNaN(state.prestige)||!state.prestige) state.prestige=0;
state.gearBonuses=state.gearBonuses||{strength:0,intelligence:0,agility:0,vitality:0,perception:0};
Object.keys(state.gearBonuses).forEach(k=>{if(isNaN(state.gearBonuses[k])) state.gearBonuses[k]=0;});
save();
applyTheme();
generatePlayerCode();
generateMandatoryQuests();
generateDailyChallenge();
initWeeklyBoss();
checkSeasonalEvent();
updateRankBgEffect();
if(state.prevRankIdx===undefined) state.prevRankIdx=Math.min(RANKS.length-1,Math.floor((state.level-1)/2));
renderAll();