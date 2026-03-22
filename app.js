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
  if(name==='shop'){initShop();renderShop();}
  if(name==='game'){const b=parseInt(localStorage.getItem('dungeon_best')||'0');document.getElementById('gameBest').textContent=b;}
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
  state.stats[q.type]=Math.min(99,(parseInt(state.stats[q.type])||1)+(parseInt(state.prestigeBonus)||0)+1);
  state.crystals=(state.crystals||0)+Math.ceil(xp/10);
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
  // Show crystals in records if element exists
  const crystalEl=document.getElementById('totalCrystals');
  if(crystalEl) crystalEl.textContent='💎'+(state.crystals||0);
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

// ====== TUTORIAL ======
const TUTORIAL_STEPS = [
  { icon:'⚔️', title:'WELCOME HUNTER', desc:'This is the LIFE SYSTEM — a Solo Leveling inspired self-improvement app. Complete real-life tasks as quests to level up your stats, just like Sung Jinwoo!', pos:'center' },
  { icon:'📋', title:'ADDING QUESTS', desc:'Type a task in the DAILY QUESTS box. Choose the stat it trains (Strength = gym, Intelligence = study) and the difficulty. Easy = +10 XP, Medium = +20, Hard = +40. Press + ADD or Enter!', pos:'right' },
  { icon:'✓', title:'COMPLETING QUESTS', desc:'Hit ✓ DONE when you finish a task. You earn XP and your stat goes up by 1. Fill the XP bar to LEVEL UP! ⚡ Hit ☠ FAIL if you could not do it — but beware the penalty!', pos:'right' },
  { icon:'☠', title:'PENALTY SYSTEM', desc:'Failing a quest deducts XP, drops your stat, resets your streak AND assigns a brutal shadow extraction quest. The System does not forgive weakness!', pos:'right' },
  { icon:'🔥', title:'COMBO SYSTEM', desc:'Complete quests quickly back-to-back to build a COMBO! 3 in a row = 1.5x XP, 5 = 2x XP, 10 = 3x XP! The multiplier shows on your quest cards.', pos:'center' },
  { icon:'👑', title:'BOSS & PRESTIGE', desc:'Complete enough quests each week to defeat the WEEKLY BOSS for bonus XP! Reach Level 30 to PRESTIGE — reset your level but gain permanent stat bonuses forever!', pos:'center' },
  { icon:'📊', title:'TABS & FEATURES', desc:'Explore the tabs at the top! DASHBOARD = life summary + goals. HABITS = monthly habit tracker. CHAINS = story-like quest progressions. GEAR = equipment drops. ARENA = the 2D game!', pos:'center' },
  { icon:'🎮', title:'SHADOW ARENA', desc:'Click the ARENA tab for a Solo Leveling themed 2D game! Survive waves of shadow monsters. The further you get the more XP you earn for your hunter. ARISE! ⚔️', pos:'center' },
];

let tutorialStep = 0;

function startTutorial() {
  tutorialStep = 0;
  document.getElementById('tutorialOverlay').style.display = 'block';
  showTutorialStep();
}

function showTutorialStep() {
  const step = TUTORIAL_STEPS[tutorialStep];
  const card = document.getElementById('tutorialCard');
  document.getElementById('tutorialStep').textContent = 'STEP ' + (tutorialStep+1) + ' / ' + TUTORIAL_STEPS.length;
  document.getElementById('tutorialIcon').textContent = step.icon;
  document.getElementById('tutorialTitle').textContent = step.title;
  document.getElementById('tutorialDesc').textContent = step.desc;
  document.getElementById('tutorialNextBtn').textContent = tutorialStep === TUTORIAL_STEPS.length-1 ? '✓ FINISH' : 'NEXT →';

  // Position card
  if (step.pos === 'center') {
    card.style.top = '50%'; card.style.left = '50%';
    card.style.transform = 'translate(-50%, -50%)';
    card.style.right = 'auto'; card.style.bottom = 'auto';
  } else if (step.pos === 'right') {
    card.style.top = '120px'; card.style.right = '20px';
    card.style.left = 'auto'; card.style.transform = 'none';
  }

  // Dots
  document.getElementById('tutorialDots').innerHTML = TUTORIAL_STEPS.map((_,i) =>
    `<div style="width:8px;height:8px;border-radius:50%;background:${i===tutorialStep?'var(--glow)':'var(--border)'};transition:background 0.3s;"></div>`
  ).join('');
}

function nextTutorial() {
  tutorialStep++;
  if (tutorialStep >= TUTORIAL_STEPS.length) { skipTutorial(); return; }
  showTutorialStep();
}

function skipTutorial() {
  document.getElementById('tutorialOverlay').style.display = 'none';
  state.tutorialDone = true; save();
}

// ====== SHADOW DUNGEON GAME v2 ======
let gameRunning=false,gameAnim=null,gs={};

const SHOP_ITEMS=[
  {id:'iron_sword',icon:'⚔️',name:'IRON SWORD',rarity:'common',stat:'strength',bonus:2,price:30,desc:'+2 STR · Attack Speed +5%'},
  {id:'shadow_dagger',icon:'🗡️',name:'SHADOW DAGGER',rarity:'rare',stat:'agility',bonus:3,price:80,desc:'+3 AGI · Crit Chance +10%'},
  {id:'mage_ring',icon:'💍',name:'MAGE RING',rarity:'rare',stat:'intelligence',bonus:3,price:80,desc:'+3 INT · Skill damage +15%'},
  {id:'iron_shield',icon:'🛡️',name:'IRON SHIELD',rarity:'common',stat:'vitality',bonus:2,price:30,desc:'+2 VIT · Block chance +8%'},
  {id:'shadow_armor',icon:'🥋',name:'SHADOW ARMOR',rarity:'epic',stat:'vitality',bonus:6,price:200,desc:'+6 VIT · Shadow resist +20%'},
  {id:'shadow_blade',icon:'🌑',name:'SHADOW BLADE',rarity:'epic',stat:'strength',bonus:6,price:200,desc:'+6 STR · Life steal +10%'},
  {id:'eye_of_shadow',icon:'👁️',name:'EYE OF SHADOW',rarity:'epic',stat:'perception',bonus:5,price:180,desc:'+5 PER · Enemy reveal'},
  {id:'arise_crown',icon:'💎',name:'ARISE CROWN',rarity:'legendary',stat:'perception',bonus:10,price:500,desc:'+10 PER · All skills enhanced'},
  {id:'monarch_robe',icon:'👑',name:'MONARCH ROBE',rarity:'legendary',stat:'vitality',bonus:12,price:600,desc:'+12 VIT · Invincibility frames +50%'},
  {id:'death_scythe',icon:'💀',name:'DEATH SCYTHE',rarity:'legendary',stat:'strength',bonus:15,price:800,desc:'+15 STR · ARISE cooldown -50%'},
  {id:'void_boots',icon:'🥾',name:'VOID BOOTS',rarity:'rare',stat:'agility',bonus:4,price:100,desc:'+4 AGI · Move speed +20%'},
  {id:'wisdom_crown',icon:'📿',name:'WISDOM AMULET',rarity:'rare',stat:'intelligence',bonus:4,price:100,desc:'+4 INT · XP gain +10%'},
];

