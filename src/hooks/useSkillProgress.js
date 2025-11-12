import { useEffect } from 'react';
import gsap from 'gsap';

export default function useSkillProgress() {
  useEffect(() => {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach((bar) => {
      const target = Number(bar.getAttribute('data-progress')) || 0;
      gsap.to(bar, { width: `${target}%`, duration: 1.2, ease: 'power2.out', delay: 0.2 });
    });
  }, []);
}
