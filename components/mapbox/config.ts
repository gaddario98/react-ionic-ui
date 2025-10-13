import mapboxgl, { LngLatBoundsLike } from "mapbox-gl";

// Default bounds for Italy/Valle d'Aosta region
export const DEFAULT_BOUNDS: LngLatBoundsLike = [
  6.7612296073187395, 45.4247127112302, 7.959253618227592, 45.99675143961292,
];

// Default center coordinates
export const DEFAULT_CENTER: [number, number] = [7.3223, 45.7354];

export interface MapConfigProps {
  bounds: LngLatBoundsLike;
  center: [number, number];
  zoom: number;
  accessToken: string;
  markerIcon: string;
}

export let mapConfig: MapConfigProps = {
  bounds: DEFAULT_BOUNDS,
  center: DEFAULT_CENTER,
  zoom: 10,
  accessToken: "",
  markerIcon: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2246%22%20height%3D%2256%22%3E%3Cpath%20d%3D%22M23%2056L3.22%2030.82C-3.67%2022.9%201.48%208.9%2012.14%207.23a16.01%2016.01%200%200%201%2017.72%208.9c6.9%2011.97-1.2%2027.96-6.86%2039.87z%22%20fill%3D%22%23e74c3c%22%2F%3E%3Ccircle%20cx%3D%2223%22%20cy%3D%2219%22%20r%3D%229%22%20fill%3D%22%23FFF%22%2F%3E%3C%2Fsvg%3E'
};

export const setMapConfig = (config: Partial<MapConfigProps>) => {
  mapConfig = {
    ...mapConfig,
    ...config,
  };
  mapboxgl.accessToken = mapConfig.accessToken;
};
