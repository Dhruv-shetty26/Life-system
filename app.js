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
  updateSidebarInfo();
  save();
  notify(state.soundOn ? '🔊 SOUND ON' : '🔇 SOUND OFF');
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
  // Legacy support — now we scroll to sections
  const map={
    main:'sec-hunter',dashboard:'sec-progress',habits:'sec-habits',
    chains:'sec-quests',gear:'sec-gear',shop:'sec-shop',
    stats:'sec-stats',badges:'sec-progress'
  };
  const target=document.getElementById(map[name]||'sec-hunter');
  if(target) target.scrollIntoView({behavior:'smooth'});
}

// Section nav highlight on scroll + re-render charts when visible
window.addEventListener('scroll',()=>{
  const sections=['sec-hunter','sec-quests','sec-stats','sec-army','sec-gear','sec-progress','sec-habits','sec-shop'];
  let current='sec-hunter';
  sections.forEach(id=>{
    const el=document.getElementById(id);
    if(el&&el.getBoundingClientRect().top<=120) current=id;
  });
  document.querySelectorAll('.sec-btn').forEach(btn=>{
    const href=btn.getAttribute('href')||'';
    btn.classList.toggle('active',href==='#'+current);
  });
  // Re-render charts when stats section is in view
  if(current==='sec-stats') renderEvolutionChart();
});

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
function toggleTheme(){state.theme=state.theme==='normal'?'arise':'normal';applyTheme();save();updateSidebarInfo();}
function applyTheme(){
  const arise=state.theme==='arise';
  document.body.classList.toggle('arise-mode',arise);
  // Update sidebar theme badge
  updateSidebarInfo();
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
    const oldLevel = state.level;
    state.xp-=state.xpNeeded;state.level++;
    state.xpNeeded=Math.floor(state.xpNeeded*1.4);
    document.getElementById('levelupNewLevel').textContent='LEVEL '+state.level;
    document.getElementById('levelupOverlay').classList.add('active');
    notify('⚡ LEVEL UP! NOW LEVEL '+state.level,'levelup');
    playSound('levelup');
    setTimeout(()=>document.getElementById('levelupOverlay').classList.remove('active'),2800);
    checkRankCeremony();
    updateRankBgEffect();
    checkWisdomUnlock(oldLevel, state.level);
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
  // Show dramatic quest complete animation
  showQuestComplete(q.name, xp, q.type, totalMult);
  save();renderAll();
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
  const diff=document.getElementById('habitDifficulty')?.value||'easy';
  if(!name){notify('Enter a habit name!');return;}
  if(!state.habits) state.habits=[];
  state.habits.push({id:Date.now(),name,type,diff});
  document.getElementById('habitInput').value='';
  save();renderHabits();
  notify('📋 HABIT ADDED: '+name.toUpperCase());
}

function toggleHabitDay(habitId,day){
  if(!state.habitLogs) state.habitLogs={};
  const key=habitId+'_'+day;
  const wasOn=state.habitLogs[key];
  state.habitLogs[key]=!wasOn;
  const habit=(state.habits||[]).find(h=>h.id===habitId);
  if(!habit) return;
  // XP based on difficulty
  const XP_MAP={easy:5,medium:10,hard:20};
  const xp=XP_MAP[habit.diff||'easy'];
  if(!wasOn){
    // Ticking ON — give XP + stat
    state.xp+=xp; state.totalXP+=xp;
    state.stats[habit.type]=Math.min(99,(parseInt(state.stats[habit.type])||1)+1);
    logActivity('📋 HABIT: '+habit.name,'+'+xp+' XP',habit.type);
    checkLevelUp(); checkSkills();
    // Streak milestone notifications
    const streak=getHabitStreak(habitId);
    if(streak>0&&streak%7===0) notify('🔥 '+habit.name+' — '+streak+' DAY STREAK!','levelup');
  } else {
    // Unticking — take back XP
    state.xp=Math.max(0,state.xp-xp);
    state.totalXP=Math.max(0,state.totalXP-xp);
    state.stats[habit.type]=Math.max(1,(parseInt(state.stats[habit.type])||1)-1);
  }
  save();renderHabits();renderPlayer();renderStatsGrid();
}

function getHabitStreak(habitId){
  // Count consecutive days from today backwards in current month
  const today=new Date().getDate();
  let streak=0;
  for(let d=today;d>=1;d--){
    const k=habitId+'_'+d;
    if(state.habitLogs&&state.habitLogs[k]) streak++;
    else break;
  }
  return streak;
}

function getWeeklyHabitScore(){
  if(!state.habits||!state.habits.length) return {score:0,done:0,total:0};
  const today=new Date();
  // Get day of week (0=Sun), find start of this week (Mon)
  const dow=today.getDay()===0?6:today.getDay()-1;
  const todayDate=today.getDate();
  const weekDays=[];
  for(let i=dow;i>=0;i--) weekDays.push(todayDate-i);
  let done=0,total=state.habits.length*weekDays.length;
  state.habits.forEach(h=>{
    weekDays.forEach(d=>{
      if(state.habitLogs&&state.habitLogs[h.id+'_'+d]) done++;
    });
  });
  const score=total>0?Math.round((done/total)*100):0;
  return {score,done,total};
}

function deleteHabit(habitId){
  state.habits=(state.habits||[]).filter(h=>h.id!==habitId);
  // Clean up logs for this habit
  Object.keys(state.habitLogs||{}).forEach(k=>{
    if(k.startsWith(habitId+'_')) delete state.habitLogs[k];
  });
  save();renderHabits();
  notify('🗑 HABIT REMOVED');
}

