import { useEffect, useRef, memo, useState, useCallback } from "react";
import { IonSpinner } from "@ionic/react";
import { MapBoxProps } from "../types";
import { mapConfig } from "../config";
import { isWeb } from "@gaddario98/react-ionic-utiles";
import { useThemeValue } from "../../../styles";
import { useMarkersManager, usePositionMarker, useMapInstance } from "../hooks";

const mobilePitchAndBearing = !isWeb
  ? {
      pitch: 0,
      bearing: 0,
      cooperativeGestures: true,
    }
  : {};

const MapBox = ({
  onMapLoad: onCustomMapLoad,
  center = mapConfig.center,
  zoom = mapConfig.zoom,
  bounds,
  blockMap = false,
  disableBounds = false,
  children,
  position,
  className,
  markerIcon,
  clickHandler,
  markers = [],
  mapRef: customMapRef,
}: MapBoxProps) => {
  const [loading, setLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useThemeValue();

  // Custom hooks per gestire le diverse funzionalità
  const { mapRef, initializeMap } = useMapInstance({
    customMapRef,
    onCustomMapLoad,
    setLoading,
  });

  const { updatePosition } = usePositionMarker({
    mapRef,
    color: "black",
    defaultZoom: 13,
  });

  const { handleMarkers } = useMarkersManager({
    mapRef,
    markers,
    markerIcon,
    clickHandler,
  });

  const onLoad = useCallback((func: () => void) => {
    if (!mapRef.current?.loaded()) {
      mapRef.current?.on("load", func);
    } else {
      func();
    }
  }, []);

  // Inizializzazione mappa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    initializeMap({
      container: mapContainerRef.current,
      style: `mapbox://styles/mapbox/${theme === "dark" ? "dark-v10" : "light-v10"}`,
      center,
      zoom,
      bounds,
      blockMap,
      disableBounds,
      mobilePitchAndBearing,
    });

    return () => mapRef.current?.remove();
  }, [center, zoom, blockMap, disableBounds, bounds]);

  const update = useCallback(() => {
    const func = handleMarkers;
    if (mapRef.current?.isStyleLoaded()) {
      func();
    } else {
      mapRef.current?.on("style.load", func);
    }
  }, [handleMarkers]);

  useEffect(() => {
    onLoad(() => position && updatePosition(position));
  }, [position]);

  useEffect(() => {
    onLoad(() => {
      const mapTheme = theme === "dark" ? "dark-v10" : "light-v10";
      const mapStyle = `mapbox://sprites/mapbox/${mapTheme}`;
      if (mapRef.current?.getStyle()?.sprite !== mapStyle) {
        mapRef.current?._updateStyle(mapStyle);
      }
      update();
    });
  }, [theme, update]);

  return (
    <div
      className={`h-full relative flex flex-col rounded-md ${className?.container}`}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex justify-center items-center">
          <IonSpinner name="crescent" />
        </div>
      )}
      <div
        id="map"
        className={`h-full flex-1 w-full ${className?.map}`}
        ref={mapContainerRef}
      />
      {children}
    </div>
  );
};

export default memo(MapBox);
