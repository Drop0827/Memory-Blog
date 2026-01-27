'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useConfigStore } from '@/stores';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import TimerSvg from '@/assets/svg/other/timer.svg';

const AnimatedNumber = ({ value, suffix, onComplete }: { value: number; suffix: string; onComplete?: () => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, {
        duration: 2,
        ease: 'easeOut',
        onComplete: () => {
          onComplete?.();
        },
      });
      return animation.stop;
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="inline-block dark:text-gray-400">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

export default () => {
  const { web } = useConfigStore();
  const [showDetailed, setShowDetailed] = useState(false);

  const calculateTimeDifference = (startTimestamp: number) => {
    const startDate = new Date(+startTimestamp);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - startDate.getFullYear();
    let months = currentDate.getMonth() - startDate.getMonth();
    let days = currentDate.getDate() - startDate.getDate();

    if (days < 0) {
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    // 计算总天数
    const totalDays = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
  };

  const timeDiff = calculateTimeDifference(web?.create_time);

  const handleTotalDaysComplete = () => {
    // 总天数动画完成后立即切换到详细显示
    setShowDetailed(true);
  };

  return (
    <div className="flex flex-col tw_container bg-white dark:bg-black-b p-4 mb-5 tw_title">
      <div className="tw_title w-full dark:text-white">
        <Image src={TimerSvg} alt="站点运行时间" width={33} height={23} /> 站点运行时间
      </div>

      <div className="mt-2.5">
        {!showDetailed ? (
          <AnimatedNumber value={timeDiff.totalDays} suffix="天" onComplete={handleTotalDaysComplete} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <AnimatedNumber value={timeDiff.years} suffix="年 " />
            <AnimatedNumber value={timeDiff.months} suffix="个月 " />
            <AnimatedNumber value={timeDiff.days} suffix="天" />
          </motion.div>
        )}
      </div>
    </div>
  );
};