function renderHabits(){
  const el=document.getElementById('habitTrackerGrid');if(!el) return;

  if(!state.habits||!state.habits.length){
    el.innerHTML=`
      <div class="empty-state" style="padding:20px;">[ NO HABITS YET — ADD ONE ABOVE ]</div>`;
    return;
  }

  const today=new Date();
  const daysInMonth=new Date(today.getFullYear(),today.getMonth()+1,0).getDate();
  const todayDate=today.getDate();
  const DIFF_XP={easy:5,medium:10,hard:20};
  const DIFF_COL={easy:'var(--success)',medium:'#ffaa00',hard:'var(--danger)'};

  // ── Weekly Score Banner ──
  const {score,done,total}=getWeeklyHabitScore();
  const scoreColor=score>=80?'var(--success)':score>=50?'#ffaa00':'var(--danger)';
  const weeklyBanner=`
    <div style="background:rgba(0,15,35,0.8);border:1px solid var(--border);border-radius:4px;padding:12px 16px;margin-bottom:12px;display:flex;align-items:center;gap:16px;">
      <div style="flex:1;">
        <div style="font-family:'Share Tech Mono';font-size:9px;color:var(--muted);letter-spacing:2px;margin-bottom:6px;">THIS WEEK'S HABIT SCORE</div>
        <div style="background:rgba(0,30,70,0.8);border:1px solid var(--border);height:8px;border-radius:4px;overflow:hidden;">
          <div style="width:${score}%;height:100%;background:${scoreColor};border-radius:4px;transition:width 0.5s ease;box-shadow:0 0 6px ${scoreColor};"></div>
        </div>
        <div style="font-family:'Share Tech Mono';font-size:9px;color:var(--muted);margin-top:4px;">${done} / ${total} habits completed this week</div>
      </div>
      <div style="text-align:center;flex-shrink:0;">
        <div style="font-family:'Orbitron';font-size:30px;font-weight:900;color:${scoreColor};text-shadow:0 0 12px ${scoreColor};">${score}%</div>
        <div style="font-family:'Share Tech Mono';font-size:8px;color:var(--muted);">${score>=80?'EXCELLENT 🔥':score>=50?'GOOD ⚡':'NEEDS WORK ⚠'}</div>
      </div>
    </div>`;

  // ── Habit Rows ──
  const LIMIT=4;
  const visible=_slice(state.habits,'habits',LIMIT);

  const rows=visible.map(h=>{
    const diff=h.diff||'easy';
    const xp=DIFF_XP[diff];
    const col=DIFF_COL[diff];
    const streak=getHabitStreak(h.id);
    const count=Object.keys(state.habitLogs||{}).filter(k=>k.startsWith(h.id+'_')&&state.habitLogs[k]).length;

    const days=Array.from({length:daysInMonth},(_,i)=>{
      const d=i+1;
      const k=h.id+'_'+d;
      const done2=state.habitLogs&&state.habitLogs[k];
      const isToday=d===todayDate;
      const isFuture=d>todayDate;
      return `<div class="habit-day ${done2?'done':''} ${isToday?'today':''} ${isFuture?'future':''}"
        onclick="${isFuture?'':('toggleHabitDay('+h.id+','+d+')')}"
        title="Day ${d}${done2?' ✓':''}"
        style="${isToday?'border-color:var(--glow);':''} ${isFuture?'opacity:0.25;cursor:default;':''}">
        ${done2?'✓':d}
      </div>`;
    }).join('');

    return `
      <div class="habit-tracker-row" style="border-left-color:${col};">
        <div class="habit-name">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
            <span style="font-size:16px;">${TYPE_ICONS[h.type]}</span>
            <div style="min-width:0;">
              <div style="font-family:'Orbitron';font-size:12px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${h.name}</div>
              <div style="display:flex;gap:6px;align-items:center;margin-top:2px;">
                <span style="font-family:'Share Tech Mono';font-size:8px;color:${col};background:rgba(0,20,40,0.6);border:1px solid ${col};padding:1px 5px;border-radius:2px;text-transform:uppercase;">${diff} +${xp}xp</span>
                <span style="font-family:'Share Tech Mono';font-size:9px;color:var(--success);">${count}/${daysInMonth} days</span>
                ${streak>0?`<span style="font-family:'Share Tech Mono';font-size:9px;color:#ff8800;">🔥${streak} streak</span>`:''}
              </div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <div style="text-align:center;">
              <div style="font-family:'Orbitron';font-size:18px;font-weight:900;color:${streak>0?'#ff8800':'var(--muted)'};">${streak}</div>
              <div style="font-family:'Share Tech Mono';font-size:7px;color:var(--muted);">STREAK</div>
            </div>
            <button onclick="deleteHabit(${h.id})" style="font-family:'Share Tech Mono';font-size:9px;padding:3px 7px;background:transparent;border:1px solid rgba(255,51,102,0.3);color:rgba(255,51,102,0.5);cursor:pointer;border-radius:2px;" title="Delete habit">✕</button>
          </div>
        </div>
        <div class="habit-days">${days}</div>
      </div>`;
  }).join('');

  el.innerHTML=weeklyBanner+rows+seeMoreBtn('habits',state.habits.length,LIMIT);
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
  const LIMIT=3;
  const visible=_slice(state.chains,'chains',LIMIT);
  el.innerHTML=visible.map(chain=>{
    const done=chain.steps.filter(s=>s.done).length,total=chain.steps.length,pct=Math.round((done/total)*100);
    return `<div class="chain-card">
      <div class="chain-title"><span>🔗 ${chain.name}</span><span style="font-family:'Share Tech Mono';font-size:10px;color:var(--success)">${done}/${total} · +${chain.bonus} BONUS</span></div>
      <div class="bar-track" style="margin-bottom:10px;"><div class="bar-fill" style="width:${pct}%"></div></div>
      ${chain.steps.map(step=>`<div class="chain-step ${step.done?'done':''}">
        <div class="chain-step-num">${step.id}</div><div class="chain-step-name">${step.name}</div>
        ${!step.done?`<button class="btn btn-success" onclick="completeChainStep(${chain.id},${step.id})" style="font-size:9px;padding:3px 8px;">✓</button>`:'<span style="color:var(--success);font-size:10px;">✓</span>'}
      </div>`).join('')}
    </div>`;
  }).join('') + seeMoreBtn('chains', state.chains.length, 3);
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
  const startDate=new Date(state.startDate||Date.now());
  const daysActive=Math.floor((Date.now()-startDate)/86400000)+1;
  const avgQpD=daysActive>0?(state.totalQuests/daysActive).toFixed(1):0;
  const scores=Object.values(state.dailyScores||{});
  const bestDay=scores.length?Math.max(...scores):0;
  const s=state.stats;
  const best=Object.entries(s).sort((a,b)=>b[1]-a[1])[0];
  const worst=Object.entries(s).sort((a,b)=>a[1]-b[1])[0];

  // Weekly report preview (used in sec-progress)
  renderWeeklyPreview();

  // Goal Tracker
  const gtEl=document.getElementById('goalTrackerContent');
  if(gtEl){
    const goals=state.goals||{};
    const goalKeys=Object.keys(goals);
    gtEl.innerHTML=goalKeys.length===0
      ?'<div class="empty-state" style="padding:12px;">[ CLICK 🎯 ON A STAT TO SET GOALS ]</div>'
      :goalKeys.map(stat=>{
        const g=goals[stat];const current=state.stats[stat];
        const pct=Math.min(100,Math.round((current/g.target)*100));
        const deadline=new Date(g.date);const today=new Date();
        const daysLeft=Math.ceil((deadline-today)/(1000*60*60*24));
        const needed=Math.ceil((g.target-current)/Math.max(1,daysLeft));
        const behind=daysLeft>0&&needed>2;
        return `<div class="goal-card">
          <div class="goal-stat-name"><span>${TYPE_ICONS[stat]} ${stat.toUpperCase()} → ${g.target}</span><span style="color:${behind?'var(--danger)':'var(--muted)'};">${daysLeft}d left</span></div>
          <div class="bar-track" style="margin:5px 0;"><div class="bar-fill" style="width:${pct}%;${behind?'background:var(--danger);':''}"></div></div>
          <div class="goal-progress-text">${current}/${g.target} (${pct}%) · ${behind?'⚠ FALLING BEHIND':'On track ✓'}</div>
        </div>`;
      }).join('');
  }

  // Prestige History
  const phEl=document.getElementById('prestigeHistoryContent');
  if(phEl){
    const ph=state.prestigeHistory||[];
    const PLIMIT=3;
    const phVisible=_slice(ph,'prestige',PLIMIT);
    phEl.innerHTML=state.prestige===0
      ?'<div class="empty-state" style="padding:12px;">[ REACH LEVEL '+MAX_LEVEL+' TO PRESTIGE ]</div>'
      :phVisible.map((p,i)=>`
        <div class="prestige-entry">
          <span style="font-size:22px;">⭐</span>
          <div>
            <div style="font-family:'Orbitron';font-size:12px;color:var(--gold);">PRESTIGE ${toRoman(i+1)}</div>
            <div style="font-family:'Share Tech Mono';font-size:9px;color:var(--muted);">${p.date} · ${p.totalXP} XP</div>
          </div>
        </div>`).join('') + seeMoreBtn('prestige', ph.length, PLIMIT);
  }
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
  const xpBar=document.getElementById('xpBar');
  const xpLabel=document.getElementById('xpLabel');
  const levelDisplay=document.getElementById('levelDisplay');
  const rankBadge=document.getElementById('rankBadge');
  const playerName=document.getElementById('playerName');
  const playerTitle=document.getElementById('playerTitle');
  if(xpBar) xpBar.style.width=pct+'%';
  if(xpLabel) xpLabel.textContent=state.xp+' / '+state.xpNeeded+' XP';
  if(levelDisplay) levelDisplay.innerHTML=state.level+'<span style="font-size:11px;color:var(--muted);display:block;margin-top:2px;">LEVEL</span>';
  const rankIdx=Math.min(RANKS.length-1,Math.floor((state.level-1)/2));
  if(rankBadge) rankBadge.textContent='RANK '+RANKS[rankIdx];
  if(playerName) playerName.textContent=state.hunterName;
  if(playerTitle) playerTitle.textContent=getRankTitle(rankIdx)+' ✏️';
  const tq=document.getElementById('totalQuests'); if(tq) tq.textContent=state.totalQuests;
  const tx=document.getElementById('totalXP'); if(tx) tx.textContent=state.totalXP;
  const td=document.getElementById('totalDays'); if(td) td.textContent=state.streak;
  const crystalEl=document.getElementById('totalCrystals');
  if(crystalEl) crystalEl.textContent='💎'+(state.crystals||0);
  updateAvatarDisplay(); updatePlayerCodeDisplay();
  const stars=document.getElementById('prestigeStars');
  if(stars) stars.textContent=Array(state.prestige).fill('⭐').join('');
  const pb=document.getElementById('prestigeBtn');
  if(pb) pb.style.display=state.level>=MAX_LEVEL?'block':'none';
  const gb=document.getElementById('guildBadge');
  if(gb){gb.style.display=state.guild?'block':'none';if(state.guild)gb.textContent='⚜ '+state.guild.name;}
  const today=new Date().toISOString().split('T')[0];
  const todayScore=(state.dailyScores||{})[today]||0;
  const scores=Object.values(state.dailyScores||{});
  const ds=document.getElementById('dailyScore'); if(ds) ds.textContent=todayScore;
  const bs=document.getElementById('bestDayScore'); if(bs) bs.textContent=scores.length?Math.max(...scores):0;
  const avgEl=document.getElementById('avgDayScore');
  if(avgEl) avgEl.textContent=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
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

// ====== SEE MORE HELPER ======
// Tracks expanded state for each section by key
const _expanded = {};

function seeMoreBtn(key, total, limit){
  if(total <= limit) return '';
  const hidden = total - limit;
  const open = _expanded[key];
  return `<button onclick="_toggleExpand('${key}')" style="
    width:100%;margin-top:6px;padding:7px;cursor:pointer;
    background:transparent;border:1px dashed var(--border2);
    color:var(--muted);font-family:'Share Tech Mono',monospace;
    font-size:10px;letter-spacing:1px;border-radius:3px;transition:all 0.2s;"
    onmouseover="this.style.borderColor='var(--glow)';this.style.color='var(--glow)'"
    onmouseout="this.style.borderColor='var(--border2)';this.style.color='var(--muted)'">
    ${open ? '▲ SEE LESS' : `▼ SEE MORE (${hidden} more)`}
  </button>`;
}

function _toggleExpand(key){
  _expanded[key] = !_expanded[key];
  // Re-render the relevant section
  const map = {
    history:    ()=>renderHistory(),
    badges:     ()=>renderBadges(),
    chains:     ()=>renderChains(),
    habits:     ()=>renderHabits(),
    prestige:   ()=>renderDashboard(),
    leaderboard:()=>renderDashboard(),
    shadow:     ()=>renderShadowArmy(),
    weeklyrep:  ()=>renderWeeklyPreview(),
    milestones: ()=>renderMilestones(),
    skills:     ()=>renderSkills(),
  };
  if(map[key]) map[key]();
}

function _slice(arr, key, limit=5){
  return _expanded[key] ? arr : arr.slice(0, limit);
}

// ====== RENDER: HISTORY ======
function renderHistory(){
  const c=document.getElementById('historyList');
  if(!c) return;
  if(!state.history.length){
    c.innerHTML=`<div style="text-align:center;color:var(--muted);font-family:'Share Tech Mono';font-size:11px;padding:20px;">[ AWAITING FIRST ACTIVITY ]</div>`;
    return;
  }
  const LIMIT=5;
  const visible=_slice(state.history,'history',LIMIT);
  c.innerHTML=visible.map(h=>`
    <div class="history-item">
      <span class="h-time">${h.time}</span>
      <span class="h-msg" style="${h.type==='penalty'?'color:var(--danger);opacity:1;':''}">${h.msg}</span>
      <span class="h-xp" style="${h.type==='penalty'?'color:var(--danger);':''}">${h.xp}</span>
    </div>`).join('')
    + seeMoreBtn('history', state.history.length, LIMIT);
}

// ====== RENDER: RADAR ======
function renderRadar(){
  const canvas=document.getElementById('radarCanvas');if(!canvas) return;

  // Fill parent width
  const parent=canvas.parentElement;
  const size=Math.min(parent?parent.offsetWidth:320, 320);
  canvas.width=size; canvas.height=size;

  const ctx=canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  const cx=W/2, cy=H/2;
  const maxR=Math.min(W,H)*0.38;
  const maxV=99;

  const keys   =['intelligence','agility','vitality','strength','perception'];
  const labels =['INT','AGI','VIT','STR','PER'];
  const colors =['#60c0ff','#60ffb0','#ffd060','#ff6060','#cc80ff'];
  const n=keys.length;

  ctx.clearRect(0,0,W,H);

  function pt(i,f){
    const a=(Math.PI*2*i)/n - Math.PI/2;
    return {x:cx+Math.cos(a)*maxR*f, y:cy+Math.sin(a)*maxR*f};
  }

  // ── Background fill ──
  ctx.fillStyle='rgba(0,10,25,0.4)';
  ctx.beginPath();
  for(let i=0;i<n;i++){const p=pt(i,1);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}
  ctx.closePath(); ctx.fill();

  // ── Grid rings with value labels ──
  const rings=5;
  for(let l=1;l<=rings;l++){
    const f=l/rings;
    ctx.beginPath();
    for(let i=0;i<n;i++){const p=pt(i,f);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}
    ctx.closePath();
    ctx.strokeStyle=`rgba(0,170,255,${l===rings?0.25:0.1})`;
    ctx.lineWidth=l===rings?1.5:1;
    ctx.stroke();
    // Ring value label (on the right spoke)
    const val=Math.round(maxV*f);
    const rp=pt(0,f+0.03);
    ctx.font='8px Share Tech Mono,monospace';
    ctx.fillStyle='rgba(58,90,122,0.7)';
    ctx.textAlign='left'; ctx.textBaseline='middle';
    ctx.fillText(val,rp.x+2,rp.y);
  }

  // ── Spokes ──
  for(let i=0;i<n;i++){
    const p=pt(i,1);
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(p.x,p.y);
    ctx.strokeStyle='rgba(0,170,255,0.18)';
    ctx.lineWidth=1; ctx.stroke();
  }

  // ── Filled shape with gradient ──
  const vals=keys.map(k=>Math.max(0.03,(parseInt(state.stats[k])||1)/maxV));
  ctx.beginPath();
  for(let i=0;i<n;i++){const p=pt(i,vals[i]);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}
  ctx.closePath();
  const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,maxR);
  grad.addColorStop(0,'rgba(0,212,255,0.45)');
  grad.addColorStop(0.6,'rgba(0,100,255,0.25)');
  grad.addColorStop(1,'rgba(0,50,200,0.08)');
  ctx.fillStyle=grad; ctx.fill();

  // Glow stroke
  ctx.strokeStyle='rgba(0,212,255,0.95)';
  ctx.lineWidth=2.5;
  ctx.shadowColor='#00aaff'; ctx.shadowBlur=14;
  ctx.beginPath();
  for(let i=0;i<n;i++){const p=pt(i,vals[i]);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}
  ctx.closePath(); ctx.stroke(); ctx.shadowBlur=0;

  // ── Colored dots + value labels per stat ──
  for(let i=0;i<n;i++){
    const p=pt(i,vals[i]);
    const rawVal=parseInt(state.stats[keys[i]])||1;
    const col=colors[i];

    // Outer glow
    ctx.beginPath(); ctx.arc(p.x,p.y,8,0,Math.PI*2);
    ctx.fillStyle=col.replace(')',',0.18)').replace('rgb','rgba')||'rgba(0,212,255,0.18)';
    ctx.fill();

    // Dot
    ctx.beginPath(); ctx.arc(p.x,p.y,5,0,Math.PI*2);
    ctx.fillStyle=col; ctx.shadowColor=col; ctx.shadowBlur=12; ctx.fill(); ctx.shadowBlur=0;

    // White shine
    ctx.beginPath(); ctx.arc(p.x-1.5,p.y-1.5,2,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fill();

    // Value label next to dot
    const a=(Math.PI*2*i)/n - Math.PI/2;
    const lx=p.x+Math.cos(a)*18;
    const ly=p.y+Math.sin(a)*14;
    ctx.font='bold 11px Orbitron,monospace';
    ctx.fillStyle=col; ctx.shadowColor=col; ctx.shadowBlur=6;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(rawVal,lx,ly); ctx.shadowBlur=0;
  }

  // ── Axis labels (further out) ──
  ctx.font='bold 11px Orbitron,monospace';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  for(let i=0;i<n;i++){
    const p=pt(i,1.32);
    ctx.fillStyle=colors[i];
    ctx.shadowColor=colors[i]; ctx.shadowBlur=8;
    ctx.fillText(labels[i],p.x,p.y);
    ctx.shadowBlur=0;
  }

  // ── Center glow ──
  const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,16);
  cg.addColorStop(0,'rgba(0,212,255,0.5)');
  cg.addColorStop(1,'rgba(0,212,255,0)');
  ctx.fillStyle=cg;
  ctx.beginPath(); ctx.arc(cx,cy,16,0,Math.PI*2); ctx.fill();

  // ── Update power score + rank label ──
  const avg=keys.reduce((s,k)=>s+(parseInt(state.stats[k])||1),0)/n;
  const scoreEl=document.getElementById('radarScore');
  if(scoreEl) scoreEl.textContent=isNaN(avg)?'1.00':avg.toFixed(2);

  const rankEl=document.getElementById('radarRank');
  if(rankEl){
    const powerRank=
      avg>=80?'SHADOW MONARCH 👑':
      avg>=60?'S-RANK HUNTER ⚡':
      avg>=45?'A-RANK HUNTER':
      avg>=30?'B-RANK HUNTER':
      avg>=20?'C-RANK HUNTER':
      avg>=12?'D-RANK HUNTER':
      'E-RANK HUNTER';
    rankEl.textContent=powerRank;
    rankEl.style.color=avg>=80?'#cc00ff':avg>=60?'#ffd700':avg>=45?'#00d4ff':'var(--muted)';
  }
}

