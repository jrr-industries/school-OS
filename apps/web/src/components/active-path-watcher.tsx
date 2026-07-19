'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useActivePathStore } from '@/store/active-path';

export function ActivePathWatcher() {
  const pathname = usePathname();
  const setActivePath = useActivePathStore((s) => s.setActivePath);
  const prevRef = useRef(pathname);

  useEffect(() => {
    if (prevRef.current !== pathname) {
      prevRef.current = pathname;
      setActivePath(pathname);
    }
  }, [pathname, setActivePath]);

  return null;
}
