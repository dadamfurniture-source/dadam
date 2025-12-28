'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [designContext, setDesignContext] = useState<any>({
    category: null,
    dimensions: { width: 0, height: 0, depth: 0 },
    modules: [],
  });

  return (
    <ChatInterface
      context={designContext}
      onContextUpdate={setDesignContext}
    />
  );
}