// ====== RENDER: SHADOW ARMY ======
function renderShadowArmy(){
  const count=Math.floor(state.totalQuests/10);
  const sc=document.getElementById('shadowCount');if(sc) sc.textContent=count;
  const ss=document.getElementById('shadowSoldiers');if(!ss) return;
  const LIMIT=10;
  const showCount=_expanded['shadow']?Math.min(count,50):Math.min(count,LIMIT);
  ss.innerHTML=Array.from({length:showCount},()=>'<span class="shadow-soldier">💀</span>').join('')
    + (count>LIMIT?seeMoreBtn('shadow',count,LIMIT):'');
}

// ====== RENDER: SKILLS ======
function renderSkills(){
  const el=document.getElementById('skillList');if(!el) return;
  const LIMIT=4;
  const visible=_slice(SKILLS,'skills',LIMIT);
  el.innerHTML=visible.map(s=>{
    const unlocked=state.skills.includes(s.id);
    return `<div class="skill-item ${unlocked?'unlocked':''}">
      <div class="skill-icon">${s.icon}</div>
      <div>
        <div class="skill-name">${s.name}</div>
        <div class="skill-req">${s.desc} ${unlocked?'✓':'('+state.stats[s.stat]+'/'+s.req+')'}</div>
      </div>
    </div>`;
  }).join('') + seeMoreBtn('skills', SKILLS.length, LIMIT);
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
  const el=document.getElementById('milestoneList');if(!el) return;
  const LIMIT=4;
  const visible=_slice(MILESTONES,'milestones',LIMIT);
  el.innerHTML=visible.map(m=>{
    const done=state.milestonesAchieved.includes(m.id);
    return `<div class="milestone-item ${done?'achieved':''}"><div class="milestone-icon">${m.icon}</div><div><div class="milestone-name">${m.name}</div><div class="milestone-req">${m.desc} ${done?'✓':''}</div></div></div>`;
  }).join('') + seeMoreBtn('milestones', MILESTONES.length, LIMIT);
}

