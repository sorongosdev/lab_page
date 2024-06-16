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
  const toggleButton = document.querySelector(".navbar-toggler");
  const navbarDiv = document.getElementById("navbar");

  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      if (navbarDiv.classList.contains("show")) {
        // 메뉴를 서서히 사라지게
        navbarDiv.style.height = `${navbarDiv.scrollHeight}px`;
        navbarDiv.offsetHeight; // 강제 리플로우(reflow) 트리거
        navbarDiv.style.height = "0";
        navbarDiv.style.opacity = "0";

        setTimeout(() => {
          navbarDiv.classList.remove("show");
          toggleButton.classList.add("collapsed");
          toggleButton.setAttribute("aria-expanded", "false");
        }, 300); // CSS 전환 시간과 동일하게 설정
      } else {
        // 메뉴를 서서히 나타나게 하기
        navbarDiv.classList.add("show");
        navbarDiv.style.height = "0";
        navbarDiv.offsetHeight; // 강제 리플로우(reflow) 트리거
        navbarDiv.style.height = `${navbarDiv.scrollHeight}px`;
        navbarDiv.style.opacity = "1";

        setTimeout(() => {
          navbarDiv.style.height = "auto"; // 높이를 auto로 설정
          toggleButton.classList.remove("collapsed");
          toggleButton.setAttribute("aria-expanded", "true");
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

  // 이미지 갤러리
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let initialOffset = 0;

  const slidesContainer = document.querySelector(".slides");
  const slides = document.querySelectorAll(".slide");
  const slideWidth = 200; // 이미지 크기
  const slidePadding = 12; // 슬라이드 패딩
  const slideStep = slideWidth + slidePadding * 2; // 각 슬라이드의 총 너비
  const containerMarginLeft = 64; // 컨테이너의 margin-left
  let currentOffset = 0;

  // 슬라이드의 전체 너비 계산
  const totalWidth = slides.length * slideStep;
  const containerWidth = slidesContainer.offsetWidth - containerMarginLeft;

  function updateTransform(offset) {
    slidesContainer.style.transform = `translateX(${offset}px)`;
  }

  function getTransformValue() {
    const style = window.getComputedStyle(slidesContainer);
    const matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m41; // translateX 값 반환
  }
  function clampOffset(offset) {
    // 슬라이드의 시작과 끝을 넘어가지 않도록 제한
    const maxOffset = 0;
    const minOffset = -(totalWidth - containerWidth);
    return Math.min(Math.max(offset, minOffset), maxOffset);
  }

  slidesContainer.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    initialOffset = getTransformValue();
    isDragging = true;
    slidesContainer.style.transition = "none";
  });

  slidesContainer.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const diff = currentX - startX;
    const newOffset = clampOffset(initialOffset + diff);
    updateTransform(newOffset);
  });

  slidesContainer.addEventListener("mouseup", () => {
    isDragging = false;
    slidesContainer.style.transition = "none";
    currentOffset = getTransformValue();
  });

  slidesContainer.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false;
      slidesContainer.style.transition = "none";
      currentOffset = getTransformValue();
    }
  });

  slidesContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    initialOffset = getTransformValue();
    isDragging = true;
    slidesContainer.style.transition = "none";
  });

  slidesContainer.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const newOffset = clampOffset(initialOffset + diff);
    updateTransform(newOffset);
  });

  slidesContainer.addEventListener("touchend", () => {
    isDragging = false;
    slidesContainer.style.transition = "none";
    currentOffset = getTransformValue();
  });

  function nextSlide() {
    currentOffset = clampOffset(currentOffset - slideStep);
    slidesContainer.style.transition = "transform 0.3s ease-in-out";
    updateTransform(currentOffset);
  }

  function prevSlide() {
    currentOffset = clampOffset(currentOffset + slideStep);
    slidesContainer.style.transition = "transform 0.3s ease-in-out";
    updateTransform(currentOffset);
  }

  document.querySelector(".next").addEventListener("click", nextSlide);
  document.querySelector(".prev").addEventListener("click", prevSlide);
});
