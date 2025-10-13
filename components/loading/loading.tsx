// src/components/Loading/loading.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { IonSpinner, IonText, createAnimation } from "@ionic/react";
import { LoadingProps } from "./types";
import { useTranslatedText } from "@gaddario98/react-localization";

const Loading: React.FC<LoadingProps> = ({
  visible = true,
  text,
  overlay = false,
  size = "large",
  className = "",
  textClassName = "",
  color,
  ns,
}) => {
  const { traslateText } = useTranslatedText(ns);
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef1 = useRef<HTMLDivElement>(null);
  const backgroundRef2 = useRef<HTMLDivElement>(null);

  // Per mantenere il controllo delle animazioni
  const animationsRef = useRef<{ destroy: () => void }[]>([]);

  // Usa il colore fornito o il default di Ionic (primary)
  const spinnerColor = useMemo(() => (color ? undefined : "primary"), [color]);
  const spinnerStyle = useMemo(() => (color ? { color } : undefined), [color]);
  const textStyle = useMemo(() => (color ? { color } : undefined), [color]);

  useEffect(() => {
    // Pulisce le animazioni precedenti
    animationsRef.current.forEach((anim) => anim.destroy());
    animationsRef.current = [];

    if (visible && contentRef.current) {
      // Animazione del contenuto
      const contentAnimation = createAnimation()
        .addElement(contentRef.current)
        .duration(200)
        .fromTo("opacity", "0", "1")
        .fromTo("transform", "scale(0.9)", "scale(1)");

      contentAnimation.play();
      animationsRef.current.push(contentAnimation);

      // Animazioni di background (solo in modalità overlay)
      if (overlay) {
        if (backgroundRef1.current) {
          const backgroundAnimation1 = createAnimation()
            .addElement(backgroundRef1.current)
            .duration(6000)
            .iterations(Infinity)
            .keyframes([
              { offset: 0, transform: "translateX(-50vw)" },
              { offset: 0.5, transform: "translateX(50vw)" },
              { offset: 1, transform: "translateX(-50vw)" },
            ]);

          backgroundAnimation1.play();
          animationsRef.current.push(backgroundAnimation1);
        }

        if (backgroundRef2.current) {
          const backgroundAnimation2 = createAnimation()
            .addElement(backgroundRef2.current)
            .duration(8000)
            .iterations(Infinity)
            .keyframes([
              { offset: 0, transform: "translateX(50vw)" },
              { offset: 0.5, transform: "translateX(-50vw)" },
              { offset: 1, transform: "translateX(50vw)" },
            ]);

          backgroundAnimation2.play();
          animationsRef.current.push(backgroundAnimation2);
        }
      }
    }

    // Cleanup delle animazioni quando smonta il componente
    return () => {
      animationsRef.current.forEach((anim) => anim.destroy());
    };
  }, [visible, overlay]);

  const LoadingContent = useMemo(
    () => (
      <div
        ref={contentRef}
        className={`ion-text-center ion-padding ${className}`}
      >
        <div className="ion-padding-bottom">
          <IonSpinner
            name="crescent"
            color={spinnerColor}
            style={spinnerStyle}
            className={
              size === "large"
                ? "w-16 h-16"
                : size === "medium"
                  ? "w-12 h-12"
                  : "w-8 h-8"
            }
          />
        </div>

        {text && (
          <IonText style={textStyle} className={textClassName}>
            <p>{traslateText(text)}</p>
          </IonText>
        )}
      </div>
    ),
    [
      className,
      size,
      spinnerColor,
      spinnerStyle,
      text,
      textClassName,
      textStyle,
      traslateText,
    ]
  );

  if (!visible) return null;

  if (overlay) {
    return (
      <div
        className="ion-position-fixed ion-position-cover ion-flex ion-align-items-center ion-justify-content-center"
        style={{ background: "rgba(0, 0, 0, 0.7)", zIndex: 9999 }}
      >
        <div
          ref={backgroundRef1}
          className="ion-position-absolute"
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "rgba(45, 211, 111, 0.3)",
            top: "10%",
          }}
        />

        <div
          ref={backgroundRef2}
          className="ion-position-absolute"
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "rgba(56, 128, 255, 0.2)",
            bottom: "10%",
          }}
        />

        <div className="ion-position-relative" style={{ zIndex: 10 }}>
          {LoadingContent}
        </div>
      </div>
    );
  }

  return LoadingContent;
};

export default React.memo(Loading);
