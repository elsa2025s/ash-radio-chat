'use client';

import { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

export default function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // C'est la ligne importante qui a changé !
    return <div data-hydration-placeholder style={{ display: 'none' }}></div>;
  }

  return <>{children}</>;
}