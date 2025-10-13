import { useCallback, useMemo, useRef } from "react";
import { manageMap } from "../utils";
import { mapConfig } from "../config";
import { MarkersManagerProps } from "../types/hooks";

export const useMarkersManager = ({
  mapRef,
  markers,
  markerIcon,
  clickHandler,
}: MarkersManagerProps) => {
  const prevClickHandler = useRef(clickHandler);

  const defaultMarkerIcon = useMemo(() => {
    if (markerIcon) return markerIcon;
    const img = new Image();
    img.src = mapConfig.markerIcon;
    return img;
  }, [markerIcon]);

  const handleMarkers = useCallback(() => {
    if (!mapRef.current || !markers) return;

    if (!mapRef.current.hasImage("custom-marker")) {
      mapRef.current.addImage("custom-marker", defaultMarkerIcon);
    }

    manageMap({
      layerData: {
        id: "places",
        type: "symbol",
        source: "places",
        layout: {
          "icon-image": "custom-marker",
          "icon-allow-overlap": true,
          "icon-size": 0.8,
        },
      },
      layerId: "places",
      sourceData: {
        type: "FeatureCollection",
        features: markers.map((el) => ({
          type: "Feature",
          properties: el,
          geometry: { type: "Point", coordinates: el.lnglat },
          id: el.id,
        })),
      },
      sourceId: "places",
      mapRef,
    });

    if (prevClickHandler.current) {
      mapRef.current.off("click", "places", prevClickHandler.current);
    }
    
    if (clickHandler) {
      mapRef.current.on("click", "places", clickHandler);
      prevClickHandler.current = clickHandler;
    }
  }, [markers, defaultMarkerIcon, clickHandler, mapRef]);

  return { handleMarkers };
};
