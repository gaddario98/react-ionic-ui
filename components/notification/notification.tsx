import React, { useRef } from "react";
import { IonToast } from "@ionic/react";
import { useTranslatedText } from "@gaddario98/react-localization";
import type { TOptions } from "i18next";
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  warningOutline,
} from "ionicons/icons";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface IonicNotificationProps {
  message: string;
  type?: NotificationType;
  visible?: boolean;
  onDismiss?: () => void;
  autoHideDuration?: number;
  className?: string;
  textTransOption?: TOptions;
  header?: string;
  position?: "top" | "middle" | "bottom";
  positionAnchor?: string;
}

// Mappa i tipi di notifica ai colori di Ionic
export const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case "success":
      return "success";
    case "error":
      return "danger";
    case "warning":
      return "warning";
    case "info":
      return "primary";
    default:
      return "dark";
  }
};

// Mappa i tipi di notifica alle icone di Ionic
export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case "success":
      return checkmarkCircleOutline;
    case "error":
      return alertCircleOutline;
    case "warning":
      return warningOutline;
    case "info":
      return informationCircleOutline;
    default:
      return informationCircleOutline;
  }
};

const IonicNotification: React.FC<IonicNotificationProps> = ({
  message,
  type = "info",
  visible = true,
  onDismiss,
  autoHideDuration = 5000,
  textTransOption,
  header,
  position = "top",
  positionAnchor,
}) => {
  const { traslateText } = useTranslatedText();
  const toastRef = useRef<HTMLIonToastElement>(null);

  return (
    <IonToast
      ref={toastRef}
      isOpen={visible}
      onDidDismiss={onDismiss}
      message={traslateText(message, textTransOption)}
      header={header ? traslateText(header) : undefined}
      duration={autoHideDuration}
      position={position}
      color={getNotificationColor(type)}
      icon={getNotificationIcon(type)}
      positionAnchor={positionAnchor}
      swipeGesture="vertical"
      
      buttons={[
        {
          role: "cancel",
          handler: onDismiss,
        },
      ]}
      cssClass="custom-toast"
    />
  );
};

export default IonicNotification;
