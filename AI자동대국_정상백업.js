/* PAW STORY - 한국식 동물 장기 */

document.body.innerHTML =

'<div id="mainMenu">' +
  '<div id="mainScreen">' +
    '<img id="mainImage" src="https://i.ibb.co/Zp7x33Y4/image.png">' +
    '<button id="mainStart"></button>' +
  '</div>' +
'</div>' +

'<div id="game">' +
'<h1>🐾 Paw Story</h1>' +
'<p class="sub">타일을 뒤집고 동물 장기를 시작하세요!</p>' +
'<div id="turn"></div>' +
'<div id="msg">타일을 하나 뒤집어 보세요!</div>' +
'<div id="boardWrap">' +
  '<div id="capturedLeft"></div>' +
  '<div id="board"></div>' +
  '<div id="capturedRight"></div>' +
'</div>' +
'<div class="info">🔵 호랑이팀 16개　　🔴 사자팀 16개</div>' +
'<button id="aiMode">🤖 AI 대국</button>' +
'<button id="aiVsAi">🤖 AI끼리 대국</button>' +
'<button id="restart">🔄 새 게임</button>' +
  '<button id="backMain">🏠 메인으로</button>' +
'<button id="hint">💡 힌트</button>' +
'<div class="rule">👑 왕　🥷 사　🐘 상　🐴 마　🚩 차　💣 포　🐶 졸<br>🇰🇷 한국식: <b>차가 상을 이깁니다.</b></div>' +
'</div>';
/* 장기알 탁 소리 */
var gameAudioCtx = null;
var takSound = new Audio('./sound/tak.mp3');
takSound.preload = 'auto';
takSound.volume = 0.7;

function playPieceTak(){

  takSound.pause();
  takSound.currentTime = 0;

  takSound.play().catch(function(err){
    console.log('소리 재생 실패:', err);
  });
}
/* STYLE */

var style = document.createElement('style');
style.textContent = [
'@keyframes flagWave{0%{transform:perspective(220px) rotateY(0deg) skewY(0deg) scaleX(1)}15%{transform:perspective(220px) rotateY(-16deg) skewY(5deg) scaleX(.94)}30%{transform:perspective(220px) rotateY(10deg) skewY(-4deg) scaleX(1.04)}45%{transform:perspective(220px) rotateY(-12deg) skewY(3deg) scaleX(.96)}60%{transform:perspective(220px) rotateY(14deg) skewY(-5deg) scaleX(1.05)}75%{transform:perspective(220px) rotateY(-8deg) skewY(3deg) scaleX(.97)}90%{transform:perspective(220px) rotateY(6deg) skewY(-2deg) scaleX(1.02)}100%{transform:perspective(220px) rotateY(0deg) skewY(0deg) scaleX(1)}}',
'@keyframes victoryFeather{0%{transform:translate(0,0) rotate(0deg);opacity:0}15%{opacity:1}40%{transform:translate(18px,-30px) rotate(70deg);opacity:1}70%{transform:translate(-14px,10px) rotate(150deg);opacity:.9}100%{transform:translate(22px,65px) rotate(260deg);opacity:0}}', 
 '#mainMenu{display:flex;justify-content:center;background:#06172c;min-height:100vh}',
'#mainScreen{position:relative;width:1365px}',
'#mainImage{display:block;width:1365px;height:auto}',
'#game{display:none}',
  '#mainStart{position:absolute;left:15px;top:925px;width:250px;height:82px;border:0;background:transparent;cursor:pointer;z-index:20}',
'#game{max-width:800px;margin:auto;padding:15px;text-align:center}',
'#board{display:grid;grid-template-columns:repeat(4,120px);gap:6px;background:#70451f;padding:8px;border-radius:15px;justify-content:center}',
'#boardWrap{display:grid;grid-template-columns:140px 480px 140px;gap:10px;align-items:start;justify-content:center}',
'#capturedLeft,#capturedRight{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;background:#70451f;padding:6px;border-radius:12px}',
'#capturedLeft .miniTile,#capturedRight .miniTile{height:42px;border-radius:13px;border:3px solid #d4ad5b;background:#704a25;display:flex;align-items:center;justify-content:center}',
 '#capturedLeft .miniTile:after,#capturedRight .miniTile:after{content:"🐾";font-size:14px}',
'#capturedLeft .miniTile.empty:after,#capturedRight .miniTile.empty:after{content:""}',
  '#capturedLeft .miniTile.hint:after,#capturedRight .miniTile.hint:after{content:""}',
'.miniPieceName{font-size:13px;font-weight:bold;color:white;text-align:center}',
  '#capturedArea{margin:12px 0;padding:10px;background:#29294f;border-radius:12px;color:#ffd21c}',
'.tile{height:90px;border-radius:13px;border:3px solid #8888c9;background:#484873;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none}',
'.tile.hidden{background:#484873;border-color:#8888c9}',
'.tile.hidden:after{content:"🐾";width:48px;height:48px;background:#704a25;border:3px solid #d4ad5b;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;box-sizing:border-box}',
'.tile.blue{background:linear-gradient(#3555a5,#202f69);border-color:#70a5ff}',
'.tile.red{background:linear-gradient(#a94545,#682727);border-color:#ff7777}',
'.tile.selected{outline:5px solid #ffe000;transform:scale(1.04);z-index:2}',
'.animal{font-size:38px;line-height:42px}',
  '.animal{display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:38px;line-height:42px}',
'.animal img{display:block;max-width:68px;max-height:64px;object-fit:contain;margin:0 auto}',
'.redName{position:absolute;left:50%;bottom:4px;transform:translateX(-50%);font-size:15px;line-height:15px;font-weight:bold;text-align:center;color:white;z-index:5}',
'.character{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center}',
  
  '.animal img{max-width:85px;max-height:85px;object-fit:contain;display:block;margin:auto}',
'.pieceName{font-size:13px;font-weight:bold;margin-top:3px}',
'.hanja{font-size:18px}',
'.info{margin:15px 0;color:#ccc}',
'button{border:0;background:#ffd21c;color:#222;font-size:17px;font-weight:bold;padding:12px 25px;border-radius:25px;cursor:pointer;transition:transform .08s ease,box-shadow .08s ease;box-shadow:0 5px 0 #b68d00}',
'button:active{transform:translateY(4px) scale(0.97);box-shadow:0 1px 0 #b68d00}',
'.rule{margin-top:15px;padding:12px;background:#29294f;border-radius:12px;line-height:1.8;font-size:14px}',
'@media(max-width:500px){.tile{height:95px}.animal{font-size:29px;line-height:32px}h1{font-size:28px}.pieceName{font-size:11px}}'
].join('\n');

document.head.appendChild(style);


/* 말 16개씩 = 총 32개 */

var pieces = [

/* 🔵 호랑이팀 */

{team:'blue',type:'king',name:'왕',emoji:'🐯',dog:false},

{team:'blue',type:'advisor',name:'사',emoji:'🥷',dog:false},
{team:'blue',type:'advisor',name:'사',emoji:'🥷',dog:false},

{team:'blue',type:'elephant',name:'상',emoji:'🐘',dog:true},
{team:'blue',type:'elephant',name:'상',emoji:'🐘',dog:true},

{team:'blue',type:'horse',name:'마',emoji:'🐴',dog:true},
{team:'blue',type:'horse',name:'마',emoji:'🐴',dog:true},

{team:'blue',type:'chariot',name:'차',emoji:'🚩',dog:true},
{team:'blue',type:'chariot',name:'차',emoji:'🚩',dog:true},

{team:'blue',type:'cannon',name:'포',emoji:'💣',dog:true},
{team:'blue',type:'cannon',name:'포',emoji:'💣',dog:true},

{team:'blue',type:'soldier',name:'졸',emoji:'🐶',dog:false},
{team:'blue',type:'soldier',name:'졸',emoji:'🐶',dog:false},
{team:'blue',type:'soldier',name:'졸',emoji:'🐶',dog:false},
{team:'blue',type:'soldier',name:'졸',emoji:'🐶',dog:false},
{team:'blue',type:'soldier',name:'졸',emoji:'🐶',dog:false},


/* 🔴 사자팀 */

{team:'red',type:'king',name:'왕',emoji:'🦁',dog:false},

{team:'red',type:'advisor',name:'사',emoji:'🥷',dog:false},
{team:'red',type:'advisor',name:'사',emoji:'🥷',dog:false},

{team:'red',type:'elephant',name:'상',emoji:'🐘',dog:true},
{team:'red',type:'elephant',name:'상',emoji:'🐘',dog:true},

{team:'red',type:'horse',name:'마',emoji:'🐴',dog:true},
{team:'red',type:'horse',name:'마',emoji:'🐴',dog:true},

{team:'red',type:'chariot',name:'차',emoji:'🚩',dog:true},
{team:'red',type:'chariot',name:'차',emoji:'🚩',dog:true},

{team:'red',type:'cannon',name:'포',emoji:'💣',dog:true},
{team:'red',type:'cannon',name:'포',emoji:'💣',dog:true},

{team:'red',type:'soldier',name:'졸',emoji:'🐶',dog:false},
{team:'red',type:'soldier',name:'졸',emoji:'🐶',dog:false},
{team:'red',type:'soldier',name:'졸',emoji:'🐶',dog:false},
{team:'red',type:'soldier',name:'졸',emoji:'🐶',dog:false},
{team:'red',type:'soldier',name:'졸',emoji:'🐶',dog:false}

];


var board = [];
/* 새 게임 시작 후 전체 행동 횟수 */
var totalActionCount = 0;
var capturedBlue = [];
var capturedRed = [];
var showHint = false;
var selected = null;
var turn = 'blue';
var aiMode = false;
var aiTeam = 'red';
var aiVsAiMode = false;
var lastRevealedBy = null;
var lastRevealedIndex = null;
var aiValue = {
  king:1000,
  advisor:850,
  chariot:600,
  elephant:500,
  horse:400,
  cannon:350,
  soldier:150
};

/* 섞기 */

function shuffle(a){

  for(var i=a.length-1;i>0;i--){

    var j=Math.floor(Math.random()*(i+1));

    var t=a[i];
    a[i]=a[j];
    a[j]=t;
  }
}
/* 버튼 클릭 소리 */

function playClickSound(){

  var AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

  var ctx=new AudioContext();

  var osc=ctx.createOscillator();
  var gain=ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type='sine';
  osc.frequency.setValueAtTime(520,ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    300,
    ctx.currentTime+0.06
  );

  gain.gain.setValueAtTime(0.12,ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime+0.07
  );

  osc.start();
  osc.stop(ctx.currentTime+0.07);
}

/* 새 게임 */

function newGame(){
gameEnded = false;
totalActionCount = 0;
var oldResult = document.getElementById('boardResult');

if(oldResult){
  oldResult.remove();
}
  board=pieces.map(function(p){

    return {
      team:p.team,
      type:p.type,
      name:p.name,
      emoji:p.emoji,
      dog:p.dog,
      revealed:false
    };

  });

  shuffle(board);

  selected=null;

  turn = aiMode ? 'blue' : (Math.random()<0.5 ? 'blue' : 'red');

  say('🔀 말이 섞였습니다! 타일을 뒤집으세요.');

  draw();
}


/* 한자 */

var hanjaMap = {

  '왕':'王',
  '사':'士',
  '상':'象',
  '마':'馬',
  '차':'車',
  '포':'砲',
  '졸':'卒'

};


/* 화면 */

function draw(){

  var boardEl=document.getElementById('board');

  boardEl.innerHTML='';
  var left=document.getElementById('capturedLeft');
var right=document.getElementById('capturedRight');
  left.innerHTML='';
right.innerHTML='';
 for(var m=0; m<16; m++){

  /* 왼쪽 - 먹힌 블루 기물 */
  var leftTile=document.createElement('div');

  if(m < capturedBlue.length){

    leftTile.className='miniTile';

    if(showHint){
      leftTile.classList.add('hint');
      leftTile.innerHTML =
        '<div class="miniPieceName">' +
        capturedBlue[m].name +
        '</div>';
    }

  }else{
    leftTile.className='miniTile empty';
  }

  left.appendChild(leftTile);


  /* 오른쪽 - 먹힌 레드 기물 */
  var rightTile=document.createElement('div');

  if(m < capturedRed.length){

    rightTile.className='miniTile';

    if(showHint){
      rightTile.classList.add('hint');
      rightTile.innerHTML =
        '<div class="miniPieceName">' +
        capturedRed[m].name +
        '</div>';
    }

  }else{
    rightTile.className='miniTile empty';
  }

  right.appendChild(rightTile);
}
  
board.forEach(function(p,index){
    var tile=document.createElement('div');

    tile.className='tile';

    if(!p){

      /* 빈칸 */

    }
    else if(!p.revealed){

      tile.classList.add('hidden');

    }
    else{

      tile.classList.add(p.team);

    tile.innerHTML =
  '<div class="character">' +
    '<div class="animal">' +

      (p.team === 'blue' && p.type === 'king'
  ? '<img src="https://i.ibb.co/Zzv6XgrF/file-0000000032148206ac083e6130067e27.png">'

: p.team === 'blue' && p.type === 'advisor'
  ? '<img src="https://i.ibb.co/F2z7Fg4/file-00000000fe64820692db11216dfd52bb.png">'

: p.team === 'blue' && p.type === 'elephant'
  ? '<img src="https://i.ibb.co/9mG0LBS4/file-00000000d1408209952ae63c82d306e2.png">'

: p.team === 'blue' && p.type === 'horse'
  ? '<img src="https://i.ibb.co/vg1ztVX/file-00000000426c8209b265bc9bf78f8ae8.png">'

: p.team === 'blue' && p.type === 'chariot'
  ? '<img src="https://i.ibb.co/21wy6Rwc/file-000000003b448211b05634b2f55c1713.png">'

: p.team === 'blue' && p.type === 'cannon'
  ? '<img src="https://i.ibb.co/CGjyQzd/file-000000009d84820b978c47349ced09e3.png">'

  : p.team === 'blue' && p.type === 'soldier'
  ? '<img src="https://i.ibb.co/ZRp11N9B/file-00000000c220822fa7e25d15128a2b0b.png">'     

 : p.team === 'red' && p.type === 'king'
  ? '<img src="https://i.ibb.co/qLdkYkjJ/file-0000000091a88207bb19e5cd5924ba06.png">'      

  : p.team === 'red' && p.type === 'advisor'
  ? '<img src="https://i.ibb.co/pvZLxkry/file-00000000b5548206b0df6181f521a305.png">'     
   : p.team === 'red' && p.type === 'horse'
  ? '<img src="https://i.ibb.co/MwX6ZJY/file-00000000ecc481f8a2db1a30da1be17f.png">'  
: p.team === 'red' && p.type === 'elephant'
  ? '<img src="https://i.ibb.co/KctKSKW5/file-000000002f508209a949be423ea62d11.png">'
    : p.team === 'red' && p.type === 'chariot'
  ? '<img src="https://i.ibb.co/yFNY0WmP/file-00000000ce388206a95fd8c1c7ca20ce.png">'   
   : p.team === 'red' && p.type === 'cannon'
  ? '<img src="https://i.ibb.co/zVvK12zq/file-00000000b33c82068ec8c0014551f729.png">'   
    : p.team === 'red' && p.type === 'soldier'
  ? '<img src="https://i.ibb.co/PKyZsRz/file-000000009f3482099632831bcc0d4ccb.png">'

   
     : p.emoji) +

(p.team === 'red' && p.type !== 'advisor'
  ? '<div class="redName">' + p.name + '</div>'
  : '')+

    '</div>' +
  '</div>';
          
      }

    if(index===selected){

      tile.classList.add('selected');
    }

    tile.onclick=function(){

      clickTile(index);
    };

    boardEl.appendChild(tile);
  });


  document.getElementById('turn').textContent =
    turn==='blue'
    ? '🔵 호랑이팀 차례'
    : '🔴 사자팀 차례';
  
}


/* 메시지 */

function say(text){

  document.getElementById('msg').textContent=text;
}


/* 타일 클릭 */

