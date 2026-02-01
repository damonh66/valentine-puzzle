const $=s=>document.querySelector(s);
const audio={bg:$('#bgMusic'),swell:$('#swellMusic'),clips:[new Audio('assets/laugh.mp3'),new Audio('assets/giggle.mp3'),new Audio('assets/beach.mp3'),new Audio('assets/quote.mp3')]};
function showStage(id){document.querySelectorAll('.stage').forEach(s=>s.classList.remove('active'));$(`#${id}`).classList.add('active');}

$('.pulse-dot').onclick=()=>{showStage('timeline');audio.bg.play();initTimeline();};

let dragged=null,order=['firstText','firstDate','firstTrip','firstCook','firstRoad'];
function initTimeline(){
  const f=$('.starfield');
  order.forEach((id,i)=>{
    const s=document.createElement('div');s.className='star';s.id=id;s.draggable=true;
    s.style.left=`${15+i*17}%`;s.style.top=`${20+Math.random()*40}%`;
    s.ondragstart=e=>dragged=e.target;s.ondragend=e=>dragged=null;
    f.appendChild(s);
  });
  f.ondragover=e=>e.preventDefault();
  f.ondrop=e=>{
    if(!dragged)return;
    const idx=[...f.children].indexOf(dragged);
    if(idx===order.indexOf(dragged.id)){dragged.style.opacity='0.3';dragged.draggable=false;
      if([...f.children].every(ch=>ch.style.opacity==='0.3'))setTimeout(()=>nextStage(),3000);}
  };
}
let vinylSeq=[],vinylCorrect=[1,0,2,3];
function nextStage(){showStage('vinyl');initVinyl();}
function initVinyl(){
  const b=$('.clips');
  [0,1,2,3].forEach(i=>{
    const c=document.createElement('div');c.className='clip';c.dataset.idx=i;
    c.onclick=()=>{audio.clips[i].currentTime=0;audio.clips[i].play();vinylSeq.push(i);c.classList.add('playing');
      if(vinylSeq.length===4){if(JSON.stringify(vinylSeq)===JSON.stringify(vinylCorrect))setTimeout(()=>nextStage(),800);
        else{vinylSeq=[];document.querySelectorAll('.clip').forEach(x=>x.classList.remove('playing'));}}
    };
    b.appendChild(c);
  });
}
const correctTiles=[3,7,9,16,22];
function nextStage(){showStage('lightlock');initGrid();}
function initGrid(){
  const g=$('.grid');let picked=0;
  for(let i=0;i<25;i++){const t=document.createElement('div');t.className='tile';
    t.onclick=()=>{if(correctTiles.includes(i)){t.classList.add('lit');picked++;}
      if(picked===5)setTimeout(()=>nextStage(),800);};g.appendChild(t);}
}
function nextStage(){showStage('cipher');$('#codeInput').focus();}
$('#codeInput').oninput=e=>{if(e.target.value==='0214'){setTimeout(()=>nextStage(),800);}};

const SIZE=12,CELL=30;let px=1,py=1,rx=SIZE-2,ry=SIZE-2;
function nextStage(){showStage('roseMaze');initMaze();}
function initMaze(){
  const c=$('#mazeCanvas'),ctx=c.getContext('2d');
  c.width=c.height=SIZE*CELL;
  const gr=Array.from({length:SIZE},()=>Array(SIZE).fill(1));
  const st=[[px,py]];gr[py][px]=0;
  while(st.length){
    const [cx,cy]=st[st.length-1];
    const nb=[[0,-2],[0,2],[2,0],[-2,0]].map(([dx,dy])=>[cx+dx,cy+dy]).filter(([x,y])=>x>0&&y>0&&x<SIZE-1&&y<SIZE-1&&gr[y][x]===1);
    if(nb.length){const [nx,ny]=nb[Math.random()*nb.length|0];gr[(cy+ny)/2][(cx+nx)/2]=0;gr[ny][nx]=0;st.push([nx,ny]);}else st.pop();
  }
  gr[ry][rx]=0;
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)if(gr[y][x])ctx.fillRect(x*CELL,y*CELL,CELL,CELL);
    ctx.fillStyle='#ff96ab';ctx.beginPath();ctx.arc(px*CELL+CELL/2,py*CELL+CELL/2,CELL/3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff1744';ctx.beginPath();ctx.arc(rx*CELL+CELL/2,ry*CELL+CELL/2,CELL/3,0,Math.PI*2);ctx.fill();
  }
  draw();
  window.onkeydown=e=>{
    const dir={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(!dir)return;
    const [dx,dy]=dir,nx=px+dx,ny=py+dy;if(gr[ny][nx]===0){px=nx;py=ny;draw();}
    if(px===rx&&py===ry)setTimeout(()=>nextStage(),500);
  };
}
const targetDay=14;
function nextStage(){showStage('capsule');}
$('.spin').onclick=()=>{
  $('.wheel').classList.add('spinning');
  setTimeout(()=>{$('.wheel').classList.remove('spinning');const d=Math.ceil(Math.random()*31);$('.date-slot').textContent=d;
    if(d===targetDay)setTimeout(()=>nextStage(),800);},4000);
};
let breathTimer=null;
function nextStage(){showStage('breath');startBreath();}
function startBreath(){
  const dot=$('.circle-dot');let angle=0;
  breathTimer=setInterval(()=>{angle=(angle+180)%360;dot.style.top=115-115*Math.cos(angle*Math.PI/180)+'px';},2000);
  setTimeout(()=>{clearInterval(breathTimer);nextStageRealFinale();},30000);
}
function nextStageRealFinale(){
  showStage('finale');audio.bg.pause();audio.swell.play();
  $('#lottieCandle').innerHTML=`<lottie-player src="https://assets2.lottiefiles.com/packages/lf20_yst6frwn.json" background="transparent" speed="1" style="width:300px;height:300px;" loop autoplay></lottie-player>`;
}
$('#yesBtn').onclick=()=>{$('#yesBtn').textContent='❤️';confetti();};
function confetti(){
  const c=document.createElement('canvas');c.style.position='fixed';c.style.top=0;c.style.left=0;c.style.pointerEvents='none';document.body.appendChild(c);
  const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;
  const p=[],colors=['#ffb7c5','#ffe4e1','#fff'];
  for(let i=0;i<150;i++)p.push({x:Math.random()*c.width,y:Math.random()*c.height-c.height,r:Math.random()*4+2,d:Math.random()*p.length,color:colors[Math.random()*colors.length|0]});
  function draw(){ctx.clearRect(0,0,c.width,c.height);p.forEach(x=>{x.y+=Math.pow(x.r,.5)+1;ctx.beginPath();ctx.arc(x.x,x.y,x.r,0,Math.PI*2);ctx.fillStyle=x.color;ctx.fill();if(x.y>c.height){x.y=-10;x.x=Math.random()*c.width;}});requestAnimationFrame(draw);}draw();setTimeout(()=>c.remove(),7000);
}
