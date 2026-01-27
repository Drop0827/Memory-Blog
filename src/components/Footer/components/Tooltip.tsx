'use client';

import { Tooltip } from '@heroui/react';

export default ({ children, content }: { children: React.ReactNode; content: string }) => {
  return (
    <Tooltip showArrow={true} content={content}>
      {children}
    </Tooltip>
  );
};