function clickTile(index){
if(gameEnded){
  return;
}
  var p=board[index];


  /* 빈칸인데 선택한 말도 없으면 아무것도 안 함 */

  if(!p && selected===null){

    return;
  }


  /* 뒤집기 */

  if(p && !p.revealed){
 totalActionCount++;
  lastRevealedBy = turn;  
    lastRevealedIndex = index;
    p.revealed=true;
playPieceTak();
    say(p.emoji+' '+p.name+' 등장!');
totalActionCount++;
console.log('전체 행동 횟수:', totalActionCount);
turn = turn==='blue' ? 'red' : 'blue';
    draw();
if(aiMode && turn===aiTeam) aiMove();
    return;
  }


  /* 말 선택 */

  if(selected===null){

    if(!p){

      return;
    }

    if(p.team!==turn){

      say('⚠️ 상대팀 말입니다.');

      return;
    }

    selected=index;

    say('🐾 '+p.name+' 선택! 이동할 곳을 눌러주세요.');

    draw();

    return;
  }


  /* 같은 말을 다시 누르면 선택 취소 */

  if(selected===index){

    selected=null;

    say('선택을 취소했습니다.');

    draw();

    return;
  }


  var attacker=board[selected];

  var target=board[index];


  /* 자기 팀 말을 누르면 선택 변경 */

  if(target && target.team===turn){

    selected=index;

    say('🐾 '+target.name+' 선택');

    draw();

    return;
  }


  /* 이동 가능한 위치인지 확인 */

  if(!canMove(selected,index)){

    say('❌ 그곳으로 이동할 수 없습니다.');

    return;
  }


  /* 상대 말 공격 */

  if(target){

    if(!canCapture(attacker,target)){

      say(
        '❌ '+
        attacker.name+
        '은 '+
        target.name+
        '을 잡을 수 없습니다.'
      );

      return;
    }


    var captured=target;

/* 먹힌 말 기록 */
if(captured.team==='red'){
  capturedRed.push(captured);
}else{
  capturedBlue.push(captured);
}

var fromIndex=selected;

board[index]=attacker;
board[fromIndex]=null;
totalActionCount++;
console.log('전체 행동 횟수:', totalActionCount);
playPieceTak();

    say(
      attacker.emoji+
      ' '+
      attacker.name+
      '이 '+
      captured.emoji+
      ' '+
      captured.name+
      '을 잡았습니다!'
    );
if(checkBlueWin()) return;

    

  }


  /* 빈칸 이동 */

  else{

    var fromIndex=selected;

board[index]=attacker;
board[fromIndex]=null;
totalActionCount++;
console.log('전체 행동 횟수:', totalActionCount);

playPieceTak();
    say('➡️ '+attacker.name+' 이동!');
  }


  /* 이동이나 공격 성공했을 때만 턴 변경 */

  selected=null;

  turn =
    turn==='blue'
    ? 'red'
    : 'blue';

  draw();
  if(aiMode && turn===aiTeam) aiMove();
}
function isDangerAfterMove(from,to){

  var movingPiece=board[from];
  var targetPiece=board[to];

  /* 잠깐 이동해보기 */
  board[to]=movingPiece;
  board[from]=null;

  var dangerous=false;

  for(var i=0;i<board.length;i++){

    var enemy=board[i];

    if(
      !enemy ||
      !enemy.revealed ||
      enemy.team!=='blue'
    ){
      continue;
    }

    if(
      canMove(i,to) &&
      canCapture(enemy,movingPiece)
    ){
      dangerous=true;
      break;
    }
  }

  /* 원래대로 복구 */
  board[from]=movingPiece;
  board[to]=targetPiece;

  return dangerous;
}
function findPotentialCannonThreat(targetIndex){

  var target=board[targetIndex];

  if(
    !target ||
    !target.revealed ||
    target.type==='cannon'
  ){
    return [];
  }

  var danger=[];

  var tr=Math.floor(targetIndex/4);
  var tc=targetIndex%4;

  for(var i=0;i<board.length;i++){

    if(i===targetIndex){
      continue;
    }

    var r=Math.floor(i/4);
    var c=i%4;

    /* 같은 가로/세로 줄만 검사 */
console.log(
  '줄검사:',
  '포=', index,
  '포행=', r,
  '포열=', c,
  '상대=', targetIndex,
  '상대행=', tr,
  '상대열=', tc
);
    if(r!==tr && c!==tc){
      continue;
    }

    /* 그 라인에 숨은 알이 있으면 잠재 포 위험으로 기록 */
    if(board[i] && !board[i].revealed){
      danger.push(i);
    }
  }

  return danger;
}
function findCannonDefenseTile(targetIndex){

  var target = board[targetIndex];

  /* 레드 왕/사만 보호 */
  if(
    !target ||
    !target.revealed ||
    target.team !== 'red' ||
    (
      target.type !== 'king' &&
      target.type !== 'advisor'
    )
  ){
    return null;
  }

  /* 이 왕/사를 공격할 수 있는
     미공개 포 후보 위치 찾기 */
  var cannonCandidates =
    findHiddenCannonCandidates(targetIndex);

  if(cannonCandidates.length === 0){
    return null;
  }

  var bestTile = null;
  var bestScore = -999999;

  /* 각각의 포 후보 주변을 검사 */
  for(var c=0; c<cannonCandidates.length; c++){

    var cannonIndex = cannonCandidates[c];

    var cr = Math.floor(cannonIndex/4);
    var cc = cannonIndex%4;

    var around = [
      [cr-1,cc],
      [cr+1,cc],
      [cr,cc-1],
      [cr,cc+1]
    ];

    for(var a=0; a<around.length; a++){

      var r = around[a][0];
      var col = around[a][1];

      if(
        r < 0 || r >= 8 ||
        col < 0 || col >= 4
      ){
        continue;
      }

      var index = r*4+col;

      /* 미공개 알만 방어 후보 */
      if(
        !board[index] ||
        board[index].revealed
      ){
        continue;
      }

      /* 포 후보 자체는 열지 않는다.
         포 후보 '옆'을 먼저 연다. */
      if(index === cannonIndex){
        continue;
      }

      var score = 1000;

      /* 보호하려는 왕/사와 가까운 방어칸을 우선 */
      var tr = Math.floor(targetIndex/4);
      var tc = targetIndex%4;

      var distance =
        Math.abs(r-tr) +
        Math.abs(col-tc);

      score -= distance * 50;

      if(score > bestScore){
        bestScore = score;
        bestTile = index;
      }
    }
  }

  return bestTile;
}
function findCannonDefenseTile(targetIndex){

  var target = board[targetIndex];

  /* 레드 왕/사만 보호 */
  if(
    !target ||
    !target.revealed ||
    target.team !== 'red' ||
    (
      target.type !== 'king' &&
      target.type !== 'advisor'
    )
  ){
    return null;
  }

  var cannonCandidates =
    findHiddenCannonCandidates(targetIndex);

  if(cannonCandidates.length === 0){
    return null;
  }

  var bestTile = null;
  var bestScore = -999999;

  var tr = Math.floor(targetIndex / 4);
  var tc = targetIndex % 4;

  /* 아직 남아 있는 블루 기물 계산 */
  var remaining = getRemainingPieces();

  for(var c=0; c<cannonCandidates.length; c++){

    var cannonIndex = cannonCandidates[c];

    var cr = Math.floor(cannonIndex / 4);
    var cc = cannonIndex % 4;

    var around = [
      [cr-1,cc],
      [cr+1,cc],
      [cr,cc-1],
      [cr,cc+1]
    ];

    for(var a=0; a<around.length; a++){

      var r = around[a][0];
      var col = around[a][1];

      if(
        r < 0 || r >= 8 ||
        col < 0 || col >= 4
      ){
        continue;
      }

      var index = r * 4 + col;

      /* 미공개 알만 */
      if(
        !board[index] ||
        board[index].revealed
      ){
        continue;
      }

      var distance =
        Math.abs(r-tr) +
        Math.abs(col-tc);

      /* ★ 매우 중요:
         블루 졸이 아직 남아 있으면
         레드 왕 바로 옆 알은 절대 열지 않는다 */
      if(
        target.type === 'king' &&
        distance === 1 &&
        remaining.blue.soldier > 0
      ){
        continue;
      }

      var score = 1000;

      score -= distance * 30;

      if(score > bestScore){

        bestScore = score;
        bestTile = index;
      }
    }
  }

  return bestTile;
}
function findCannonNeighborHidden(){

  var candidates=[];

  for(var i=0;i<board.length;i++){

    var p=board[i];

    /* 공개된 레드 포 찾기 */
    if(
      !p ||
      !p.revealed ||
      p.team!=='red' ||
      p.type!=='cannon'
    ){
      continue;
    }

    var r=Math.floor(i/4);
    var c=i%4;

    var around=[
      [r-1,c],
      [r+1,c],
      [r,c-1],
      [r,c+1]
    ];

    for(var a=0;a<around.length;a++){

      var nr=around[a][0];
      var nc=around[a][1];

      /* 보드 밖 제외 */
      if(
        nr<0 || nr>=8 ||
        nc<0 || nc>=4
      ){
        continue;
      }

      var index=nr*4+nc;

      /* 안 열린 알만 */
      if(
  board[index] &&
  !board[index].revealed
){

  var dangerous=false;

  for(var e=0; e<board.length; e++){

    var enemy=board[e];

    if(
      !enemy ||
      !enemy.revealed ||
      enemy.team!=='blue'
    ){
      continue;
    }

    var er=Math.floor(e/4);
    var ec=e%4;

    var ir=Math.floor(index/4);
    var ic=index%4;

    var distance=
      Math.abs(er-ir)+Math.abs(ec-ic);

    /* 숨은 알 바로 옆에 상대 강한 말이 있으면 위험 */
    if(
      distance===1 &&
      (
        enemy.type==='king' ||
        enemy.type==='advisor' ||
        enemy.type==='chariot' ||
        enemy.type==='elephant'
      )
    ){
      dangerous=true;
      break;
    }
  }

  if(!dangerous){
    candidates.push(index);
  }
}
    }
  }

  return candidates;
}
      
function isCannonDangerAfterCapture(from,to){

  var movingPiece=board[from];
  var capturedPiece=board[to];

  /* 왕과 사만 검사 */
  if(
    movingPiece.type!=='king' &&
    movingPiece.type!=='advisor'
  ){
    return false;
  }

  /* 잠깐 먹었다고 가정 */
  board[to]=movingPiece;
  board[from]=null;

  var danger=false;

  /* 상대 블루 포 찾기 */
  for(var i=0;i<board.length;i++){

    var enemy=board[i];

    if(
      !enemy ||
      !enemy.revealed ||
      enemy.team!=='blue' ||
      enemy.type!=='cannon'
    ){
      continue;
    }

    /* 그 포가 이동 후 위치를 공격할 수 있는가 */
    if(canCannon(i,to)){
      danger=true;
      break;
    }
  }

  /* 먹고 간 자리에서 숨은 포 후보가 있으면 위험 */
  if(!danger){

    var hiddenCannonDanger=
      findHiddenCannonCandidates(to);

    if(hiddenCannonDanger.length>0){
      danger=true;
    }
  }
  
  /* 원래대로 복구 */
  board[from]=movingPiece;
  board[to]=capturedPiece;

  return danger;
}

function hasSafeMove(index){

  var piece=board[index];

  if(!piece || !piece.revealed){
    return false;
  }

  for(var to=0; to<board.length; to++){

    if(board[to]!==null){
      continue;
    }

    if(!canMove(index,to)){
      continue;
    }

    var old=board[index];

    board[to]=old;
    board[index]=null;

    var danger=false;

    for(var e=0; e<board.length; e++){

      var enemy=board[e];

      if(
        !enemy ||
        !enemy.revealed ||
        enemy.team!=='blue'
      ){
        continue;
      }

      if(
        canMove(e,to) &&
        canCapture(enemy,old)
      ){
        danger=true;
        break;
      }
    }

    board[index]=old;
    board[to]=null;

    if(!danger){
      return true;
    }
  }

  return false;
}
function getHiddenRedRatio(){

  var hiddenCount=0;
  var redCount=0;

  for(var i=0;i<board.length;i++){

    var p=board[i];

    if(
      p &&
      !p.revealed
    ){
      hiddenCount++;

      if(p.team==='red'){
        redCount++;
      }
    }
  }

  if(hiddenCount===0){
    return 0;
  }

  return redCount / hiddenCount;
}
function isDangerousHiddenNearKing(index){

  var hiddenSoldiers=0;
  var hiddenTotal=0;

  /* 아직 안 열린 블루 졸의 수 계산 */
  for(var i=0;i<board.length;i++){

    var p=board[i];

    if(p && !p.revealed){

      hiddenTotal++;

      if(
        p.team==='blue' &&
        p.type==='soldier'
      ){
        hiddenSoldiers++;
      }
    }
  }

  /* 숨은 상대 졸이 없으면 위험 없음 */
  if(hiddenSoldiers===0){
    return false;
  }


  /* AI 왕 찾기 */
  for(var k=0;k<board.length;k++){

    var king=board[k];

    if(
      !king ||
      !king.revealed ||
      king.team!=='red' ||
      king.type!=='king'
    ){
      continue;
    }

    var kr=Math.floor(k/4);
    var kc=k%4;

    var ir=Math.floor(index/4);
    var ic=index%4;

    /* AI의 공개된 모든 기물 주변 숨은 알은 위험도 계산 */

for(var k=0; k<board.length; k++){

  var myPiece=board[k];

  if(
    !myPiece ||
    !myPiece.revealed ||
    myPiece.team!=='red'
  ){
    continue;
  }

  var kr=Math.floor(k/4);
  var kc=k%4;

  var myDistance=
    Math.abs(r-kr)+
    Math.abs(c-kc);

  /* 내 기물 바로 옆의 숨은 알 */
  if(myDistance===1){

    var myValue=
      aiValue[myPiece.type] || 100;

    /* 중요한 기물일수록 더 위험하게 판단 */
    score-=myValue;
  }
}

    var distance=
      Math.abs(kr-ir)+
      Math.abs(kc-ic);

    /* 왕 바로 옆의 숨은 알 */
    if(distance===1){

      /*
        상대 졸이 아직 많이 숨어 있으면
        왕 옆 알은 위험하다고 판단
      */
      if(hiddenSoldiers>=2){
        return true;
      }
    }
  }

  return false;
}
function scoreHiddenTile(index){

  var score=0;

  var r=Math.floor(index/4);
  var c=index%4;
var blueKingRevealed=false;
var redKingRevealed=false;

for(var k=0; k<board.length; k++){

  var kp=board[k];

  if(
    !kp ||
    !kp.revealed ||
    kp.type!=='king'
  ){
    continue;
  }

  if(kp.team==='blue'){
    blueKingRevealed=true;
  }

  if(kp.team==='red'){
    redKingRevealed=true;
  }
}

var bothKingsRevealed =
  blueKingRevealed &&
  redKingRevealed;
  /* 공개된 블루 기물 주변이면 공격 준비 점수 */
  for(var i=0;i<board.length;i++){

    var p=board[i];

    if(
      !p ||
      !p.revealed ||
      p.team!=='blue'
    ){
      continue;
    }

    var pr=Math.floor(i/4);
    var pc=i%4;

    var distance=
      Math.abs(r-pr)+
      Math.abs(c-pc);

    if(distance===1){
/* 양쪽 왕이 아직 모두 공개되지 않았다면
   졸 옆 숨은 알은 피한다 */

if(
  p.type==='soldier' &&
  !bothKingsRevealed
){
  score-=3000;
}
      /* 강한 상대 기물 바로 옆은 위험 */
if(p.type==='king'){
  score-=2500;
}

if(p.type==='advisor'){
  score-=2000;
}

if(p.type==='chariot'){
  score-=250;
}

      /* 상대 기물이 움직일 수 있는 빈칸 계산 */
      var escapeCount=0;

      for(var m=0; m<board.length; m++){

        if(board[m]!==null){
          continue;
        }

        if(canMove(i,m)){
          escapeCount++;
        }
      }

      /* 상대 기물이 완전히 갇혀 있으면 점수 추가 */
      
      
    }
  }

  return score;
}
function getNearbyThreatLevel(index){

  var me=board[index];

  if(
    !me ||
    !me.revealed ||
    me.team!=='red'
  ){
    return null;
  }

  var myPower=aiValue[me.type] || 0;

  var r=Math.floor(index/4);
  var c=index%4;

  var result={
    equal:[],
    stronger:[],
    weaker:[]
  };

  var around=[
    [r-1,c],
    [r+1,c],
    [r,c-1],
    [r,c+1]
  ];

  for(var i=0;i<around.length;i++){

    var nr=around[i][0];
    var nc=around[i][1];

    if(
      nr<0 || nr>=8 ||
      nc<0 || nc>=4
    ){
      continue;
    }

    var idx=nr*4+nc;
    var enemy=board[idx];

    if(
      !enemy ||
      !enemy.revealed ||
      enemy.team!=='blue'
    ){
      continue;
    }

    var enemyPower=aiValue[enemy.type] || 0;

    if(enemyPower>myPower){
      result.stronger.push(idx);
    }
    else if(enemyPower===myPower){
      result.equal.push(idx);
    }
    else{
      result.weaker.push(idx);
    }
  }

  return result;
}
function getStrongerChance(myPiece){

  var rank={
    king:7,
    advisor:6,
    chariot:5,
    elephant:4,
    horse:3,
    cannon:2,
    soldier:1
  };

  var myRank=rank[myPiece.type];

  var hiddenEnemyTotal=0;
  var strongerEnemy=0;

  for(var i=0; i<board.length; i++){

    var p=board[i];

    if(!p || p.revealed){
      continue;
    }

    /* 숨은 기물 중 블루만 계산 */
    if(p.team!=='blue'){
      continue;
    }

    hiddenEnemyTotal++;

    if(rank[p.type] > myRank){
      strongerEnemy++;
    }
  }

  if(hiddenEnemyTotal===0){
    return 0;
  }

  return strongerEnemy / hiddenEnemyTotal;
}

function evaluateBoard(){

  var score=0;

  for(var i=0; i<board.length; i++){

    var p=board[i];

    if(!p || !p.revealed){
      continue;
    }

    var value=aiValue[p.type] || 0;

    /* AI 레드 기물은 플러스 */
    if(p.team==='red'){
      score+=value;
    }

    /* 사용자 블루 기물은 마이너스 */
    if(p.team==='blue'){
      score-=value;
    }
  }

  return score;
}

