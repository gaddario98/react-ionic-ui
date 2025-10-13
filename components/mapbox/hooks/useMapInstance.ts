import { useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { mapConfig } from "../config";
import { MapInstanceProps, InitializeMapOptions } from "../types/hooks";

export const useMapInstance = ({
  customMapRef,
  onCustomMapLoad,
  setLoading,
}: MapInstanceProps) => {
  const mapRef = customMapRef ?? useRef<mapboxgl.Map | null>(null);

  const initializeMap = useCallback((options: InitializeMapOptions) => {
    if (!mapboxgl.accessToken) {
      setLoading(false);
      console.error("Mapbox access token is not set.");
      return;
    }
    const {
      container,
      style,
      center,
      zoom,
      bounds,
      blockMap,
      disableBounds,
      onLoad,
    } = options;

    if (mapRef.current?.loaded()) {
      mapRef.current?.remove();
      setLoading(true);
    }

    mapRef.current = new mapboxgl.Map({
      container,
      style,
      center,
      zoom,
      logoPosition: "top-left",
      attributionControl: false,
      dragPan: !blockMap,
      dragRotate: !blockMap,
      scrollZoom: true,
      touchZoomRotate: !blockMap,
   //   ...mobilePitchAndBearing,
    });

    if (!disableBounds) {
      mapRef.current.setMaxBounds(bounds ?? mapConfig.bounds);
    }

    mapRef.current.on("load", () => {
      if (!mapRef.current) return;
      onCustomMapLoad?.();
      mapRef.current.resize();
      onLoad?.();
      setLoading(false);
    });
  }, []);

  return { mapRef, initializeMap };
};
