// ============================================================
// UN AÑO JUNTOS — C + C
// Puedes cambiar textos directamente en index.html.
// Para cambiar fotos, reemplaza los archivos dentro de /img
// conservando los mismos nombres, o cambia la ruta src="...".
// ============================================================

// FECHA DE INICIO DE LA RELACIÓN (año, mes-1, día, hora)
const anniversaryStart = new Date(2025, 9, 4, 0, 0, 0);

function updateCounter() {
  const now = new Date();
  let diff = Math.max(0, now - anniversaryStart);
  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
updateCounter();
setInterval(updateCounter, 1000);

// Aparición suave de elementos al hacer scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Carta sorpresa
const modal = document.getElementById('letterModal');
document.getElementById('openLetter').addEventListener('click', () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  burstHearts(16);
});
document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeLetter));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLetter(); });
function closeLetter(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// Corazones discretos ocasionales
const heartLayer = document.getElementById('hearts');
function createHeart(x = Math.random() * 100) {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = Math.random() > .5 ? '♡' : '♥';
  heart.style.left = x + 'vw';
  heart.style.fontSize = (12 + Math.random() * 18) + 'px';
  heart.style.animationDuration = (4 + Math.random() * 4) + 's';
  heartLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 8500);
}
function burstHearts(amount){ for(let i=0;i<amount;i++) setTimeout(() => createHeart(30 + Math.random()*40), i*80); }
setInterval(() => createHeart(), 3500);


// ============================================================
// JUEGO: ADIVINA EL RECUERDO
// EDITA AQUÍ las pistas, fotos, respuesta correcta y mensaje.
// correct: 0 = primera foto, 1 = segunda, 2 = tercera.
// ============================================================
const memoryQuestions = [
  // RECUERDO 1 — SALIDA A COMER HELADO
  // Coloca estas 3 fotos dentro de /img. La correcta es la primera.
  { clue:'Nuestra salida a comer helado 🍦', photos:['img/juego-helado.jpg','img/juego-02.jpg','img/juego-03.jpg'], correct:0, message:'¡SÍ! 🍦 Este día merece quedarse aquí para siempre.' },

  // RECUERDO 2 — DÍA DE RISAS
  // La foto correcta es juego-risas.jpg.
  { clue:'Ese día que no parábamos de reír ♡', photos:['img/juego-04.jpg','img/juego-risas.jpg','img/juego-06.jpg'], correct:1, message:'Lo encontraste ♡ Tu risa siempre será de mis sonidos favoritos.' },

  // RECUERDO 3 — RECUERDO FAVORITO
  // La foto correcta es juego-favorito.jpg.
  { clue:'Uno de nuestros recuerdos favoritos ✨', photos:['img/juego-07.jpg','img/juego-08.jpg','img/juego-favorito.jpg'], correct:2, message:'Correcto ♡ Y todavía nos faltan muchísimos recuerdos por crear.' }
];
let qIndex=0;
const quizPhotos=document.getElementById('quizPhotos'), quizClue=document.getElementById('quizClue'), quizResult=document.getElementById('quizResult'), nextMemory=document.getElementById('nextMemory');
function renderQuestion(){
  const q=memoryQuestions[qIndex]; quizClue.textContent=q.clue; quizResult.textContent=''; nextMemory.hidden=true;
  document.getElementById('quizStep').textContent=`Recuerdo ${qIndex+1} de ${memoryQuestions.length}`;
  document.getElementById('quizBar').style.width=((qIndex+1)/memoryQuestions.length*100)+'%'; quizPhotos.innerHTML='';
  q.photos.forEach((src,i)=>{const b=document.createElement('button');b.type='button';b.className='quiz-photo';b.dataset.filename=src.replace('img/',''); b.innerHTML=`<img src="${src}" alt="Opción ${i+1}" onerror="this.style.display='none';this.parentElement.classList.add('missing-photo')"><span class="quiz-file-label">${b.dataset.filename}</span>`;b.addEventListener('click',()=>checkMemory(i,b));quizPhotos.appendChild(b)});
}
function checkMemory(i,b){const q=memoryQuestions[qIndex];document.querySelectorAll('.quiz-photo').forEach(x=>x.disabled=true);if(i===q.correct){b.classList.add('correct');quizResult.textContent=q.message;burstHearts(8)}else{b.classList.add('wrong');document.querySelectorAll('.quiz-photo')[q.correct].classList.add('correct');quizResult.textContent='Casi ♡ Esta era la foto que estaba buscando.'}nextMemory.hidden=false;nextMemory.textContent=qIndex===memoryQuestions.length-1?'Terminamos ♡':'Siguiente recuerdo →'}
nextMemory?.addEventListener('click',()=>{if(qIndex<memoryQuestions.length-1){qIndex++;renderQuestion()}else{quizResult.textContent='3 recuerdos desbloqueados. Te conoces nuestra historia muy bien ♡';nextMemory.hidden=true;burstHearts(15)}}); if(quizPhotos) renderQuestion();

// Tarjetas que se voltean
 document.querySelectorAll('.flip-card').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('flipped')));

// MINI MEMORAMA — cambia estas tres rutas por tus fotos
const matchImages=['img/memoria-01.jpg','img/memoria-02.jpg','img/memoria-03.jpg'];
let first=null, lock=false, found=0;
function buildMatch(){const board=document.getElementById('matchBoard'); if(!board)return; found=0;first=null;lock=false;document.getElementById('matchStatus').textContent='0 de 3 parejas encontradas';let cards=[...matchImages,...matchImages].map((src,i)=>({src,key:src,id:i})).sort(()=>Math.random()-.5);board.innerHTML='';cards.forEach(data=>{const b=document.createElement('button');b.type='button';b.className='match-card';b.dataset.key=data.key;b.innerHTML=`<span class="match-cover">♡</span><span class="match-face"><img src="${data.src}" alt="Foto de nuestro recuerdo" onerror="this.style.display='none';this.parentElement.classList.add('missing-match');this.parentElement.dataset.filename='${data.src.replace('img/','')}'"></span>`;b.addEventListener('click',()=>flipMatch(b));board.appendChild(b)})}
function flipMatch(card){if(lock||card===first||card.classList.contains('matched'))return;card.classList.add('open');if(!first){first=card;return}lock=true;if(first.dataset.key===card.dataset.key){first.classList.add('matched');card.classList.add('matched');first.classList.remove('open');card.classList.remove('open');found++;document.getElementById('matchStatus').textContent=found===3?'¡Encontraste todos nuestros recuerdos! ♡':`${found} de 3 parejas encontradas`;first=null;lock=false;if(found===3)burstHearts(14)}else{const prev=first;setTimeout(()=>{prev.classList.remove('open');card.classList.remove('open');first=null;lock=false},850)}}
document.getElementById('resetMatch')?.addEventListener('click',buildMatch);buildMatch();