// ====== RENDER: GEAR ======

function renderGear(){
  const inv=document.getElementById('gearInventory'),equip=document.getElementById('equippedGear'),bonusEl=document.getElementById('gearBonus');
  if(!inv||!equip) return;
  recalcGearBonuses();

  // Ensure lockedGear array exists
  if(!state.lockedGear) state.lockedGear=[];

  const bonuses=state.gearBonuses||{};
  if(bonusEl) bonusEl.textContent=Object.entries(bonuses).filter(([,v])=>v>0).map(([k,v])=>'+'+v+' '+k.toUpperCase()).join(', ')||'+0';

  // Equipped
  const equipped=(state.gear||[]).filter(g=>state.equippedGear.includes(g.uid));
  equip.innerHTML=equipped.length===0
    ?'<div class="empty-state" style="padding:12px;">[ NO GEAR EQUIPPED ]</div>'
    :equipped.map(g=>`
      <div class="gear-slot">
        <div class="gear-slot-icon">${g.icon}</div>
        <div style="flex:1;">
          <div class="gear-slot-name">${g.name} ${state.lockedGear.includes(g.uid)?'🔒':''}</div>
          <div class="gear-slot-stat">+${g.bonus} ${g.stat.toUpperCase()}</div>
        </div>
        <button onclick="unequipGear(${g.uid})" style="font-family:'Share Tech Mono';font-size:8px;padding:3px 7px;background:transparent;border:1px solid var(--muted);color:var(--muted);cursor:pointer;border-radius:2px;">REMOVE</button>
      </div>`).join('');

  // Unequipped — apply sort
  let unequipped=(state.gear||[]).filter(g=>!state.equippedGear.includes(g.uid));
  const RARITY_ORDER={common:1,rare:2,epic:3,legendary:4};
  if(gearSortBy==='rarity')       unequipped=[...unequipped].sort((a,b)=>RARITY_ORDER[b.rarity]-RARITY_ORDER[a.rarity]);
  else if(gearSortBy==='stat')    unequipped=[...unequipped].sort((a,b)=>a.stat.localeCompare(b.stat));
  else if(gearSortBy==='bonus')   unequipped=[...unequipped].sort((a,b)=>b.bonus-a.bonus);
  else if(gearSortBy==='name')    unequipped=[...unequipped].sort((a,b)=>a.name.localeCompare(b.name));
  else if(gearSortBy==='locked')  unequipped=[...unequipped].sort((a,b)=>(state.lockedGear.includes(b.uid)?1:0)-(state.lockedGear.includes(a.uid)?1:0));

  if(unequipped.length===0){
    inv.innerHTML=`
      <div style="margin-bottom:8px;">${renderGearSortBar()}</div>
      <div class="empty-state">[ COMPLETE QUESTS FOR GEAR DROPS! ]</div>`;
    return;
  }

  const LIMIT=5;
  const visible=_expanded['gear']?unequipped:unequipped.slice(0,LIMIT);
  const hasMore=unequipped.length>LIMIT;

  const itemsHtml=visible.map(g=>{
    const locked=state.lockedGear.includes(g.uid);
    return `
      <div class="gear-item gear-rarity-${g.rarity}" style="${locked?'border-color:rgba(255,215,0,0.4);background:rgba(255,215,0,0.03);':''}">
        <div style="font-size:20px;">${g.icon}</div>
        <div style="flex:1;min-width:0;">
          <div class="gear-name" style="display:flex;align-items:center;gap:4px;">
            ${g.name}
            ${locked?'<span style="font-size:10px;">🔒</span>':''}
          </div>
          <div class="gear-bonus-text">+${g.bonus} ${g.stat.toUpperCase()}</div>
          <div style="font-family:'Share Tech Mono';font-size:8px;color:var(--muted);">${g.rarity.toUpperCase()}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:3px;align-items:flex-end;">
          <button onclick="equipGear(${g.uid})" style="font-family:'Share Tech Mono';font-size:8px;padding:3px 7px;background:rgba(0,100,255,0.08);border:1px solid var(--glow);color:var(--glow);cursor:pointer;border-radius:2px;white-space:nowrap;">EQUIP</button>
          <button onclick="toggleGearLock(${g.uid})" style="font-family:'Share Tech Mono';font-size:8px;padding:3px 7px;background:${locked?'rgba(255,215,0,0.08)':'transparent'};border:1px solid ${locked?'var(--gold)':'var(--muted)'};color:${locked?'var(--gold)':'var(--muted)'};cursor:pointer;border-radius:2px;">
            ${locked?'🔒 LOCK':'🔓 LOCK'}
          </button>
        </div>
      </div>`;
  }).join('');

  const seeMoreBtn=hasMore?`
    <button onclick="toggleGearInventory()" style="
      width:100%;margin-top:6px;padding:7px;
      background:transparent;border:1px dashed var(--border2);
      color:var(--muted);font-family:'Share Tech Mono',monospace;
      font-size:10px;letter-spacing:1px;cursor:pointer;border-radius:3px;transition:all 0.2s;"
      onmouseover="this.style.borderColor='var(--glow)';this.style.color='var(--glow)'"
      onmouseout="this.style.borderColor='var(--border2)';this.style.color='var(--muted)'">
      ${_expanded['gear']?'▲ SEE LESS':`▼ SEE MORE (${unequipped.length-LIMIT} more items)`}
    </button>`:'';

  inv.innerHTML=`
    <div style="margin-bottom:8px;">${renderGearSortBar()}</div>
    ${itemsHtml}
    ${seeMoreBtn}`;
}

function renderGearSortBar(){
  const opts=[
    {v:'default', l:'DEFAULT'},
    {v:'rarity',  l:'RARITY'},
    {v:'bonus',   l:'BONUS'},
    {v:'stat',    l:'STAT'},
    {v:'locked',  l:'🔒 LOCKED'},
    {v:'name',    l:'NAME'},
  ];
  return `<div style="display:flex;gap:3px;flex-wrap:wrap;align-items:center;">
    <span style="font-family:'Share Tech Mono';font-size:8px;color:var(--muted);margin-right:2px;">SORT:</span>
    ${opts.map(o=>`
      <button onclick="setGearSort('${o.v}')" style="
        padding:2px 7px;font-family:'Share Tech Mono';font-size:8px;
        background:${gearSortBy===o.v?'rgba(0,170,255,0.12)':'transparent'};
        border:1px solid ${gearSortBy===o.v?'var(--glow)':'var(--border)'};
        color:${gearSortBy===o.v?'var(--glow)':'var(--muted)'};
        cursor:pointer;border-radius:2px;transition:all 0.15s;white-space:nowrap;">
        ${o.l}
      </button>`).join('')}
  </div>`;
}

function setGearSort(by){
  gearSortBy=by;
  renderGear();
}

function toggleGearInventory(){
  _expanded['gear']=!_expanded['gear'];
  renderGear();
}

function toggleGearLock(uid){
  if(!state.lockedGear) state.lockedGear=[];
  const idx=state.lockedGear.indexOf(uid);
  if(idx===-1){
    state.lockedGear.push(uid);
    notify('🔒 GEAR LOCKED — cannot be sold');
  } else {
    state.lockedGear.splice(idx,1);
    notify('🔓 GEAR UNLOCKED');
  }
  save();
  renderGear();
  renderShop();
}

// ====== RENDER: BADGES ======
function renderBadges(){
  checkBadges();
  const el=document.getElementById('badgeGrid');if(!el) return;
  const LIMIT=6;
  const visible=_slice(BADGES_LIST,'badges',LIMIT);
  el.innerHTML=visible.map(b=>{
    const earned=state.badges.includes(b.id);
    return `<div class="badge-card ${earned?'earned':'locked'}"><div class="badge-icon">${b.icon}</div><div class="badge-name">${b.name}</div><div class="badge-desc">${b.desc}</div>${earned?'<div style="font-family:\'Share Tech Mono\';font-size:10px;color:var(--success);margin-top:6px;">✓ EARNED</div>':''}</div>`;
  }).join('') + seeMoreBtn('badges', BADGES_LIST.length, LIMIT);
}