const SELL_VALUES={common:10,rare:25,epic:60,legendary:150};

function initGameState(){
  return {
    hp:100,maxHp:100,mana:100,maxMana:100,
    score:0,floor:1,kills:0,crystals:0,
    p:{x:100,y:300,w:28,h:40,vx:0,vy:0,
       facing:1,state:'idle',stateTimer:0,
       invincible:0,attackBox:null,attackTimer:0,
       skill1CD:0,skill2CD:0,skill3CD:0,
       ariseTargets:[],shadowSoldiers:[]},
    enemies:[],drops:[],particles:[],floatingTexts:[],
    platforms:[],bg:[],
    floorTimer:0,floorEnemies:8,enemiesSpawned:0,
    betweenFloors:false,betweenTimer:0,
    keys:{},lastAttack:0,frameCount:0,
    cameraX:0,worldW:1800,
  };
}

// ====== SHOP SYSTEM ======
function initShop(){
  if(!state.crystals) state.crystals=0;
  if(!state.shopPurchased) state.shopPurchased=[];
}

function renderShop(){
  const el=document.getElementById('shopItemsList');if(!el) return;
  document.getElementById('shopCrystals').textContent=state.crystals||0;
  const filter=window._shopFilter||'all';
  const items=filter==='all'?SHOP_ITEMS:SHOP_ITEMS.filter(i=>i.rarity===filter);
  el.innerHTML=items.map(item=>{
    const owned=(state.shopPurchased||[]).includes(item.id);
    const canAfford=(state.crystals||0)>=item.price;
    return `<div class="shop-item rarity-${item.rarity}">
      ${owned?'<div class="shop-item-owned">OWNED</div>':''}
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-stat">${item.desc}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
        <div class="shop-item-price">💎 ${item.price}</div>
        ${owned
          ?`<button class="btn btn-success" style="font-size:9px;padding:4px 10px;" onclick="equipShopGear('${item.id}')">EQUIP</button>`
          :`<button class="btn" onclick="buyShopItem('${item.id}')" style="font-size:9px;padding:4px 10px;${!canAfford?'opacity:0.4;pointer-events:none;':''};border-color:var(--gold);color:var(--gold);">BUY</button>`
        }
      </div>
    </div>`;
  }).join('');

  // Sell list
  const sellEl=document.getElementById('sellGearList');if(!sellEl) return;
  const gear=state.gear||[];
  if(!gear.length){sellEl.innerHTML='<div class="empty-state" style="padding:16px;">[ NO GEAR TO SELL ]</div>';return;}
  sellEl.innerHTML=gear.map(g=>{
    const val=SELL_VALUES[g.rarity]||10;
    return `<div class="sell-item gear-rarity-${g.rarity}" onclick="sellGear(${g.uid})">
      <div style="font-size:22px;">${g.icon}</div>
      <div style="flex:1;"><div class="gear-name">${g.name}</div><div class="gear-bonus-text">+${g.bonus} ${g.stat.toUpperCase()}</div></div>
      <div style="font-family:'Orbitron';font-size:12px;color:var(--gold);">💎 ${val}</div>
    </div>`;
  }).join('');
}

function filterShop(rarity,btn){
  window._shopFilter=rarity;
  document.querySelectorAll('.shop-filter').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderShop();
}

function buyShopItem(id){
  const item=SHOP_ITEMS.find(i=>i.id===id);if(!item) return;
  if((state.crystals||0)<item.price){notify('Not enough Shadow Crystals! 💎');return;}
  state.crystals-=item.price;
  if(!state.shopPurchased) state.shopPurchased=[];
  state.shopPurchased.push(id);
  // Add to gear inventory
  state.gear=state.gear||[];
  state.gear.push({...item,uid:Date.now(),dropChance:0});
  playSound('complete');
  save();renderShop();renderGear();
  notify('🏪 PURCHASED: '+item.name+'! 💎-'+item.price);
}

function equipShopGear(id){
  const gearItem=state.gear.find(g=>g.id===id);if(!gearItem) return;
  equipGear(gearItem.uid);
  notify('🛡️ EQUIPPED: '+gearItem.name);
}

function sellGear(uid){
  const g=state.gear.find(x=>x.uid===uid);if(!g) return;
  const val=SELL_VALUES[g.rarity]||10;
  state.gear=state.gear.filter(x=>x.uid!==uid);
  state.equippedGear=state.equippedGear.filter(id=>id!==uid);
  state.crystals=(state.crystals||0)+val;
  recalcGearBonuses();
  playSound('complete');save();renderShop();renderGear();
  notify('💰 SOLD: '+g.name+' for 💎'+val);
}

// ====== GAME START/STOP ======
function startGame(){
  document.getElementById('gameStartScreen').style.display='none';
  document.getElementById('gameOverScreen').style.display='none';
  document.getElementById('gameStartBtn').style.display='none';
  document.getElementById('gameStopBtn').style.display='inline-flex';
  document.getElementById('gameTutorialOverlay').style.display='block';
  setTimeout(()=>{const el=document.getElementById('gameTutorialOverlay');if(el)el.style.display='none';},5000);
  const best=parseInt(localStorage.getItem('dungeon_best')||'0');
  document.getElementById('gameBest').textContent=best;
  gs=initGameState();
  buildFloor();
  gameRunning=true;
  if(gameAnim) cancelAnimationFrame(gameAnim);
  gameLoop();
}

function stopGame(){
  gameRunning=false;cancelAnimationFrame(gameAnim);
  document.getElementById('gameStartScreen').style.display='flex';
  document.getElementById('gameStartBtn').style.display='inline-flex';
  document.getElementById('gameStopBtn').style.display='none';
}

function endGame(){
  gameRunning=false;cancelAnimationFrame(gameAnim);
  const xpEarned=Math.floor(gs.score/4)+(gs.floor-1)*15;
  const crystalsEarned=gs.crystals;
  state.xp+=xpEarned;state.totalXP+=xpEarned;
  state.crystals=(state.crystals||0)+crystalsEarned;
  logActivity('🎮 DUNGEON FLOOR '+gs.floor,'+'+xpEarned+' XP','strength');
  checkLevelUp();save();renderPlayer();renderShop();
  const best=parseInt(localStorage.getItem('dungeon_best')||'0');
  if(gs.score>best) localStorage.setItem('dungeon_best',gs.score);
  document.getElementById('gameBest').textContent=Math.max(best,gs.score);
  document.getElementById('gameOverWave').textContent=gs.floor;
  document.getElementById('gameOverKills').textContent=gs.kills;
  document.getElementById('gameOverScore').textContent=gs.score;
  document.getElementById('gameOverCrystals').textContent='💎'+crystalsEarned;
  document.getElementById('gameXPEarned').textContent='+'+xpEarned+' XP + 💎'+crystalsEarned+' CRYSTALS ADDED!';
  document.getElementById('gameOverScreen').style.display='flex';
  document.getElementById('gameStartBtn').style.display='inline-flex';
  document.getElementById('gameStopBtn').style.display='none';
}

