import { IonContent, IonPage } from "@ionic/react";
import { FullLoading } from "./loading";
import { memo } from "react";

const Container: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <FullLoading />
      </IonContent>
    </IonPage>
  );
};
export const FullLoadingContainer = memo(Container);