// ====== RENDER: EVOLUTION CHART ======
function renderEvolutionChart(){
  const canvas=document.getElementById('evolutionChart');
  const canvas2=document.getElementById('dailyScoreChart');
  if(!canvas||!canvas2) return;

  // Set canvas size to match display size
  canvas.width=canvas.offsetWidth||600;
  canvas.height=200;
  canvas2.width=canvas2.offsetWidth||600;
  canvas2.height=140;

  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  const keys=['strength','intelligence','agility','vitality','perception'];
  const colors=['#ff6060','#60c0ff','#60ffb0','#ffd060','#cc80ff'];
  const today=new Date();
  const dates=Array.from({length:30},(_,i)=>{
    const d=new Date(today);d.setDate(d.getDate()-(29-i));
    return d.toISOString().split('T')[0];
  });

  // Build stat history — fill gaps with last known value
  const statData={};
  keys.forEach(k=>{
    let last=parseInt(state.stats[k])||1;
    statData[k]=dates.map(d=>{
      if(state.statHistory&&state.statHistory[d]&&state.statHistory[d][k])
        last=parseInt(state.statHistory[d][k])||last;
      return last;
    });
  });

  const allVals=Object.values(statData).flat();
  const maxVal=Math.max(...allVals,5)+2;
  const pL=36,pR=16,pT=18,pB=28,cW=W-pL-pR,cH=H-pT-pB;

  // Background
  ctx.fillStyle='rgba(0,10,25,0.8)';ctx.fillRect(0,0,W,H);

  // Grid lines
  for(let i=0;i<=4;i++){
    const y=pT+cH-(i/4)*cH;
    ctx.strokeStyle='rgba(0,100,180,0.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(pL,y);ctx.lineTo(W-pR,y);ctx.stroke();
    ctx.fillStyle='rgba(58,90,122,0.7)';ctx.font='9px Share Tech Mono';
    ctx.textAlign='right';ctx.fillText(Math.round((i/4)*maxVal),pL-4,y+3);
  }

  // Lines
  keys.forEach((k,ki)=>{
    const data=statData[k];
    ctx.beginPath();
    data.forEach((v,i)=>{
      const x=pL+(i/(dates.length-1))*cW;
      const y=pT+cH-((v/maxVal)*cH);
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.strokeStyle=colors[ki];ctx.lineWidth=2;
    ctx.shadowColor=colors[ki];ctx.shadowBlur=5;ctx.stroke();ctx.shadowBlur=0;

    // Dot at end
    const lastX=pL+cW,lastY=pT+cH-((data[data.length-1]/maxVal)*cH);
    ctx.fillStyle=colors[ki];ctx.beginPath();ctx.arc(lastX,lastY,3,0,Math.PI*2);ctx.fill();
  });

  // Legend
  keys.forEach((k,i)=>{
    const lx=pL+i*(cW/5);
    ctx.fillStyle=colors[i];ctx.fillRect(lx,H-16,8,8);
    ctx.fillStyle='rgba(180,210,240,0.7)';ctx.font='9px Share Tech Mono';
    ctx.textAlign='left';ctx.fillText(k.slice(0,3).toUpperCase(),lx+10,H-8);
  });

  // ── Daily XP chart ──
  const ctx2=canvas2.getContext('2d'),W2=canvas2.width,H2=canvas2.height;
  ctx2.fillStyle='rgba(0,10,25,0.8)';ctx2.fillRect(0,0,W2,H2);

  const scoreData=dates.map(d=>(state.dailyScores||{})[d]||0);
  const maxScore=Math.max(...scoreData,1);
  const barW=Math.max(2,(W2-pL-pR)/dates.length-1);

  scoreData.forEach((v,i)=>{
    const x=pL+i*(W2-pL-pR)/dates.length;
    const bh=Math.max(1,((v/maxScore)*(H2-pT-pB)));
    const y=pT+(H2-pT-pB)-bh;
    const isToday=dates[i]===today.toISOString().split('T')[0];
    ctx2.fillStyle=isToday?'rgba(0,255,136,0.7)':v>0?'rgba(0,180,255,0.55)':'rgba(0,30,60,0.4)';
    ctx2.fillRect(x,y,barW,bh);
    if(isToday){ctx2.fillStyle='rgba(0,255,136,0.3)';ctx2.fillRect(x-1,pT,barW+2,H2-pT-pB);}
  });

  // XP axis labels
  ctx2.fillStyle='rgba(58,90,122,0.7)';ctx2.font='9px Share Tech Mono';
  ctx2.textAlign='right';
  ctx2.fillText(maxScore,pL-4,pT+8);
  ctx2.fillText(0,pL-4,H2-pB);
  ctx2.fillStyle='rgba(0,180,255,0.5)';ctx2.textAlign='left';
  ctx2.fillText('30-DAY XP  (green=today)',pL+2,pT+10);
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

  // Always center — no jumping
  card.style.top = '50%';
  card.style.left = '50%';
  card.style.right = 'auto';
  card.style.bottom = 'auto';
  card.style.transform = 'translate(-50%, -50%)';

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
  // ── COMMON ──
  {id:'iron_sword',    icon:'⚔️', name:'IRON SWORD',      rarity:'common',    stat:'strength',     bonus:2,  price:30,  desc:'+2 STR · Basic melee weapon'},
  {id:'iron_shield',   icon:'🛡️', name:'IRON SHIELD',     rarity:'common',    stat:'vitality',     bonus:2,  price:30,  desc:'+2 VIT · Block chance +8%'},
  {id:'leather_boots', icon:'👟', name:'LEATHER BOOTS',   rarity:'common',    stat:'agility',      bonus:2,  price:30,  desc:'+2 AGI · Movement speed +5%'},
  {id:'cloth_hood',    icon:'🪖', name:'CLOTH HOOD',      rarity:'common',    stat:'perception',   bonus:2,  price:30,  desc:'+2 PER · Awareness +5%'},
  {id:'wood_staff',    icon:'🪄', name:'WOODEN STAFF',    rarity:'common',    stat:'intelligence', bonus:2,  price:30,  desc:'+2 INT · Spell focus +5%'},
  {id:'iron_ring',     icon:'🔘', name:'IRON RING',       rarity:'common',    stat:'vitality',     bonus:1,  price:20,  desc:'+1 VIT · Endurance +3%'},
  {id:'crude_dagger',  icon:'🔪', name:'CRUDE DAGGER',    rarity:'common',    stat:'agility',      bonus:2,  price:25,  desc:'+2 AGI · Quick draw'},
  // ── RARE ──
  {id:'shadow_dagger', icon:'🗡️', name:'SHADOW DAGGER',   rarity:'rare',      stat:'agility',      bonus:4,  price:80,  desc:'+4 AGI · Crit Chance +10%'},
  {id:'mage_ring',     icon:'💍', name:'MAGE RING',       rarity:'rare',      stat:'intelligence', bonus:3,  price:80,  desc:'+3 INT · Skill damage +15%'},
  {id:'void_boots',    icon:'🥾', name:'VOID BOOTS',      rarity:'rare',      stat:'agility',      bonus:4,  price:100, desc:'+4 AGI · Move speed +20%'},
  {id:'wisdom_crown',  icon:'📿', name:'WISDOM AMULET',   rarity:'rare',      stat:'intelligence', bonus:4,  price:100, desc:'+4 INT · XP gain +10%'},
  {id:'hunter_vest',   icon:'🦺', name:'HUNTER VEST',     rarity:'rare',      stat:'vitality',     bonus:5,  price:90,  desc:'+5 VIT · Dungeon entry bonus'},
  {id:'swift_gloves',  icon:'🧤', name:'SWIFT GLOVES',    rarity:'rare',      stat:'agility',      bonus:3,  price:75,  desc:'+3 AGI · Attack speed +12%'},
  {id:'crystal_lens',  icon:'🔭', name:'CRYSTAL LENS',    rarity:'rare',      stat:'perception',   bonus:5,  price:95,  desc:'+5 PER · Reveal hidden quests'},
  {id:'battle_axe',    icon:'🪓', name:'BATTLE AXE',      rarity:'rare',      stat:'strength',     bonus:5,  price:90,  desc:'+5 STR · Heavy attack +20%'},
  // ── EPIC ──
  {id:'shadow_armor',  icon:'🥋', name:'SHADOW ARMOR',    rarity:'epic',      stat:'vitality',     bonus:6,  price:200, desc:'+6 VIT · Shadow resist +20%'},
  {id:'shadow_blade',  icon:'🌑', name:'SHADOW BLADE',    rarity:'epic',      stat:'strength',     bonus:6,  price:200, desc:'+6 STR · Life steal +10%'},
  {id:'eye_of_shadow', icon:'👁️', name:'EYE OF SHADOW',   rarity:'epic',      stat:'perception',   bonus:5,  price:180, desc:'+5 PER · Enemy detect +30%'},
  {id:'arcane_tome',   icon:'📖', name:'ARCANE TOME',     rarity:'epic',      stat:'intelligence', bonus:7,  price:220, desc:'+7 INT · Quest XP +15%'},
  {id:'phantom_cloak', icon:'🌫️', name:'PHANTOM CLOAK',   rarity:'epic',      stat:'agility',      bonus:7,  price:220, desc:'+7 AGI · Dodge chance +15%'},
  {id:'war_helmet',    icon:'⛑️', name:'WAR HELMET',      rarity:'epic',      stat:'vitality',     bonus:8,  price:240, desc:'+8 VIT · Penalty reduction'},
  {id:'void_gauntlet', icon:'🦾', name:'VOID GAUNTLET',   rarity:'epic',      stat:'strength',     bonus:7,  price:210, desc:'+7 STR · Combo duration +2s'},
  {id:'shadow_heart',  icon:'🖤', name:'SHADOW HEART',    rarity:'epic',      stat:'perception',   bonus:6,  price:190, desc:'+6 PER · Shadow army +1 slot'},
  // ── LEGENDARY ──
  {id:'arise_crown',   icon:'💎', name:'ARISE CROWN',     rarity:'legendary', stat:'perception',   bonus:10, price:500, desc:'+10 PER · All skills enhanced'},
  {id:'monarch_robe',  icon:'👑', name:'MONARCH ROBE',    rarity:'legendary', stat:'vitality',     bonus:12, price:600, desc:'+12 VIT · Invincibility +50%'},
  {id:'death_scythe',  icon:'💀', name:'DEATH SCYTHE',    rarity:'legendary', stat:'strength',     bonus:15, price:800, desc:'+15 STR · ARISE CD -50%'},
  {id:'gods_tome',     icon:'📜', name:'GOD\'S TOME',     rarity:'legendary', stat:'intelligence', bonus:14, price:750, desc:'+14 INT · Double quest XP'},
  {id:'shadow_wings',  icon:'🦋', name:'SHADOW WINGS',    rarity:'legendary', stat:'agility',      bonus:12, price:700, desc:'+12 AGI · Ignore penalties once/day'},
  {id:'eternal_eye',   icon:'🌟', name:'ETERNAL EYE',     rarity:'legendary', stat:'perception',   bonus:11, price:650, desc:'+11 PER · See all hidden quests'},
  {id:'jinwoo_coat',   icon:'🧥', name:'JINWOO\'S COAT',  rarity:'legendary', stat:'strength',     bonus:16, price:999, desc:'+16 STR · Shadow Monarch aura'},
];

const SELL_VALUES={common:10,rare:25,epic:60,legendary:150};

// Gear sort state
let gearSortBy = 'default'; // default | rarity | stat | bonus | name

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
    const locked=(state.lockedGear||[]).includes(g.uid);
    return `<div class="sell-item gear-rarity-${g.rarity}" style="${locked?'opacity:0.45;':''}">
      <div style="font-size:20px;">${g.icon}</div>
      <div style="flex:1;min-width:0;">
        <div class="gear-name">${g.name} ${locked?'🔒':''}</div>
        <div class="gear-bonus-text">+${g.bonus} ${g.stat.toUpperCase()}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
        <div style="font-family:'Orbitron';font-size:11px;color:var(--gold);">💎${val}</div>
        ${locked
          ?`<button onclick="toggleGearLock(${g.uid})" style="font-family:'Share Tech Mono';font-size:8px;padding:2px 6px;background:rgba(255,215,0,0.08);border:1px solid var(--gold);color:var(--gold);cursor:pointer;border-radius:2px;">🔓 UNLOCK</button>`
          :`<button onclick="sellGear(${g.uid})" style="font-family:'Share Tech Mono';font-size:8px;padding:2px 6px;background:rgba(255,51,102,0.06);border:1px solid var(--danger);color:var(--danger);cursor:pointer;border-radius:2px;">SELL</button>`
        }
      </div>
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
  // Block if locked
  if((state.lockedGear||[]).includes(uid)){
    notify('🔒 GEAR IS LOCKED — unlock it first!');
    return;
  }
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

// ====== SIDEBAR ======
function toggleSidebar(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const btn = document.getElementById('hamburgerBtn');
  const isOpen = sidebar.classList.contains('open');
  if(isOpen){ closeSidebar(); }
  else {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    btn.classList.add('open');
    btn.textContent = '✕';
    updateSidebarInfo();
  }
}

function closeSidebar(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const btn = document.getElementById('hamburgerBtn');
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  btn.classList.remove('open');
  btn.textContent = '☰';
}

function updateSidebarInfo(){
  // Hunter name + rank
  const nameEl = document.getElementById('sidebarName');
  const rankEl = document.getElementById('sidebarRank');
  const avatarEl = document.getElementById('sidebarAvatar');
  if(nameEl) nameEl.textContent = state.hunterName || 'HUNTER';
  if(rankEl){
    const rankIdx = Math.min(RANKS.length-1, Math.floor((state.level-1)/2));
    rankEl.textContent = `RANK ${RANKS[rankIdx]} · LVL ${state.level}`;
  }
  if(avatarEl){
    if(state.avatarImg){
      avatarEl.innerHTML = `<img src="${state.avatarImg}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`;
    } else {
      const avatarIdx = Math.min(AVATARS.length-1, Math.floor((state.level-1)/10));
      avatarEl.textContent = AVATARS[avatarIdx];
    }
  }

  // Sound badge
  const soundBadge = document.getElementById('sidebarSoundBadge');
  if(soundBadge){
    soundBadge.textContent = state.soundOn !== false ? 'ON' : 'OFF';
    soundBadge.className = 'sb-badge' + (state.soundOn !== false ? ' on' : '');
  }

  // Music badge
  const musicBadge = document.getElementById('sidebarMusicBadge');
  if(musicBadge){
    musicBadge.textContent = musicOn ? 'ON' : 'OFF';
    musicBadge.className = 'sb-badge' + (musicOn ? ' on' : '');
  }

  // Theme badge
  const themeBadge = document.getElementById('sidebarThemeBadge');
  if(themeBadge){
    const isArise = state.theme === 'arise';
    themeBadge.textContent = isArise ? 'ON' : 'OFF';
    themeBadge.className = 'sb-badge' + (isArise ? ' on' : '');
  }
}