function findBestOneMove(){

  var bestMove=null;
  var bestScore=-Infinity;

  for(var from=0; from<board.length; from++){

    var piece=board[from];

    if(
      !piece ||
      !piece.revealed ||
      piece.team!=='red'
    ){
      continue;
    }

    for(var to=0; to<board.length; to++){

      if(from===to){
        continue;
      }

      /* 이동도 못하고 잡기도 못하면 제외 */
      if(
        !canMove(from,to) &&
        !canCapture(piece,to)
      ){
        continue;
      }

      /* 현재 상태 저장 */
      var oldFrom=board[from];
      var oldTo=board[to];

      /* 가상으로 움직임 */
      board[to]=oldFrom;
      board[from]=null;

      /* 움직인 뒤 보드 점수 */
      var score=evaluateBoard();

      /* 위험한 자리라면 감점 */
      if(isDangerAfterMove(from,to)){
        score-=1000;
      }

      /* 원래 상태로 복구 */
      board[from]=oldFrom;
        board[to]=oldTo;

      if(score>bestScore){

        bestScore=score;

        bestMove={
          from:from,
          to:to,
          score:score
        };
      }
    }
  }

  return bestMove;
}
function getRemainingPieces(){

  var total = {
    blue:{
      king:1,
      advisor:2,
      elephant:2,
      horse:2,
      chariot:2,
      cannon:2,
      soldier:5
    },
    red:{
      king:1,
      advisor:2,
      elephant:2,
      horse:2,
      chariot:2,
      cannon:2,
      soldier:5
    }
  };

  for(var i=0; i<board.length; i++){

    var p=board[i];

    if(!p || !p.revealed){
      continue;
    }

    total[p.team][p.type]--;
  }

  for(var i=0; i<capturedBlue.length; i++){

    var p=capturedBlue[i];

    total.blue[p.type]--;
  }

  for(var i=0; i<capturedRed.length; i++){

    var p=capturedRed[i];

    total.red[p.type]--;
  }

  return total;
}
function getHiddenDangerScore(){

  var remaining = getRemainingPieces();

  var dangerous =
    remaining.blue.king * 100 +
    remaining.blue.advisor * 80 +
    remaining.blue.chariot * 65 +
    remaining.blue.elephant * 50 +
    remaining.blue.horse * 40 +
    remaining.blue.cannon * 55 +
    remaining.blue.soldier * 15;

  var count =
    remaining.blue.king +
    remaining.blue.advisor +
    remaining.blue.chariot +
    remaining.blue.elephant +
    remaining.blue.horse +
    remaining.blue.cannon +
    remaining.blue.soldier;

  if(count===0){
    return 0;
  }

  return dangerous / count;
}
function countKingEscapeSpaces(team){

  for(var i=0; i<board.length; i++){

    var p=board[i];

    if(
      !p ||
      !p.revealed ||
      p.team!==team ||
      p.type!=='king'
    ){
      continue;
    }

    var r=Math.floor(i/4);
    var c=i%4;

    var around=[
      [r-1,c],
      [r+1,c],
      [r,c-1],
      [r,c+1]
    ];

    var count=0;

    for(var a=0; a<around.length; a++){

      var nr=around[a][0];
      var nc=around[a][1];

      if(
        nr<0 || nr>=8 ||
        nc<0 || nc>=4
      ){
        continue;
      }

      var idx=nr*4+nc;

      if(board[idx]===null){
        count++;
      }
    }

    return count;
  }

  return 0;
}
function isBadRevealNearBluePower(index){

  var r=Math.floor(index/4);
  var c=index%4;

  for(var i=0; i<board.length; i++){

    var p=board[i];

    if(
      !p ||
      !p.revealed ||
      p.team!=='blue'
    ){
      continue;
    }

    var pr=Math.floor(i/4);
    var pc=i%4;

    var distance=
      Math.abs(r-pr)+
      Math.abs(c-pc);

    if(distance!==1){
      continue;
    }

    if(
      p.type==='king' ||
      p.type==='advisor' ||
      p.type==='chariot'
    ){
      return true;
    }
  }

  return false;
}
function showWin(team){

  /* 이미 승리 화면이 있으면 중복 생성 금지 */
  if(document.getElementById('winScreen')){
    return;
  }

  var overlay=document.createElement('div');
  overlay.id='winScreen';

  overlay.style.position='fixed';
  overlay.style.left='0';
  overlay.style.top='0';
  overlay.style.width='100%';
  overlay.style.height='100%';
  overlay.style.background='rgba(0,0,0,0.75)';
  overlay.style.zIndex='99999';
  overlay.style.display='flex';
  overlay.style.alignItems='center';
  overlay.style.justifyContent='center';

  var box=document.createElement('div');

  box.style.width='420px';
  box.style.height='420px';
  box.style.background='#f3d58a';
  box.style.border='8px solid #754214';
  box.style.borderRadius='30px';
  box.style.position='relative';
  box.style.textAlign='center';
  box.style.overflow='hidden';

  var title=document.createElement('div');

  title.innerHTML =
    team==='red'
    ? '🔴 사자팀 승리!'
    : '🔵 호랑이팀 승리!';

  title.style.fontSize='36px';
  title.style.fontWeight='bold';
  title.style.marginTop='25px';
  title.style.color='#512b0b';
var soldier=document.createElement('img');

soldier.src =
  team==='red'
  ? 'https://i.ibb.co/PKyZsRz/file-000000009f3482099632831bcc0d4ccb.png'
  : 'https://i.ibb.co/ZRp11N9B/file-00000000c220822fa7e25d15128a2b0b.png';

soldier.style.position='absolute';
soldier.style.width='170px';
soldier.style.height='170px';
soldier.style.objectFit='contain';
soldier.style.left='35px';
soldier.style.bottom='35px';
soldier.style.zIndex='3';
 var winImage=document.createElement('img');

winImage.src='./win_flag.png';

winImage.style.position='absolute';
winImage.style.left='50%';
winImage.style.top='50%';
winImage.style.transform='translate(-50%,-50%)';
winImage.style.width='100%';
winImage.style.height='100%';
winImage.style.objectFit='contain';
winImage.style.zIndex='3';

box.appendChild(winImage);
 

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}
var gameEnded = false;
var noCaptureTurns = 0;
function countAlivePieces(team){

  var count = 0;

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(p && p.team === team){
      count++;
    }
  }

  return count;
}
function showBoardResult(text){

  var boardEl = document.getElementById('board');

  var result = document.createElement('div');

  result.id = 'boardResult';
  result.textContent = text;

  result.style.position = 'absolute';
  result.style.left = '0';
  result.style.top = '0';
  result.style.width = '100%';
  result.style.height = '100%';

  result.style.display = 'flex';
  result.style.alignItems = 'center';
  result.style.justifyContent = 'center';

  result.style.background = 'rgba(0,0,0,0.55)';
  result.style.zIndex = '9999';

  result.style.color =
  text === '레드 승'
  ? '#ff3333'
  : '#55aaff';
  result.style.fontSize = '70px';
  result.style.fontWeight = '900';
result.style.fontFamily = '"휴먼둥근헤드라인", "Human Yet", serif';
  result.style.textShadow =
    '0 3px 0 #fff,' +
    '0 6px 0 #777,' +
    '0 10px 8px #000';

  boardEl.style.position = 'relative';

  boardEl.appendChild(result);
}
function checkBlueWin(){

  var redCount = countAlivePieces('red');

  if(redCount === 0){

    gameEnded = true;
    selected = null;

    draw();

    say('🏆 🔵 블루 승!');

    showBoardResult('블루 승');

    return true;
  }

  return false;
}
function checkRedWin(){

  var blueCount = countAlivePieces('blue');

  if(blueCount === 0){

    gameEnded = true;
    selected = null;

    draw();

    say('🏆 🔴 레드 승!');

    showBoardResult('레드 승');

    return true;
  }

  return false;
}
function findHiddenCannonCandidates(targetIndex){

  var target = board[targetIndex];

  if(
    !target ||
    !target.revealed
  ){
    return [];
  }

  var candidates = [];

  var tr = Math.floor(targetIndex / 4);
  var tc = targetIndex % 4;

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(!p || p.revealed){
      continue;
    }

    var ir = Math.floor(i / 4);
    var ic = i % 4;

    if(ir !== tr && ic !== tc){
      continue;
    }

    var dr = Math.sign(tr - ir);
    var dc = Math.sign(tc - ic);

    var r = ir + dr;
    var c = ic + dc;

    var count = 0;

    while(r !== tr || c !== tc){

      var idx = r * 4 + c;

      if(board[idx]){
        count++;
      }

      r += dr;
      c += dc;
    }

    if(count === 1){
      candidates.push(i);
    }
  }

  return candidates;
}
function isChainRiskHidden(index){

  var r = Math.floor(index / 4);
  var c = index % 4;

  var around = [
    [r-1,c],
    [r+1,c],
    [r,c-1],
    [r,c+1]
  ];

  /* 숨은 알 바로 옆 레드 기물 검사 */
  for(var a=0; a<around.length; a++){

    var nr = around[a][0];
    var nc = around[a][1];

    if(
      nr < 0 || nr >= 8 ||
      nc < 0 || nc >= 4
    ){
      continue;
    }

    var frontIndex = nr*4 + nc;
    var frontPiece = board[frontIndex];

    if(
      !frontPiece ||
      !frontPiece.revealed ||
      frontPiece.team !== 'red'
    ){
      continue;
    }

    /* 그 레드 기물 주변에
       또 다른 중요한 레드 기물이 붙어 있는지 검사 */

    var fr = Math.floor(frontIndex / 4);
    var fc = frontIndex % 4;

    var secondAround = [
      [fr-1,fc],
      [fr+1,fc],
      [fr,fc-1],
      [fr,fc+1]
    ];

    for(var b=0; b<secondAround.length; b++){

      var sr = secondAround[b][0];
      var sc = secondAround[b][1];

      if(
        sr < 0 || sr >= 8 ||
        sc < 0 || sc >= 4
      ){
        continue;
      }

      var secondIndex = sr*4 + sc;

      if(secondIndex === index){
        continue;
      }

      var protectedPiece = board[secondIndex];

      if(
        !protectedPiece ||
        !protectedPiece.revealed ||
        protectedPiece.team !== 'red'
      ){
        continue;
      }

      /* 뒤에 포/왕/사가 붙어 있으면
         연쇄 위험 구역으로 판단 */
      if(
        protectedPiece.type === 'cannon' ||
        protectedPiece.type === 'king' ||
        protectedPiece.type === 'advisor'
      ){
        return true;
      }
    }
  }

  return false;
}

/* =========================================================
   PAW STORY 사부님 AI
========================================================= */

function enemyTeam(team){
  return team === 'blue' ? 'red' : 'blue';
}


/* 가능한 행동 만들기 */
function getMasterActions(team){

  var actions = [];
  var enemy = enemyTeam(team);

  /* 내 공개 기물 찾기 */
  for(var from=0; from<board.length; from++){

    var piece = board[from];

    if(
      !piece ||
      !piece.revealed ||
      piece.team !== team
    ){
      continue;
    }

    for(var to=0; to<board.length; to++){

      if(from === to){
        continue;
      }

      var target = board[to];

      /* 빈칸 이동 */
      if(target === null){

        if(canMove(from,to)){
          actions.push({
            type:'move',
            from:from,
            to:to
          });
        }

        continue;
      }

      /* 숨은 알은 여기서 건드리지 않음 */
      if(!target.revealed){
        continue;
      }

      /* 상대 기물 잡기 */
      if(
        target.team === enemy &&
        canMove(from,to) &&
        canCapture(piece,target)
      ){
        actions.push({
          type:'capture',
          from:from,
          to:to
        });
      }
    }
  }


  /* 뒤집을 수 있는 알 */
  for(var i=0; i<board.length; i++){

    if(
      board[i] &&
      !board[i].revealed
    ){
      actions.push({
        type:'reveal',
        index:i
      });
    }
  }

  return actions;
}


/* 행동 실행 */
function executeMasterAction(team,action){

console.log('AI 행동:', action);
  if(!action){
    return;
  }
totalActionCount++;
console.log('전체 행동 횟수:', totalActionCount);
  /* =================================================
     최고 우선 왕 보호
     어떤 AI 로직이 선택했더라도 마지막에 강제 차단
  ================================================= */

  if(
    action &&
    action.type === 'reveal' &&
    isLockedKingAdjacentRevealForbidden(
      team,
      action.index
    )
  ){

    var safeAlternative = [];

    for(var i=0; i<board.length; i++){

      if(
        !board[i] ||
        board[i].revealed
      ){
        continue;
      }

      if(
        isLockedKingAdjacentRevealForbidden(
          team,
          i
        )
      ){
        continue;
      }

      safeAlternative.push(i);
    }

    if(safeAlternative.length > 0){

      console.log(
        '👑 왕 갇힘 보호:',
        action.index,
        '오픈 취소'
      );

      action = {
        type:'reveal',
        reason:'lockedKingSafeAlternative',
        index:
          safeAlternative[
            Math.floor(
              Math.random() *
              safeAlternative.length
            )
          ]
      };
    }
  }
  /* 알 뒤집기 */
  if(action.type === 'reveal'){
/* 내 졸 바로 옆 알이면 다른 안전한 알로 변경 */
if(
  isRevealDangerousNearMySoldier(
    team,
    action.index
  )
){

  var safeReveal = [];

  for(var s=0; s<board.length; s++){

    if(
      !board[s] ||
      board[s].revealed
    ){
      continue;
    }

    if(
      isRevealDangerousNearMySoldier(
        team,
        s
      )
    ){
      continue;
    }

    safeReveal.push(s);
  }

  /* 다른 안전한 미오픈 알이 있으면 그쪽으로 변경 */
  if(safeReveal.length > 0){

    action.index =
      safeReveal[
        Math.floor(
          Math.random() *
          safeReveal.length
        )
      ];

    console.log(
      '🐶 졸 보호: 옆 알 오픈 취소 →',
      action.index
    );
  }
}
    board[action.index].revealed = true;

    lastRevealedBy = team;
    lastRevealedIndex = action.index;
/* 포를 찾으려고 열었는데 상대 포가 나왔는지 확인 */
if(
  board[action.index].type === 'cannon' &&
  board[action.index].team !== team
){
 
}
    playPieceTak();

    say('🤖 AI가 알을 뒤집었습니다!');
  }


  /* 이동 */
  else if(action.type === 'move'){

    var moving = board[action.from];

    board[action.to] = moving;
    board[action.from] = null;

    playPieceTak();

    say('🤖 AI ' + moving.name + ' 이동!');
  }


  /* 잡기 */
  else if(action.type === 'capture'){

    var attacker = board[action.from];
    var captured = board[action.to];

    if(captured.team === 'blue'){
      capturedBlue.push(captured);
    }
    else{
      capturedRed.push(captured);
    }

    board[action.to] = attacker;
    board[action.from] = null;

    playPieceTak();

    say(
      '🤖 AI ' +
      attacker.name +
      '이 ' +
      captured.name +
      '을 잡았습니다!'
    );

    if(team === 'red'){
      if(checkRedWin()) return;
    }
    else{
      if(checkBlueWin()) return;
    }
  }


  selected = null;
  turn = enemyTeam(team);

  draw();
}


/* =========================================================
   사부님 판단실
   앞으로 우리가 전수한 기술은 전부 여기로 들어감
========================================================= */
/* =========================================================
   사부님 기술 1 - 초반 포 찾기
========================================================= */

/* 기준 알에서 포가 공격 가능한 숨은 위치 찾기 */
function findMasterCannonSearchTiles(centerIndex){

  var result = [];

  var cr = Math.floor(centerIndex / 4);
  var cc = centerIndex % 4;

  for(var i=0; i<board.length; i++){

    if(
      !board[i] ||
      board[i].revealed ||
      i === centerIndex
    ){
      continue;
    }

    var r = Math.floor(i / 4);
    var c = i % 4;

    /* 같은 가로/세로만 */
    if(r !== cr && c !== cc){
      continue;
    }

    var dr = Math.sign(r-cr);
    var dc = Math.sign(c-cc);

    var nr = cr + dr;
    var nc = cc + dc;

    var middleCount = 0;

    while(nr !== r || nc !== c){

      var middleIndex = nr * 4 + nc;

      if(board[middleIndex]){
        middleCount++;
      }

      nr += dr;
      nc += dc;
    }

    /* 중간에 알/기물이 정확히 하나 있으면
       포가 공격 가능한 구조 */
    if(middleCount === 1){
      result.push(i);
    }
  }

  return result;
}


/* 포 찾기용 알 하나 선택 */
function masterFindCannonReveal(team){

  var bestCandidates = [];

  /* 공개된 모든 기물을 기준으로 포 후보 찾기 */
  for(var centerIndex=0; centerIndex<board.length; centerIndex++){

    var center = board[centerIndex];

    if(
      !center ||
      !center.revealed
    ){
      continue;
    }

    /* 자기 포 자체는 기준으로 쓰지 않음 */
    if(
      center.team === team &&
      center.type === 'cannon'
    ){
      continue;
    }

    var candidates =
      findMasterCannonSearchTiles(
        centerIndex
      );

    for(var i=0; i<candidates.length; i++){

  if(
    bestCandidates.indexOf(
      candidates[i]
    ) === -1 &&
    masterBadCannonSearch[team].indexOf(
      candidates[i]
    ) === -1
  ){
    bestCandidates.push(
      candidates[i]
    );
  }
}
  }

  if(bestCandidates.length === 0){
    return null;
  }

  return {
    type:'reveal',
    reason:'findCannon',
    index:
      bestCandidates[
        Math.floor(
          Math.random() *
          bestCandidates.length
        )
      ]
  };
}
function masterActiveCannonReveal(team){

  var candidates = [];

  for(var from=0; from<board.length; from++){

    var cannon = board[from];

    if(
      !cannon ||
      !cannon.revealed ||
      cannon.team !== team ||
      cannon.type !== 'cannon'
    ){
      continue;
    }

    for(var to=0; to<board.length; to++){

      if(
        !board[to] ||
        board[to].revealed
      ){
        continue;
      }

      /*
        숨은 알을 임시로 "공격 대상"이라고 보고
        포 공격 규칙상 가능한 자리인지 검사
      */
      var hiddenPiece = board[to];

      hiddenPiece.revealed = true;

      var canAttack =
        canCannon(from,to);

      hiddenPiece.revealed = false;

      if(canAttack){
        candidates.push(to);
      }
    }
  }

  if(candidates.length === 0){
    return null;
  }

  return {
    type:'reveal',
    reason:'activeCannonAttack',
    index:
      candidates[
        Math.floor(
          Math.random() * candidates.length
        )
      ]
  };
}

function masterRevealAroundEnemyCannon(team){

  var cannonIndex =
    masterEnemyCannonGuard[team];

  if(cannonIndex === null){
    return null;
  }

  var cannon = board[cannonIndex];

  if(
    !cannon ||
    !cannon.revealed ||
    cannon.team === team ||
    cannon.type !== 'cannon'
  ){
    masterEnemyCannonGuard[team] = null;
    return null;
  }

  var r = Math.floor(cannonIndex / 4);
  var c = cannonIndex % 4;

  var around = [
    [r-1,c],
    [r+1,c],
    [r,c-1],
    [r,c+1]
  ];

  for(var i=0; i<around.length; i++){

    var nr = around[i][0];
    var nc = around[i][1];

    if(
      nr < 0 || nr >= 8 ||
      nc < 0 || nc >= 4
    ){
      continue;
    }

    var index = nr * 4 + nc;

    if(
      board[index] &&
      !board[index].revealed
    ){
      return {
        type:'reveal',
        reason:'enemyCannonGuard',
        index:index
      };
    }
  }

  masterEnemyCannonGuard[team] = null;

  return null;
}
/* 숨은 칸이 상대 포라고 가정했을 때
   이미 공개된 내 기물을 공격할 수 있는지 검사 */
function isPotentialEnemyCannonDanger(team,index){

  var ir = Math.floor(index/4);
  var ic = index%4;

  for(var i=0; i<board.length; i++){

    var myPiece = board[i];

    if(
      !myPiece ||
      !myPiece.revealed ||
      myPiece.team !== team
    ){
      continue;
    }

    var mr = Math.floor(i/4);
    var mc = i%4;

    if(ir !== mr && ic !== mc){
      continue;
    }

    var dr = Math.sign(mr-ir);
    var dc = Math.sign(mc-ic);

    var r = ir + dr;
    var c = ic + dc;

    var middleCount = 0;

    while(r !== mr || c !== mc){

      var middleIndex = r*4+c;

      if(board[middleIndex]){
        middleCount++;
      }

      r += dr;
      c += dc;
    }

    /* 중간에 기물 하나면
       상대 포가 나왔을 때 내 기물 공격 가능 */
    if(middleCount === 1){
      return true;
    }
  }

  return false;
}


/* 내 포가 있는데 현재 포 공격용 알도 없으면
   포 주변을 피해서 안전한 다른 알 오픈 */
function masterSafeRevealAwayFromCannon(team){

  var cannons = [];

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      p &&
      p.revealed &&
      p.team === team &&
      p.type === 'cannon'
    ){
      cannons.push(i);
    }
  }

  if(cannons.length === 0){
    return null;
  }

  var safe = [];

  for(var index=0; index<board.length; index++){

    if(
      !board[index] ||
      board[index].revealed
    ){
      continue;
    }

    var r = Math.floor(index/4);
    var c = index%4;

    var nearMyCannon = false;

    /* 내 포 바로 주변은 금지 */
    for(var k=0; k<cannons.length; k++){

      var cr = Math.floor(cannons[k]/4);
      var cc = cannons[k]%4;

      var distance =
        Math.abs(r-cr) +
        Math.abs(c-cc);

      if(distance === 1){
        nearMyCannon = true;
        break;
      }
    }

    if(nearMyCannon){
      continue;
    }

    /* 상대 포가 나왔을 때
       내 공개 기물을 바로 공격할 수 있는 칸도 제외 */
    if(
      isPotentialEnemyCannonDanger(
        team,
        index
      )
    ){
      continue;
    }

    safe.push(index);
  }

  if(safe.length === 0){
    return null;
  }

  return {
    type:'reveal',
    reason:'safeAwayFromCannon',
    index:
      safe[
        Math.floor(
          Math.random()*safe.length
        )
      ]
  };
}
/* 상대 왕/사/차/상이 공개되면
   그 상대를 공격할 "내 포가 숨어 있을 만한 알"을 오픈 */
