'use client';

import { useEffect } from 'react';
import './index.scss';

const StarrySky = () => {
  useEffect(() => {
    /*星星的密集程度，数字越大越多*/
    const stars = 800;
    const starsContainer = document.querySelector('.stars_starrySky');

    /*星星的看起来的距离,值越大越远,可自行调制到自己满意的样子*/
    const r = 800;
    for (let i = 0; i < stars; i++) {
      const star = document.createElement('div');
      star.classList.add('star_starrySky');
      starsContainer?.appendChild(star);
    }

    const starElements = document.querySelectorAll<HTMLElement>('.star_starrySky');
    starElements?.forEach((starElement) => {
      const s = 0.2 + Math.random() * 1;
      const curR = r + Math.random() * 300;
      starElement.style.transformOrigin = `0 0 ${curR}px`;
      starElement.style.transform = `translate3d(0,0,-${curR}px) rotateY(${Math.random() * 360}deg) rotateX(${Math.random() * -50}deg) scale(${s},${s})`;
    });
  }, []);

  return (
    <div className="StarryComponent">
      <div className="overflow-hidden absolute w-full h-[180%] sm:h-[160%] md:h-[150%]">
        {/*背景层，不要删除，否则没有作用*/}
        <div className="stars_starrySky"></div>
      </div>
    </div>
  );
};

export default StarrySky;
