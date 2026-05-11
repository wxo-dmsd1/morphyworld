const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});


const photos = document.querySelectorAll('.photo');

photos.forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.transform = `
      translateX(-80px)
      scale(5)
      rotate(-20deg)
    `;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = `
      translateX(0px)
      scale(1)
      rotate(0deg)
    `;
  });
});



const overlays = document.querySelectorAll(".overlay");

overlays.forEach((overlay) => {

  overlay.addEventListener("click", () => {

    overlay.classList.add("hide");

    setTimeout(() => {
      overlay.classList.remove("hide");
    }, 3000);

  });

});



const texts = document.querySelectorAll(".spawn-text");

texts.forEach(text => {

  text.addEventListener("click", () => {

    const rect = text.getBoundingClientRect();

    const img = document.createElement("img");

    img.src = "morphycall.png";

    img.classList.add("physics-image");

    document.body.appendChild(img);

    // 시작 위치
    let x = rect.left + rect.width / 2 - 75;
    let y = rect.top;

    // 속도
    let vx = Math.random() * 8 - 4;
    let vy = -12;

    // 중력
    const gravity = 0.7;

    // 회전
    let rotation = Math.random() * 40 - 20;

    // 바닥
    const floor = window.innerHeight - 180;

    let alive = true;

    function animate(){

      if(!alive) return;

      vy += gravity;

      x += vx;
      y += vy;

      rotation += vx;

      // 바닥 충돌
      if(y >= floor){

        y = floor;

        vy *= -0.3;

        // 거의 멈추면 정지
        if(Math.abs(vy) < 1){

          vy = 0;
          vx *= 0.96;

        }
      }

      // transform 대신 left/top 사용
      img.style.left = x + "px";
      img.style.top = y + "px";

      img.style.transform =
        `rotate(${rotation}deg)`;

      requestAnimationFrame(animate);
    }

    animate();

    // 5초 뒤 제거
    setTimeout(() => {

      alive = false;

      img.remove();

    }, 5000);

  });

});



const hoverTexts = document.querySelectorAll(".hover-grow");

hoverTexts.forEach(text => {

  text.addEventListener("mouseenter", () => {

    text.style.transition =
      "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)";

    text.style.transform = "scale(1.15)";

  });

  text.addEventListener("mouseleave", () => {

    text.style.transform = "scale(1)";

  });

});



const area = document.querySelector('.btn-area');
const tooltip = document.querySelector('.tooltip');

let animationId;

/* =========================
   🔒 초기 깜빡임 방지
========================= */
window.addEventListener("DOMContentLoaded", () => {
  tooltip.style.transition = "none";
  tooltip.style.opacity = 0;
  tooltip.style.transform = "translate(-50%, 40px)";

  requestAnimationFrame(() => {
    tooltip.style.transition =
      "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease";
  });
});

/* =========================
   🎢 스프링 애니메이션
========================= */
function animateSpring(from, to, duration = 600, onEnd) {
  cancelAnimationFrame(animationId);

  const start = performance.now();

  function easeOutElastic(t) {
    return Math.pow(2, -10 * t) *
      Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  }

  function animate(time) {
    const elapsed = (time - start) / duration;
    const t = Math.min(1, elapsed);

    const eased = easeOutElastic(t);
    const currentY = from + (to - from) * eased;

    tooltip.style.transform = `translate(-50%, ${currentY}px)`;

    // 올라올 때만 보이게, 내려갈 땐 점점 사라지게
    tooltip.style.opacity = (to === -10) ? t : (1 - t);

    if (t < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      if (onEnd) onEnd();
    }
  }

  animationId = requestAnimationFrame(animate);
}

/* =========================
   🖱 hover 이벤트
========================= */
area.addEventListener('mouseenter', () => {
  animateSpring(40, -10, 100); // 아래 → 위
});

area.addEventListener('mouseleave', () => {
  animateSpring(-10, 40, 100, () => {
    tooltip.style.opacity = 0; // 완전 숨김 확정
  });
});