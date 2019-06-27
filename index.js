import Sqlite from 'https://tomashubelbauer.github.io/sqlite-javascript/Sqlite.js';

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

    const dataView = new DataView(typedArray.buffer);
    const sqlite = new Sqlite(dataView);

    // [row ID, z/x/y, ProtoBuf GZIP, SQLite page #]
    const tile = sqlite.getRows('images').next().value;

    /** @type {ArrayBuffer} */
    const tileArrayBuffer = tile[2];

    const tileDataView = new DataView(tileArrayBuffer);

    /* http://www.zlib.org/rfc-gzip.html#header-trailer */
    if (tileDataView.getUint8(0) !== 0x1f || tileDataView.getUint8(1) !== 0x8b) {
      throw new Error('This is not a valid GZIP stream.');
    }

    const compressionId = tileDataView.getUint8(2);
    if (compressionId !== 8) {
      throw new Error('Compression ID other than 8 (DEFLATE) is not supported.');
    }

    const flags = tileDataView.getUint8(3);
    const ftext = (flags & (1 << 7)) === 1;
    const fhcrc = (flags & (1 << 6)) === 1;
    const fextra = (flags & (1 << 5)) === 1;
    const fname = (flags & (1 << 4)) === 1;
    const fcomment = (flags & (1 << 3)) === 1;
    const reserved1 = (flags & (1 << 2)) === 1;
    const reserved2 = (flags & (1 << 1)) === 1;
    const reserved3 = (flags & (1 << 0)) === 1;
    //console.log({ flags, ftext, fhcrc, fextra, fname, fcomment, reserved1, reserved2, reserved3 });

    const mtime = tileDataView.getUint32(4);
    if (mtime === 0) {
      //console.log('No timestamp');
    } else {
      //console.log(mtime);
    }

    const extraFlags = tileDataView.getUint8(8);
    //console.log(extraFlags);

    const operatingSystem = tileDataView.getUint8(9);
    // switch (operatingSystem) {
    //   case 0: console.log('FAT filesystem (MS-DOS, OS/2, NT/Win32)'); break;
    //   case 1: console.log('Amiga'); break;
    //   case 2: console.log('VMS (or OpenVMS)'); break;
    //   case 3: console.log('Unix'); break;
    //   case 4: console.log('VM/CMS'); break;
    //   case 5: console.log('Atari TOS'); break;
    //   case 6: console.log('HPFS filesystem (OS/2, NT)'); break;
    //   case 7: console.log('Macintosh'); break;
    //   case 8: console.log('Z-System'); break;
    //   case 9: console.log('CP/M'); break;
    //   case 10: console.log('TOPS-20'); break;
    //   case 11: console.log('NTFS filesystem (NT)'); break;
    //   case 12: console.log('QDOS'); break;
    //   case 13: console.log('Acorn RISCOS'); break;
    //   case 255: console.log('Unknown'); break;
    //   default: throw new Error('Invalid operating system value.');
    // }

    if (fextra) {
      throw new Error('TODO: Extra length');
    }

    if (fname) {
      throw new Error('TODO: File name');
    }

    if (fcomment) {
      throw new Error('TODO: File comment');
    }

    if (fhcrc) {
      throw new Error('TODO: CRC');
    }

    // https://en.wikipedia.org/wiki/DEFLATE#Stream_format
    const deflateBytes = new Uint8Array(tileArrayBuffer.slice(10, tileArrayBuffer.byteLength - 8));

    const sanity = deflateBytes[0];
    const isLastBlock = (sanity & (1 << 7)) !== 0;
    const compressionMethod = [(sanity & (1 << 6)) !== 0, (sanity & (1 << 5)) !== 0];
    //console.log(sanity, isLastBlock, compressionMethod);

    const protobufBytes = UZIP.inflateRaw(deflateBytes);
    const protobuf = new Pbf(protobufBytes);
    //console.log(protobuf);
    protobuf.readFields(readData, {});

    function readData(tag, data, pbf) {
      if (tag === 1) console.log('name', pbf.readString());
      else if (tag === 2) console.log('version', pbf.readVarint());
      else if (tag === 3) console.log('layer'), pbf.readMessage(readLayer, {});
      else console.log(tag);
    }

    function readLayer(tag, layer, pbf) {
      if (tag === 1) layer.name = pbf.readString();
      else if (tag === 3) layer.size = pbf.readVarint();
    }

    const crc32 = 'TODO';
    const isize = 'TODO';
  });
});
