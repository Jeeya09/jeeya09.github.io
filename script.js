const tiltFrame = document.getElementById("tilt-frame");
const tiltArea = document.querySelector("[data-tilt-area]");
const navLinks = document.querySelectorAll(".nav-link");
const scrollStory = document.querySelector(".scroll-story");
const scrollVisual = document.getElementById("scroll-visual");
const scrollCopy = document.getElementById("scroll-copy");
const scrollCopyHeading = scrollCopy?.querySelector("h2");
const aboutStory = document.querySelector(".about-story");
const aboutIntro = document.getElementById("about-intro");
const aboutLeft = document.getElementById("about-left");
const aboutSide = document.getElementById("about-side");
const cursorAura = document.getElementById("cursor-aura");
const howWorkImage = document.getElementById("how-work-image");
const howWorkSteps = document.querySelectorAll(".how-work__step");
const revealItems = document.querySelectorAll(".reveal-on-scroll");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactScreen = window.matchMedia("(max-width: 640px)");

if (navLinks.length) {
  const linkedSections = [...navLinks]
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) {
        return null;
      }

      const section = document.querySelector(href);
      if (!section) {
        return null;
      }

      return { link, section };
    })
    .filter(Boolean);

  const setActiveNavLink = (activeLink) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link === activeLink);
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setActiveNavLink(link));
  });

  const updateActiveNavOnScroll = () => {
    const offset = window.innerHeight * 0.28;
    let current = linkedSections[0];

    linkedSections.forEach((item) => {
      const rect = item.section.getBoundingClientRect();
      if (rect.top - offset <= 0) {
        current = item;
      }
    });

    if (current) {
      setActiveNavLink(current.link);
    }
  };

  updateActiveNavOnScroll();
  window.addEventListener("scroll", updateActiveNavOnScroll, { passive: true });
  window.addEventListener("resize", updateActiveNavOnScroll);
}

