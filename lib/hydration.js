// lib/hydration.js
'use client';

import { useEffect, useState } from 'react';
import { useProfileStore } from "@/store/useProfileStore";
import { usePlannerStore } from "@/store/usePlannerStore";
import { useAuthStore } from '@/store/useAuthStore';

export function useStoreHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const checkAllHydrated = () => {
      if (
        usePlannerStore.persist.hasHydrated() &&
        useProfileStore.persist.hasHydrated() &&
        useAuthStore.persist.hasHydrated()
      ) {
        setHydrated(true);
      }
    };

    const unsubs = [
      usePlannerStore.persist.onFinishHydration(checkAllHydrated),
      useProfileStore.persist.onFinishHydration(checkAllHydrated),
      useAuthStore.persist.onFinishHydration(checkAllHydrated)
    ];

    // Initial check for server-side or cached hydration
    checkAllHydrated();

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  return hydrated;
}