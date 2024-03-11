import { useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

export const useIsScrollable = () => {
  const [contentH, setContentH] = useState<number>(0);
  const [layoutH, setLayoutH] = useState<number>(0);

  const onContenteSizeChange = (w: number, h: number) => {
    setContentH(h);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    setLayoutH(event.nativeEvent.layout.height);
  };

  const isScrollable = useMemo(() => contentH > layoutH, [contentH, layoutH]);

  return {
    isScrollable,
    onContenteSizeChange,
    onLayout,
  };
};
