# OSM Vector Maps

[**DEMO**](https://tomashubelbauer.github.io/osm-vector-map)

This project uses SQL.js and MBTiles snapshot of Czech Republic's Prague from
OpenMapTiles (https://openmaptiles.com/downloads/dataset/osm/europe/czech-republic/prague)
to render the tiles on an HTML5 `canvas`.

WebSQL by itself, while supported (for now) in Chrome and Safari, wouldn't work
for this because it doesn't support loading from a file so that's why SQL.js is
used, which is an Emscripten-compiled SQLite source code to JavaScript.

The vector tile database file is loaded upon user gesture and with loading
indicator, because it is really big (70 MB).

I am toying around with an idea of using a service worker to cache the file when
the user clicks the download button and the application determining whether it
was already downloaded or not by inspecting the `caches` object or issuing a
request with some marker (header/fragment/query) which would tell the worker to
actually download if present or fail to indicate not having been cached yet if
not present.

The worker might break the download indication (worried it will split the
pipeline into two steps - worker downloads and then the page downloads from the
cache) so if that's the case, we can try ranged fetch to preserve the ability to
download with indication as GitHub Pages support ranged requests.

https://github.com/mapbox/mbtiles-spec
https://sqlite.org/fileformat2.html

- Use a custom SQLite file reader over SQL.js because I don't need writing or SQL querying
