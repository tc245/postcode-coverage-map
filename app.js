import { POLLUTANTS, DEFAULT_POLLUTANT } from "./data.js";

const SCALE_STOPS = [
  [0, [249, 250, 251]],
  [25, [156, 201, 209]],
  [50, [79, 168, 184]],
  [75, [14, 124, 143]],
  [100, [11, 85, 99]],
];

function colorFor(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "#f3f4f6";
  const v = Math.max(0, Math.min(100, value));
  for (let i = 0; i < SCALE_STOPS.length - 1; i++) {
    const [v0, c0] = SCALE_STOPS[i];
    const [v1, c1] = SCALE_STOPS[i + 1];
    if (v >= v0 && v <= v1) {
      const t = (v - v0) / (v1 - v0);
      const rgb = c0.map((c, i2) => Math.round(c + t * (c1[i2] - c)));
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  }
  return "#0b5563";
}

const map = L.map("map", { zoomControl: false }).setView([56.5, -4.0], 7);
L.control.zoom({ position: "bottomright" }).addTo(map);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);

let activeKey = DEFAULT_POLLUTANT;
let geojsonLayer = null;

function propertyFor(key) {
  return POLLUTANTS.find((p) => p.key === key).property;
}

function styleFor(feature) {
  const value = feature.properties[propertyFor(activeKey)];
  return {
    fillColor: colorFor(value),
    fillOpacity: 0.85,
    color: "#d1d5db",
    weight: 0.6,
  };
}

function tooltipHtml(feature) {
  const value = feature.properties[propertyFor(activeKey)];
  const pollutant = POLLUTANTS.find((p) => p.key === activeKey).label;
  const valueText = value === null || value === undefined ? "no data" : `${value.toFixed(1)}%`;
  const count = feature.properties.postcode_count;
  const countText = count ? `${count} postcodes observed` : "no postcodes observed";
  return `<div class="district-tooltip"><b>${feature.properties.district}</b><br>${pollutant} coverage: ${valueText}<br>${countText}</div>`;
}

function highlight(e) {
  e.target.setStyle({ weight: 2, color: "#0b5563" });
  e.target.bringToFront();
}

function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
  layer.bindTooltip(tooltipHtml(feature));
  layer.on({
    mouseover: highlight,
    mouseout: resetHighlight,
  });
}

function repaint() {
  if (!geojsonLayer) return;
  geojsonLayer.eachLayer((layer) => {
    layer.setStyle(styleFor(layer.feature));
    layer.setTooltipContent(tooltipHtml(layer.feature));
  });
  document.querySelectorAll(".pollutant-control button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.key === activeKey);
  });
}

function buildPollutantControl() {
  const control = L.control({ position: "topleft" });
  control.onAdd = () => {
    const div = L.DomUtil.create("div", "pollutant-control");
    const panel = document.createElement("div");
    panel.className = "panel";
    const heading = document.createElement("h2");
    heading.textContent = "Pollutant";
    panel.appendChild(heading);
    POLLUTANTS.forEach((p) => {
      const btn = document.createElement("button");
      btn.textContent = p.label;
      btn.dataset.key = p.key;
      btn.addEventListener("click", () => {
        activeKey = p.key;
        repaint();
      });
      panel.appendChild(btn);
    });
    div.appendChild(panel);
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  control.addTo(map);
}

function buildLegend() {
  const control = L.control({ position: "bottomleft" });
  control.onAdd = () => {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML = `
      <div class="panel">
        <h2>Fixed-denominator coverage</h2>
        <div class="gradient"></div>
        <div class="ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
        <div class="nodata-key"><span class="nodata-swatch"></span> No postcodes observed</div>
      </div>`;
    return div;
  };
  control.addTo(map);
}

fetch("data/districts.geojson")
  .then((r) => r.json())
  .then((geojson) => {
    geojsonLayer = L.geoJSON(geojson, { style: styleFor, onEachFeature }).addTo(map);
    map.fitBounds(geojsonLayer.getBounds(), { padding: [20, 20] });
    buildPollutantControl();
    buildLegend();
    repaint();
  });