function masterFindCannonForImportantEnemy(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var importantTypes = {
    king:true,
    advisor:true,
    chariot:true,
    elephant:true
  };

  var candidates = [];

  /* 상대 왕/사/차/상 찾기 */
  for(var targetIndex=0;
      targetIndex<board.length;
      targetIndex++){

    var target = board[targetIndex];

    if(
      !target ||
      !target.revealed ||
      target.team !== enemy ||
      !importantTypes[target.type]
    ){
      continue;
    }

    var tr = Math.floor(targetIndex / 4);
    var tc = targetIndex % 4;

    /*
      모든 숨은 알을
      "여기서 내 포가 나온다면?"
      이라고 가정해서 검사
    */
    for(var index=0;
        index<board.length;
        index++){

      var hidden = board[index];

      if(
        !hidden ||
        hidden.revealed
      ){
        continue;
      }

      var r = Math.floor(index / 4);
      var c = index % 4;

      /* 상대 기물과 같은 가로/세로만 */
      if(
        r !== tr &&
        c !== tc
      ){
        continue;
      }

      var dr = Math.sign(tr-r);
      var dc = Math.sign(tc-c);

      var nr = r + dr;
      var nc = c + dc;

      var middleCount = 0;

      while(
        nr !== tr ||
        nc !== tc
      ){

        var middleIndex =
          nr * 4 + nc;

        if(board[middleIndex]){
          middleCount++;
        }

        nr += dr;
        nc += dc;
      }

      /*
        이 알에서 내 포가 나온다고 가정했을 때
        상대 기물까지 중간 기물이 정확히 1개면
        바로 포 공격 구조
      */
      if(middleCount === 1){

        candidates.push(index);
if(
  middleCount === 1 &&
  !middleIsRevealedEnemy
){

  candidates.push(index);

  console.log(
    '포후보:',
    index,
    '대상:',
    target.type,
    '대상위치:',
    targetIndex
  );
}
      }
    }
  }

  if(candidates.length === 0){
    return null;
  }

  return {
    type:'reveal',
    reason:'findCannonForImportantEnemy',
    index:
      candidates[
        Math.floor(
          Math.random() *
          candidates.length
        )
      ]
  };
}


/* =========================================================
   포 최우선 판단실
   1순위 : 상대 왕/사/차/상/마/졸 → 공격할 포 알 찾기
   2순위 : 상대 포 → 포 주변 알 오픈
   3순위 : 내 포 → 공격 가능한 알 오픈
========================================================= */
/* =====================================================
   포 찾기 후보 안전 검사

   숨은 알에서 "내 포가 나왔다"고 가정했을 때
   공개된 상대 기물이 그 포를 바로 잡을 수 있으면
   위험한 포 후보로 판단한다.
===================================================== */
function isRevealAdjacentToEnemyKing(team, index){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var r = Math.floor(index / 4);
  var c = index % 4;

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      !p ||
      !p.revealed ||
      p.team !== enemy ||
      p.type !== 'king'
    ){
      continue;
    }

    var kr = Math.floor(i / 4);
    var kc = i % 4;

    if(
      Math.abs(r - kr) +
      Math.abs(c - kc) === 1
    ){
      return true;
    }
  }

  return false;
}
function isMyHiddenCannonImmediatelyKillable(team, index){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  /* 가상의 내 포 */
  var fakeCannon = {
    team: team,
    type: 'cannon',
    name: '포',
    revealed: true
  };

  for(var i=0; i<board.length; i++){

    var enemyPiece = board[i];

    if(
      !enemyPiece ||
      !enemyPiece.revealed ||
      enemyPiece.team !== enemy
    ){
      continue;
    }

    /* 상대 포는 포 규칙으로 검사 */
    if(enemyPiece.type === 'cannon'){

      if(canCannon(i, index)){
        return true;
      }

      continue;
    }

    /* 나머지 상대 말 */
    if(
      canMove(i, index) &&
      canCapture(
        enemyPiece,
        fakeCannon
      )
    ){
      return true;
    }
  }

  return false;
}

/* =====================================================
   포가 나왔을 때 상대가 도망칠 수 없는지 검사

   cannonIndex:
   내 포가 나왔다고 가정할 숨은 칸

   targetIndex:
   현재 노리는 공개 상대 기물

   true  = 상대가 안전하게 도망갈 칸 없음
   false = 하나 이상 안전하게 피할 수 있음
===================================================== */

function isEnemyTrappedByPotentialCannon(
  team,
  cannonIndex,
  targetIndex
){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var target =
    board[targetIndex];

  if(
    !target ||
    !target.revealed ||
    target.team !== enemy
  ){
    return false;
  }


  /* 가상의 내 포 */
  var fakeCannon = {
    team:team,
    type:'cannon',
    name:'포',
    revealed:true
  };


  /* 숨은 알 자리에 내 포가 나왔다고 가정 */
  var oldCannonTile =
    board[cannonIndex];

  board[cannonIndex] =
    fakeCannon;


  var tr =
    Math.floor(targetIndex / 4);

  var tc =
    targetIndex % 4;

  var around = [
    [tr-1,tc],
    [tr+1,tc],
    [tr,tc-1],
    [tr,tc+1]
  ];

  var hasSafeEscape = false;


  for(var i=0; i<around.length; i++){

    var nr = around[i][0];
    var nc = around[i][1];

    if(
      nr < 0 || nr >= 8 ||
      nc < 0 || nc >= 4
    ){
      continue;
    }

    var to =
      nr * 4 + nc;

    var destination =
      board[to];


    /* 미오픈 알은 도망칸으로 보지 않음 */
    if(
      destination &&
      !destination.revealed
    ){
      continue;
    }


    /* 자기 팀 기물이 있으면 못 감 */
    if(
      destination &&
      destination.team === enemy
    ){
      continue;
    }


    /* 상대 기물이 있다면
       target이 실제로 잡을 수 있어야 함 */
    if(
      destination &&
      destination.team === team &&
      !canCapture(
        target,
        destination
      )
    ){
      continue;
    }


    if(
      !canMove(
        targetIndex,
        to
      )
    ){
      continue;
    }


    /* ===============================================
       상대가 그 자리로 도망갔다고 가정
    =============================================== */

    var oldTarget =
      board[targetIndex];

    var oldDestination =
      board[to];

    board[to] =
      target;

    board[targetIndex] =
      null;


    /* 가상 포가 도망간 상대를 계속 잡을 수 있는가 */
    var stillCannonDanger =
      canCannon(
        cannonIndex,
        to
      );


    /* 원상복구 */
    board[targetIndex] =
      oldTarget;

    board[to] =
      oldDestination;


    /* 포 공격에서 벗어나는 칸 하나라도 있으면
       완전 봉쇄 아님 */
    if(!stillCannonDanger){

      hasSafeEscape = true;
      break;
    }
  }


  /* 가상 포 제거 */
  board[cannonIndex] =
    oldCannonTile;


  return !hasSafeEscape;
}
/* =====================================================
   상대 왕을 노릴 포 후보 자리 찾기

   조건:
   1. 상대 왕이 공개되어 있어야 함
   2. 미오픈 알 중
      그 자리에서 내 포가 나온다고 가정했을 때
      상대 왕까지 중간 기물이 정확히 1개여야 함
   3. 실제 숨은 알의 team/type은 보지 않음

   반환:
   왕을 공격할 수 있는 포 후보가 있으면 reveal 행동
   없으면 null
===================================================== */

function masterAttackEnemyKingWithCannon(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var enemyKingIndex = -1;


  /* 공개된 상대 왕 찾기 */
  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      p &&
      p.revealed &&
      p.team === enemy &&
      p.type === 'king'
    ){
      enemyKingIndex = i;
      break;
    }
  }


  /* 상대 왕이 아직 공개되지 않았으면 종료 */
  if(enemyKingIndex === -1){
    return null;
  }


  var candidates = [];

  var kr =
    Math.floor(enemyKingIndex / 4);

  var kc =
    enemyKingIndex % 4;


  /* 모든 미오픈 알 검사 */
  for(var index=0;
      index<board.length;
      index++){

    var hidden =
      board[index];

    if(
      !hidden ||
      hidden.revealed
    ){
      continue;
    }


    var r =
      Math.floor(index / 4);

    var c =
      index % 4;


    /* 왕과 같은 가로/세로만 */
    if(
      r !== kr &&
      c !== kc
    ){
      continue;
    }


    var dr =
      Math.sign(kr-r);

    var dc =
      Math.sign(kc-c);

    var nr =
      r + dr;

    var nc =
      c + dc;

    var middleCount = 0;


    while(
      nr !== kr ||
      nc !== kc
    ){

      var middleIndex =
        nr * 4 + nc;

      if(board[middleIndex]){
        middleCount++;
      }

      nr += dr;
      nc += dc;
    }


    /* 포 공격 구조:
       중간 기물 정확히 하나 */
    if(middleCount !== 1){
      continue;
    }


    /* 중복 방지 */
    if(
      candidates.indexOf(index)
      === -1
    ){
      candidates.push(index);
    }
  }


  if(candidates.length === 0){
    return null;
  }


  return {
    type:'reveal',
    reason:'attackEnemyKingWithCannon',
    index:
      candidates[
        Math.floor(
          Math.random() *
          candidates.length
        )
      ]
  };
}
function masterCannonFirstAction(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';
/* 이미 내 포가 하나라도 공개되어 있으면
   새로운 포 찾기 1순위 행동은 하지 않는다 */
var myRevealedCannonCount = 0;

for(var i=0; i<board.length; i++){

  var p = board[i];

  if(
    p &&
    p.revealed &&
    p.team === team &&
    p.type === 'cannon'
  ){
    myRevealedCannonCount++;
  }
}

 /* =====================================================
   1순위
   상대 왕/사/차/상/마/졸이 공개되면

   숨은 알 전부 검사
   → 그중 실제 내 포인 알만 검사
   → 그 포와 상대 기물 사이에
      기물/알이 정확히 1개면
   → 그 포 알을 오픈
===================================================== */

var enemyTargets = {
  king:true,
  advisor:true,
  chariot:true,
  elephant:true,
  horse:true,
  soldier:true
};

var cannonSearchCandidates = [];
var trappedCannonCandidates = [];
var trappedCannonCandidates = [];
for(var z=0; z<board.length; z++){

  var testPiece = board[z];

  if(
    testPiece &&
    !testPiece.revealed &&
    testPiece.team === team &&
    testPiece.type === 'cannon'
  ){
    console.log('숨은 내 포 발견:', z);
  }
}
for(var targetIndex=0;
    targetIndex<board.length;
    targetIndex++){

  var target = board[targetIndex];

  if(
    !target ||
    !target.revealed ||
    target.team !== enemy ||
    !enemyTargets[target.type]
  ){
    continue;
  }

  var tr = Math.floor(targetIndex / 4);
  var tc = targetIndex % 4;

  for(var index=0;
      index<board.length;
      index++){

    var hidden = board[index];

/* 숨은 알이면 후보로 검사
   정체(team/type)는 절대 보지 않는다 */
if(
  !hidden ||
  hidden.revealed
){
  continue;
}

    var r = Math.floor(index / 4);
    var c = index % 4;

    /* 같은 가로/세로만 */
    if(
      r !== tr &&
      c !== tc
    ){
      continue;
    }

    var dr = Math.sign(tr-r);
    var dc = Math.sign(tc-c);

    var nr = r + dr;
    var nc = c + dc;

    var middleCount = 0;
var middleIsRevealedEnemy = false;

while(
  nr !== tr ||
  nc !== tc
){

  var middleIndex =
    nr * 4 + nc;

  var middlePiece =
    board[middleIndex];

  if(middlePiece){

    middleCount++;

    if(
      middlePiece.revealed &&
      middlePiece.team === enemy
    ){
      middleIsRevealedEnemy = true;
    }
  }

  nr += dr;
  nc += dc;
}
console.log(
  '포공격검사:',
  '포=', index,
  '상대=', targetIndex,
  '상대종류=', target.type,
  '중간개수=', middleCount
);
    
/* 중간에 정확히 하나만 있으면
       이 포가 상대 기물을 공격 가능 */
    if(middleCount === 1){
/* 상대 왕 바로 옆,앞뒤 미오픈 알은
   포 후보라도 절대 열지 않는다 */
if(
  isRevealAdjacentToEnemyKing(
    team,
    index
  )
){
  continue;
}
/* 왕 바로 옆 위험 칸이면
   포 찾기 후보에서도 제외 */
if(
  isRevealDangerousForKing(
    team,
    index
  )
){
  continue;
}
/* 이 후보칸에서 상대 포가 나오면
   내 공개 기물을 바로 잡을 수 있는 자리면 제외 */
if(
  isPotentialEnemyCannonDanger(
    team,
    index
  )
){
  continue;
}

/* 블루 왕/사/차/상/마 바로 옆이면
   포 찾겠다고 열지 않는다 */
if(
  team === 'red' &&
  isBadRevealNearBluePower(index)
){
  continue;
}
 /* 이 자리에서 내 포가 나와도
   상대에게 즉시 잡히면 포 후보에서 제외 */
if(
  isMyHiddenCannonImmediatelyKillable(
    team,
    index
  )
){
  continue;
}  
/* 이 포가 나오면 현재 상대가
   도망칠 안전한 칸이 없는가 */
if(
  isEnemyTrappedByPotentialCannon(
    team,
    index,
    targetIndex
  )
){

  if(
    trappedCannonCandidates.indexOf(index)
    === -1
  ){
    trappedCannonCandidates.push(index);
  }
}
   if(
        cannonSearchCandidates.indexOf(index)
        === -1
      ){
        cannonSearchCandidates.push(index);
      }
    }
  }
}

/* 상대 기물이 현재 자리에서 도망갈 빈칸이 없으면
   더 강한 포 후보로 따로 저장 */


console.log(
  '도망불가 포후보:',
  trappedCannonCandidates
);
console.log('1순위 포후보:', cannonSearchCandidates);
var validTrappedCannonCandidates =
  trappedCannonCandidates.filter(function(v){
    return (
      Number.isInteger(v) &&
      v >= 0 &&
      v < board.length
    );
  });

var finalCannonCandidates =
  validTrappedCannonCandidates.length > 0
  ? validTrappedCannonCandidates
  : cannonSearchCandidates;
if(
  finalCannonCandidates.length > 0 &&
  !board.some(function(p){
    return (
      p &&
      p.revealed &&
      p.team === team &&
      p.type === 'cannon'
    );
  })
){
  
return {
    type:'reveal',
    reason:'findRealCannonForEnemy',
   index:
  finalCannonCandidates[
    Math.floor(
      Math.random() *
      finalCannonCandidates.length
        )
      ]
  };
}



  /* =====================================================
     2순위
     상대 포가 공개되어 있으면
     상대 포 바로 주변의 숨은 알을 오픈
  ===================================================== */

  for(var i=0; i<board.length; i++){

    var enemyCannon = board[i];

    if(
      !enemyCannon ||
      !enemyCannon.revealed ||
      enemyCannon.team !== enemy ||
      enemyCannon.type !== 'cannon'
    ){
      continue;
    }

    var er = Math.floor(i / 4);
    var ec = i % 4;

    var around = [
      [er-1,ec],
      [er+1,ec],
      [er,ec-1],
      [er,ec+1]
    ];

    var aroundCandidates = [];

    for(var a=0; a<around.length; a++){

      var ar = around[a][0];
      var ac = around[a][1];

      if(
        ar < 0 || ar >= 8 ||
        ac < 0 || ac >= 4
      ){
        continue;
      }

      var aroundIndex =
        ar * 4 + ac;

      if(
        board[aroundIndex] &&
        !board[aroundIndex].revealed
      ){
        aroundCandidates.push(
          aroundIndex
        );
      }
    }


    if(aroundCandidates.length > 0){

      return {
        type:'reveal',
        reason:'enemyCannonAround',
        index:
          aroundCandidates[
            Math.floor(
              Math.random() *
              aroundCandidates.length
            )
          ]
      };
    }
  }



  /* =====================================================
     3순위
     내 포가 공개되어 있으면
     그 포가 공격할 수 있는 숨은 알을 오픈

     단:
     그 숨은 알이 공개된 내 기물 바로 옆이면 제외
  ===================================================== */

  var attackCandidates = [];

  for(var from=0;
      from<board.length;
      from++){

    var myCannon = board[from];

    if(
      !myCannon ||
      !myCannon.revealed ||
      myCannon.team !== team ||
      myCannon.type !== 'cannon'
    ){
      continue;
    }


    for(var to=0;
        to<board.length;
        to++){

      var hiddenTarget = board[to];

      if(
        !hiddenTarget ||
        hiddenTarget.revealed
      ){
        continue;
      }


      var fr = Math.floor(from / 4);
      var fc = from % 4;

      var tr2 = Math.floor(to / 4);
      var tc2 = to % 4;


      /* 같은 가로/세로만 */
      if(
        fr !== tr2 &&
        fc !== tc2
      ){
        continue;
      }


      var dr2 = Math.sign(tr2-fr);
      var dc2 = Math.sign(tc2-fc);

      var rr = fr + dr2;
      var cc = fc + dc2;

      var middleCount2 = 0;


      /* 내 포와 숨은 공격 알 사이에
         기물/알이 정확히 하나인지 검사 */
      while(
        rr !== tr2 ||
        cc !== tc2
      ){

        var middleIndex2 =
          rr * 4 + cc;

        if(board[middleIndex2]){
          middleCount2++;
        }

        rr += dr2;
        cc += dc2;
      }


      if(middleCount2 !== 1){
        continue;
      }


      /* 공개된 내 기물 바로 옆은 제외 */
      var nearMyPiece = false;

      for(var m=0;
          m<board.length;
          m++){

        var myPiece = board[m];

        if(
          !myPiece ||
          !myPiece.revealed ||
          myPiece.team !== team
        ){
          continue;
        }

        var mr = Math.floor(m / 4);
        var mc = m % 4;

        if(
          Math.abs(tr2-mr) +
          Math.abs(tc2-mc)
          === 1
        ){
          nearMyPiece = true;
          break;
        }
      }


      if(nearMyPiece){
        continue;
      }


      if(
        attackCandidates.indexOf(to)
        === -1
      ){
        attackCandidates.push(to);
      }
    }
  }


  if(attackCandidates.length > 0){

    return {
      type:'reveal',
      reason:'myCannonAttack',
      index:
        attackCandidates[
          Math.floor(
            Math.random() *
            attackCandidates.length
          )
        ]
    };
  }


  return null;
}
/* =========================================================
   포 한수 앞 보기
   상대를 잡았다고 가정한 뒤
   새 포 위치에서 공격할 숨은 알을 먼저 오픈
========================================================= */
function isMyCannonInDanger(team, cannonIndex){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      !p ||
      !p.revealed ||
      p.team !== enemy
    ){
      continue;
    }

    /* 상대 포가 내 포를 잡을 수 있는지 */
    if(
      p.type === 'cannon' &&
      canCannon(i, cannonIndex)
    ){
      return true;
    }

    /* 다른 상대 기물이 내 포를 잡을 수 있는지 */
    if(
      p.type !== 'cannon' &&
      canMove(i, cannonIndex) &&
      canCapture(p, board[cannonIndex])
    ){
      return true;
    }
  }

  return false;
}

