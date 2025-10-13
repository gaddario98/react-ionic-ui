import { useCallback } from "react";
import { useIonRouter, AlertOptions, useIonAlert } from "@ionic/react";
import type {  ListPress } from "./types";
import { useTranslatedText } from "@gaddario98/react-localization";

export const useListItemActions = (ns?: string) => {
  const { traslateText } = useTranslatedText(ns);
  const [presentAlert] = useIonAlert();
  const ionRouter = useIonRouter();

  const openLink = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  // Funzione che mostra un alert di conferma utilizzando Ionic alertController
  const showConfirmAlert = useCallback(
    async (
      title: string,
      message?: string,
      okButtonHandler?: () => void,
      cancelButtonHandler?: () => void
    ) => {
      const alertOptions: AlertOptions = {
        header: title,
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              if (cancelButtonHandler) cancelButtonHandler();
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              if (okButtonHandler) okButtonHandler();
            },
          },
        ],
      };

      await presentAlert(alertOptions);
    },
    [presentAlert]
  );

  const handlePress = useCallback(
    (onPress?: ListPress | (() => void)): void => {
      if (onPress) {
        if (typeof onPress === "function") {
          onPress();
        } else {
          const { link, route, action } = onPress;
          if (route) {
            ionRouter.push(route);
          } else if (link) {
            openLink(link);
          } else if (action) {
            // Usa l'alert controller di Ionic invece del confirm nativo
            showConfirmAlert(
              traslateText(action?.title ?? "confirm", { ns: action?.ns }),
              action?.description 
                ? traslateText(action?.description, { ns: action?.ns }) 
                : undefined,
              action?.okButton?.action,
              action?.cancelButton?.action
            );
          }
        }
      }
    },
    [traslateText, ionRouter, openLink, showConfirmAlert]
  );

  return { handlePress };
};