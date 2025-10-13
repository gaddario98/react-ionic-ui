import { useCallback, useState } from "react";
import { Geolocation, Position } from "@capacitor/geolocation";
import { useIonAlert } from "@ionic/react";
import { Capacitor } from "@capacitor/core";

interface UseGeolocationReturn {
  getUserPosition: () => Promise<Position | undefined>;
  position: Position | null;
  error: Error | null;
}

const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [presentAlert] = useIonAlert();

  const controlPermission = useCallback(
    async (func?: () => void) => {
      try {
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location === "granted") {
          if (func) func();
          return permissions.location;
        } else {
          const request = await Geolocation.requestPermissions();
          if (request.location === "granted" && func) {
            func();
          }
          return request.location;
        }
      } catch (err) {
        if ((err as Error)?.message === "Location services are not enabled") {
          presentAlert({
            header: "Geolocalizzazione disattivata",
            message:
              "Per utilizzare questa funzionalità, attiva la geolocalizzazione nelle impostazioni del tuo dispositivo.",
            buttons: ["OK"],
          });
        }
        return "denied";
      }
    },
    [presentAlert]
  );

  const getPosition = useCallback(async () => {
    try {
      console.log('getPosition')
      let permission = "granted";
      if (Capacitor.isNativePlatform()) {
        permission = await controlPermission();
      }
      if (permission === "granted") {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        setPosition(position);
        return position;
      }
    } catch (err) {
      setError(err as Error);
      return undefined;
    }
  }, [setPosition, setError]);

  const getUserPosition = useCallback(async (): Promise<
    Position | undefined
  > => {
    return await getPosition();
  }, [getPosition]);

  return { getUserPosition, position, error };
};

export default useGeolocation;