// ====== BUILD FLOOR ======
function buildFloor(){
  const W=gs.worldW,FLOOR=350;
  gs.platforms=[
    {x:0,y:FLOOR,w:W,h:70,isGround:true},
    {x:200,y:280,w:120,h:16},{x:420,y:230,w:100,h:16},
    {x:600,y:270,w:130,h:16},{x:800,y:220,w:110,h:16},
    {x:1000,y:260,w:140,h:16},{x:1200,y:230,w:120,h:16},
    {x:1400,y:270,w:150,h:16},{x:1600,y:240,w:120,h:16},
  ];
  gs.enemies=[];gs.drops=[];gs.particles=[];gs.floatingTexts=[];
  gs.enemiesSpawned=0;gs.floorEnemies=8+gs.floor*3;
  gs.p.x=80;gs.p.y=FLOOR-gs.p.h;gs.p.vx=0;gs.p.vy=0;
  gs.cameraX=0;gs.betweenFloors=false;gs.floorTimer=0;
}

// ====== GAME LOOP ======
function gameLoop(){
  if(!gameRunning) return;
  const canvas=document.getElementById('gameCanvas');if(!canvas) return;
  const ctx=canvas.getContext('2d');
  updateGame();drawGame(ctx,canvas.width,canvas.height);
  updateHUD();
  gameAnim=requestAnimationFrame(gameLoop);
}

function updateGame(){
  gs.frameCount++;
  const p=gs.p;
  const FLOOR=350,GRAVITY=0.55,SPEED=3.5,JUMP=-12;

  // Between floors
  if(gs.betweenFloors){
    gs.betweenTimer--;
    if(gs.betweenTimer<=0){gs.floor++;buildFloor();}
    return;
  }

  // Input - movement
  if(gs.keys['ArrowLeft']||gs.keys['a']||gs.keys['A']){p.vx=-SPEED;p.facing=-1;}
  else if(gs.keys['ArrowRight']||gs.keys['d']||gs.keys['D']){p.vx=SPEED;p.facing=1;}
  else p.vx*=0.7;

  // Jump
  if((gs.keys['ArrowUp']||gs.keys['w']||gs.keys['W']||gs.keys[' '])&&p.onGround){
    p.vy=JUMP;p.onGround=false;playSound('combo');
  }

  // Skills
  if(gs.keys['q']||gs.keys['Q']){gs.keys['q']=gs.keys['Q']=false;useSkill(1);}
  if(gs.keys['e']||gs.keys['E']){gs.keys['e']=gs.keys['E']=false;useSkill(2);}
  if(gs.keys['r']||gs.keys['R']){gs.keys['r']=gs.keys['R']=false;useSkill(3);}

  // Normal attack
  if(gs.keys['j']||gs.keys['z']||gs.keys['J']||gs.keys['Z']){
    gs.keys['j']=gs.keys['z']=gs.keys['J']=gs.keys['Z']=false;
    doAttack();
  }

  // Physics
  p.vy+=GRAVITY;
  p.x+=p.vx;p.y+=p.vy;
  p.onGround=false;

  // Platform collision
  gs.platforms.forEach(pl=>{
    if(p.x+p.w>pl.x&&p.x<pl.x+pl.w&&p.y+p.h>pl.y&&p.y+p.h<pl.y+pl.h+15&&p.vy>=0){
      p.y=pl.y-p.h;p.vy=0;p.onGround=true;
    }
  });

  // World bounds
  if(p.x<0)p.x=0;
  if(p.x+p.w>gs.worldW)p.x=gs.worldW-p.w;
  if(p.y>500){gs.hp=0;}

  // Camera
  gs.cameraX=Math.max(0,Math.min(gs.worldW-900,p.x-300));

  // Cooldowns
  if(p.skill1CD>0)p.skill1CD--;
  if(p.skill2CD>0)p.skill2CD--;
  if(p.skill3CD>0)p.skill3CD--;
  if(p.invincible>0)p.invincible--;
  if(p.attackTimer>0){p.attackTimer--;if(p.attackTimer===0)p.attackBox=null;}

  // Mana regen
  if(gs.mana<gs.maxMana&&gs.frameCount%60===0) gs.mana=Math.min(gs.maxMana,gs.mana+5);

  // Spawn enemies
  const spawnInterval=Math.max(80,200-gs.floor*15);
  if(gs.frameCount%spawnInterval===0&&gs.enemiesSpawned<gs.floorEnemies){
    spawnEnemy();gs.enemiesSpawned++;
  }

  // Update enemies
  gs.enemies.forEach(e=>{
    if(e.dead){e.deadTimer--;return;}
    // AI: move toward player
    const dx=p.x-e.x;
    e.facing=dx>0?1:-1;
    if(Math.abs(dx)>60) e.x+=e.speed*e.facing;
    // Jump toward player
    if(e.onGround&&Math.abs(dx)<200&&Math.random()<0.02) e.vy=-9;
    e.vy+=GRAVITY;e.y+=e.vy;e.onGround=false;
    gs.platforms.forEach(pl=>{
      if(e.x+e.w>pl.x&&e.x<pl.x+pl.w&&e.y+e.h>pl.y&&e.y+e.h<pl.y+pl.h+15&&e.vy>=0){
        e.y=pl.y-e.h;e.vy=0;e.onGround=true;
      }
    });
    if(e.y>520){e.dead=true;e.deadTimer=10;return;}
    // Attack player
    if(p.invincible===0&&rectsOverlap(p,e)){
      gs.hp=Math.max(0,gs.hp-(3+gs.floor));
      p.invincible=50;gs.screenShake=6;
      addParticles(p.x+p.w/2,p.y+p.h/2,'#ff3366',8);
      if(gs.hp<=0){setTimeout(endGame,400);gameRunning=false;}
    }
    // Check attack box
    if(p.attackBox&&!e.dead&&rectsOverlap(p.attackBox,e)){
      e.hp-=p.attackBox.dmg;
      addFloatingText('+'+p.attackBox.dmg,e.x+e.w/2,e.y,p.attackBox.dmg>15?'#ffd700':'#fff');
      addParticles(e.x+e.w/2,e.y+e.h/2,e.color,6);
      if(e.hp<=0) killEnemy(e);
    }
    e.frame++;
  });
  gs.enemies=gs.enemies.filter(e=>!e.dead||e.deadTimer>0);

  // Drops
  gs.drops.forEach(d=>{
    d.vy=(d.vy||0)+0.3;d.y+=d.vy;
    gs.platforms.forEach(pl=>{if(d.y+10>pl.y&&d.y<pl.y+pl.h&&d.x>pl.x&&d.x<pl.x+pl.w&&d.vy>=0){d.y=pl.y-10;d.vy=0;}});
    if(Math.hypot(d.x-(p.x+p.w/2),d.y-(p.y+p.h/2))<30){
      if(d.type==='crystal'){gs.crystals+=d.val;addFloatingText('💎+'+d.val,d.x,d.y,'#ffd700');}
      if(d.type==='hp'){gs.hp=Math.min(gs.maxHp,gs.hp+d.val);addFloatingText('❤+'+d.val,d.x,d.y,'#ff6688');}
      d.collected=true;
    }
  });
  gs.drops=gs.drops.filter(d=>!d.collected&&d.y<600);

  // Particles & text
  gs.particles.forEach(pt=>{pt.x+=pt.vx;pt.y+=pt.vy;pt.vy+=0.08;pt.life--;pt.alpha=pt.life/pt.maxLife;});
  gs.particles=gs.particles.filter(pt=>pt.life>0);
  gs.floatingTexts.forEach(ft=>{ft.y-=1;ft.life--;ft.alpha=ft.life/ft.maxLife;});
  gs.floatingTexts=gs.floatingTexts.filter(ft=>ft.life>0);

  // Shadow soldiers AI
  p.shadowSoldiers.forEach((s,i)=>{
    const targetX=p.x-40*(i+1)*p.facing;
    s.x+=(targetX-s.x)*0.1;s.y+=(p.y-s.y)*0.1;
    // Attack nearby enemies
    gs.enemies.forEach(e=>{
      if(!e.dead&&Math.hypot(s.x-e.x,s.y-e.y)<50){
        e.hp-=0.3;if(e.hp<=0)killEnemy(e);
      }
    });
  });

  // Floor clear
  if(gs.enemiesSpawned>=gs.floorEnemies&&gs.enemies.every(e=>e.dead)){
    gs.betweenFloors=true;gs.betweenTimer=150;
    gs.score+=100*gs.floor;
    addParticles(p.x+p.w/2,p.y+p.h/2,'#ffd700',30);
  }

  updateSkillUI();
}

