# OSM Vector Map

[**DEMO**](https://tomashubelbauer.github.io/osm-vector-map)

In this repository I prototype a vector map tile rendered. I am using an extract
from the OSM maps provided by OpenMapTiles. I am using the freely available
snapshot of Prague from 2017-07-03.

https://openmaptiles.com/downloads/dataset/osm/europe/czech-republic/prague

MBTILES file format is a SQLite database with a specific schema, documented here:

https://github.com/mapbox/mbtiles-spec

I am working on a JavaScript SQLite database library found here:

https://github.com/TomasHubelbauer/sqlite-javascript

Unfortunately it is not possible to use WebSQL to access the database, because
it is barely supported (works in Chrome and Safari though) and is not able to
work off a given file.

The vector tiles are stored in the ProtoBuf format in the database table called
`images`. This is true of the particular database included in this repository,
but the MBTILES format also supports raster tiles. To check what sort of tiles
your MBTILES database contains, check the `metadata` table, the `format` column
in particular.

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

## To-Do

### Implement custom protobuf wire format parser

Because the MapBox one sucks and there don't seem to be others not requiring the schema

- https://github.com/mapbox/pbf
- Validate with https://protogen.marcgravell.com/decode
  - https://github.com/protobuf-net/protobuf-net/blob/master/src/protobuf-net/ProtoReader.cs

### Check out Qwant maps, they have a public vector tile server

- https://www.qwant.com/maps/tiles/ozpoi/14/8853/5549.pbf
- Consider merging this with my osm-bitmap-map and allow both bitmap and vector servers!
- https://betterweb.qwant.com/qwant-maps-a-open-and-privacy-focused-map
- https://www.qwant.com/maps

### Check out the Mapy.cz vector tile server (might be just labels?)

- https://mapserver.mapy.cz/bing/11-1116-708 this is alternative rasters below? This one is used by the app
  - https://mapserver.mapy.cz/base-m/8-138-87
  - https://mapserver.mapy.cz/hybrid-base-m/8-139-86
  - https://vectmap.mapy.cz/map/online/17/0/data/12-2232-1416.br4 vector tile
  - https://vectmap.mapy.cz/poi/online/v5/15-2231-1416.br4?zl=11&zh=14&al=en&sl=en POI data
