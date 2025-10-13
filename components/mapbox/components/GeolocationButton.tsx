import { type Map } from "mapbox-gl";
import { ComponentProps, MutableRefObject } from "react";
import { useCallback } from "react";
import { locateOutline } from "ionicons/icons";
import useGeolocation from "../hooks/useGeolocation";
import { Button } from "../../button";
import { IonIcon } from "@ionic/react";
import { typography } from "../../../styles";
import { isWeb } from "@gaddario98/react-ionic-utiles";

interface Props {
  mapRef: MutableRefObject<Map | null>;
  setNewPosition: (position: [number, number]) => void;
  className?: string;
  buttonProps?: ComponentProps<typeof Button>;
  viewButton?: boolean;
}
const GeolocationButton = ({
  mapRef,
  setNewPosition,
  className,
  viewButton,
}: Props) => {
  const { getUserPosition } = useGeolocation();

  const setCurrentPosition = useCallback(async () => {
    try {
      const position = await getUserPosition();
      if (position) {
        const coords: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        if (mapRef.current?.loaded()) {
          setNewPosition(coords);
        } else {
          mapRef.current?.on("load", () => setNewPosition(coords));
        }
      }
    } catch (error) {
      console.error("Error getting position:", error);
    }
  }, [getUserPosition, mapRef, setNewPosition]);

  if(isWeb){
    return 
  }

  if (viewButton) {
    return (
      <Button
        iconOnly
        endIcon={{ name: locateOutline, className: typography.icon.title }}
        onClick={setCurrentPosition}
        className={className}
        variant="outlined"
        size="small"
      />
    );
  }

  return (
    <IonIcon
      icon={locateOutline}
      onClick={setCurrentPosition}
      className={`${className ?? ""} ${typography.icon.title}`}
      color="primary"
      slot="end"
    />
  );
};

export default GeolocationButton;
