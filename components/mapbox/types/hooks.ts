import { MutableRefObject } from 'react';

export interface MapInstanceProps {
  customMapRef?: MutableRefObject<mapboxgl.Map | null>;
  onCustomMapLoad?: () => void;
  setLoading: (loading: boolean) => void;
}

export interface InitializeMapOptions {
  container: HTMLDivElement;
  style: string;
  center: [number, number];
  zoom: number;
  bounds?: mapboxgl.LngLatBoundsLike;
  blockMap: boolean;
  disableBounds: boolean;
  mobilePitchAndBearing: Record<string, any>;
  onLoad?: () => void;
}

export interface PositionMarkerProps {
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  color: string;
  defaultZoom: number;
}

export interface Marker {
  id: string | number;
  title: string;
  lnglat: [number, number];
}

export interface MarkersManagerProps {
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  markers: Marker[];
  markerIcon?: HTMLImageElement;
  clickHandler?: (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => void;
}
