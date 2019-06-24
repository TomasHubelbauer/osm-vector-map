# OSM Vector Maps

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
