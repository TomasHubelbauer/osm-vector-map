window.addEventListener('load', () => {
  const downloadButton = document.getElementById('downloadButton');
  downloadButton.addEventListener('click', async () => {
    const downloadProgress = document.getElementById('downloadProgress');

    const response = await fetch('2017-07-03_czech-republic_prague.mbtiles');
    const total = Number(response.headers.get('content-length'));
    downloadProgress.max = total;

    const typedArray = new Uint8Array(total);

    let loaded = 0;
    const reader = response.body.getReader();
    let result;

    while (!(result = await reader.read()).done) {
      typedArray.set(result.value, loaded);
      loaded += result.value.length;
      downloadProgress.value = loaded;
    }

    // TODO: Use `sqlite-javascript` to access the database
    // TODO: Parse the ProtoBuf of the individual tiles
  });
});
