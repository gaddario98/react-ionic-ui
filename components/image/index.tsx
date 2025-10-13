// src/components/Image/index.tsx
import { memo, useMemo, useEffect, useRef, useState, useCallback } from "react";
import { IonImg, createAnimation } from "@ionic/react";
import { useComposeClassNames } from "../../hooks";

export type ImageResizeMode = "cover" | "contain" | "fill" | "none";
export type ImagePosition = "center" | "top" | "bottom" | "left" | "right";

interface ImageWithFallbackProps {
  src: string | string[] | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
  resizeMode?: ImageResizeMode;
  position?: ImagePosition;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
}

const getPositionClass = (position: ImagePosition): string => {
  const positionMap: Record<ImagePosition, string> = {
    center: "object-center",
    top: "object-top",
    bottom: "object-bottom",
    left: "object-left",
    right: "object-right",
  };

  return positionMap[position];
};

const getResizeModeClass = (mode: ImageResizeMode): string => {
  const modeMap: Record<ImageResizeMode, string> = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  };

  return modeMap[mode];
};

const ImageComponent = ({
  src,
  alt,
  width = 0,
  height = 0,
  className,
  containerClassName,
  fallbackSrc = "",
  resizeMode = "cover",
  position = "center",
  onLoad,
  onError,
  fill = false,
}: ImageWithFallbackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [, setHasError] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (!src) return fallbackSrc;
    if (typeof src === "string") return src;
    if (Array.isArray(src) && src.length > 0) return src[0];
    return fallbackSrc;
  }, [fallbackSrc, src]);

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      const animation = createAnimation()
        .addElement(containerRef.current)
        .duration(300)
        .fromTo("opacity", "0", "1");

      animation.play();

      return () => {
        animation.stop();
      };
    }
  }, [isLoaded]);

  useEffect(() => {
    setImageSrc(resolvedSrc);
    setHasError(false);
    setIsLoaded(false);
  }, [resolvedSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [setIsLoaded, onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setImageSrc(fallbackSrc);
    onError?.();
  }, [fallbackSrc, onError]);

  const imageClasses = useComposeClassNames({
    baseClasses: `
      ${getResizeModeClass(resizeMode)}
      ${getPositionClass(position)}
    `,
    additionalClasses: className,
  });

  const containerClasses = useComposeClassNames({
    baseClasses: "ion-relative",
    additionalClasses: containerClassName,
  });

  const containerStyle = useMemo(
    () => ({
      width: fill ? "100%" : width ? `${width}px` : "100%",
      height: fill ? "100%" : height ? `${height}px` : "auto",
      overflow: "hidden",
      opacity: isLoaded ? 1 : 0,
    }),
    [width, fill, height, isLoaded]
  );

  // Se non c'è una sorgente valida, non renderizzare nulla
  if (!src && !fallbackSrc) return null;

  return (
    <div ref={containerRef} className={containerClasses} style={containerStyle}>
      <IonImg
        src={imageSrc || fallbackSrc}
        alt={alt}
        className={imageClasses}
        onIonImgDidLoad={handleLoad}
       // onIonError={handleError}
      />
    </div>
  );
};

ImageComponent.displayName = "Image";

export const Image = memo(ImageComponent);
