'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from '../../svg/dynamic.svg';
import { getRecordPagingAPI } from '@/api/record';
import { Record } from '@/types/app/record';
import { extractText } from '@/utils';

export default function Dynamic({ className }: { className?: string }) {
  const [list, setList] = useState<Record[]>([]);

  const getRecordList = async () => {
    const { data } = (await getRecordPagingAPI({ pagination: { page: 1, size: 8 } })) || { data: {} as Paginate<Record[]> };
    setList(data?.result || []);
  };

  useEffect(() => {
    getRecordList();
  }, []);

  // 使用useState来管理当前显示的内容索引
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // 使用useEffect来设置定时器
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // 开始淡出
      setTimeout(() => {
        setCurrentContentIndex((prevIndex) => (prevIndex + 1) % list.length);
        setFade(true); // 淡入新内容
      }, 500); // 500ms的淡出时间
    }, 5000); // 每2.5秒切换一次内容，包括500ms的过渡时间

    // 清除定时器
    return () => clearInterval(interval);
  }, [list]);

  return (
    <div className={`flex justify-between items-center w-full px-4 py-3 border dark:border-transparent rounded-lg bg-white dark:bg-black-b mb-2 ${className}`}>
      <div className="flex items-center">
        <Image src={dynamic} alt="动态" width={25} height={25} className="mr-2 w-[25px] h-[25px]" />
        <span>最新动态：</span>
      </div>

      <Link href="/record" className={`flex-1 line-clamp-1 hover:text-primary cursor-pointer ${fade ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        {extractText(list[currentContentIndex]?.content || '')}
      </Link>
    </div>
  );
}
