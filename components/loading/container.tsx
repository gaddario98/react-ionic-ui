// src/components/Loading/container.tsx
import React, { useEffect } from "react";
import { useIonLoading } from "@ionic/react";
import { LoadingProps } from "./types";
import { useLoadingValue } from "@gaddario98/react-state";
import { useTranslatedText } from "@gaddario98/react-localization";

// Versione alternativa che utilizza il nativo useIonLoading hook di Ionic
const LoadingContainer: React.FC<Omit<LoadingProps, "visible">> = ({
  text,
  duration,
  ns,
}) => {
  const visible = useLoadingValue();
  const [present, dismiss] = useIonLoading();
  const { traslateText } = useTranslatedText(ns);

  useEffect(() => {
    if (visible && text) {
      present({
        message: traslateText(text),
        duration: duration || undefined,
        spinner: "crescent",
      });
    } else {
      dismiss();
    }
  }, [visible, text, duration, present, dismiss, traslateText]);

  return null;
};
export default LoadingContainer;
