import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function setupGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Fade-in and scale-in animations when elements come into view
  const fadeIns = document.querySelectorAll('.fade-in');
  fadeIns.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      }
    );
  });

  const scaleIns = document.querySelectorAll('.scale-in');
  scaleIns.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      }
    );
  });
}