function spawnEnemy(){
  const p=gs.p;
  const side=Math.random()<0.5?-1:1;
  const x=p.x+side*(600+Math.random()*200);
  const FLOOR=350;
  const types=['grunt','shadow','heavy','elite'];
  const tier=Math.min(3,Math.floor(gs.floor/3));
  const type=Math.random()<0.7?'grunt':types[Math.min(tier,3)];
  const configs={
    grunt:{w:26,h:36,hp:3+gs.floor,speed:1.2+gs.floor*0.15,color:'#6622aa',outline:'#9933ff',score:10},
    shadow:{w:22,h:32,hp:2+gs.floor,speed:2.5+gs.floor*0.2,color:'#003366',outline:'#0066ff',score:12},
    heavy:{w:36,h:46,hp:8+gs.floor*2,speed:0.8+gs.floor*0.1,color:'#330033',outline:'#cc00ff',score:20},
    elite:{w:30,h:42,hp:5+gs.floor,speed:1.8+gs.floor*0.2,color:'#220011',outline:'#ff0044',score:25,elite:true},
  };
  const cfg=configs[type]||configs.grunt;
  gs.enemies.push({
    x:Math.max(0,Math.min(gs.worldW-cfg.w,x)),y:FLOOR-cfg.h,
    w:cfg.w,h:cfg.h,hp:cfg.hp,maxHp:cfg.hp,
    speed:cfg.speed,color:cfg.color,outline:cfg.outline,
    type,facing:side<0?1:-1,frame:0,dead:false,deadTimer:20,
    vy:0,onGround:true,score:cfg.score,elite:cfg.elite||false,
  });
}

function killEnemy(e){
  e.dead=true;e.deadTimer=120; // 2 seconds to press ARISE (was 20!)
  e.canArise=true; // ALL enemies can be arised now (was 30% random)
  gs.kills++;gs.score+=e.score*gs.floor;
  // Drop crystals
  const crystalAmt=e.elite?5:Math.ceil(Math.random()*3);
  for(let i=0;i<crystalAmt;i++){
    gs.drops.push({x:e.x+e.w/2+(-15+Math.random()*30),y:e.y,vy:-4,type:'crystal',val:1});
  }
  // Rare HP drop
  if(Math.random()<0.1) gs.drops.push({x:e.x+e.w/2,y:e.y,vy:-3,type:'hp',val:15});
  addParticles(e.x+e.w/2,e.y+e.h/2,e.outline,12);
  addFloatingText(''+e.score*gs.floor,e.x+e.w/2,e.y-10,'#ffd700');
  playSound('complete');
}

function doAttack(){
  const p=gs.p,now=Date.now();
  if(now-gs.lastAttack<250) return;
  gs.lastAttack=now;
  p.attackBox={x:p.x+(p.facing>0?p.w:-40),y:p.y+8,w:44,h:p.h-8,dmg:4+gs.floor};
  p.attackTimer=8;
  addParticles(p.x+p.w/2+(p.facing*30),p.y+p.h/2,'#00aaff',5);
}

function useSkill(n){
  const p=gs.p;
  if(n===1){// Shadow Strike
    if(p.skill1CD>0){notify('Shadow Strike on cooldown!');return;}
    if(gs.mana<20){notify('Not enough mana!');return;}
    gs.mana-=20;p.skill1CD=120;
    p.attackBox={x:p.x+(p.facing>0?p.w:-80),y:p.y,w:90,h:p.h+10,dmg:12+gs.floor*2};
    p.attackTimer=18;
    addParticles(p.x+p.w/2+(p.facing*60),p.y+p.h/2,'#9933ff',20);
    addFloatingText('SHADOW STRIKE!',p.x+p.w/2,p.y-20,'#9933ff');
    playSound('combo');
  } else if(n===2){// ARISE
    if(p.skill2CD>0){
      notify('☠ ARISE on cooldown! ('+(Math.ceil(p.skill2CD/60))+'s)');return;
    }
    if(gs.mana<20){notify('Not enough mana! Need 20 mana for ARISE');return;}
    // Find nearest dead enemy with canArise flag
    const targets=gs.enemies.filter(e=>e.dead&&e.canArise&&e.deadTimer>0);
    if(!targets.length){
      notify('☠ No shadows to extract! Kill enemies first, then press E quickly!');return;
    }
    // Pick closest one to player
    const t=targets.reduce((closest,e)=>
      Math.abs(e.x-p.x)<Math.abs(closest.x-p.x)?e:closest
    );
    gs.mana-=20; // reduced from 30
    p.skill2CD=200;
    t.canArise=false;
    p.shadowSoldiers.push({x:t.x,y:t.y,type:t.type,color:t.color,outline:t.outline});
    if(p.shadowSoldiers.length>3) p.shadowSoldiers.shift();
    addParticles(t.x+(t.w||20)/2,t.y+(t.h||30)/2,'#cc00ff',30);
    addFloatingText('☠ ARISE!',t.x+(t.w||20)/2,t.y-20,'#cc00ff');
    gs.score+=50;
    notify('☠ SHADOW EXTRACTED! Soldiers: '+p.shadowSoldiers.length+'/3');
    playSound('levelup');
  } else if(n===3){// Shadow Shield
    if(p.skill3CD>0){notify('Shield on cooldown!');return;}
    if(gs.mana<15){notify('Not enough mana!');return;}
    gs.mana-=15;p.skill3CD=180;
    p.invincible=120;
    addParticles(p.x+p.w/2,p.y+p.h/2,'#00d4ff',25);
    addFloatingText('SHIELD!',p.x+p.w/2,p.y-20,'#00d4ff');
  }
}

function updateSkillUI(){
  const p=gs.p;
  const skills=[{id:'skill1Btn',cd:p.skill1CD,max:120},{id:'skill2Btn',cd:p.skill2CD,max:200},{id:'skill3Btn',cd:p.skill3CD,max:180}];
  skills.forEach(s=>{
    const el=document.getElementById(s.id);if(!el) return;
    el.classList.toggle('on-cooldown',s.cd>0);
  });
}

function rectsOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function addParticles(x,y,color,count){
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2,sp=1+Math.random()*4;
    gs.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,color,life:20+Math.random()*20,maxLife:40,alpha:1});
  }
}
function addFloatingText(text,x,y,color){
  gs.floatingTexts.push({text,x,y,color,life:50,maxLife:50,alpha:1});
}

// ====== DRAW ======
function drawGame(ctx,W,H){
  const p=gs.p,cam=gs.cameraX,fc=gs.frameCount;
  if(!gs.screenShake) gs.screenShake=0;
  let shakeX=0,shakeY=0;
  if(gs.screenShake>0){shakeX=(Math.random()-0.5)*gs.screenShake;shakeY=(Math.random()-0.5)*gs.screenShake;gs.screenShake=Math.max(0,gs.screenShake-1);}
  ctx.clearRect(0,0,W,H);
  ctx.save();ctx.translate(shakeX,shakeY);

  // BG gradient - dungeon
  const skyG=ctx.createLinearGradient(0,0,0,H);
  skyG.addColorStop(0,'#030010');skyG.addColorStop(0.5,'#080028');skyG.addColorStop(1,'#120040');
  ctx.fillStyle=skyG;ctx.fillRect(0,0,W,H);

  // Far pillars (parallax)
  ctx.save();ctx.translate(-(cam*0.2)%W,0);
  for(let i=-1;i<5;i++){
    const px=i*240+80,ph=H*0.65;
    const pg=ctx.createLinearGradient(px,0,px+40,0);
    pg.addColorStop(0,'#0a0030');pg.addColorStop(0.5,'#180055');pg.addColorStop(1,'#0a0030');
    ctx.fillStyle=pg;ctx.fillRect(px,H-ph,40,ph);
    ctx.fillStyle='#220066';ctx.fillRect(px-6,H-ph,52,12);
    ctx.fillStyle='rgba(123,47,255,0.25)';
    for(let r=0;r<3;r++){ctx.fillRect(px+10,H-ph+30+r*60,20,8);ctx.fillRect(px+14,H-ph+42+r*60,12,4);}
    ctx.fillStyle='#1a0050';ctx.fillRect(px-8,H-65,56,20);
  }
  ctx.restore();

  // Ceiling darkness
  ctx.fillStyle='rgba(5,0,20,0.7)';ctx.fillRect(0,0,W,25);
  // Hanging chains
  ctx.save();ctx.translate(-(cam*0.4)%W,0);
  for(let i=0;i<8;i++){
    const cx2=i*130+50;
    ctx.strokeStyle='rgba(80,40,120,0.35)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(cx2,0);ctx.lineTo(cx2+8,55);ctx.stroke();
    ctx.fillStyle='rgba(90,45,130,0.35)';ctx.beginPath();ctx.arc(cx2+8,57,5,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();

  // Fog layers
  for(let layer=0;layer<3;layer++){
    const fx=(fc*(0.3+layer*0.15)+layer*300)%(W+200)-100;
    const fg=ctx.createRadialGradient(fx,H*0.6,0,fx,H*0.6,100+layer*40);
    fg.addColorStop(0,`rgba(40,0,80,${0.05-layer*0.01})`);fg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=fg;ctx.fillRect(0,0,W,H);
  }

  ctx.save();ctx.translate(-cam,0);

  // PLATFORMS
  gs.platforms.forEach(pl=>{
    if(pl.isGround){
      const flG=ctx.createLinearGradient(0,pl.y,0,pl.y+pl.h);
      flG.addColorStop(0,'#0e0030');flG.addColorStop(1,'#050015');
      ctx.fillStyle=flG;ctx.fillRect(pl.x,pl.y,pl.w,pl.h);
      ctx.strokeStyle='rgba(60,20,100,0.4)';ctx.lineWidth=1;
      for(let tx=0;tx<pl.w;tx+=60){ctx.beginPath();ctx.moveTo(pl.x+tx,pl.y);ctx.lineTo(pl.x+tx,pl.y+pl.h);ctx.stroke();}
      for(let ty=0;ty<pl.h;ty+=20){ctx.beginPath();ctx.moveTo(pl.x,pl.y+ty);ctx.lineTo(pl.x+pl.w,pl.y+ty);ctx.stroke();}
      for(let rx=50;rx<pl.w;rx+=150){
        const ra=0.12+Math.sin(fc*0.03+rx)*0.08;
        ctx.strokeStyle=`rgba(123,47,255,${ra})`;ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(pl.x+rx,pl.y+5);ctx.lineTo(pl.x+rx+30,pl.y+5);ctx.stroke();
        ctx.beginPath();ctx.arc(pl.x+rx+15,pl.y+12,8,0,Math.PI*2);ctx.stroke();
      }
      const eG=ctx.createLinearGradient(0,pl.y-8,0,pl.y+4);
      eG.addColorStop(0,'rgba(123,47,255,0.6)');eG.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=eG;ctx.fillRect(pl.x,pl.y-8,pl.w,12);
      ctx.strokeStyle='#9933ff';ctx.lineWidth=2;ctx.shadowColor='#7b2fff';ctx.shadowBlur=12;
      ctx.beginPath();ctx.moveTo(pl.x,pl.y);ctx.lineTo(pl.x+pl.w,pl.y);ctx.stroke();ctx.shadowBlur=0;
      for(let tx=100;tx<pl.w;tx+=300) drawTorch(ctx,pl.x+tx,pl.y-36,fc);
    } else {
      const ptG=ctx.createLinearGradient(pl.x,pl.y,pl.x,pl.y+pl.h);
      ptG.addColorStop(0,'#1a0050');ptG.addColorStop(1,'#0a0030');
      ctx.fillStyle=ptG;ctx.fillRect(pl.x,pl.y,pl.w,pl.h);
      ctx.fillStyle='#2a0070';ctx.fillRect(pl.x,pl.y,pl.w,4);
      ctx.fillStyle='#100040';ctx.fillRect(pl.x,pl.y+pl.h-4,pl.w,4);
      const uG=ctx.createLinearGradient(0,pl.y+pl.h,0,pl.y+pl.h+20);
      uG.addColorStop(0,`rgba(123,47,255,${0.25+Math.sin(fc*0.05)*0.1})`);uG.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=uG;ctx.fillRect(pl.x,pl.y+pl.h,pl.w,20);
      ctx.strokeStyle='#aa55ff';ctx.lineWidth=2;ctx.shadowColor='#9933ff';ctx.shadowBlur=10;
      ctx.beginPath();ctx.moveTo(pl.x,pl.y);ctx.lineTo(pl.x+pl.w,pl.y);ctx.stroke();ctx.shadowBlur=0;
    }
  });

  // DROPS
  gs.drops.forEach(d=>{
    ctx.save();
    if(d.type==='crystal'){
      ctx.shadowColor='#00d4ff';ctx.shadowBlur=15;ctx.fillStyle='#0088cc';
      ctx.beginPath();ctx.moveTo(d.x,d.y-8);ctx.lineTo(d.x+6,d.y);ctx.lineTo(d.x,d.y+8);ctx.lineTo(d.x-6,d.y);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(0,212,255,0.6)';
      ctx.beginPath();ctx.moveTo(d.x,d.y-8);ctx.lineTo(d.x+3,d.y-2);ctx.lineTo(d.x,d.y+3);ctx.lineTo(d.x-3,d.y-2);ctx.closePath();ctx.fill();
    } else {
      ctx.shadowColor='#ff6688';ctx.shadowBlur=12;ctx.fillStyle='#cc0033';
      ctx.beginPath();ctx.arc(d.x-4,d.y-3,5,Math.PI,0);ctx.arc(d.x+4,d.y-3,5,Math.PI,0);
      ctx.lineTo(d.x,d.y+8);ctx.closePath();ctx.fill();
    }
    ctx.restore();
  });

  // SHADOW SOLDIERS
  p.shadowSoldiers.forEach((s,i)=>{
    ctx.save();const pulse=0.7+Math.sin(fc*0.15+i)*0.3;ctx.globalAlpha=pulse;
    drawShadowSoldier(ctx,s.x,s.y,fc,i);ctx.restore();
  });

  // ENEMIES
  gs.enemies.forEach(e=>{
    if(e.dead&&e.deadTimer<=0) return;
    ctx.save();if(e.dead)ctx.globalAlpha=Math.max(0,e.deadTimer/120);
    drawEnemy(ctx,e,e.dead?0:Math.sin(e.frame*0.1)*2,fc);ctx.restore();
  });

  // PLAYER
  ctx.save();
  if(p.invincible>0&&Math.floor(p.invincible/4)%2===0)ctx.globalAlpha=0.35;
  drawPlayer(ctx,p,fc);ctx.restore();

  // PARTICLES
  gs.particles.forEach(pt=>{
    ctx.save();ctx.globalAlpha=pt.alpha;ctx.fillStyle=pt.color;
    ctx.shadowColor=pt.color;ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(pt.x,pt.y,pt.size||3,0,Math.PI*2);ctx.fill();ctx.restore();
  });

  // FLOATING TEXTS
  gs.floatingTexts.forEach(ft=>{
    ctx.save();ctx.globalAlpha=ft.alpha;
    ctx.font='bold '+(ft.big?18:13)+'px Orbitron,monospace';ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,0.8)';ctx.lineWidth=3;ctx.strokeText(ft.text,ft.x,ft.y);
    ctx.fillStyle=ft.color;ctx.shadowColor=ft.color;ctx.shadowBlur=10;ctx.fillText(ft.text,ft.x,ft.y);ctx.restore();
  });

  ctx.restore(); // end camera

  // FLOOR CLEAR OVERLAY
  if(gs.betweenFloors){
    const prog=Math.min(1,(150-gs.betweenTimer)/40);
    ctx.save();ctx.globalAlpha=prog*0.88;ctx.fillStyle='rgba(0,0,10,0.9)';ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=prog*0.3;
    for(let r=0;r<3;r++){ctx.strokeStyle='#7b2fff';ctx.lineWidth=1;ctx.shadowColor='#7b2fff';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(W/2,H/2,(80+r*50)+Math.sin(fc*0.05)*5,0,Math.PI*2);ctx.stroke();}
    ctx.globalAlpha=prog;ctx.shadowBlur=0;
    ctx.font='bold 38px Orbitron,monospace';ctx.fillStyle='#ffd700';ctx.textAlign='center';
    ctx.shadowColor='#ffd700';ctx.shadowBlur=30;ctx.fillText('FLOOR '+gs.floor+' CLEARED!',W/2,H/2-16);
    ctx.font='bold 16px Share Tech Mono,monospace';ctx.fillStyle='#cc88ff';ctx.shadowColor='#cc88ff';ctx.shadowBlur=10;
    ctx.fillText('▼  FLOOR '+(gs.floor+1)+'  ▼',W/2,H/2+20);ctx.restore();
  }

  ctx.restore(); // end shake
}

function drawTorch(ctx,x,y,fc){
  ctx.fillStyle='#4a2800';ctx.fillRect(x-2,y+8,4,22);
  ctx.fillStyle='#6b3a00';ctx.fillRect(x-4,y+6,8,10);
  const flicker=Math.sin(fc*0.3)*3;
  const fG=ctx.createRadialGradient(x,y+flicker,0,x,y+flicker,14);
  fG.addColorStop(0,'rgba(255,220,100,0.9)');fG.addColorStop(0.4,'rgba(255,100,20,0.7)');fG.addColorStop(1,'rgba(255,50,0,0)');
  ctx.fillStyle=fG;ctx.beginPath();
  ctx.moveTo(x-8,y+8);ctx.quadraticCurveTo(x-4+flicker,y,x,y-10+flicker);
  ctx.quadraticCurveTo(x+4+flicker,y,x+8,y+8);ctx.closePath();ctx.fill();
  const lG=ctx.createRadialGradient(x,y+20,0,x,y+20,60);
  lG.addColorStop(0,'rgba(255,150,50,0.06)');lG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=lG;ctx.fillRect(x-60,y,120,80);
}

function drawPlayer(ctx,p,fc){
  const x=p.x,y=p.y,f=p.facing,moving=Math.abs(p.vx)>0.5;
  const legAnim=moving?Math.sin(fc*0.25)*8:0;
  const aG=ctx.createRadialGradient(x+14,y+20,0,x+14,y+20,35);
  aG.addColorStop(0,'rgba(0,170,255,0.10)');aG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=aG;ctx.fillRect(x-20,y-10,68,80);
  // Coat body
  ctx.fillStyle='#070e1f';
  ctx.beginPath();ctx.moveTo(x+4,y+14);ctx.lineTo(x+p.w-4,y+14);ctx.lineTo(x+p.w,y+p.h-4);ctx.lineTo(x,y+p.h-4);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#1a3a6a';ctx.lineWidth=1.5;ctx.shadowColor='#0066cc';ctx.shadowBlur=6;ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle='#0d1e3a';
  ctx.beginPath();ctx.moveTo(x+p.w/2,y+14);ctx.lineTo(x+p.w/2-5,y+26);ctx.lineTo(x+p.w/2,y+28);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x+p.w/2,y+14);ctx.lineTo(x+p.w/2+5,y+26);ctx.lineTo(x+p.w/2,y+28);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(0,120,255,0.4)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(x+2,y+p.h-6);ctx.lineTo(x+p.w-2,y+p.h-6);ctx.stroke();
  ctx.fillStyle='#1a1a2e';ctx.fillRect(x+2,y+p.h-16,p.w-4,5);
  ctx.strokeStyle='#334488';ctx.lineWidth=1;ctx.strokeRect(x+2,y+p.h-16,p.w-4,5);
  ctx.fillStyle='#080f20';ctx.fillRect(x+3,y+p.h-10+legAnim,8,10);ctx.fillRect(x+p.w-11,y+p.h-10-legAnim,8,10);
  ctx.fillStyle='#1a2244';ctx.fillRect(x+3,y+p.h-4+legAnim,8,4);ctx.fillRect(x+p.w-11,y+p.h-4-legAnim,8,4);
  // Head
  ctx.fillStyle='#e8c4a0';ctx.beginPath();ctx.arc(x+p.w/2,y+8,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#1a0a0a';ctx.beginPath();ctx.arc(x+p.w/2,y+3,8,Math.PI,0);ctx.fill();
  ctx.beginPath();ctx.moveTo(x+p.w/2-8,y+3);ctx.lineTo(x+p.w/2-12,y-4);ctx.lineTo(x+p.w/2-6,y+1);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x+p.w/2+8,y+3);ctx.lineTo(x+p.w/2+12,y-4);ctx.lineTo(x+p.w/2+6,y+1);ctx.closePath();ctx.fill();
  ctx.fillStyle='#00d4ff';ctx.shadowColor='#00d4ff';ctx.shadowBlur=12;
  if(f>0)ctx.fillRect(x+p.w/2+1,y+7,5,3);else ctx.fillRect(x+p.w/2-6,y+7,5,3);
  ctx.shadowBlur=0;
  // Sword
  const sX=f>0?x+p.w-2:x+2,sTX=f>0?sX+30:sX-30,sY=y+p.h*0.38;
  const swingA=p.attackTimer>0?Math.sin(p.attackTimer*0.5)*15:0;
  ctx.shadowColor='#4488ff';ctx.shadowBlur=p.attackTimer>0?20:8;
  ctx.strokeStyle=p.attackTimer>0?'#88ccff':'#336699';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(sX,sY+swingA);ctx.lineTo(sTX,sY-8+swingA);ctx.stroke();
  ctx.strokeStyle='rgba(150,200,255,0.6)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(sX,sY-1+swingA);ctx.lineTo(sTX-f*3,sY-9+swingA);ctx.stroke();
  ctx.fillStyle='#334466';ctx.shadowBlur=4;ctx.fillRect(sX-2,sY-3+swingA,5,6);ctx.shadowBlur=0;
  if(p.attackTimer>0){
    const sAlpha=p.attackTimer/15;
    ctx.save();ctx.globalAlpha=sAlpha*0.7;
    for(let arc=0;arc<4;arc++){
      ctx.strokeStyle=arc%2===0?'#00d4ff':'#ffffff';ctx.lineWidth=3-arc*0.5;
      ctx.shadowColor='#00aaff';ctx.shadowBlur=15;
      ctx.beginPath();ctx.arc(sX+f*25,sY,20+arc*8,-0.6+arc*0.1,0.6-arc*0.1,f<0);ctx.stroke();
    }
    ctx.restore();
  }
  if(p.invincible>80){
    ctx.save();ctx.globalAlpha=0.4+Math.sin(fc*0.2)*0.2;
    const shG=ctx.createRadialGradient(x+p.w/2,y+p.h/2,10,x+p.w/2,y+p.h/2,36);
    shG.addColorStop(0,'rgba(0,212,255,0.3)');shG.addColorStop(1,'rgba(0,80,255,0)');
    ctx.fillStyle=shG;ctx.beginPath();ctx.arc(x+p.w/2,y+p.h/2,36,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#00d4ff';ctx.lineWidth=2;ctx.shadowColor='#00d4ff';ctx.shadowBlur=20;
    ctx.beginPath();ctx.arc(x+p.w/2,y+p.h/2,34,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  if(!p.onGround&&p.vy<-2){
    ctx.save();ctx.globalAlpha=0.25;
    const trG=ctx.createLinearGradient(x+p.w/2,y+p.h,x+p.w/2,y+p.h+30);
    trG.addColorStop(0,'rgba(0,120,255,0.4)');trG.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=trG;ctx.fillRect(x+4,y+p.h,p.w-8,30);ctx.restore();
  }
  ctx.fillStyle='rgba(0,170,255,0.8)';ctx.font='bold 9px Orbitron,monospace';ctx.textAlign='center';
  ctx.shadowColor='#00aaff';ctx.shadowBlur=6;ctx.fillText(state.hunterName||'HUNTER',x+p.w/2,y-4);ctx.shadowBlur=0;
}

function drawEnemy(ctx,e,bob,fc){
  const x=e.x,y=e.y+bob,f=e.facing;
  if(e.type==='shadow'||e.type==='grunt'){
    const bG=ctx.createRadialGradient(x+e.w/2,y+e.h/2,0,x+e.w/2,y+e.h/2,e.w);
    bG.addColorStop(0,e.type==='shadow'?'rgba(0,80,180,0.35)':'rgba(80,0,150,0.35)');bG.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bG;ctx.fillRect(x-10,y-10,e.w+20,e.h+20);
    ctx.fillStyle=e.color;ctx.shadowColor=e.outline;ctx.shadowBlur=e.elite?20:10;
    ctx.beginPath();ctx.moveTo(x+e.w*0.2,y+e.h*0.15);ctx.lineTo(x+e.w*0.8,y+e.h*0.15);ctx.lineTo(x+e.w*0.9,y+e.h*0.7);ctx.lineTo(x+e.w*0.1,y+e.h*0.7);ctx.closePath();ctx.fill();
    ctx.fillStyle=e.elite?'#1a0030':'#0a0020';
    ctx.beginPath();ctx.moveTo(x,y+e.h*0.5);ctx.lineTo(x+e.w*0.5,y+e.h);ctx.lineTo(x+e.w,y+e.h*0.5);ctx.closePath();ctx.fill();
    ctx.fillStyle=e.color;ctx.beginPath();ctx.arc(x+e.w/2,y+8,9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=e.elite?'#ff0044':'#ff2255';ctx.shadowColor=e.elite?'#ff0044':'#ff3366';ctx.shadowBlur=12;
    ctx.beginPath();ctx.arc(x+e.w/2-5*f,y+8,3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+e.w/2+5*f,y+8,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    const aS=Math.sin(e.frame*0.12)*15;
    ctx.strokeStyle=e.outline;ctx.lineWidth=3;ctx.shadowColor=e.outline;ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(x+e.w*0.2,y+e.h*0.3);ctx.lineTo(x-10,y+e.h*0.5+aS);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+e.w*0.8,y+e.h*0.3);ctx.lineTo(x+e.w+10,y+e.h*0.5-aS);ctx.stroke();
    ctx.fillStyle=e.outline;ctx.shadowBlur=6;
    ctx.beginPath();ctx.arc(x-10,y+e.h*0.5+aS,4,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+e.w+10,y+e.h*0.5-aS,4,0,Math.PI*2);ctx.fill();
  } else if(e.type==='heavy'){
    const aS=Math.sin(e.frame*0.08)*10;
    ctx.fillStyle='#0a0020';ctx.shadowColor='#cc00ff';ctx.shadowBlur=15;ctx.fillRect(x,y+e.h*0.1,e.w,e.h*0.7);
    ctx.strokeStyle='#660099';ctx.lineWidth=2;ctx.strokeRect(x,y+e.h*0.1,e.w,e.h*0.7);
    ctx.fillStyle='#160030';ctx.fillRect(x+4,y+e.h*0.15,e.w-8,e.h*0.25);
    ctx.fillStyle='#0a0020';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(x+e.w/2,y+8,12,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#660099';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+e.w/2,y+8,12,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#ff00ff';ctx.shadowColor='#ff00ff';ctx.shadowBlur=15;ctx.fillRect(x+e.w/2-8,y+6,16,4);
    ctx.fillStyle='#220033';ctx.shadowColor='#cc00ff';ctx.shadowBlur=10;
    ctx.fillRect(x+(f>0?e.w-2:2),y+e.h*0.3+aS,f*20,6);ctx.fillRect(x+(f>0?e.w+14:-20),y+e.h*0.2+aS,8,18);
    ctx.fillStyle='#0a001a';ctx.shadowBlur=0;ctx.fillRect(x+3,y+e.h*0.75,e.w/2-5,e.h*0.25);ctx.fillRect(x+e.w/2+2,y+e.h*0.75,e.w/2-5,e.h*0.25);
  } else {
    const dA=Math.sin(e.frame*0.15)*5;
    ctx.save();ctx.globalAlpha=0.15;ctx.fillStyle=e.color;
    ctx.fillRect(x-8*f,y,e.w,e.h);ctx.fillRect(x-16*f,y,e.w,e.h);ctx.restore();
    ctx.fillStyle='#110011';ctx.shadowColor='#ff0044';ctx.shadowBlur=18;
    ctx.beginPath();ctx.moveTo(x+e.w/2,y);ctx.lineTo(x+e.w,y+e.h*0.3);ctx.lineTo(x+e.w*0.85,y+e.h);ctx.lineTo(x+e.w*0.15,y+e.h);ctx.lineTo(x,y+e.h*0.3);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#ff0044';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#220011';ctx.beginPath();ctx.arc(x+e.w/2,y+7,9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff0000';ctx.shadowColor='#ff0000';ctx.shadowBlur=15;
    for(let ei=0;ei<3;ei++){ctx.beginPath();ctx.arc(x+e.w/2-8+ei*8,y+7,2.5,0,Math.PI*2);ctx.fill();}
    ctx.shadowBlur=0;ctx.strokeStyle='#ff3366';ctx.lineWidth=2;ctx.shadowColor='#ff3366';ctx.shadowBlur=12;
    ctx.beginPath();ctx.moveTo(x-6,y+e.h*0.35+dA);ctx.lineTo(x-22,y+e.h*0.2+dA);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+e.w+6,y+e.h*0.35-dA);ctx.lineTo(x+e.w+22,y+e.h*0.2-dA);ctx.stroke();ctx.shadowBlur=0;
  }

  if(!e.dead&&e.hp<e.maxHp){
    const bW=e.w+8;
    ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(x-4,y-12,bW,6);
    const hpC=e.elite?'#ff0044':e.type==='heavy'?'#cc00ff':'#9933ff';
    ctx.fillStyle=hpC;ctx.shadowColor=hpC;ctx.shadowBlur=4;ctx.fillRect(x-4,y-12,bW*(e.hp/e.maxHp),6);ctx.shadowBlur=0;
  }
  if(e.dead&&e.canArise&&e.deadTimer>0){
    const arP=0.5+Math.sin(fc*0.25)*0.5;
    ctx.save();
    for(let i=0;i<4;i++){const a=fc*0.1+i*Math.PI/2;const rx=x+e.w/2+Math.cos(a)*18,ry=y+e.h/2+Math.sin(a)*10;ctx.globalAlpha=arP*0.7;ctx.fillStyle='#cc00ff';ctx.shadowColor='#cc00ff';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(rx,ry,3,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=arP;ctx.font='bold 22px serif';ctx.textAlign='center';ctx.fillStyle='#ee44ff';ctx.shadowColor='#cc00ff';ctx.shadowBlur=25;ctx.fillText('☠',x+e.w/2,y-10);
    ctx.font='bold 9px Orbitron,monospace';ctx.fillStyle='#fff';ctx.shadowBlur=0;ctx.fillText('PRESS E',x+e.w/2,y+2);
    ctx.globalAlpha=0.8;ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(x-4,y-25,e.w+8,4);
    ctx.fillStyle='#cc00ff';ctx.shadowColor='#cc00ff';ctx.shadowBlur=6;ctx.fillRect(x-4,y-25,(e.w+8)*(e.deadTimer/120),4);ctx.restore();
  }
}

function drawShadowSoldier(ctx,s,sy,fc,idx){
  const pulse=0.6+Math.sin(fc*0.1+idx)*0.4;
  ctx.shadowColor='#cc00ff';ctx.shadowBlur=20*pulse;ctx.fillStyle='#0a0010';
  ctx.fillRect(s.x,sy,20,30);ctx.strokeStyle=`rgba(170,0,255,${pulse})`;ctx.lineWidth=2;ctx.strokeRect(s.x,sy,20,30);
  ctx.fillStyle=`rgba(255,0,255,${pulse})`;ctx.shadowColor='#ff00ff';ctx.shadowBlur=10;
  ctx.fillRect(s.x+4,sy+6,4,4);ctx.fillRect(s.x+12,sy+6,4,4);
  ctx.fillStyle=`rgba(120,0,200,${pulse*0.3})`;ctx.beginPath();ctx.arc(s.x+10,sy+15,18,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
}

function updateHUD(){
  document.getElementById('gameWave').textContent=gs.floor;
  document.getElementById('gameScore').textContent=gs.score;
  document.getElementById('gameKills').textContent=gs.kills;
  document.getElementById('gameCrystals').textContent='💎'+gs.crystals;
  const hp=Math.max(0,(gs.hp/gs.maxHp)*100);
  const mn=Math.max(0,(gs.mana/gs.maxMana)*100);
  const hb=document.getElementById('gameHpBar');
  const mb=document.getElementById('gameManaBar');
  if(hb){hb.style.width=hp+'%';hb.style.background=hp>50?'linear-gradient(90deg,#ff3366,#ff6688)':hp>25?'linear-gradient(90deg,#ff6600,#ffaa00)':'#ff0000';}
  if(mb) mb.style.width=mn+'%';
}

// Controls
document.addEventListener('keydown',e=>{
  if(!gameRunning) return;
  gs.keys[e.key]=true;
  // Prevent browser defaults for game keys
  if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','q','Q','e','E','r','R','j','J','z','Z'].includes(e.key)){
    e.preventDefault();
  }
});
document.addEventListener('keyup',e=>{if(gs.keys) gs.keys[e.key]=false;});

// Touch controls
(function(){
  let touchStartY=0;
  document.addEventListener('touchstart',e=>{
    if(!gameRunning) return;
    const canvas=document.getElementById('gameCanvas');if(!canvas) return;
    const rect=canvas.getBoundingClientRect();
    const t=e.touches[0];
    const rx=(t.clientX-rect.left)/rect.width;
    const ry=(t.clientY-rect.top)/rect.height;
    if(rx<0.3){gs.keys['ArrowLeft']=true;setTimeout(()=>{if(gs.keys)gs.keys['ArrowLeft']=false;},200);}
    else if(rx>0.7){gs.keys['ArrowRight']=true;setTimeout(()=>{if(gs.keys)gs.keys['ArrowRight']=false;},200);}
    if(ry<0.4){gs.keys[' ']=true;setTimeout(()=>{if(gs.keys)gs.keys[' ']=false;},100);}
    else if(ry>0.4&&ry<0.8){gs.keys['j']=true;setTimeout(()=>{if(gs.keys)gs.keys['j']=false;},100);}
    e.preventDefault();
  },{passive:false});
})();

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
// Auto-show tutorial for new users
if (!state.tutorialDone) setTimeout(startTutorial, 1500);