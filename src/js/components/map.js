ymaps.ready(init);
function init() {
  let myMap = new ymaps.Map("map", {
    center: [55.76953456898229, 37.63998549999998],
    zoom: 17,
    controls: ['geolocationControl', 'zoomControl'],
  });

  let Placemark = new ymaps.Placemark([55.76953456898229, 37.63998549999998],
    {},
    {
      iconLayout: "default#image",
      iconImageHref: "./img/sprite.svg#placemark",
      iconImageSize: [12, 12],
      iconImageOffset: [-40, -50],
    }
  );

  myMap.geoObjects.add(Placemark);

  myMap.controls.remove('geolocationControl');
  myMap.controls.remove('searchControl');
  myMap.controls.remove('trafficControl');
  myMap.controls.remove('typeSelector');
  myMap.controls.remove('fullscreenControl');
  myMap.controls.remove('zoomControl');
  myMap.controls.remove('rulerControl');
  myMap.behaviors.disable(['scrollZoom']);
}
