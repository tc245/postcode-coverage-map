// Pollutant metadata. district coverage values live in data/districts.geojson,
// one property per pollutant (coverage_co, coverage_no2, ...).
export const POLLUTANTS = [
  { key: "co", label: "CO", property: "coverage_co" },
  { key: "no2", label: "NO₂", property: "coverage_no2" },
  { key: "o3", label: "O₃", property: "coverage_o3" },
  { key: "pm10", label: "PM10", property: "coverage_pm10" },
  { key: "pm2.5", label: "PM2.5", property: "coverage_pm25" },
  { key: "so2", label: "SO₂", property: "coverage_so2" },
];

export const DEFAULT_POLLUTANT = "no2";
