import { useEffect } from "react";
import { createAnimation } from "@ionic/react";

interface BaseAnimationConfig {
  enabled?: boolean;
  duration?: number;
  initialOpacity?: string;
  finalOpacity?: string;
  initialTransform?: string;
  finalTransform?: string;
}

export const useBaseAnimation = (
  elementRef: React.RefObject<HTMLElement | null>,
  config: BaseAnimationConfig = {}
) => {
  const {
    enabled = true,
    duration = 300,
    initialOpacity = "0",
    finalOpacity = "1",
    initialTransform = "translateY(5px)",
    finalTransform = "translateY(0)",
  } = config;

  useEffect(() => {
    if (elementRef.current && enabled) {
      const animation = createAnimation()
        .addElement(elementRef.current)
        .duration(duration)
        .fromTo("opacity", initialOpacity, finalOpacity)
        .fromTo("transform", initialTransform, finalTransform);

      animation.play();

      return () => {
        animation.stop();
      };
    }
  }, [
    elementRef,
    duration,
    initialOpacity,
    finalOpacity,
    initialTransform,
    finalTransform,
  ]);
};
