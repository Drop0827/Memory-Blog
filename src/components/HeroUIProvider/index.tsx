'use client';

import { HeroUIProvider } from '@heroui/react';

export default ({ children }: { children: React.ReactNode }) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};
