window.addEventListener('load', () => {
  const service = 'xapi';

  navigator.geolocation.getCurrentPosition(
    async position => {
      const { longitude, latitude } = position.coords;

      // left, bottom, right, top (min long, min lat, max long, max lat)
      const bounds = [
        longitude - .00001,
        latitude - .00001,
        longitude + .00001,
        latitude + .00001,
      ];

      switch (service) {
        case 'api': {
          const response = await fetch(`https://api.openstreetmap.org/api/0.6/map?bbox=${bounds.join()}`);
          const data = await response.text();
          console.log(data);
          break;
        }
        case 'xapi': {
          const response = await fetch(`http://www.overpass-api.de/api/xapi_meta?*[bbox=${bounds.join()}]`);
          const data = await response.text();
          console.log(data);
          break;
        }
        default: throw new Error(`Unknown service '${service}'.`);
      }
    },
    error => alert(error.code + ' ' + error.message),
    { enableHighAccuracy: true },
  );
});
