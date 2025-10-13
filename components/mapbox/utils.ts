import { ManageMapParams } from "./types";

// Map utilities
export const manageMap = ({
  layerData,
  layerId,
  sourceData,
  sourceId,
  mapRef,
}: ManageMapParams) => {
  if (!mapRef.current) return;

  const isSourceLoad = mapRef.current.getSource(sourceId);
  
  if (isSourceLoad && isSourceLoad?.type === "geojson") {
    isSourceLoad.setData(sourceData);
  } else {
    mapRef.current.addSource(sourceId, { type: "geojson", data: sourceData });
  }

  if (!mapRef.current.getLayer(layerId)) {
    mapRef.current.addLayer(layerData);
  }
};