function masterDangerCannonCapture(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var rank = {
    king:7,
    advisor:6,
    chariot:5,
    elephant:4,
    horse:3,
    cannon:2,
    soldier:1
  };

  var best = null;
  var bestRank = -1;

  for(var from=0; from<board.length; from++){

    var cannon = board[from];

    if(
      !cannon ||
      !cannon.revealed ||
      cannon.team !== team ||
      cannon.type !== 'cannon'
    ){
      continue;
    }

    /* 위험한 포만 */
    if(!isMyCannonInDanger(team, from)){
      continue;
    }

    for(var to=0; to<board.length; to++){

      var target = board[to];

      if(
        !target ||
        !target.revealed ||
        target.team !== enemy
      ){
        continue;
      }

      /* 이 포가 실제로 공격 가능한 상대만 */
      if(!canCannon(from, to)){
        continue;
      }

      if(rank[target.type] > bestRank){

        bestRank = rank[target.type];

        best = {
          type:'capture',
          reason:'dangerCannonCapture',
          from:from,
          to:to
        };
      }
    }
  }

  return best;
}
function masterCannonLookAheadReveal(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var candidates = [];


  /* 내 공개 포 찾기 */
  for(var from=0; from<board.length; from++){

    var cannon = board[from];

    if(
      !cannon ||
      !cannon.revealed ||
      cannon.team !== team ||
      cannon.type !== 'cannon'
    ){
      continue;
    }

/* 이 포가 현재 위험하면
   2차 공격구간을 더 열지 않는다 */
if(isMyCannonInDanger(team, from)){
  continue;
}
    /* 현재 포가 먹을 수 있는 상대 찾기 */
    for(var targetIndex=0;
        targetIndex<board.length;
        targetIndex++){

      var target = board[targetIndex];

      if(
        !target ||
        !target.revealed ||
        target.team !== enemy
      ){
        continue;
      }

      /* 현재 실제로 포가 잡을 수 있어야 함 */
      if(!canCannon(from,targetIndex)){
        continue;
      }


      /*
        여기부터는 실제 이동하지 않고

        from = 비었다고 가정
        targetIndex = 내 포가 있다고 가정
      */

      var newFrom = targetIndex;

      var fr = Math.floor(newFrom / 4);
      var fc = newFrom % 4;


      /* 새 포 자리에서 숨은 알 전부 검사 */
      for(var to=0; to<board.length; to++){

        var hidden = board[to];

        if(
          !hidden ||
          hidden.revealed ||
          to === from ||
          to === targetIndex
        ){
          continue;
        }

        var tr = Math.floor(to / 4);
        var tc = to % 4;


        /* 같은 가로/세로만 */
        if(
          fr !== tr &&
          fc !== tc
        ){
          continue;
        }

        var dr = Math.sign(tr-fr);
        var dc = Math.sign(tc-fc);

        var r = fr + dr;
        var c = fc + dc;

        var middleCount = 0;


        while(
          r !== tr ||
          c !== tc
        ){

          var index = r * 4 + c;

          /*
            원래 포 자리(from)는
            잡고 이동했으므로 빈칸으로 가정
          */
          if(
            index !== from &&
            board[index]
          ){
            middleCount++;
          }

          r += dr;
          c += dc;
        }


        /* 중간 기물/알 정확히 하나 */

var nearMyPiece = false;

var toRow = Math.floor(to / 4);
var toCol = to % 4;

for(var m=0; m<board.length; m++){

  var myPiece = board[m];

  if(
    !myPiece ||
    !myPiece.revealed ||
    myPiece.team !== team
  ){
    continue;
  }

  var mr = Math.floor(m / 4);
  var mc = m % 4;

  if(
    Math.abs(toRow - mr) +
    Math.abs(toCol - mc) === 1
  ){
    nearMyPiece = true;
    break;
  }
}

if(nearMyPiece){
  continue;
}
        if(middleCount === 1){

          if(
            candidates.indexOf(to)
            === -1
          ){
            candidates.push(to);
          }
        }
      }
    }
  }


  if(candidates.length === 0){
    return null;
  }


  return {
    type:'reveal',
    reason:'cannonLookAhead',
    index:
      candidates[
        Math.floor(
          Math.random() *
          candidates.length
        )
      ]
  };
}


/* =====================================================
   왕 바로 옆 숨은 알 오픈 위험 검사
===================================================== */
/* =====================================================
   최고 우선 왕 보호

   조건:
   1. 내 왕이 공개됨
   2. 현재 왕이 상하좌우 어디로도 이동/포획 불가능
   3. 상대 왕이 아직 생존
   4. 상대 졸이 1개 이상 생존

   위 조건이면
   왕 상하좌우 미오픈 알은 절대 오픈 금지
===================================================== */

function isLockedKingAdjacentRevealForbidden(team, revealIndex){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var kingIndex = -1;

  /* 공개된 내 왕 찾기 */
  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      p &&
      p.revealed &&
      p.team === team &&
      p.type === 'king'
    ){
      kingIndex = i;
      break;
    }
  }

  /* 내 왕이 아직 공개되지 않았으면 적용 안 함 */
  if(kingIndex === -1){
    return false;
  }


  /* =================================================
     상대 왕 / 졸 생존 여부

     숨은 알 정체는 보지 않고
     먹힌 말 기록만 사용
  ================================================= */

  var capturedEnemy =
    enemy === 'blue'
    ? capturedBlue
    : capturedRed;

  var enemyKingCaptured = false;
  var enemySoldierCapturedCount = 0;

  for(var c=0; c<capturedEnemy.length; c++){

    var captured =
      capturedEnemy[c];

    if(captured.type === 'king'){
      enemyKingCaptured = true;
    }

    if(captured.type === 'soldier'){
      enemySoldierCapturedCount++;
    }
  }

  /* 상대 왕이 이미 죽었으면 제한 해제 */
  if(enemyKingCaptured){
    return false;
  }

  /* 상대 졸 5마리가 모두 죽었으면 제한 해제 */
  if(enemySoldierCapturedCount >= 5){
    return false;
  }


  /* =================================================
     왕이 현재 실제로 이동 가능한지 검사

     빈칸 이동뿐 아니라
     바로 옆 상대 기물 포획도 포함
  ================================================= */

  var kr =
    Math.floor(kingIndex / 4);

  var kc =
    kingIndex % 4;

  var around = [
    [kr-1,kc],
    [kr+1,kc],
    [kr,kc-1],
    [kr,kc+1]
  ];

  var kingCanMove = false;

  for(var a=0; a<around.length; a++){

    var nr = around[a][0];
    var nc = around[a][1];

    if(
      nr < 0 || nr >= 8 ||
      nc < 0 || nc >= 4
    ){
      continue;
    }

    var to =
      nr * 4 + nc;

    var target =
      board[to];


    /* 빈칸 이동 가능 */
    if(target === null){

      if(canMove(kingIndex, to)){
        kingCanMove = true;
        break;
      }

      continue;
    }


    /* 미오픈 알은 왕을 막고 있음 */
    if(!target.revealed){
      continue;
    }


    /* 자기 기물도 막고 있음 */
    if(target.team === team){
      continue;
    }


    /* 상대 기물을 실제로 잡고 이동 가능 */
    if(
      canMove(kingIndex, to) &&
      canCapture(
        board[kingIndex],
        target
      )
    ){
      kingCanMove = true;
      break;
    }
  }


  /* 왕이 움직일 수 있으면 절대금지 규칙 발동 안 함 */
  if(kingCanMove){
    return false;
  }


  /* =================================================
     이제 revealIndex가
     왕 바로 상하좌우인지 검사
  ================================================= */

  var rr =
    Math.floor(revealIndex / 4);

  var rc =
    revealIndex % 4;

  var distance =
    Math.abs(kr - rr) +
    Math.abs(kc - rc);


  if(distance === 1){

    console.log(
      '👑 최고우선 왕 보호: 왕 옆 오픈 금지',
      '왕=', kingIndex,
      '금지칸=', revealIndex
    );

    return true;
  }

  return false;
}
function isRevealDangerousForKing(team, revealIndex){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var enemySoldierTotal = 5;
  var knownEnemySoldiers = 0;

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      p &&
      p.revealed &&
      p.team === enemy &&
      p.type === 'soldier'
    ){
      knownEnemySoldiers++;
    }
  }

  /* 상대 졸이 모두 공개됐다면
     숨은 상대 졸 가능성 없음 */
  if(knownEnemySoldiers >= enemySoldierTotal){
    return false;
  }

  /* 공개된 내 왕 찾기 */
  for(var k=0; k<board.length; k++){

    var king = board[k];

    if(
      !king ||
      !king.revealed ||
      king.team !== team ||
      king.type !== 'king'
    ){
      continue;
    }

    var kr = Math.floor(k / 4);
    var kc = k % 4;

    var rr = Math.floor(revealIndex / 4);
    var rc = revealIndex % 4;

    /* 왕 바로 상하좌우 */
    if(
      Math.abs(kr - rr) +
      Math.abs(kc - rc) === 1
    ){
      return true;
    }
  }

  return false;
}


/* =====================================================
   왕을 공격할 수 있는 상대 포 자리 오픈 위험 검사
===================================================== */

function isRevealCannonDangerForKing(team, revealIndex){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var revealedEnemyCannons = 0;

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      p &&
      p.revealed &&
      p.team === enemy &&
      p.type === 'cannon'
    ){
      revealedEnemyCannons++;
    }
  }

  /* 상대 포 2개가 모두 공개됐다면
     숨은 상대 포 가능성 없음 */
  if(revealedEnemyCannons >= 2){
    return false;
  }

  /* 공개된 내 왕 찾기 */
  for(var k=0; k<board.length; k++){

    var king = board[k];

    if(
      !king ||
      !king.revealed ||
      king.team !== team ||
      king.type !== 'king'
    ){
      continue;
    }

    var kr = Math.floor(k / 4);
    var kc = k % 4;

    var rr = Math.floor(revealIndex / 4);
    var rc = revealIndex % 4;

    /* 같은 가로/세로만 */
    if(
      kr !== rr &&
      kc !== rc
    ){
      continue;
    }

    var dr = Math.sign(rr - kr);
    var dc = Math.sign(rc - kc);

    var r = kr + dr;
    var c = kc + dc;

    var middleCount = 0;

    while(
      r !== rr ||
      c !== rc
    ){

      var index = r * 4 + c;

      if(board[index]){
        middleCount++;
      }

      r += dr;
      c += dc;
    }

    /* 이 알에서 상대 포가 나오면
       왕을 바로 공격할 수 있음 */
    if(middleCount === 1){
      return true;
    }
  }

  return false;
}


/* =====================================================
   왕/사를 공격할 수 있는
   상대 포 후보 자리 찾기

   숨은 알의 실제 team/type은 보지 않는다.
===================================================== */

function getKingAdvisorCannonThreatPositions(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var candidates = [];

  var revealedEnemyCannons = 0;

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      p &&
      p.revealed &&
      p.team === enemy &&
      p.type === 'cannon'
    ){
      revealedEnemyCannons++;
    }
  }

  /* 상대 포가 이미 전부 공개됨 */
  if(revealedEnemyCannons >= 2){
    return candidates;
  }

  /* 공개된 내 왕/사 찾기 */
  for(var targetIndex=0;
      targetIndex<board.length;
      targetIndex++){

    var target = board[targetIndex];

    if(
  !target ||
  !target.revealed ||
  target.team !== team ||
  target.type !== 'king'
){
  continue;
}

    var tr = Math.floor(targetIndex / 4);
    var tc = targetIndex % 4;

    /* 모든 미오픈 알 검사 */
    for(var index=0;
        index<board.length;
        index++){

      var hidden = board[index];

      if(
        !hidden ||
        hidden.revealed
      ){
        continue;
      }

      var r = Math.floor(index / 4);
      var c = index % 4;

      /* 같은 가로/세로만 */
      if(
        r !== tr &&
        c !== tc
      ){
        continue;
      }

      var dr = Math.sign(tr-r);
      var dc = Math.sign(tc-c);

      var nr = r + dr;
      var nc = c + dc;

      var middleCount = 0;

      while(
        nr !== tr ||
        nc !== tc
      ){

        var middleIndex =
          nr * 4 + nc;

        if(board[middleIndex]){
          middleCount++;
        }

        nr += dr;
        nc += dc;
      }

      /* 여기서 상대 포가 나오면
         왕/사를 공격 가능한 자리 */
      if(middleCount === 1){
/* 이 포 후보 자리 바로 옆에
   공개된 상대 강한 기물이 있으면 제외 */
var dangerNear = false;

var checkAround = [
  [r-1,c],
  [r+1,c],
  [r,c-1],
  [r,c+1]
];

for(var d=0; d<checkAround.length; d++){

  var dr3 = checkAround[d][0];
  var dc3 = checkAround[d][1];

  if(
    dr3 < 0 || dr3 >= 8 ||
    dc3 < 0 || dc3 >= 4
  ){
    continue;
  }

  var dangerIndex =
    dr3 * 4 + dc3;

  var dangerPiece =
    board[dangerIndex];

  if(
    !dangerPiece ||
    !dangerPiece.revealed ||
    dangerPiece.team !== enemy
  ){
    continue;
  }

  if(
    dangerPiece.type === 'king' ||
    dangerPiece.type === 'advisor' ||
    dangerPiece.type === 'chariot' ||
    dangerPiece.type === 'elephant' ||
    dangerPiece.type === 'horse'
  ){
    dangerNear = true;
    break;
  }
}

if(dangerNear){
  continue;
}
        if(
          candidates.indexOf(index)
          === -1
        ){
          candidates.push(index);
        }
      }
    }
  }

  return candidates;
}
/* =====================================================
   내 졸 바로 옆 미오픈 알 오픈 방지

   공개된 내 졸의 상하좌우 바로 옆에 있는
   미오픈 알은 위험한 오픈으로 판단한다.

   졸은 상대 왕을 잡을 수 있으므로
   가능하면 보존한다.
===================================================== */

function isRevealDangerousNearMySoldier(team, revealIndex){

  var r = Math.floor(revealIndex / 4);
  var c = revealIndex % 4;

  for(var i=0; i<board.length; i++){

    var soldier = board[i];

    if(
      !soldier ||
      !soldier.revealed ||
      soldier.team !== team ||
      soldier.type !== 'soldier'
    ){
      continue;
    }

    var sr = Math.floor(i / 4);
    var sc = i % 4;

    var distance =
      Math.abs(r - sr) +
      Math.abs(c - sc);

    /* 공개된 내 졸 바로 옆 */
    if(distance === 1){
      return true;
    }
  }

  return false;
}
/* =========================================================
   왕/사가 적 기물을 잡은 뒤 바로 죽는 수인지 판단
   true  = 잡아도 됨
   false = 잡지 말자
========================================================= */
/* =========================================================
   왕/사가 적 기물을 잡은 뒤 바로 죽는 수인지 판단

   true  = 잡아도 됨
   false = 잡으면 바로 죽으므로 잡지 않음
========================================================= */

function shouldKingAdvisorMakeCapture(attacker, target, targetIndex){

  /* 왕/사가 아니면 이 규칙 적용 안 함 */
  if(
    attacker.type !== 'king' &&
    attacker.type !== 'advisor'
  ){
    return true;
  }

  var team = attacker.team;

  /* 공격자의 현재 위치 찾기 */
  var fromIndex = board.indexOf(attacker);

  if(fromIndex === -1){
    return true;
  }

  /* 현재 상태 저장 */
  var oldTarget = board[targetIndex];

  /* 실제로 잡았다고 가정 */
  board[targetIndex] = attacker;
  board[fromIndex] = null;

  /* 잡은 자리에서 즉시 죽는지 검사 */
  var dangerous =
    isMyPieceInImmediateDanger(
      team,
      targetIndex
    );

  /* 반드시 원상복구 */
  board[fromIndex] = attacker;
  board[targetIndex] = oldTarget;

  /* 죽는 자리면 잡지 않는다 */
  if(dangerous){

    console.log(
      '🛡 왕/사 희생 공격 취소:',
      attacker.type,
      '→',
      target.type
    );

    return false;
  }

  return true;
}
function shouldKingAdvisorCaptureCannon(team, attackerIndex, cannonIndex){

  var attacker = board[attackerIndex];
  var cannon   = board[cannonIndex];

  if(
    !attacker ||
    !cannon
  ){
    return true;
  }


  /* 상대가 포가 아니면 일반 포획 */
  if(cannon.type !== 'cannon'){
    return true;
  }


  /* 왕/사만 특별 판단 */
  if(
    attacker.type !== 'king' &&
    attacker.type !== 'advisor'
  ){
    return true;
  }


  var attackerValue =
    aiValue[attacker.type] || 0;


  /* =====================================================
     1단계
     상대 포가 지금 바로 노리는
     내 기물 중 최고 가치 계산
  ===================================================== */

  var highestThreatenedValue = 0;

  for(var i=0; i<board.length; i++){

    var myPiece = board[i];

    if(
      !myPiece ||
      !myPiece.revealed ||
      myPiece.team !== team
    ){
      continue;
    }


    /* 포를 잡으려는 왕/사 자신은 제외 */
    if(i === attackerIndex){
      continue;
    }


    if(canCannon(cannonIndex, i)){

      var value =
        aiValue[myPiece.type] || 0;

      if(value > highestThreatenedValue){
        highestThreatenedValue = value;
      }
    }
  }


  /* =====================================================
     2단계
     포가 현재 내 말을 하나 잡고 이동한 뒤,
     그 새 자리에서 내 왕/사를 또 노릴 수 있는지 검사
  ===================================================== */

  var chainThreat = false;


  for(var firstTarget=0;
      firstTarget<board.length;
      firstTarget++){

    var victim =
      board[firstTarget];


    if(
      !victim ||
      !victim.revealed ||
      victim.team !== team
    ){
      continue;
    }


    /*
      왕/사 자신은 여기서 제외.
      지금 잡을지 판단 중인 바로 그 기물까지
      첫 먹이로 계산할 필요는 없음.
    */
    if(firstTarget === attackerIndex){
      continue;
    }


    /* 포가 지금 실제로 이 말을 먹을 수 있어야 함 */
    if(
      !canCannon(
        cannonIndex,
        firstTarget
      )
    ){
      continue;
    }


    /* ===============================================
       포가 victim을 먹고 이동했다고 가정
    =============================================== */

    var oldCannon =
      board[cannonIndex];

    var oldVictim =
      board[firstTarget];


    board[firstTarget] =
      oldCannon;

    board[cannonIndex] =
      null;


    /* 새 포 위치에서 내 공개 왕/사 검사 */
    for(var secondTarget=0;
        secondTarget<board.length;
        secondTarget++){

      var important =
        board[secondTarget];


      if(
        !important ||
        !important.revealed ||
        important.team !== team ||
        (
          important.type !== 'king' &&
          important.type !== 'advisor'
        )
      ){
        continue;
      }


      if(
        canCannon(
          firstTarget,
          secondTarget
        )
      ){

        chainThreat = true;

        break;
      }
    }


    /* 반드시 원상복구 */
    board[cannonIndex] =
      oldCannon;

    board[firstTarget] =
      oldVictim;


    if(chainThreat){
      break;
    }
  }


  /* =====================================================
     연쇄적으로 왕/사를 노릴 수 있으면
     지금 포를 제거한다.
  ===================================================== */

  if(chainThreat){

    console.log(
      '🚨 포 연쇄위협 발견 - 왕/사가 포 제거'
    );

    return true;
  }


  /* =====================================================
     연쇄위협이 없으면 가치 비교

     포가 노리는 최고 가치가
     왕/사 자신의 가치보다 낮으면
     굳이 포를 잡지 않는다.
  ===================================================== */

  if(
    highestThreatenedValue <
    attackerValue
  ){

    console.log(
      '🛑 왕/사 포 공격 보류:',
      attacker.name,
      '가치=',
      attackerValue,
      '포가 노리는 최고가치=',
      highestThreatenedValue
    );

    return false;
  }


  /* 자기만큼 중요한 기물을 지켜야 하면 포 제거 */
  return true;
}

/* =====================================================
   AI 전체 행동 결정
===================================================== */
/* =====================================================
   왕/사를 노릴 수 있는 포 후보 자리의
   상하좌우 미오픈 알 찾기
===================================================== */