// Close sidebar on Escape key
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeSidebar();
});

// ====== WISDOM SYSTEM ======
const WISDOM_LIST = [
  // Level 1
  { level:1, quote:"The beginning is always the hardest. But you have already begun.", source:"— System Message, Floor 1", lore:"When Sung Jinwoo first entered the Double Dungeon, he had no power. Only will." },
  // Level 3
  { level:3, quote:"Even the weakest hunter has the potential to become the strongest. The question is — do you have the resolve?", source:"— Sung Jinwoo", lore:"Jinwoo was ranked E — the absolute weakest. He never stopped. Neither should you." },
  // Level 5
  { level:5, quote:"I alone level up.", source:"— Sung Jinwoo", lore:"The most iconic line in Solo Leveling. Jinwoo realized the System chose only him. Your life system chooses only YOU." },
  // Level 7
  { level:7, quote:"The strong do not need to brag. Their results speak for themselves.", source:"— System Observation", lore:"S-Rank hunters don't announce their power. They demonstrate it through action." },
  // Level 10
  { level:10, quote:"Pain is temporary. Weakness, if you accept it, becomes permanent.", source:"— Sung Jinwoo", lore:"At Level 10 you have proven you are not weak. You push through. Every day." },
  // Level 13
  { level:13, quote:"Arise.", source:"— Sung Jinwoo, Shadow Monarch", lore:"The word that changes everything. Jinwoo does not just defeat enemies. He raises them. Your past failures? Rise above them." },
  // Level 15
  { level:15, quote:"There is no limit to what a person can achieve if they refuse to stop growing.", source:"— Goto Ryuji, S-Rank Hunter", lore:"Even rival hunters acknowledged that growth has no ceiling. You are proving this every day." },
  // Level 18
  { level:18, quote:"I did not become strong because I wanted power. I became strong because there were people I needed to protect.", source:"— Sung Jinwoo", lore:"Real strength comes from purpose. What is your purpose, Hunter?" },
  // Level 20
  { level:20, quote:"The difference between those who survive and those who don't — is the will to keep moving when everything says stop.", source:"— System Log", lore:"Level 20. You have defied the odds. Most hunters quit before this point. You did not." },
  // Level 23
  { level:23, quote:"Every scar on a hunter is a story of survival. Wear them with pride.", source:"— Hunter Guild Record", lore:"You have failed quests. Taken penalties. Lost streaks. And you came back. Every time." },
  // Level 25
  { level:25, quote:"An S-Rank is not born. They are forged — through a thousand battles, ten thousand decisions, and one unbreakable will.", source:"— Hunter Association Report", lore:"Level 25. S-Rank territory. You are no longer ordinary. You never were." },
  // Level 28
  { level:28, quote:"The System does not make mistakes. If it chose you — it knows what you are capable of, even before you do.", source:"— System Administrator Log", lore:"The System saw something in Jinwoo that even he could not see at first. Trust the process." },
  // Level 30 (Prestige threshold)
  { level:30, quote:"I was not given power. I earned every single fragment of it. One quest, one battle, one day at a time.", source:"— Sung Jinwoo, Shadow Monarch", lore:"You have reached the threshold of Prestige. This is where legends begin." },
];

