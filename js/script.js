document.addEventListener("DOMContentLoaded", function () {

  // 네비게이션 링크 설정
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // 모든 링크의 active 클래스 제거
      navLinks.forEach((link) => link.classList.remove("active"));

      // 클릭된 링크에 active 클래스 추가
      this.classList.add("active");

      // 홈 링크 클릭 시 최상단으로 스크롤
      if (this.getAttribute("href") === "#") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        // 타겟 요소로 스크롤
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          window.scrollTo({
            top: target.offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // 네비게이션 토글 버튼 기능 추가
  const toggleButton = document.querySelector('.navbar-toggler');
  const navbarDiv = document.getElementById('navbar');

  if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      if (navbarDiv.classList.contains('show')) {
        // 메뉴를 서서히 사라지게
        navbarDiv.style.height = `${navbarDiv.scrollHeight}px`;
        navbarDiv.offsetHeight; // 강제 리플로우(reflow) 트리거
        navbarDiv.style.height = '0';
        navbarDiv.style.opacity = '0';

        setTimeout(() => {
          navbarDiv.classList.remove('show');
          toggleButton.classList.add('collapsed');
          toggleButton.setAttribute('aria-expanded', 'false');
        }, 300); // CSS 전환 시간과 동일하게 설정
      } else {
        // 메뉴를 서서히 나타나게 하기
        navbarDiv.classList.add('show');
        navbarDiv.style.height = '0';
        navbarDiv.offsetHeight; // 강제 리플로우(reflow) 트리거
        navbarDiv.style.height = `${navbarDiv.scrollHeight}px`;
        navbarDiv.style.opacity = '1';

        setTimeout(() => {
          navbarDiv.style.height = 'auto'; // 높이를 auto로 설정
          toggleButton.classList.remove('collapsed');
          toggleButton.setAttribute('aria-expanded', 'true');
        }, 300); // CSS 전환 시간과 동일하게 설정
      }
    });
  }

  // 스크롤 이벤트 리스너 추가
  window.addEventListener("scroll", () => {
    let current = "";
    
    // 각 섹션의 위치를 확인하여 현재 위치 파악
    document.querySelectorAll("section").forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 60) {
        current = section.getAttribute("id");
      }
    });

    // 현재 위치에 해당하는 네비게이션 링크에 active 클래스 추가
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // 이미지 슬라이더 기능 추가
  let currentIndex = 0;
  const slideWidth = 212; // 각 슬라이드의 고정된 너비 (패딩 포함)
  const slidesContainer = document.querySelector('.slides');
  const totalSlides = document.querySelectorAll('.slide').length;
  const totalWidth = slideWidth * totalSlides;

  function showSlide(index) {
    if (index >= totalSlides) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = totalSlides - 1;
    } else {
      currentIndex = index;
    }

    const offset = -currentIndex * slideWidth;
    slidesContainer.style.transform = `translateX(${offset}px)`;
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  // 화살표 버튼에 이벤트 리스너 추가
  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');

  if (nextButton) {
    nextButton.addEventListener('click', nextSlide);
  }

  if (prevButton) {
    prevButton.addEventListener('click', prevSlide);
  }

  // 터치 및 드래그 이벤트를 위한 변수
  let startX = 0;
  let isDragging = false;

  // 터치 시작 이벤트
  slidesContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  // 터치 이동 이벤트
  slidesContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (diff > 50) {
      nextSlide();
      isDragging = false;
    } else if (diff < -50) {
      prevSlide();
      isDragging = false;
    }
  });

  // 터치 종료 이벤트
  slidesContainer.addEventListener('touchend', () => {
    isDragging = false;
  });

  // 마우스 드래그 시작 이벤트
  slidesContainer.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
  });

  // 마우스 드래그 이동 이벤트
  slidesContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = startX - currentX;

    if (diff > 50) {
      nextSlide();
      isDragging = false;
    } else if (diff < -50) {
      prevSlide();
      isDragging = false;
    }
  });

  // 마우스 드래그 종료 이벤트
  slidesContainer.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // 마우스가 슬라이더 밖으로 나갔을 때 드래그 종료
  slidesContainer.addEventListener('mouseleave', () => {
    isDragging = false;
  });
});