function getKingAdvisorDefenseRevealCandidates(team){

  var threatPositions =
    getKingAdvisorCannonThreatPositions(team);

  var candidates = [];

  for(var i=0; i<threatPositions.length; i++){

    var pos = threatPositions[i];

    var r = Math.floor(pos / 4);
    var c = pos % 4;

    var around = [
      [r-1,c],
      [r+1,c],
      [r,c-1],
      [r,c+1]
    ];

    for(var a=0; a<around.length; a++){

      var nr = around[a][0];
      var nc = around[a][1];

      /* 보드 밖 제외 */
      if(
        nr < 0 || nr >= 8 ||
        nc < 0 || nc >= 4
      ){
        continue;
      }

      var index =
        nr * 4 + nc;

      var hidden =
        board[index];

      /* 미오픈 알만 */
      if(
        !hidden ||
        hidden.revealed
      ){
        continue;
      }
/* =====================================================
   열려고 하는 알 바로 옆에
   공개된 상대 강한 기물이 있으면 제외
===================================================== */

var enemy =
  team === 'red' ? 'blue' : 'red';

var dangerousEnemyNear = false;

var checkAround = [
  [nr-1,nc],
  [nr+1,nc],
  [nr,nc-1],
  [nr,nc+1]
];

for(var d=0; d<checkAround.length; d++){

  var dr = checkAround[d][0];
  var dc = checkAround[d][1];

  if(
    dr < 0 || dr >= 8 ||
    dc < 0 || dc >= 4
  ){
    continue;
  }

  var dangerIndex =
    dr * 4 + dc;

  var enemyPiece =
    board[dangerIndex];

  if(
    !enemyPiece ||
    !enemyPiece.revealed ||
    enemyPiece.team !== enemy
  ){
    continue;
  }

  /*
    공개된 상대 강한 기물.
    일단 왕/사/차/상/마를 위험 기물로 본다.
    포는 별도 공격방식이라 여기서는 제외.
    졸도 여기서는 제외.
  */
  if(
    enemyPiece.type === 'king' ||
    enemyPiece.type === 'advisor' ||
    enemyPiece.type === 'chariot' ||
    enemyPiece.type === 'elephant' ||
    enemyPiece.type === 'horse'
  ){
    dangerousEnemyNear = true;
    break;
  }
}

if(dangerousEnemyNear){
  continue;
}
      /* 중복 제외 */
      if(
        candidates.indexOf(index)
        === -1
      ){
        candidates.push(index);
      }
    }
  }

  return candidates;
}

/* =====================================================
   사 기본 행동

   공개된 내 사가 있으면
   바로 상하좌우의 미오픈 알을 우선 오픈

   중요:
   미오픈 알의 실제 team/type은 보지 않는다.
===================================================== */

function masterAdvisorFirstAction(team){


  var enemy =
    team === 'red' ? 'blue' : 'red';

  var revealedCount = 0;
  var enemyKingAdvisorRevealed = 0;

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(!p){
      continue;
    }

    if(p.revealed){
      revealedCount++;
    }

    if(
      p.revealed &&
      p.team === enemy &&
      (
        p.type === 'king' ||
        p.type === 'advisor'
      )
    ){
      enemyKingAdvisorRevealed++;
    }
  }

  /* 기물이 많이 공개됐는데
     상대 왕/사 3개가 아직 하나도 안 나왔다면
     사의 공격적 주변 오픈 중지 */
  if(
    totalActionCount >= 10 &&
    enemyKingAdvisorRevealed === 0
  ){
    return null;
  }

  var candidates = [];



  /* 공개된 내 사 찾기 */
  for(var i=0; i<board.length; i++){

    var advisor = board[i];

    if(
      !advisor ||
      !advisor.revealed ||
      advisor.team !== team ||
      advisor.type !== 'advisor'
    ){
      continue;
    }

    var r = Math.floor(i / 4);
    var c = i % 4;

    var around = [
      [r-1,c],
      [r+1,c],
      [r,c-1],
      [r,c+1]
    ];

    /* 사 주변 검사 */
    for(var a=0; a<around.length; a++){

      var nr = around[a][0];
      var nc = around[a][1];

      /* 보드 밖 제외 */
      if(
        nr < 0 || nr >= 8 ||
        nc < 0 || nc >= 4
      ){
        continue;
      }

      var index =
        nr * 4 + nc;

      var hidden =
        board[index];

      /* 미오픈 알만 */
      if(
        !hidden ||
        hidden.revealed
      ){
        continue;
      }

      /* 중복 방지 */
      if(
        candidates.indexOf(index)
        === -1
      ){
        candidates.push(index);
      }
    }
  }


  if(candidates.length === 0){
    return null;
  }


  return {
    type:'reveal',
    reason:'advisorAggressiveReveal',
    index:
      candidates[
        Math.floor(
          Math.random() *
          candidates.length
        )
      ]
  };
}
/* =====================================================
   차 / 포 / 마 공격적 주변 오픈

   공개된 내 차·포·마 바로 주변의
   미오픈 알을 적극적으로 오픈한다.

   숨은 알의 실제 team/type은 절대 보지 않는다.
===================================================== */

function masterChariotCannonHorseReveal(team){

  var candidates = [];
  /* =====================================================
     상대 포가 하나라도 아직 미오픈이면
     차 / 포 / 마 주변 공격적 오픈을 하지 않는다
  ===================================================== */

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var revealedEnemyCannons = 0;

  for(var e=0; e<board.length; e++){

    var enemyPiece = board[e];

    if(
      enemyPiece &&
      enemyPiece.revealed &&
      enemyPiece.team === enemy &&
      enemyPiece.type === 'cannon'
    ){
      revealedEnemyCannons++;
    }
  }

  /* 상대 포는 총 2개.
     2개가 모두 공개되기 전까지 이 행동 금지 */
  if(revealedEnemyCannons < 2){
    return null;
  }
  for(var i=0; i<board.length; i++){

    var piece = board[i];

    if(
      !piece ||
      !piece.revealed ||
      piece.team !== team
    ){
      continue;
    }

    /* 차 / 포 / 마만 */
    if(
      piece.type !== 'chariot' &&
      piece.type !== 'cannon' &&
      piece.type !== 'horse'
    ){
      continue;
    }

    var r = Math.floor(i / 4);
    var c = i % 4;

    var around = [
      [r-1,c],
      [r+1,c],
      [r,c-1],
      [r,c+1]
    ];

    for(var a=0; a<around.length; a++){

      var nr = around[a][0];
      var nc = around[a][1];

      /* 보드 밖 제외 */
      if(
        nr < 0 || nr >= 8 ||
        nc < 0 || nc >= 4
      ){
        continue;
      }

      var index =
        nr * 4 + nc;

      var hidden = board[index];

      /* 미오픈 알만 */
      if(
        !hidden ||
        hidden.revealed
      ){
        continue;
      }

      /* 중복 제외 */

/* 이 칸에서 상대 포가 나오면
   내 공개 기물이 포 공격을 받을 수 있으면 제외 */
if(
  isPotentialEnemyCannonDanger(
    team,
    index
  )
){
  continue;
}
      if(
        candidates.indexOf(index)
        === -1
      ){
        candidates.push(index);
      }
    }
  }

  if(candidates.length === 0){
    return null;
  }

  return {
    type:'reveal',
    reason:'chariotCannonHorseAggressiveReveal',
    index:
      candidates[
        Math.floor(
          Math.random() *
          candidates.length
        )
      ]
  };
}
/* =====================================================
   AI 전체 행동 점수 계산

   지금은 뼈대만 만든다.
   아직 기존 AI 행동에는 영향 없음.
===================================================== */

function scoreMasterAction(action, team){

  if(!action){
    return -9999;
  }

  var score = 0;


  /* =====================================================
     위험한 포의 즉시 공격

     masterDangerCannonCapture가 만든 행동이면
     최상급 점수를 준다.
  ===================================================== */

  if(
    action.reason === 'dangerCannonCapture'
  ){
    score += 150;
  }
/* 안전한 포의 2차 공격 준비 */
if(
  action.reason === 'cannonLookAhead'
){
  score += 80;
}
/* 사 주변 공격적 오픈 */
if(
  action.reason === 'advisorAggressiveReveal'
){
  score += 60;
}
/* 차 / 포 / 마 주변 공격적 오픈 */
if(
  action.reason === 'chariotCannonHorseAggressiveReveal'
){
  score += 55;
}
  return score;
}

/* =====================================================
   AI 후보 중 가장 점수가 높은 행동 선택
===================================================== */

function pickBestMasterCandidate(candidates, team){

  if(
    !candidates ||
    candidates.length === 0
  ){
    return null;
  }

  var bestAction = null;
  var bestScore = -999999;

  for(var i=0; i<candidates.length; i++){

    var action = candidates[i];

    var score =
      scoreMasterAction(
        action,
        team
      );

    if(score > bestScore){

      bestScore = score;
      bestAction = action;
    }
  }

  return bestAction;
}

/* =====================================================
   내 기물이 지금 즉시 잡힐 위험인지 검사

   왕 / 사 / 차 / 상 / 마 / 포 / 졸 공통

   true  = 상대가 지금 바로 잡을 수 있음
   false = 당장 잡힐 위험 없음
===================================================== */

function isMyPieceInImmediateDanger(team, pieceIndex){

  var myPiece = board[pieceIndex];

  if(
    !myPiece ||
    !myPiece.revealed ||
    myPiece.team !== team
  ){
    return false;
  }

  var enemy =
    team === 'red' ? 'blue' : 'red';


  for(var i=0; i<board.length; i++){

    var enemyPiece = board[i];

    if(
      !enemyPiece ||
      !enemyPiece.revealed ||
      enemyPiece.team !== enemy
    ){
      continue;
    }


    /* 상대 포 */
    if(enemyPiece.type === 'cannon'){

      if(canCannon(i, pieceIndex)){
        return true;
      }

      continue;
    }


    /* 나머지 상대 기물 */
    if(
      canMove(i, pieceIndex) &&
      canCapture(
        enemyPiece,
        myPiece
      )
    ){
      return true;
    }
  }


  return false;
}

/* =====================================================
   현재 즉시 위험에 빠진 내 사 찾기

   반환:
   위험한 사가 있으면 그 위치 index
   없으면 -1
===================================================== */

function findDangerAdvisor(team){

  for(var i=0; i<board.length; i++){

    var piece = board[i];

    /* 공개된 내 사만 검사 */
    if(
      !piece ||
      !piece.revealed ||
      piece.team !== team ||
      piece.type !== 'advisor'
    ){
      continue;
    }

    /* 상대에게 지금 바로 잡힐 수 있는가 */
    if(
      isMyPieceInImmediateDanger(
        team,
        i
      )
    ){
      return i;
    }
  }

  return -1;
}

function findDangerKing(team){

  for(var i=0; i<board.length; i++){

    var piece = board[i];

    if(
      !piece ||
      !piece.revealed ||
      piece.team !== team ||
      piece.type !== 'king'
    ){
      continue;
    }

    if(
      isMyPieceInImmediateDanger(
        team,
        i
      )
    ){
      return i;
    }
  }

  return -1;
}
function getBoardSituation(team){

  var dangerKing =
    findDangerKing(team);

  var situation = {

    /* 현재 내 왕이 즉시 위험한가 */
    kingInDanger:
      dangerKing !== -1,

    /* 위험한 왕의 위치 */
    dangerKingIndex:
      dangerKing

  };

  console.log(
    '🧠 현재 판 상황:',
    situation
  );

  return situation;
}
function findSafeKingEscape(team, from){

  var king = board[from];

  if(
    !king ||
    !king.revealed ||
    king.team !== team ||
    king.type !== 'king'
  ){
    return null;
  }

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var r = Math.floor(from / 4);
  var c = from % 4;

  var around = [
    [r-1,c],
    [r+1,c],
    [r,c-1],
    [r,c+1]
  ];

  var safeMoves = [];

  for(var i=0; i<around.length; i++){

    var nr = around[i][0];
    var nc = around[i][1];

    if(
      nr < 0 || nr >= 8 ||
      nc < 0 || nc >= 4
    ){
      continue;
    }

    var to = nr * 4 + nc;
    var target = board[to];

    /* 아군 있으면 못 감 */
    if(
      target &&
      target.team === team
    ){
      continue;
    }

    /* 미오픈 알도 못 감 */
    if(
      target &&
      !target.revealed
    ){
      continue;
    }

    /* 상대 기물이면 실제 왕이 먹을 수 있어야 함 */
    if(
      target &&
      target.team === enemy &&
      !canCapture(
        king,
        target
      )
    ){
      continue;
    }

    if(!canMove(from,to)){
      continue;
    }

    var oldTarget = board[to];

    board[to] = king;
    board[from] = null;

    var dangerous =
      isMyPieceInImmediateDanger(
        team,
        to
      );

    board[from] = king;
    board[to] = oldTarget;

    if(dangerous){
      continue;
    }

    safeMoves.push({
      to:to,
      targetValue:
        target
        ? (aiValue[target.type] || 0)
        : 0
    });
  }

  if(safeMoves.length === 0){
    return null;
  }

  /* 일단 먹을 수 있는 강한 기물 우선 */
  safeMoves.sort(function(a,b){
    return b.targetValue - a.targetValue;
  });

  return {
    type:'move',
    reason:'kingEscape',
    from:from,
    to:safeMoves[0].to
  };
}
/* =====================================================
   위험한 사의 안전한 도망 자리 찾기

   상하좌우 한 칸 중
   1. 빈칸이어야 하고
   2. 실제 이동 가능해야 하고
   3. 이동 후 상대에게 즉시 잡히지 않는 자리만 선택
===================================================== */

function findSafeAdvisorEscape(team, from){

  var advisor = board[from];

  if(
    !advisor ||
    !advisor.revealed ||
    advisor.team !== team ||
    advisor.type !== 'advisor'
  ){
    return null;
  }

  var r = Math.floor(from / 4);
  var c = from % 4;

  var around = [
    [r-1,c],
    [r+1,c],
    [r,c-1],
    [r,c+1]
  ];

  var safeMoves = [];

  for(var i=0; i<around.length; i++){

    var nr = around[i][0];
    var nc = around[i][1];

    /* 보드 밖 제외 */
    if(
      nr < 0 || nr >= 8 ||
      nc < 0 || nc >= 4
    ){
      continue;
    }

    var to = nr * 4 + nc;

    /* 빈칸으로만 도망 */
    if(board[to]){
      continue;
    }

    if(!canMove(from, to)){
      continue;
    }


    /* ===============================================
       실제 이동한 것처럼 잠깐 가정해서
       새 자리의 위험 여부 검사
    =============================================== */

    board[to] = advisor;
    board[from] = null;

    var dangerous =
      isMyPieceInImmediateDanger(
        team,
        to
      );

    /* 원상복구 */
    board[from] = advisor;
    board[to] = null;


    if(!dangerous){
      safeMoves.push(to);
    }
  }


  if(safeMoves.length === 0){
    return null;
  }


  return {
    type:'move',
    reason:'advisorEscapeDanger',
    from:from,
    to:
      safeMoves[
        Math.floor(
          Math.random() *
          safeMoves.length
        )
      ]
  };
}

/* =====================================================
   상대 포 압박 대응

   상대 공개 포가 현재 내 공개 기물을
   바로 잡을 수 있는 상태라면

   그 내 기물의 상하좌우 미오픈 알을
   우선 오픈 후보로 만든다.

   왕도 예외 아님.
   숨은 알의 실제 team/type은 보지 않는다.
===================================================== */

function masterPressureEnemyCannon(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var candidates = [];


  /* 상대 공개 포 찾기 */
  for(var cannonIndex=0;
      cannonIndex<board.length;
      cannonIndex++){

    var enemyCannon =
      board[cannonIndex];

    if(
      !enemyCannon ||
      !enemyCannon.revealed ||
      enemyCannon.team !== enemy ||
      enemyCannon.type !== 'cannon'
    ){
      continue;
    }


    /* 그 포가 현재 잡을 수 있는
       내 공개 기물 찾기 */
    for(var targetIndex=0;
        targetIndex<board.length;
        targetIndex++){

      var myPiece =
        board[targetIndex];

      if(
        !myPiece ||
        !myPiece.revealed ||
        myPiece.team !== team
      ){
        continue;
      }


      /* 상대 포가 지금 실제로
         이 기물을 잡을 수 있어야 함 */
      if(
        !canCannon(
          cannonIndex,
          targetIndex
        )
      ){
        continue;
      }


      var r =
        Math.floor(targetIndex / 4);

      var c =
        targetIndex % 4;

      var around = [
        [r-1,c],
        [r+1,c],
        [r,c-1],
        [r,c+1]
      ];


      /* 공격받는 내 기물 주변의
         미오픈 알 수집 */
      for(var a=0;
          a<around.length;
          a++){

        var nr = around[a][0];
        var nc = around[a][1];

        if(
          nr < 0 || nr >= 8 ||
          nc < 0 || nc >= 4
        ){
          continue;
        }

        var index =
          nr * 4 + nc;

        var hidden =
          board[index];

        if(
          !hidden ||
          hidden.revealed
        ){
          continue;
        }

        if(
          candidates.indexOf(index)
          === -1
        ){
          candidates.push(index);
        }
      }
    }
  }


  if(candidates.length === 0){
    return null;
  }


  return {
    type:'reveal',
    reason:'pressureEnemyCannon',
    index:
      candidates[
        Math.floor(
          Math.random() *
          candidates.length
        )
      ]
  };
}

/* =====================================================
   상대 포 제거용 주변 오픈

   상대 공개 포 주변의 미오픈 알 중에서
   바로 옆에 공개된 상대 강한 말이 없는
   안전한 후보를 우선 선택한다.

   안전 후보가 하나도 없으면
   위험 후보 중 하나를 선택한다.
===================================================== */
/* =====================================================
   공개된 상대 포를 지금 바로 잡을 수 있으면 우선 제거

   왕/사/차/상/마/졸 모두 가능
   단, 실제 잡기 규칙을 통과해야 함
===================================================== */

