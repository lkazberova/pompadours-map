import turfCircle from "@turf/circle";
import isFunction from "lodash.isfunction";
export const getPositionInCircle = (center, radius = 1, index) => {
  const options = { steps: index > 12 ? index + 1 : 12, units: "kilometers" };
  const circle = turfCircle(center, radius, options);
  // console.log("-", index, circle, circle.geometry.coordinates[0][index]);
  return circle.geometry.coordinates[0][index];
};
export const getLatitude = ({
  geometry: {
    location: { lat }
  }
}) => (isFunction(lat) ? lat() : lat);
export const getLongitude = ({
  geometry: {
    location: { lng }
  }
}) => (isFunction(lng) ? lng() : lng);
export const getBBox = ({ geometry: { viewport } }) => [
  [viewport.getSouthWest().lng(), viewport.getSouthWest().lat()],
  [viewport.getNorthEast().lng(), viewport.getNorthEast().lat()]
];
