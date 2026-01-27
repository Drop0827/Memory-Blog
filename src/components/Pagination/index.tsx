'use client';

import { useRouter } from 'next/navigation';
import { Pagination } from '@heroui/react';

interface Props {
  total: number;
  page: number;
  size?: number;
  path?: string;
  className?: string;
}

export default ({ total, page, path, className }: Props) => {
  const router = useRouter();

  const onChange = (page: number) => {
    router.push(path ? `${path}&page=${page}` : `?page=${page}`);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={className}>
      <Pagination showControls total={total} page={+page} onChange={onChange} classNames={{ item: 'shadow-none bg-transparent dark:hover:!bg-black-b  ', prev: 'dark:bg-black-b  ', next: 'dark:bg-black-b  ' }} />
    </div>
  );
};