function masterCaptureEnemyCannonFirst(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var best = null;
  var bestValue = -1;

  for(var from=0; from<board.length; from++){

    var attacker = board[from];

    if(
      !attacker ||
      !attacker.revealed ||
      attacker.team !== team
    ){
      continue;
    }

    for(var to=0; to<board.length; to++){

      var target = board[to];

      if(
        !target ||
        !target.revealed ||
        target.team !== enemy ||
        target.type !== 'cannon'
      ){
        continue;
      }

      if(
        !canMove(from,to) ||
        !canCapture(attacker,target)
      ){
        continue;
      }

      /* 왕/사는 기존 특수 판단도 적용 */
      if(
        (
          attacker.type === 'king' ||
          attacker.type === 'advisor'
        ) &&
        !shouldKingAdvisorCaptureCannon(
          team,
          from,
          to
        )
      ){
        continue;
      }

      var value =
        aiValue[attacker.type] || 0;

      /*
        같은 포를 여러 기물이 잡을 수 있으면
        너무 중요한 말보다 싼 말로 잡는 쪽 우선
      */
      if(
        best === null ||
        value < bestValue
      ){
        bestValue = value;

        best = {
          type:'capture',
          reason:'captureEnemyCannonFirst',
          from:from,
          to:to
        };
      }
    }
  }

  return best;
}
function masterOpenAroundEnemyCannonSafely(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var safeCandidates = [];
  var riskyCandidates = [];


  /* 상대 공개 포 찾기 */
  for(var i=0; i<board.length; i++){

    var cannon = board[i];

    if(
      !cannon ||
      !cannon.revealed ||
      cannon.team !== enemy ||
      cannon.type !== 'cannon'
    ){
      continue;
    }

    var r = Math.floor(i / 4);
    var c = i % 4;

    var around = [
      [r-1,c],
      [r+1,c],
      [r,c-1],
      [r,c+1]
    ];


    /* 포 주변 미오픈 알 검사 */
    for(var a=0; a<around.length; a++){

      var nr = around[a][0];
      var nc = around[a][1];

      if(
        nr < 0 || nr >= 8 ||
        nc < 0 || nc >= 4
      ){
        continue;
      }

      var index =
        nr * 4 + nc;

      var hidden =
        board[index];

      if(
        !hidden ||
        hidden.revealed
      ){
        continue;
      }


      /* 이 알 바로 옆에
         공개된 상대 강한 말이 있는지 검사 */
      var dangerNear = false;

      var check = [
        [nr-1,nc],
        [nr+1,nc],
        [nr,nc-1],
        [nr,nc+1]
      ];

      for(var d=0; d<check.length; d++){

        var cr = check[d][0];
        var cc = check[d][1];

        if(
          cr < 0 || cr >= 8 ||
          cc < 0 || cc >= 4
        ){
          continue;
        }

        var dangerIndex =
          cr * 4 + cc;

        var p =
          board[dangerIndex];

        if(
          !p ||
          !p.revealed ||
          p.team !== enemy
        ){
          continue;
        }

        /*
          포 주변 오픈 방해가 되는
          공개 상대 기물
        */
        if(
          p.type === 'king' ||
          p.type === 'advisor' ||
          p.type === 'chariot' ||
          p.type === 'elephant' ||
          p.type === 'horse'
        ){
          dangerNear = true;
          break;
        }
      }


      if(dangerNear){

        if(
          riskyCandidates.indexOf(index)
          === -1
        ){
          riskyCandidates.push(index);
        }

      }
      else{

        if(
          safeCandidates.indexOf(index)
          === -1
        ){
          safeCandidates.push(index);
        }
      }
    }
  }


  /* 안전 후보가 있으면 무조건 안전 후보 우선 */
  if(safeCandidates.length > 0){

    return {
      type:'reveal',
      reason:'openAroundEnemyCannonSafe',
      index:
        safeCandidates[
          Math.floor(
            Math.random() *
            safeCandidates.length
          )
        ]
    };
  }


  


  return null;
}

/* =====================================================
   강한 상대 기물에게 바로 공격받지 않는
   안전한 미오픈 알 찾기
===================================================== */

function masterSafeGeneralReveal(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var safeCandidates = [];

  for(var index=0; index<board.length; index++){

    var hidden = board[index];

    /* 미오픈 알만 */
    if(
      !hidden ||
      hidden.revealed
    ){
      continue;
    }

    var dangerous = false;


    /* 공개된 상대 기물 전부 검사 */
    for(var i=0; i<board.length; i++){

      var enemyPiece = board[i];

      if(
        !enemyPiece ||
        !enemyPiece.revealed ||
        enemyPiece.team !== enemy
      ){
        continue;
      }

      /*
        일단 강한 기물만 위험 대상으로 본다.
        왕 / 사 / 차 / 상 / 마
      */
      if(
        enemyPiece.type !== 'king' &&
        enemyPiece.type !== 'advisor' &&
        enemyPiece.type !== 'chariot' &&
        enemyPiece.type !== 'elephant' &&
        enemyPiece.type !== 'horse'
      ){
        continue;
      }

      /*
        이 미오픈 알 자리에 내 기물이 나왔다고 가정했을 때
        상대가 바로 한 칸 공격할 수 있는 위치인지 확인
      */
      if(canMove(i, index)){

        dangerous = true;
        break;
      }
    }


   if(dangerous){
  continue;
}

/* 여기서 상대 포가 나오면
   내 기물이 포에게 공격당하는 자리인지 검사 */
if(
  isPotentialEnemyCannonDanger(
    team,
    index
  )
){
  continue;
}

safeCandidates.push(index);
  }


  if(safeCandidates.length === 0){
    return null;
  }


  return {
    type:'reveal',
    reason:'safeGeneralReveal',
    index:
      safeCandidates[
        Math.floor(
          Math.random() *
          safeCandidates.length
        )
      ]
  };
}
/* =====================================================
   갇힌 사의 공간 확보

   사 주변에 빈칸이 하나도 없으면
   사를 막고 있는 아군 기물 중 하나를
   안전한 빈칸으로 이동시켜 공간을 만든다.

   차/포/마/상/졸/왕 등 종류 상관없이 적용.
===================================================== */

function masterFreeAdvisorSpace(team){

  var moveCandidates = [];


  /* 공개된 내 사 찾기 */
  for(var advisorIndex=0;
      advisorIndex<board.length;
      advisorIndex++){

    var advisor =
      board[advisorIndex];

    if(
      !advisor ||
      !advisor.revealed ||
      advisor.team !== team ||
      advisor.type !== 'advisor'
    ){
      continue;
    }

    var ar =
      Math.floor(advisorIndex / 4);

    var ac =
      advisorIndex % 4;

    var aroundAdvisor = [
      [ar-1,ac],
      [ar+1,ac],
      [ar,ac-1],
      [ar,ac+1]
    ];


    /* 사 주변에 현재 빈칸이 있는지 확인 */
    var hasEmptySpace = false;

    for(var a=0;
        a<aroundAdvisor.length;
        a++){

      var rr =
        aroundAdvisor[a][0];

      var cc =
        aroundAdvisor[a][1];

      if(
        rr < 0 || rr >= 8 ||
        cc < 0 || cc >= 4
      ){
        continue;
      }

      var nearIndex =
        rr * 4 + cc;

      if(!board[nearIndex]){
        hasEmptySpace = true;
        break;
      }
    }


    /* 이미 움직일 빈칸이 있으면
       굳이 다른 아군을 비키게 하지 않음 */
    if(hasEmptySpace){
      continue;
    }


    /* =================================================
       사 옆을 막고 있는 아군 기물 검사
    ================================================= */

    for(var b=0;
        b<aroundAdvisor.length;
        b++){

      var br =
        aroundAdvisor[b][0];

      var bc =
        aroundAdvisor[b][1];

      if(
        br < 0 || br >= 8 ||
        bc < 0 || bc >= 4
      ){
        continue;
      }

      var blockerIndex =
        br * 4 + bc;

      var blocker =
        board[blockerIndex];


      /* 공개된 내 기물만 */
      if(
        !blocker ||
        !blocker.revealed ||
        blocker.team !== team
      ){
        continue;
      }


      /* 막고 있는 기물이 이동할
         빈칸 찾기 */
      for(var to=0;
          to<board.length;
          to++){

        /* 빈칸만 */
        if(board[to]){
          continue;
        }

        /* 실제 이동 가능한 곳만 */
        if(
          !canMove(
            blockerIndex,
            to
          )
        ){
          continue;
        }


        /* =============================================
           실제로 이동했다고 잠깐 가정해서
           그 기물이 새 자리에서 죽는지 검사
        ============================================= */

        board[to] = blocker;
        board[blockerIndex] = null;

        var dangerous =
          isMyPieceInImmediateDanger(
            team,
            to
          );

        /* 원상복구 */
        board[blockerIndex] = blocker;
        board[to] = null;


        /* 이동하자마자 죽는 곳이면 제외 */
        if(dangerous){
          continue;
        }


        moveCandidates.push({
          type:'move',
          reason:'freeAdvisorSpace',
          from:blockerIndex,
          to:to
        });
      }
    }
  }


  if(moveCandidates.length === 0){
    return null;
  }


  return moveCandidates[
    Math.floor(
      Math.random() *
      moveCandidates.length
    )
  ];
}

/* =====================================================
   상대 포가 아직 하나도 공개되지 않았는지 검사
===================================================== */

function hasNoRevealedEnemyCannon(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      p &&
      p.revealed &&
      p.team === enemy &&
      p.type === 'cannon'
    ){
      return false;
    }
  }

  return true;
}


/* =====================================================
   사가 상대를 잡고 이동했을 때
   주변에 빠져나갈 빈칸이 남는지 검사

   true  = 잡은 뒤 탈출 공간 있음
   false = 잡은 뒤 완전히 갇힘
===================================================== */

function advisorHasEscapeAfterCapture(
  team,
  from,
  to
){

  var advisor =
    board[from];

  var target =
    board[to];

  if(
    !advisor ||
    advisor.type !== 'advisor'
  ){
    return true;
  }


  /* 실제로 먹었다고 잠깐 가정 */
  board[to] = advisor;
  board[from] = null;


  var r =
    Math.floor(to / 4);

  var c =
    to % 4;

  var around = [
    [r-1,c],
    [r+1,c],
    [r,c-1],
    [r,c+1]
  ];

  var escapeCount = 0;


  for(var i=0; i<around.length; i++){

    var nr = around[i][0];
    var nc = around[i][1];

    if(
      nr < 0 || nr >= 8 ||
      nc < 0 || nc >= 4
    ){
      continue;
    }

    var index =
      nr * 4 + nc;


    /* 빈칸이 있어야 도망 가능 */
    if(board[index] !== null){
      continue;
    }

    if(
      canMove(
        to,
        index
      )
    ){
      escapeCount++;
    }
  }


  /* 반드시 원상복구 */
  board[from] = advisor;
  board[to] = target;


  return escapeCount > 0;
}

function getActionPriority(type, team, action) {

    var score = 0;

    // 나중에 여기서 행동 종류별 점수를 계산한다.
console.log(
  '🧠 우선순위 계산:',
  'type=', type,
  'action=', action
);
    switch (type) {

        case 'kingEscape':
            score += 10000;
            break;

        case 'attackEnemyKing':
            score += 5000;
            break;

        case 'trappedCannonAttack':
            score += 4000;
            break;

        case 'captureDangerousPiece':
            score += 3000;
            break;

        case 'saveAdvisor':
            score += 2500;
            break;

        case 'captureStrongPiece':
            score += 1500;
            break;

        case 'openAdvisorSpace':
            score += 1000;
            break;

        case 'reveal':
            score += 200;
            break;
    }

    return score;
}

/* =====================================================
   AI 금지 행동 판정

   현재는 reveal 행동만 검사한다.

   핵심:
   내 왕과 같은 가로/세로에 있는 미오픈 칸 중,
   왕과 그 칸 사이에 기물/알이 정확히 1개라면
   그 칸에서 상대 포가 나올 경우 왕이 바로 공격받는다.

   따라서 상대 포가 아직 남아 있는 동안
   그런 reveal은 후보에서 제외한다.
===================================================== */

