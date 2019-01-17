import turfCircle from "@turf/circle";
export const getPositionInCircle = (center, radius = 1, index) => {
  const options = { steps: index > 12 ? index + 1 : 12, units: "kilometers" };
  const circle = turfCircle(center, radius, options);
  console.log("-", index, circle, circle.geometry.coordinates[0][index]);
  return circle.geometry.coordinates[0][index];
};
