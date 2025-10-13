import React, { useState, useCallback } from "react";
import { useIonViewDidEnter, useIonViewDidLeave } from "@ionic/react";
import IonicNotification from "./notification";
import { useNotificationState } from "@gaddario98/react-notifications";


const IonicNotificationContainer: React.FC<{ pageId?: string }> = ({
  pageId,
}) => {
  const [notification, setNotification] = useNotificationState();
  const [active, setActive] = useState(false);

  // Quando la pagina diventa attiva
  useIonViewDidEnter(() => {
    setActive(true);
  });

  // Quando la pagina viene nascosta
  useIonViewDidLeave(() => {
    setActive(false);
  });
  const handleDismiss = useCallback(() => {
    setNotification(null);
  }, [setNotification]);

  if (!notification || !active) return null;

  return (
    <IonicNotification
      visible={true}
      onDismiss={handleDismiss}
      position="top"
      {...notification}
      positionAnchor={`${pageId ?? "page"}-header`}
      textTransOption={{
        ...(notification.textTransOption ?? {}),
        ns: notification.ns ?? notification.textTransOption?.ns,
      }}
    />
  );
};

export default IonicNotificationContainer;
