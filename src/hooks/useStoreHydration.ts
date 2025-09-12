import { useEffect } from 'react';
import useAppStore from '@/store';

export function useStoreHydration() {
  useEffect(() => {
    // Manually trigger hydration on client side
    useAppStore.persist.rehydrate();
  }, []);
}
