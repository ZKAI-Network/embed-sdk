import { useState, useEffect, useCallback, useRef } from 'react';

const PULL_THRESHOLD = 100; // Distance to pull before refresh is triggered
const RESISTANCE_FACTOR = 0.5; // How much resistance to feel when pulling

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<any>;
  isDisabled?: boolean;
}

export function usePullToRefresh({ onRefresh, isDisabled = false }: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullingPosition, setPullingPosition] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ y: 0 });
  const isDraggingRef = useRef(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
    setPullingPosition(0);
  }, [onRefresh, isRefreshing]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isDisabled || isRefreshing || window.scrollY > 0) return;
    isDraggingRef.current = true;
    touchStartRef.current.y = e.touches[0].clientY;
  }, [isDisabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current) return;

    const currentY = e.touches[0].clientY;
    const dy = currentY - touchStartRef.current.y;

    if (dy > 0) {
      // Prevent default to stop browser's native overscroll behavior
      e.preventDefault();
      const resistedDy = dy * RESISTANCE_FACTOR;
      setPullingPosition(resistedDy);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    if (pullingPosition > PULL_THRESHOLD) {
      handleRefresh();
    } else {
      setPullingPosition(0);
    }
  }, [pullingPosition, handleRefresh]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const style = {
    transform: `translateY(${pullingPosition}px)`,
    transition: isDraggingRef.current ? 'none' : 'transform 0.3s',
  };

  return { containerRef, isRefreshing, style };
} 
