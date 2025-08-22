document.addEventListener("DOMContentLoaded", function (event) {
  if (document.body.classList.contains("home")) {
    window.addEventListener(
      "load",
      function (e) {
        const gb = gsap.timeline();

        gb.to(".goguma-box", {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay: 2,
          ease: "power2.out",
        }).to(".goguma-box", {
          scale: 1.07,
          duration: 1.2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });

        gsap.to(".main-sticker", {
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.4)",
          stagger: 0.3,
          delay: 2,
        });

        gsap.to(".sticker-hot", {
          scale: 1,
          duration: 1,
          ease: "back.out(1.4)",
        });

        const tl = gsap.timeline();

        tl.fromTo(
          ".main-kv-wrapper",
          {
            backgroundPosition: "center bottom -340px",
          },
          {
            backgroundPosition: "center bottom -40px",
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          }
        ).to(".main-slider", {
          y: "0%",
          duration: 1,
          ease: "power2.out",
          opacity: 1,
        });
      },
      false
    );
  }

  if (
    window.location.pathname === "/about" ||
    window.location.pathname === "/about/"
  ) {
    window.addEventListener(
      "load",
      function (e) {
        gsap.to(".about-sticker", {
          opacity: 1,
          delay: 0.5,
          duration: 0.001,
          stagger: { each: 0.2, from: "random" },
          ease: "none",
        });

        gsap.fromTo(
          ".about-steam",
          { y: 100, opacity: 0, scale: 0.8 },
          {
            keyframes: [
              { opacity: 1, scale: 1, duration: 1 },
              { y: -300, opacity: 0, duration: 9 },
            ],
            repeat: -1,
          }
        );
      },
      false
    );
  }
});