function isBadMasterAction(team, action){

  if(!action){
    return true;
  }

  /* 일단 오픈 행동만 검사 */
  if(action.type !== 'reveal'){
    return false;
  }
/* =================================================
   움직일 수 있는 사의 불필요한 주변 오픈 금지

   사 주변을 열려고 하는 행동인데,
   그 사가 안전하게 이동할 빈칸이 있다면
   오픈하지 않고 아래의 이동 판단까지 내려보낸다.
================================================= */

if(
  action.reason === 'advisorAggressiveReveal'
){

  var revealR =
    Math.floor(action.index / 4);

  var revealC =
    action.index % 4;


  /* 이 reveal 칸 바로 옆의 내 사를 찾는다 */
  for(var a=0; a<board.length; a++){

    var advisor =
      board[a];

    if(
      !advisor ||
      !advisor.revealed ||
      advisor.team !== team ||
      advisor.type !== 'advisor'
    ){
      continue;
    }

    var ar =
      Math.floor(a / 4);

    var ac =
      a % 4;

    /* 이 사 주변을 여는 행동이 아니면 관계없음 */
    if(
      Math.abs(revealR - ar) +
      Math.abs(revealC - ac) !== 1
    ){
      continue;
    }


    /* 이 사가 안전하게 이동할 수 있는지 검사 */
    for(var to=0; to<board.length; to++){

      /* 빈칸만 */
      if(board[to] !== null){
        continue;
      }

      if(!canMove(a, to)){
        continue;
      }


      /* 잠깐 이동했다고 가정 */
      board[to] = advisor;
      board[a] = null;

      var dangerous =
        isMyPieceInImmediateDanger(
          team,
          to
        );

      /* 반드시 복구 */
      board[a] = advisor;
      board[to] = null;


      /* 안전한 이동칸 하나라도 발견 */
      if(!dangerous){

        console.log(
          '🚫 사 주변 오픈 금지:',
          '사=', a,
          '오픈칸=', action.index,
          '안전이동칸=', to
        );

        return true;
      }
    }
  }
}
  var enemy =
    team === 'red' ? 'blue' : 'red';

  var revealIndex =
    action.index;


  /* =================================================
     상대 포가 아직 남아 있는지 확인
  ================================================= */

  var capturedEnemy =
    enemy === 'blue'
    ? capturedBlue
    : capturedRed;

  var capturedEnemyCannons = 0;

  for(var c=0; c<capturedEnemy.length; c++){

    if(
      capturedEnemy[c].type === 'cannon'
    ){
      capturedEnemyCannons++;
    }
  }

  var revealedEnemyCannons = 0;

  for(var i=0; i<board.length; i++){

    var p = board[i];

    if(
      p &&
      p.revealed &&
      p.team === enemy &&
      p.type === 'cannon'
    ){
      revealedEnemyCannons++;
    }
  }

  /*
    상대 포 2개가 모두
    공개됐거나 잡혀서 정체가 확정됐으면
    숨은 상대 포 위험은 없음
  */
  if(
    revealedEnemyCannons +
    capturedEnemyCannons >= 2
  ){
    return false;
  }


  /* =================================================
     공개된 내 왕 찾기
  ================================================= */

  var kingIndex = -1;

  for(var k=0; k<board.length; k++){

    var king = board[k];

    if(
      king &&
      king.revealed &&
      king.team === team &&
      king.type === 'king'
    ){
      kingIndex = k;
      break;
    }
  }

  if(kingIndex === -1){
    return false;
  }


  /* 열려는 칸이 실제 미오픈 알인지 */
  if(
    !board[revealIndex] ||
    board[revealIndex].revealed
  ){
    return false;
  }


  var kr =
    Math.floor(kingIndex / 4);

  var kc =
    kingIndex % 4;

  var rr =
    Math.floor(revealIndex / 4);

  var rc =
    revealIndex % 4;


  /* 왕과 같은 가로/세로가 아니면 포 직격 자리 아님 */
  if(
    kr !== rr &&
    kc !== rc
  ){
    return false;
  }


  var dr =
    Math.sign(rr - kr);

  var dc =
    Math.sign(rc - kc);

  var r = kr + dr;
  var col = kc + dc;

  var middleCount = 0;


  /* 왕과 reveal 칸 사이의 기물/알 개수 */
  while(
    r !== rr ||
    col !== rc
  ){

    var index =
      r * 4 + col;

    if(board[index]){
      middleCount++;
    }

    r += dr;
    col += dc;
  }


  /*
    중간에 정확히 하나 있으면
    reveal 칸에서 상대 포가 나올 경우
    포 공격 구조가 완성됨
  */
  if(middleCount === 1){

    console.log(
      '🚫 AI 금지 reveal:',
      '왕=', kingIndex,
      '금지칸=', revealIndex,
      '이유=상대포 왕직격 가능'
    );

    return true;
  }


  return false;
}
function chooseMasterAction(team){
var priorityCandidates = [];
var situation =
  getBoardSituation(team);

console.log(
  '🎯 마스터 상황판:',
  '왕위험=', situation.kingInDanger,
  '위험왕=', situation.dangerKingIndex
);
/* 왕이 실제 위험하면
   먼저 아군 이동으로 포 공격선을 막을 수 있는지 본다 */
if(situation.kingInDanger){

  var kingCannonBlock =
    masterBlockCannonAttackOnKing(team);

  if(kingCannonBlock){

    console.log(
      '🛡 왕위험: 포 공격선 차단 우선',
      kingCannonBlock
    );

    return kingCannonBlock;
  }
}
var enemyKingCannonAttack =
  masterAttackEnemyKingWithCannon(team);

if(enemyKingCannonAttack){

  priorityCandidates.push({
    type:'attackEnemyKing',
    action:enemyKingCannonAttack
  });
}
/* 우선순위 후보가 있으면 점수 비교 */

  var actions = getMasterActions(team);
actions = actions.filter(function(action){

  return !isBadMasterAction(
    team,
    action
  );
});
  if(actions.length === 0){
    return null;
  }

/* =====================================================
   👑 포 공격 왕 보호 - 아군 희생 방어

   상대 공개 포가 내 공개 왕을 지금 공격 중일 때

   포와 왕 사이의 빈칸에
   공개된 내 기물을 하나 이동시켜
   중간 기물을 2개로 만든다.

   → 상대 포의 왕 직접 공격 차단

   왕 자신은 희생시키지 않는다.
   여러 후보가 있으면 가치가 낮은 기물 우선.
===================================================== */
/* =====================================================
   왕 포공격 일반 차단

   상대 공개 포가 내 왕을 공격 중일 때,
   포와 왕 사이의 빈칸으로 이동 가능한
   아군 기물을 넣어서 포 공격을 끊는다.

   왕은 사용하지 않는다.
   여러 후보가 있으면 가치가 낮은 기물 우선.
===================================================== */

function masterBlockCannonAttackOnKing(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var kingIndex = -1;

  /* 내 왕 찾기 */
  for(var k=0; k<board.length; k++){

    var king = board[k];

    if(
      king &&
      king.revealed &&
      king.team === team &&
      king.type === 'king'
    ){
      kingIndex = k;
      break;
    }
  }

  if(kingIndex === -1){
    return null;
  }

  var candidates = [];


  /* 상대 공개 포 찾기 */
  for(var cannonIndex=0;
      cannonIndex<board.length;
      cannonIndex++){

    var cannon =
      board[cannonIndex];

    if(
      !cannon ||
      !cannon.revealed ||
      cannon.team !== enemy ||
      cannon.type !== 'cannon'
    ){
      continue;
    }


    /* 지금 왕을 실제 공격 중인 포만 */
    if(
      !canCannon(
        cannonIndex,
        kingIndex
      )
    ){
      continue;
    }


    var cr =
      Math.floor(cannonIndex / 4);

    var cc =
      cannonIndex % 4;

    var kr =
      Math.floor(kingIndex / 4);

    var kc =
      kingIndex % 4;

    var dr =
      Math.sign(kr-cr);

    var dc =
      Math.sign(kc-cc);

    var r = cr + dr;
    var c = cc + dc;


    /* 포와 왕 사이 빈칸 검사 */
    while(
      r !== kr ||
      c !== kc
    ){

      var blockIndex =
        r * 4 + c;

      if(board[blockIndex] === null){

        /* 그 칸으로 들어갈 수 있는 아군 찾기 */
        for(var from=0;
            from<board.length;
            from++){

          var myPiece =
            board[from];

          if(
            !myPiece ||
            !myPiece.revealed ||
            myPiece.team !== team
          ){
            continue;
          }

          /* 왕은 차단용으로 쓰지 않음 */
          if(myPiece.type === 'king'){
            continue;
          }

          if(
            !canMove(
              from,
              blockIndex
            )
          ){
            continue;
          }


          /* 실제로 이동했다고 가정 */
          board[blockIndex] =
            myPiece;

          board[from] =
            null;

          var stillAttack =
            canCannon(
              cannonIndex,
              kingIndex
            );

          /* 원상복구 */
          board[from] =
            myPiece;

          board[blockIndex] =
            null;


          /* 포 공격이 끊긴 경우만 후보 */
          if(stillAttack){
            continue;
          }

          candidates.push({

            type:'move',
            reason:'blockCannonAttackOnKing',
            from:from,
            to:blockIndex,
            value:
              aiValue[myPiece.type] || 100
          });
        }
      }

      r += dr;
      c += dc;
    }
  }


  if(candidates.length === 0){
    return null;
  }


  /* 싼 기물 우선 */
  candidates.sort(function(a,b){
    return a.value - b.value;
  });


  console.log(
    '🛡 왕 포공격 차단:',
    candidates[0]
  );


  return {
    type:'move',
    reason:'blockCannonAttackOnKing',
    from:candidates[0].from,
    to:candidates[0].to
  };
}
function masterSacrificeBlockForKingCannon(team){

  var enemy =
    team === 'red' ? 'blue' : 'red';

  var kingIndex = -1;

  /* 내 공개 왕 찾기 */
  for(var k=0; k<board.length; k++){

    var king = board[k];

    if(
      king &&
      king.revealed &&
      king.team === team &&
      king.type === 'king'
    ){
      kingIndex = k;
      break;
    }
  }

  if(kingIndex === -1){
    return null;
  }


  var candidates = [];


  /* 상대 공개 포 찾기 */
  for(var cannonIndex=0;
      cannonIndex<board.length;
      cannonIndex++){

    var enemyCannon =
      board[cannonIndex];

    if(
      !enemyCannon ||
      !enemyCannon.revealed ||
      enemyCannon.team !== enemy ||
      enemyCannon.type !== 'cannon'
    ){
      continue;
    }


    /* 현재 그 포가 내 왕을 실제 공격할 수 있어야 함 */
    if(
      !canCannon(
        cannonIndex,
        kingIndex
      )
    ){
      continue;
    }


    var cr =
      Math.floor(cannonIndex / 4);

    var cc =
      cannonIndex % 4;

    var kr =
      Math.floor(kingIndex / 4);

    var kc =
      kingIndex % 4;


    /* 같은 줄이 아니면 이상 상황 */
    if(
      cr !== kr &&
      cc !== kc
    ){
      continue;
    }


    var dr =
      Math.sign(kr - cr);

    var dc =
      Math.sign(kc - cc);

    var r = cr + dr;
    var c = cc + dc;


    /* ===============================================
       포와 왕 사이의 모든 빈칸을 찾는다.
       여기에 아군을 넣으면 중간 기물이 하나 증가.
    =============================================== */

    while(
      r !== kr ||
      c !== kc
    ){

      var blockIndex =
        r * 4 + c;


      /* 빈칸만 막는 자리 후보 */
      if(board[blockIndex] === null){


        /* ===========================================
           이 빈칸으로 이동 가능한
           공개 아군 기물을 전부 찾는다.
        =========================================== */

        for(var from=0;
            from<board.length;
            from++){

          var myPiece =
            board[from];

          if(
            !myPiece ||
            !myPiece.revealed ||
            myPiece.team !== team
          ){
            continue;
          }


          /* 왕은 희생 방어에 사용하지 않음 */
          if(myPiece.type === 'king'){
            continue;
          }


          /* 실제 이동 가능한 말만 */
          if(
            !canMove(
              from,
              blockIndex
            )
          ){
            continue;
          }


          /* =========================================
             실제로 이동시켜 보고
             포의 왕 공격이 정말 끊기는지 검사
          ========================================= */

          board[blockIndex] =
            myPiece;

          board[from] =
            null;


          var stillAttack =
            canCannon(
              cannonIndex,
              kingIndex
            );


          /* 반드시 원상복구 */
          board[from] =
            myPiece;

          board[blockIndex] =
            null;


          /* 막았는데도 포 공격 가능하면 실패 */
          if(stillAttack){
            continue;
          }


          var value =
            aiValue[myPiece.type] || 100;


          candidates.push({

            type:'move',

            reason:
              'sacrificeBlockForKingCannon',

            from:from,

            to:blockIndex,

            value:value,

            cannonIndex:
              cannonIndex,

            kingIndex:
              kingIndex
          });
        }
      }


      r += dr;
      c += dc;
    }
  }


  if(candidates.length === 0){
    return null;
  }


  /* ===============================================
     여러 기물이 희생 가능하면
     가치가 낮은 기물부터 선택
  =============================================== */

  candidates.sort(function(a,b){
    return a.value - b.value;
  });


  var lowestValue =
    candidates[0].value;

  var cheapest = [];

  for(var i=0;
      i<candidates.length;
      i++){

    if(
      candidates[i].value ===
      lowestValue
    ){
      cheapest.push(
        candidates[i]
      );
    }
  }


  var chosen =
    cheapest[
      Math.floor(
        Math.random() *
        cheapest.length
      )
    ];


  console.log(
    '🛡️ 왕 포공격 희생방어:',
    '포=', chosen.cannonIndex,
    '왕=', chosen.kingIndex,
    '희생말=', board[chosen.from].type,
    '이동=', chosen.from,
    '→',
    chosen.to
  );


  return {
    type:'move',
    reason:
      'sacrificeBlockForKingCannon',
    from:
      chosen.from,
    to:
      chosen.to
  };
}
/* =====================================================
   최우선 : 바로 먹을 수 있는 상대가 있으면 먼저 먹기
===================================================== */

for(var i=0; i<actions.length; i++){

  if(actions[i].type !== 'capture'){
    continue;
  }

  var captureAction =
    actions[i];

  var attacker =
    board[captureAction.from];

  var target =
    board[captureAction.to];


  if(
    !attacker ||
    !target
  ){
    continue;
  }


  /* =================================================
     사 특별 판단

     상대 포가 아직 한 마리도 공개되지 않았을 때

     상대 사 / 포는 예외 → 먹어도 됨

     그 외
     졸 / 마 / 상 / 차 등을 먹은 뒤
     사가 탈출 공간 0이 되면 잡기 보류
  ================================================= */

  if(
    attacker.type === 'advisor' &&
    hasNoRevealedEnemyCannon(team) &&
    target.type !== 'advisor' &&
    target.type !== 'cannon'
  ){

    if(
      !advisorHasEscapeAfterCapture(
        team,
        captureAction.from,
        captureAction.to
      )
    ){

      console.log(
        '🛡 사 생존공간 확보:',
        attacker.name,
        '→',
        target.name,
        '잡기 보류'
      );

      continue;
    }
  }


  /* =================================================
     왕/사는 실제 잡은 자리에서
     현재 공개 상대에게 바로 죽는지도 검사
  ================================================= */

  if(
    attacker.type === 'king' ||
    attacker.type === 'advisor'
  ){

    if(
      !shouldKingAdvisorMakeCapture(
        attacker,
        target,
        captureAction.to
      )
    ){
      continue;
    }
  }


  console.log(
    '⚔️ 안전한 즉시 잡기:',
    captureAction
  );

  return captureAction;
}
/* =====================================================
   전체 AI 행동 후보 보관함

   앞으로 포 / 사 / 차 / 마 등의 행동을
   여기에 모아서 점수로 비교한다.

   아직은 저장소만 만든다.
===================================================== */
/* =====================================================
   상대 포가 아직 하나도 안 나왔고
   갇힌 사가 있다면 공간부터 확보
===================================================== */

if(
  hasNoRevealedEnemyCannon(team)
){

  var advisorSpaceMove =
    masterFreeAdvisorSpace(team);

  if(advisorSpaceMove){

    console.log(
      '🛡 사 공간 확보 행동:',
      advisorSpaceMove
    );

    return advisorSpaceMove;
  }
}
var masterCandidates = [];

/* 상대 포를 빨리 제거하기 위해
   포 주변의 안전한 알부터 오픈 */

/* 상대 공개 포를 지금 바로 잡을 수 있으면 최우선 제거 */
var directEnemyCannonCapture =
  masterCaptureEnemyCannonFirst(team);

if(directEnemyCannonCapture){
  return directEnemyCannonCapture;
}
var enemyCannonAttack =
  masterOpenAroundEnemyCannonSafely(team);

if(enemyCannonAttack){
  return enemyCannonAttack;
}

/* =====================================================
   생존 최우선 : 위험한 사 피하기
===================================================== */
/* =====================================================
   👑 최우선 : 위험한 왕 피하기
===================================================== */

var dangerKing =
  findDangerKing(team);

if(dangerKing !== -1){

  var kingEscape =
    findSafeKingEscape(
      team,
      dangerKing
    );

  if(kingEscape){
   priorityCandidates.push({
  type:'kingEscape',
  action:kingEscape
});
  }
}
var dangerKing =
  findDangerKing(team);

if(dangerKing !== -1){

  var kingEscape =
    findSafeKingEscape(
      team,
      dangerKing
    );

  if(kingEscape){

    priorityCandidates.push({
      type:'kingEscape',
      action:kingEscape
    });
  }
}

/* =====================================================
   생존 최우선 : 위험한 사 피하기
===================================================== */

var dangerAdvisor =
  findDangerAdvisor(team);

if(dangerAdvisor !== -1){

  var advisorEscape =
    findSafeAdvisorEscape(
      team,
      dangerAdvisor
    );

  if(advisorEscape){
    return advisorEscape;
  }
}
var dangerAdvisor =
  findDangerAdvisor(team);

if(dangerAdvisor !== -1){

  var advisorEscape =
    findSafeAdvisorEscape(
      team,
      dangerAdvisor
    );

  if(advisorEscape){
    return advisorEscape;
  }
}

/* =====================================================
   상대 공개 포 압박 대응

   상대 포가 이미 내 공개 기물을 잡을 수 있다면
   그 기물 주변 미오픈 알을 먼저 연다.

   왕도 예외 없음.
===================================================== */

var pressureEnemyCannon =
  masterPressureEnemyCannon(team);

if(pressureEnemyCannon){
  return pressureEnemyCannon;
}
  

/* =====================================================
   포 행동 후보 수집
===================================================== */

/* 위험한 공개 포 즉시 공격 */
var dangerCannon =
  masterDangerCannonCapture(team);

if(dangerCannon){
  masterCandidates.push(dangerCannon);
}


/* 안전한 공개 포의 2차 공격 준비 */
var cannonLookAhead =
  masterCannonLookAheadReveal(team);

if(cannonLookAhead){
  masterCandidates.push(cannonLookAhead);
}


/* 포 후보끼리 점수 비교 */
if(masterCandidates.length > 0){

  return pickBestMasterCandidate(
    masterCandidates,
    team
  );
}

/* 포 1순위:
     공개된 상대 기물을 노릴 포 후보 알 찾기 */
  var cannonFirst =
  masterCannonFirstAction(team);

if(cannonFirst){

  /* 중앙 금지판정 먼저 통과해야 함 */
  if(
    !isBadMasterAction(
      team,
      cannonFirst
    )
  ){

    /* 기존 왕 위험 검사도 그대로 유지 */
    if(
      cannonFirst.type === 'reveal' &&
      (
        isRevealDangerousForKing(
          team,
          cannonFirst.index
        ) ||
        isRevealCannonDangerForKing(
          team,
          cannonFirst.index
        )
      )
    ){
      /* 위험하면 여기서 return 하지 않고
         아래 판단으로 넘어감 */
    }
    else{
      return cannonFirst;
    }
  }
}

/* 차 / 포 / 마 공격적 주변 오픈 */
var powerMiddleReveal =
  masterChariotCannonHorseReveal(team);

if(powerMiddleReveal){
  return powerMiddleReveal;
}


/* =====================================================
   사 공격적 행동
   공개된 내 사 바로 옆 미오픈 알 우선 오픈
===================================================== */

var advisorFirst =
  masterAdvisorFirstAction(team);

if(advisorFirst){
  return advisorFirst;
}

/* =====================================================
   왕/사 초반 방어

   위험한 상대 포 후보 자리 주변의
   안전한 미오픈 알을 먼저 오픈
===================================================== */

var kingAdvisorDefense =
  getKingAdvisorDefenseRevealCandidates(team);


/* 왕을 위험하게 만드는 오픈은
   방어 후보에서 처음부터 제거 */
kingAdvisorDefense =
  kingAdvisorDefense.filter(function(index){

    var testAction = {
      type:'reveal',
      reason:'kingAdvisorCannonDefense',
      index:index
    };

    return !isBadMasterAction(
      team,
      testAction
    );
  });


if(kingAdvisorDefense.length > 0){

  return {
    type:'reveal',
    reason:'kingAdvisorCannonDefense',
    index:
      kingAdvisorDefense[
        Math.floor(
          Math.random() *
          kingAdvisorDefense.length
        )
      ]
  };
}


/* =====================================================
   일반 오픈 전에 안전한 장소 우선
===================================================== */

var safeGeneralReveal =
  masterSafeGeneralReveal(team);

if(safeGeneralReveal){
  return safeGeneralReveal;
}
  /* 일반 숨은 알 오픈 */
  var reveals = [];

  for(var i=0; i<actions.length; i++){

    if(actions[i].type !== 'reveal'){
      continue;
    }


    /* 왕 바로 옆 졸 위험 */
    if(
      isRevealDangerousForKing(
        team,
        actions[i].index
      )
    ){
      continue;
    }


    /* 왕을 노릴 상대 포 출현 위험 */
    if(
      isRevealCannonDangerForKing(
        team,
        actions[i].index
      )
    ){
      continue;
    }


    reveals.push(actions[i]);
  }


  if(reveals.length > 0){

    return reveals[
      Math.floor(
        Math.random() *
        reveals.length
      )
    ];
  }


  /* 알이 모두 열렸으면 잡기 */
for(var c=0; c<actions.length; c++){

  if(actions[c].type !== 'capture'){
    continue;
  }

  var captureAction = actions[c];

  var attacker =
    board[captureAction.from];

  var target =
    board[captureAction.to];


  /* 왕/사가 상대 포를 잡으려는 경우
     특별 판단 적용 */
  if(
    attacker &&
    target &&
    (
      attacker.type === 'king' ||
      attacker.type === 'advisor'
    ) &&
    target.type === 'cannon'
  ){

    if(
      !shouldKingAdvisorCaptureCannon(
        team,
        captureAction.from,
        captureAction.to
      )
    ){
      /* 이 포는 굳이 잡지 않고
         다른 잡기 후보를 계속 찾는다 */
      continue;
    }
  }


  return captureAction;
}


  /* 마지막으로 이동 */
  for(var m=0; m<actions.length; m++){

    if(actions[m].type === 'move'){
      return actions[m];
    }
  }

  return null;
}


/* 레드 AI 실행 */
function aiMove(){

  if(
    !aiMode ||
    turn !== 'red' ||
    gameEnded
  ){
    return;
  }

  setTimeout(function(){

    if(
      !aiMode ||
      turn !== 'red' ||
      gameEnded
    ){
      return;
    }

    var action = chooseMasterAction('red');

    executeMasterAction(
      'red',
      action
    );

  },900);
}


/* 블루 AI - AI끼리 대국용 */
function blueAiMove(){

  if(
    !aiVsAiMode ||
    turn !== 'blue' ||
    gameEnded
  ){
    return;
  }

  setTimeout(function(){

    var action = chooseMasterAction('blue');

    executeMasterAction(
      'blue',
      action
    );

  },500);
}


/* 잡기 규칙 */

function canCapture(attacker,target){

  var rank = {
    king:7,
    advisor:6,
    chariot:5,
    elephant:4,
    horse:3,
    cannon:2,
    soldier:1
  };

  /* 왕은 졸을 못 잡음 */
  if(attacker.type==='king' && target.type==='soldier'){
    return false;
  }

  /* 졸은 왕을 잡음 */
  if(attacker.type==='soldier' && target.type==='king'){
    return true;
  }

  /* 상은 차를 못 잡음 */
  if(attacker.type==='elephant' && target.type==='chariot'){
    return false;
  }

  /* 마는 차를 못 잡음 */
  if(attacker.type==='horse' && target.type==='chariot'){
    return false;
  }
/* 마는 왕을 못 잡음 */
if(attacker.type==='horse' && target.type==='king'){
  return false;
}
  
  /* 포는 상대 말이면 잡을 수 있음 */
  if(attacker.type==='cannon'){
    return true;
  }

  /* 나머지는 순위 비교 */
  return rank[attacker.type] >= rank[target.type];
} 

/* 이동 규칙 */

function canMove(from,to){

  var fr=Math.floor(from/4);

  var fc=from%4;

  var tr=Math.floor(to/4);

  var tc=to%4;

  var dr=Math.abs(fr-tr);

  var dc=Math.abs(fc-tc);

  var p=board[from];


  /* 포 */

  if(p.type==='cannon'){

    /* 공격할 때는 중간에 말 하나를 넘어야 함 */

    if(board[to]){

      return canCannon(from,to);
    }

    /* 빈칸 이동은 상하좌우 한 칸 */

    return dr+dc===1;
  }


  /* 나머지 말은 상하좌우 한 칸 */

  return dr+dc===1;
}


/* 포 공격 규칙 */

function canCannon(from,to){

  var fr=Math.floor(from/4);

  var fc=from%4;

  var tr=Math.floor(to/4);

  var tc=to%4;


  /* 같은 줄이 아니면 공격 불가 */

  if(fr!==tr && fc!==tc){

    return false;
  }


  var dr=Math.sign(tr-fr);

  var dc=Math.sign(tc-fc);

  var r=fr+dr;

  var c=fc+dc;

  var count=0;


  while(r!==tr || c!==tc){

    var index=r*4+c;

    if(board[index]){

      count++;
    }

    r+=dr;

    c+=dc;
  }


  /* 중간에 정확히 한 개가 있어야 포 공격 가능 */

  return count===1;
}


/* 새 게임 버튼 */

document.getElementById('restart').onclick=function(){

 playClickSound();
  newGame();

};

document.getElementById('aiMode').onclick=function(){
playClickSound();
  aiMode=true;
  aiTeam='red';

  say('🤖 AI 대국 시작! 🔵 호랑이팀은 당신입니다.');

  newGame();
};
document.getElementById('hint').onclick=function(){

  playClickSound();
aiVsAiMode=false;
  showHint = !showHint;

  document.getElementById('hint').textContent =
    showHint
    ? '🙈 힌트 닫기'
    : '💡 힌트';

  draw();
};
document.getElementById('backMain').onclick=function(){

  playClickSound();

  document.getElementById('game').style.display='none';
  document.getElementById('mainMenu').style.display='flex';

};

document.getElementById('aiVsAi').onclick=function(){

  playClickSound();

  aiVsAiMode=true;
  aiMode=true;
  aiTeam='red';

  newGame();

  say('🤖 스마트 AI끼리 대국 시작!');

  setTimeout(function(){

    if(turn==='blue'){
      blueAiMove();
    }
    else{
      aiMove();
    }

  },500);
};



/* 시작 */

document.getElementById('mainStart').onclick=function(){

  playClickSound();

  document.getElementById('mainMenu').style.display='none';
  document.getElementById('game').style.display='block';

  aiMode=true;
  aiTeam='red';

  newGame();
};