function getUnlockedWisdom(){
  return WISDOM_LIST.filter(w => state.level >= w.level);
}

function getCurrentWisdom(){
  const unlocked = getUnlockedWisdom();
  if(!unlocked.length) return null;
  // Show the highest unlocked wisdom
  return unlocked[unlocked.length - 1];
}

function checkWisdomUnlock(oldLevel, newLevel){
  WISDOM_LIST.forEach(w => {
    if(w.level > oldLevel && w.level <= newLevel){
      // New wisdom unlocked!
      setTimeout(() => {
        document.getElementById('wisdomUnlockLevel').textContent = 'LEVEL ' + w.level + ' REACHED';
        document.getElementById('wisdomUnlockQuote').textContent = '"' + w.quote + '"';
        document.getElementById('wisdomUnlockSource').textContent = w.source;
        document.getElementById('wisdomUnlockOverlay').classList.add('active');
        setTimeout(() => document.getElementById('wisdomUnlockOverlay').classList.remove('active'), 5000);
      }, 2500); // Show after level up animation
    }
  });
}

document.getElementById('wisdomUnlockOverlay').addEventListener('click', function(){
  this.classList.remove('active');
});

function renderWisdomPanel(){
  const el = document.getElementById('wisdomDisplay');
  if(!el) return;
  const unlocked = getUnlockedWisdom();
  if(!unlocked.length){
    el.innerHTML = `<div style="font-family:'Share Tech Mono';font-size:10px;color:var(--muted);text-align:center;padding:14px;">COMPLETE QUESTS TO REACH LEVEL 1</div>`;
    return;
  }
  const idx = (state.pinnedWisdom !== undefined && state.pinnedWisdom < unlocked.length)
    ? state.pinnedWisdom : unlocked.length - 1;
  const w = unlocked[idx];
  el.innerHTML = `
    <div class="wisdom-current">
      <div class="wisdom-current-quote">"${w.quote}"</div>
      <div class="wisdom-current-source">${w.source}</div>
    </div>
    <div style="font-family:'Share Tech Mono';font-size:9px;color:var(--muted);text-align:center;margin-top:6px;">
      ${unlocked.length} / ${WISDOM_LIST.length} WISDOM UNLOCKED
    </div>`;
}

function openWisdomBook(){
  const unlocked = getUnlockedWisdom();
  const locked = WISDOM_LIST.filter(w => state.level < w.level);
  const pinnedIdx = state.pinnedWisdom !== undefined ? state.pinnedWisdom : unlocked.length - 1;
  let html = `<div style="font-family:'Share Tech Mono';font-size:9px;color:#ffcc44;margin-bottom:14px;text-align:center;border:1px solid rgba(255,204,68,0.2);padding:8px;border-radius:3px;">
    📌 CLICK ANY QUOTE TO PIN IT TO YOUR WISDOM PANEL
  </div>`;
  unlocked.slice().reverse().forEach((w, ri) => {
    const realIdx = unlocked.length - 1 - ri;
    const isPinned = pinnedIdx === realIdx;
    html += `<div class="wisdom-card" onclick="pinWisdom(${realIdx})" style="cursor:pointer;${isPinned?'border-color:#ffcc44;background:rgba(255,204,68,0.06);box-shadow:0 0 10px rgba(255,204,68,0.12);':''}transition:all 0.2s;">
      <div class="wisdom-level-badge" style="${isPinned?'background:rgba(255,204,68,0.2);':''}">${isPinned?'📌 PINNED':'LEVEL '+w.level}</div>
      <div class="wisdom-quote">"${w.quote}"</div>
      <div class="wisdom-source">${w.source}</div>
      <div style="font-family:'Share Tech Mono';font-size:9px;color:var(--muted);margin-top:8px;border-top:1px solid rgba(255,204,68,0.12);padding-top:7px;">${w.lore}</div>
      <div style="font-family:'Share Tech Mono';font-size:8px;color:${isPinned?'#ffcc44':'var(--muted)'};margin-top:5px;text-align:right;">${isPinned?'✓ DISPLAYED NOW':'TAP TO DISPLAY →'}</div>
    </div>`;
  });
  if(locked.length > 0){
    html += `<div style="font-family:'Share Tech Mono';font-size:10px;color:var(--muted);text-align:center;margin:12px 0;letter-spacing:2px;">— ${locked.length} MORE AWAIT —</div>`;
    locked.slice(0,3).forEach(w => {
      html += `<div class="wisdom-card locked">
        <div class="wisdom-level-badge">LEVEL ${w.level}</div>
        <div class="wisdom-quote" style="color:var(--muted);">████████████████████████████</div>
        <div class="wisdom-source">Reach Level ${w.level} to unlock</div>
      </div>`;
    });
  }
  document.getElementById('wisdomBookContent').innerHTML = html;
  document.getElementById('wisdomModal').classList.add('active');
}

function pinWisdom(idx){
  state.pinnedWisdom = idx;
  save();
  renderWisdomPanel();
  openWisdomBook();
  notify('📌 WISDOM PINNED TO PANEL!');
}

// ====== AMBIENT MUSIC SYSTEM ======
let musicOn = false;
let musicNodes = {};
let musicCtx = null;

function getMusicCtx(){
  if(!musicCtx) musicCtx = new (window.AudioContext || window.webkitAudioContext)();
  return musicCtx;
}

function toggleMusic(){
  musicOn = !musicOn;
  if(musicOn){
    startAmbientMusic();
    notify('🎵 MUSIC ON');
  } else {
    stopAmbientMusic();
    notify('🎵 MUSIC OFF');
  }
  state.musicOn = musicOn;
  save();
  updateSidebarInfo();
}

function startAmbientMusic(){
  try{
    const ctx = getMusicCtx();
    if(ctx.state === 'suspended') ctx.resume();

    // Stop any existing music
    stopAmbientMusic();

    const nodes = {};

    // === LAYER 1: Deep drone bass (dark dungeon atmosphere) ===
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(55, ctx.currentTime); // A1 note — deep
    drone.frequency.setValueAtTime(58.27, ctx.currentTime + 8); // slightly detune
    drone.frequency.setValueAtTime(55, ctx.currentTime + 16);
    droneGain.gain.setValueAtTime(0.08, ctx.currentTime);
    drone.connect(droneGain);
    droneGain.connect(ctx.destination);
    drone.start();
    nodes.drone = drone;
    nodes.droneGain = droneGain;

    // === LAYER 2: Mid pad — eerie sustained chord ===
    const pad = ctx.createOscillator();
    const padGain = ctx.createGain();
    const padFilter = ctx.createBiquadFilter();
    pad.type = 'triangle';
    pad.frequency.value = 110; // A2
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 800;
    padFilter.Q.value = 2;
    pad.connect(padFilter);
    padFilter.connect(padGain);
    padGain.gain.setValueAtTime(0, ctx.currentTime);
    padGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 3);
    padGain.connect(ctx.destination);
    pad.start();
    nodes.pad = pad;
    nodes.padGain = padGain;

    // === LAYER 3: Fifth harmony (perfect 5th above drone) ===
    const fifth = ctx.createOscillator();
    const fifthGain = ctx.createGain();
    fifth.type = 'sine';
    fifth.frequency.value = 82.41; // E2 — perfect 5th above A1
    fifthGain.gain.setValueAtTime(0.04, ctx.currentTime);
    fifth.connect(fifthGain);
    fifthGain.connect(ctx.destination);
    fifth.start();
    nodes.fifth = fifth;
    nodes.fifthGain = fifthGain;

    // === LAYER 4: Slow pulsing arpeggio — creates dark melody ===
    const NOTES = [110, 130.81, 146.83, 110, 98, 110, 130.81, 164.81]; // Am pentatonic
    let noteIdx = 0;
    const arp = ctx.createOscillator();
    const arpGain = ctx.createGain();
    const arpFilter = ctx.createBiquadFilter();
    arp.type = 'triangle';
    arp.frequency.value = NOTES[0];
    arpFilter.type = 'bandpass';
    arpFilter.frequency.value = 400;
    arpFilter.Q.value = 3;
    arpGain.gain.setValueAtTime(0.03, ctx.currentTime);
    arp.connect(arpFilter);
    arpFilter.connect(arpGain);
    arpGain.connect(ctx.destination);
    arp.start();
    nodes.arp = arp;
    nodes.arpGain = arpGain;

    // Slowly step through notes
    const arpInterval = setInterval(()=>{
      if(!musicOn){ clearInterval(arpInterval); return; }
      noteIdx = (noteIdx + 1) % NOTES.length;
      arp.frequency.linearRampToValueAtTime(NOTES[noteIdx], ctx.currentTime + 0.3);
      // Accent note — small volume pulse
      arpGain.gain.setValueAtTime(0.05, ctx.currentTime);
      arpGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 1.5);
    }, 2000);
    nodes.arpInterval = arpInterval;

    // === LAYER 5: Distant bell hits (sparse, atmospheric) ===
    const bellInterval = setInterval(()=>{
      if(!musicOn){ clearInterval(bellInterval); return; }
      try{
        const bell = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bell.type = 'sine';
        const bellNotes = [220, 261.63, 293.66, 329.63, 369.99];
        bell.frequency.value = bellNotes[Math.floor(Math.random() * bellNotes.length)];
        bellGain.gain.setValueAtTime(0.04, ctx.currentTime);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4);
        bell.connect(bellGain);
        bellGain.connect(ctx.destination);
        bell.start(ctx.currentTime);
        bell.stop(ctx.currentTime + 4);
      }catch(e){}
    }, 4000 + Math.random() * 3000);
    nodes.bellInterval = bellInterval;

    // === LAYER 6: Low rumble — dungeon ambience ===
    const rumble = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    const rumbleFilter = ctx.createBiquadFilter();
    rumble.type = 'sawtooth';
    rumble.frequency.value = 27.5; // Very low A0
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 80;
    rumbleGain.gain.setValueAtTime(0, ctx.currentTime);
    rumbleGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 5);
    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);
    rumble.start();
    nodes.rumble = rumble;
    nodes.rumbleGain = rumbleGain;

    musicNodes = nodes;
    notify('🎵 DUNGEON AMBIENCE ACTIVE — ARISE FROM THE SHADOW');
  } catch(e){
    console.error('Music error:', e);
    notify('🎵 Music unavailable in this browser');
  }
}

