import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { PositionMarkerProps } from '../types/hooks';

export const usePositionMarker = ({ mapRef, color, defaultZoom }: PositionMarkerProps) => {
  const markerRef = useRef<mapboxgl.Marker>(
    new mapboxgl.Marker({ color })
  );

  const updatePosition = useCallback((position: [number, number]) => {
    if (!mapRef.current) return;
    
    markerRef.current.remove();
    markerRef.current.setLngLat(position).addTo(mapRef.current);
    mapRef.current.setCenter(position);
    mapRef.current.setZoom(defaultZoom);
  }, [defaultZoom, mapRef]);

  return { markerRef, updatePosition };
};