if (tiltFrame && tiltArea) {
  const maxTilt = 25;

  const updateTilt = (event) => {
    const rect = tiltArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const percentX = (x / rect.width) * 2 - 1;
    const percentY = (y / rect.height) * 2 - 1;

    const rotateY = percentX * maxTilt;
    const rotateX = percentY * -maxTilt;

    tiltFrame.style.transform =
      `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const resetTilt = () => {
    tiltFrame.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  tiltArea.addEventListener("mousemove", updateTilt);
  tiltArea.addEventListener("mouseleave", resetTilt);
  tiltArea.addEventListener("touchend", resetTilt);
}

if (
  scrollStory &&
  scrollVisual &&
  scrollCopyHeading &&
  !prefersReducedMotion.matches
) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const mapRange = (value, inMin, inMax, outMin, outMax) => {
    const progress = clamp((value - inMin) / (inMax - inMin), 0, 1);
    return outMin + (outMax - outMin) * progress;
  };

  const updateScrollStory = () => {
    const rect = scrollStory.getBoundingClientRect();
    const scrollable = Math.max(scrollStory.offsetHeight - window.innerHeight, 1);
    const rawProgress = clamp((-rect.top) / scrollable, 0, 1);
    const isCompact = compactScreen.matches;

    let visualScale = 1;
    let visualTranslateY = 0;
    let visualOpacity = 1;
    let textOpacity = 1;

    if (rawProgress <= 0.25) {
      visualScale = 1;
      visualTranslateY = 0;
      visualOpacity = 1;
    } else if (rawProgress <= 0.5) {
      visualScale = mapRange(rawProgress, 0.25, 0.5, 1, isCompact ? 1.18 : 1.28);
      visualTranslateY = mapRange(rawProgress, 0.25, 0.5, 0, isCompact ? -14 : -22);
      visualOpacity = 1;
    } else if (rawProgress <= 0.75) {
      visualScale = mapRange(
        rawProgress,
        0.5,
        0.75,
        isCompact ? 1.18 : 1.28,
        isCompact ? 1.36 : 1.62
      );
      visualTranslateY = mapRange(rawProgress, 0.5, 0.75, isCompact ? -14 : -22, isCompact ? -52 : -92);
      visualOpacity = mapRange(rawProgress, 0.5, 0.75, 1, 0);
    } else {
      visualScale = isCompact ? 1.36 : 1.62;
      visualTranslateY = isCompact ? -52 : -92;
      visualOpacity = 0;
      textOpacity = mapRange(rawProgress, 0.75, 1, 1, 0);
    }

    scrollVisual.style.transform = `translateY(${visualTranslateY}px) scale(${visualScale})`;
    scrollVisual.style.opacity = visualOpacity.toFixed(3);
    scrollCopyHeading.style.opacity = textOpacity.toFixed(3);
  };

  updateScrollStory();
  window.addEventListener("scroll", updateScrollStory, { passive: true });
  window.addEventListener("resize", updateScrollStory);
} else if (scrollVisual && scrollCopyHeading) {
  scrollVisual.style.transform = "translateY(0) scale(1)";
  scrollVisual.style.opacity = "1";
  scrollCopyHeading.style.opacity = "1";
}

if (
  aboutStory &&
  aboutIntro &&
  aboutLeft &&
  aboutSide &&
  !prefersReducedMotion.matches &&
  !compactScreen.matches
) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateAboutStory = () => {
    const rect = aboutStory.getBoundingClientRect();
    const scrollable = Math.max(aboutStory.offsetHeight - window.innerHeight, 1);
    const progress = clamp((-rect.top) / scrollable, 0, 1);

    const eased = progress * progress * (3 - 2 * progress);
    const introY = eased * -288;
    const leftY = eased * -112;
    const sideY = eased * -108;

    aboutIntro.style.transform = `translateY(${introY}px)`;
    aboutLeft.style.transform = `translateY(${leftY}px)`;
    aboutSide.style.transform = `translateY(${sideY}px)`;
  };

  updateAboutStory();
  window.addEventListener("scroll", updateAboutStory, { passive: true });
  window.addEventListener("resize", updateAboutStory);
} else if (aboutIntro && aboutLeft && aboutSide) {
  aboutIntro.style.transform = "translateY(0)";
  aboutLeft.style.transform = "translateY(0)";
  aboutSide.style.transform = "translateY(0)";
}

if (howWorkImage && howWorkSteps.length) {
  let howWorkIndex = [...howWorkSteps].findIndex((step) =>
    step.classList.contains("is-active")
  );

  if (howWorkIndex < 0) {
    howWorkIndex = 0;
  }

  const setHowWorkStep = (index) => {
    howWorkSteps.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    const activeStep = howWorkSteps[index];
    if (activeStep?.dataset.image) {
      howWorkImage.src = activeStep.dataset.image;
    }
  };

  howWorkSteps.forEach((step, index) => {
    step.addEventListener("click", () => {
      howWorkIndex = index;
      setHowWorkStep(index);
    });
  });

  setHowWorkStep(howWorkIndex);

  if (!prefersReducedMotion.matches) {
    window.setInterval(() => {
      howWorkIndex = (howWorkIndex + 1) % howWorkSteps.length;
      setHowWorkStep(howWorkIndex);
    }, 2600);
  }
}

if (revealItems.length && !prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (
  cursorAura &&
  window.matchMedia("(pointer: fine)").matches &&
  !prefersReducedMotion.matches
) {
  document.body.classList.add("cursor-enhanced");

  const showAura = () => cursorAura.classList.add("is-visible");
  const hideAura = () => {
    cursorAura.classList.remove("is-visible");
    cursorAura.classList.remove("is-pressed");
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      cursorAura.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%) scale(${cursorAura.classList.contains("is-pressed") ? 0.88 : 1})`;
      showAura();
    },
    { passive: true }
  );

  window.addEventListener("mouseenter", showAura);
  window.addEventListener("mouseleave", hideAura);
  window.addEventListener("mousedown", () => cursorAura.classList.add("is-pressed"));
  window.addEventListener("mouseup", () => cursorAura.classList.remove("is-pressed"));
}