function stopAmbientMusic(){
  try{
    if(musicNodes.arpInterval) clearInterval(musicNodes.arpInterval);
    if(musicNodes.bellInterval) clearInterval(musicNodes.bellInterval);
    ['drone','pad','fifth','arp','rumble'].forEach(k=>{
      try{ if(musicNodes[k]) musicNodes[k].stop(); }catch(e){}
    });
  }catch(e){}
  musicNodes = {};
}

// ====== QUEST COMPLETE ANIMATION ======
function showQuestComplete(questName, xp, statType, multiplier){
  const overlay = document.getElementById('questCompleteOverlay');
  const TYPE_NAMES = {strength:'💪 STRENGTH',intelligence:'🧠 INTELLIGENCE',agility:'⚡ AGILITY',vitality:'❤️ VITALITY',perception:'👁️ PERCEPTION'};

  document.getElementById('qcQuestName').textContent = questName;
  document.getElementById('qcXP').textContent = '+' + xp + ' XP';
  document.getElementById('qcStat').textContent = (TYPE_NAMES[statType]||statType.toUpperCase()) + ' +1';
  const bonusEl = document.getElementById('qcBonus');
  bonusEl.textContent = multiplier > 1 ? '🔥 ' + multiplier.toFixed(1) + 'x MULTIPLIER ACTIVE!' : '';

  // Shoot light lines outward
  const linesEl = document.getElementById('qcLines');
  linesEl.innerHTML = Array.from({length:12},(_,i) => {
    const angle = i * 30;
    return `<div class="qc-line" style="transform:rotate(${angle}deg);animation-delay:${i*0.02}s;"></div>`;
  }).join('');

  overlay.classList.remove('hide');
  overlay.classList.add('show');
  playSound('complete');

  // Auto-hide after 1.8s
  clearTimeout(overlay._timer);
  overlay._timer = setTimeout(()=>{
    overlay.classList.remove('show');
    overlay.classList.add('hide');
    setTimeout(()=>{ overlay.classList.remove('hide'); linesEl.innerHTML=''; }, 400);
  }, 1800);
}

// ====== WEEKLY REVIEW CUTSCENE ======
function showWeeklyReview(){
  const s = state.stats;
  const best = Object.entries(s).sort((a,b)=>b[1]-a[1])[0];
  const worst = Object.entries(s).sort((a,b)=>a[1]-b[1])[0];
  const TYPE_ICONS = {strength:'💪',intelligence:'🧠',agility:'⚡',vitality:'❤️',perception:'👁️'};
  const wisdom = getCurrentWisdom();
  const daysActive = Math.max(1, Math.floor((Date.now()-(state.startDate||Date.now()))/86400000)+1);

  const quotes = [
    {q:"I did not become strong because I wanted power. I became strong because I had people I needed to protect.", s:"— Sung Jinwoo"},
    {q:"The difference between those who survive and those who don't is the will to keep moving when everything says stop.", s:"— System Log"},
    {q:"Every week is a new dungeon floor. You cleared this one.", s:"— Shadow Monarch"},
    {q:"Pain from training fades. The strength you gain stays forever.", s:"— Hunter Association"},
  ];
  const quote = quotes[Math.floor(Date.now()/604800000) % quotes.length];

  document.getElementById('wrContent').innerHTML = `
    <div class="wr-label">◈ WEEKLY SYSTEM REPORT ◈</div>
    <div class="wr-title">WEEK COMPLETE</div>
    <div class="wr-sub">${state.hunterName} · RANK ${RANKS[Math.min(RANKS.length-1,Math.floor((state.level-1)/2))]} · LEVEL ${state.level}</div>
    <div class="wr-stats-grid">
      <div class="wr-stat" style="animation-delay:0.1s;">
        <div class="wr-stat-num" style="color:var(--gold);">${state.weeklyQuests||0}</div>
        <div class="wr-stat-label">QUESTS THIS WEEK</div>
      </div>
      <div class="wr-stat" style="animation-delay:0.2s;">
        <div class="wr-stat-num" style="color:var(--success);">${state.streak}</div>
        <div class="wr-stat-label">DAY STREAK 🔥</div>
      </div>
      <div class="wr-stat" style="animation-delay:0.3s;">
        <div class="wr-stat-num" style="color:var(--accent);">${state.totalXP}</div>
        <div class="wr-stat-label">TOTAL XP EARNED</div>
      </div>
      <div class="wr-stat" style="animation-delay:0.4s;">
        <div class="wr-stat-num" style="color:var(--glow);">${TYPE_ICONS[best[0]]} ${best[1]}</div>
        <div class="wr-stat-label">BEST STAT: ${best[0].toUpperCase()}</div>
      </div>
      <div class="wr-stat" style="animation-delay:0.5s;">
        <div class="wr-stat-num" style="color:var(--danger);">${TYPE_ICONS[worst[0]]} ${worst[1]}</div>
        <div class="wr-stat-label">NEEDS WORK: ${worst[0].toUpperCase()}</div>
      </div>
      <div class="wr-stat" style="animation-delay:0.6s;">
        <div class="wr-stat-num" style="color:var(--purple);">${daysActive}</div>
        <div class="wr-stat-label">DAYS ACTIVE TOTAL</div>
      </div>
    </div>
    <div class="wr-quote">"${quote.q}"</div>
    <div class="wr-quote-src">${quote.s}</div>
    <button class="btn" onclick="closeWeeklyReview()" style="border-color:var(--glow);color:var(--glow);padding:12px 36px;font-size:12px;">⚔ CONTINUE</button>
  `;

  document.getElementById('weeklyReviewOverlay').classList.add('show');
  playSound('levelup');
}

function closeWeeklyReview(){
  document.getElementById('weeklyReviewOverlay').classList.remove('show');
}

// Check if it's Sunday and show weekly review once
function checkWeeklyReview(){
  const now = new Date();
  const sunday = now.getDay() === 0;
  const lastReview = state.lastWeeklyReview;
  const thisWeek = `${now.getFullYear()}-W${Math.ceil((now - new Date(now.getFullYear(),0,1))/604800000)}`;
  if(sunday && lastReview !== thisWeek && state.totalQuests > 0){
    state.lastWeeklyReview = thisWeek;
    save();
    setTimeout(showWeeklyReview, 2000);
  }
}

// ====== RENDER ALL ======
function safeRender(fn){
  try{ fn(); } catch(e){ console.warn('Render error in '+fn.name+':', e.message); }
}

function renderAll(){
  safeRender(renderPlayer);
  safeRender(renderStatsGrid);
  safeRender(renderStatsDist);
  safeRender(renderQuests);
  safeRender(renderHistory);
  safeRender(renderRadar);
  safeRender(renderShadowArmy);
  safeRender(renderSkills);
  safeRender(renderBoss);
  safeRender(renderCalendar);
  safeRender(renderWeeklyPreview);
  safeRender(renderMilestones);
  safeRender(renderDailyChallenge);
  safeRender(renderTemplates);
  safeRender(renderWisdomPanel);
  safeRender(renderGear);
  safeRender(renderBadges);
  safeRender(renderChains);
  safeRender(renderHabits);
  safeRender(renderDashboard);
  safeRender(()=>{ initShop(); renderShop(); });
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
// Render charts after layout settles
setTimeout(()=>{ renderRadar(); renderEvolutionChart(); }, 300);
// Check weekly review (Sunday only)
checkWeeklyReview();
// Auto-show tutorial for new users
if (!state.tutorialDone) setTimeout(startTutorial, 1500);
// Restore music state
if(state.musicOn){ musicOn=true; startAmbientMusic(); }
// Init sidebar info
setTimeout(updateSidebarInfo, 100);