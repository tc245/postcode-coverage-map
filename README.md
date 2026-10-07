# Postcode Pollution Coverage Map

An interactive map of pollution-monitoring coverage by Scottish postcode district, alongside the analysis in [tc245/postcode-coverage](https://github.com/tc245/postcode-coverage).

Plain HTML, CSS and JavaScript with no build step, published with GitHub Pages.

- `index.html` / `app.js` / `style.css`: the map (Leaflet, loaded from a CDN).
- `data.js`: pollutant list and the default pollutant shown on load.
- `data/districts.geojson`: postcode-district boundaries (dissolved from National Records of Scotland unit-postcode boundaries, simplified for the web) with each district's fixed-denominator coverage percentage per pollutant as feature properties.

This is a spatial snapshot only; a year-by-year view is planned once the
underlying analysis is extended to report coverage by district and year.

To preview locally (the page uses JavaScript modules, which browsers won't load from `file://`):

```sh
python3 -m http.server 8000
```

then open http://localhost:8000.
