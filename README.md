# OSM Vector Maps

In the code I experiment with the OSM API and XAPI (Overpass) but both are too
lame and slow.

OpenMapTiles have an open source version which allows you to get an old snapshot
of the maps:

https://openmaptiles.com/downloads/dataset/osm/europe/czech-republic/prague

Use https://github.com/kripken/sql.js/ to local the SQLite database

https://github.com/mapbox/mbtiles-spec
https://sqlite.org/fileformat2.html

I thought WebSQL might work by loading the database from the file but it doesn't
support that. Which is a shame because both iOS Safari and Chrome support WebSQL
https://caniuse.com/#search=websql

The file is large (70 MB) so it should be downloaded by explicit user gesture
and cached (using a service worker). On startup, the app determines if the file
has been found in the cache by making a reqeuest for it, which if succeeds,
means the service worker found it. If the request fails, the application knows
the database file has not been cached yet or has been evicted. To download it
following a user gesture, the URL has an extra header/param/fragment/whatever so
that the service worker can tell this request is privileged and can actually be
downloaded and cached.

I should also look into visualizing the download or if that's not possible using
fetch and readable streams (might not work in combination with the service worker)
then see if GitHub Pages allow range requests.
