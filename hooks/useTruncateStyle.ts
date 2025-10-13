import { useMemo } from 'react';

interface UseTruncateStyleProps {
  numberOfLines?: number;
}

export const useTruncateStyle = ({ numberOfLines }: UseTruncateStyleProps) => {
  return useMemo(() => {
    if (!numberOfLines) return {};
    
    return {
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: numberOfLines,
      WebkitBoxOrient: 'vertical',
    } as React.CSSProperties;
  }, [numberOfLines]);
};