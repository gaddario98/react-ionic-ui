import {
  type Map,
  LayerSpecification,
  LngLatBoundsLike,
  MapMouseEvent,
  SourceSpecification,
} from "mapbox-gl";
import { MutableRefObject, ReactNode } from "react";

// Base MapBox component props
export interface MapBoxProps {
  onMapLoad?: () => void;
  center?: [number, number];
  zoom?: number;
  bounds?: LngLatBoundsLike;
  blockMap?: boolean;
  disableBounds?: boolean;
  children?: ReactNode;
  className?: {
    container?: string;
    map?: string;
  };
  position?: [number, number];
  markerIcon?: HTMLImageElement;
  markers?: Array<
    {
      id: string;
      title: string;
      lnglat: [number, number];
    } & Record<string, any>
  >;
  clickHandler?: (e: MapMouseEvent) => void; // Updated type
  mapRef?:  MutableRefObject<mapboxgl.Map | null>;
}

// Map utility function params
export interface ManageMapParams {
  sourceId: string;
  sourceData: Required<
    Extract<SourceSpecification, { type: "geojson" }>
  >["data"];
  layerId: string;
  layerData: LayerSpecification;
  mapRef: MutableRefObject<mapboxgl.Map | null>;
}
