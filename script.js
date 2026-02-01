/* ------------------------------
   Scroll reveal & hamburger menu
--------------------------------*/
const items = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.2 });
items.forEach(i => observer.observe(i));

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

document.querySelectorAll('#nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

/* ------------------------------
   Canvas background network
--------------------------------*/
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particleCount = window.innerWidth < 768 ? 40 : 80;
const maxDist = 200;
const particles = [];
const mouse = { x: null, y: null };

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = (Math.random() - 0.5) * 1;
    this.radius = 2 + Math.random() * 2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(37,99,235,0.9)';
    ctx.shadowColor = 'rgba(37,99,235,0.7)';
    ctx.shadowBlur = 5;
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if(this.x < 0 || this.x > width) this.vx *= -1;
    if(this.y < 0 || this.y > height) this.vy *= -1;

    this.draw();
  }
}

for(let i=0;i<particleCount;i++) particles.push(new Particle());

function connectParticles() {
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < maxDist){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(37,99,235,${1 - dist/maxDist})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
    if(mouse.x && mouse.y){
      let dx = particles[i].x - mouse.x;
      let dy = particles[i].y - mouse.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < maxDist){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(37,99,235,${1 - dist/maxDist})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0,0,width,height);
  particles.forEach(p => p.update());
  connectParticles();
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});
