import { IonItem } from "@ionic/react";
import { ComponentProps, PropsWithChildren } from "react";

export const CustomIonItem = ({
  children,
  className = "",
}: PropsWithChildren & ComponentProps<typeof IonItem>) => {
  return (
    <div className="w-full">
      <IonItem
        lines="none"
        className={`ion-radius min-h-fit w-full ${className}`}
      >
        {children}
      </IonItem>
    </div>
  );
};
