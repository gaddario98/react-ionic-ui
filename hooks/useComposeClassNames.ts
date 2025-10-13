import { useMemo } from 'react';
import { cn } from '@gaddario98/react-ionic-utiles';

interface UseComposeClassNamesProps {
  baseClasses: string;
  additionalClasses?: string;
  conditionalClasses?: Record<string, boolean>;
}

export const useComposeClassNames = ({
  baseClasses,
  additionalClasses,
  conditionalClasses = {}
}: UseComposeClassNamesProps) => {
  return useMemo(() => {
    return cn(
      baseClasses,
      additionalClasses,
      conditionalClasses
    );
  }, [baseClasses, additionalClasses, conditionalClasses]);
};

