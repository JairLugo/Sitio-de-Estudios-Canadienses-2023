// BOOTSTRAP: Agregar referencias del Sidebar a partir de HTML
const sidebar = document.querySelector("#sidebar");
const alert = document.querySelector("#alert");

// Creación de variable map con coordenadas de centro y zoom
let map = L.map("map").setView([63.997835, -102.011066], 4);

//Adición de mapa base de OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 3,
  maxZoom: 6,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// document.getElementById('select-location').addEventListener('change',function(e){
//   let coords= e.target.value.split(",");
//   map.flyTo(coords,13);
// });

// // Se agrega Mapa base de la página Carto
// var carto_light = new L.TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
// {attribution: '©OpenStreetMap, ©CartoDB', subdomains: 'abcd',maxZoom: 24});

// // Se crea la varable Minimapa

// var MiniMap = new L.Control.MiniMap(carto_light,
//   {
//       toggleDisplay: true,
//       minimized: false,
//       position: "bottomleft"
//   }).addTo(map);

//   // Agrega escala de Mini Mapa
//   new L.control.scale ({imperial: false}).addTo(map);

// Configuración del PopUP (Globo de texto que indica BARRIO y LOCALIDAD)
function popup(feature, layer) {
  if (feature.properties && feature.properties.STATE) {
    layer.bindPopup(
      "<strong>Barrio: </strong>" +
        features.properties.STATE +
        "<br/>" +
        "<strong>Localidad: </strong>" +
        features.properties.CREATED_AT
    );
  }
}

// Agregación de Coords para dibujar una línea
/** var coord_camino = [
  [4.798039528031478, -74.03124090388363],
  [4.79059838513191, -74.02832266048456],
  [4.786663954996014, -74.02806516841994],
  [4.784183541760121, -74.02832266048456],
  [4.781275459625073, -74.02703520016145],
  [4.777683105825763, -74.02617689327938],
  [4.7735878498196636, -74.02655897938767],
  [4.771834421730695, -74.02735291325358],
  [4.770316205986422, -74.02692375981255],
]; 

var camino = L.polyline(coord_camino, {
  color: "red",
}).addTo(map);

//Agregar un Marcador de tipo Punto
var marker_cerro = L.circleMarker(
  L.latLng(4.791132952755172, -73.99527784552215),
  {
    radius: 6,
    fillColor: "#ff0000",
    color: "blue",
    weight: 2,
    opacity: 1,
    fillOpacity: "0.6",
  }
).addTo(map);

//Agregar la leyenda para el mapa

const legend = L.control
  .legend({
    position: "bottomright",
    collapsed: false,
    symbolWidth: 24,
    opacity: 1,
    column: 1,
    legends: [
      {
        label: "Cerro Guayabos",
        type: "circle",
        radius: 6,
        color: "blue",
        fillColor: "#FF0000",
        fillOpacity: 0.6,
        weight: 2,
        layers: [marker_cerro],
        inactive: false,
      },
      {
        label: "Carrera Septima",
        type: "polyline",
        color: "#FF0000",
        fillColor: "#FF0000",
        weight: 2,
        layers: camino,
      },
      {
        label: "Barrios",
        type: "rectangle",
        color: "#0074f0",
        fillColor: "#009ff0",
        weight: 2,
        layers: barriosJS,
        barrios,
      },
      {
        label: "Marcador",
        type: "image",
        url: "Leaflet.Legend-master/examples/marker/purple.png",
      },
      {
        label: "Linea Punteada",
        type: "polyline",
        color: "#0000FF",
        fillColor: "#0000FF",
        dashArray: [5, 5],
        weight: 2,
      },
      {
        label: "Poligono",
        type: "polygon",
        sides: 5,
        color: "#FF0000",
        fillColor: "#FF0000",
        weight: 2,
      },
    ],
  })
  .addTo(map); **/

//Agregar control para ver los datos al pasar el puntero del Mouse

var info = L.control();

// Crear un div con la clase info
info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};

// Agregar el método que actualiza el control según el puntero vaya pasando
info.update = function (props) {
  this._div.innerHTML =
    "<h4>ESTADOS DE CANADÁ</h4>" +
    (props
      ? "<b>" +
        props.STATE +
        "</b><br/>" +
        props.CREATED_AT +
        " del Condado</sup>"
      : "Pase el puntero por un Estado");
};

info.addTo(map);

//Generar Rango de Colores, de acuerdo con el atributo TOT_VIVIEN

function getColor(d) {
  return d > 9000
    ? "#2510a3"
    : d > 7500
    ? "#0000ff"
    : d > 6000
    ? "#673dff"
    : d > 4500
    ? "#9265ff"
    : d > 2500
    ? "#b38bff"
    : d > 1000
    ? "#cfb1ff"
    : d > 0
    ? "#e8d8ff"
    : "#ffffff";
}

//Creación de una función para mostrar la simbología de acuerdo al Campo TOT_VIVIEN

function style(feature) {
  return {
    fillColor: getColor(feature.properties.TOT_VIVIEN),
    weight: 2,
    opacity: 1,
    color: "orange",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

// Agregar interacción del puntero del Mouse con la capa para resaltar el objeto
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#BF6F09",
    dashArray: "",
    opacity: 0.6,
  });

  info.update(layer.feature.properties);
}

//Configuración de los datos de realtado y Zoom de la capa

var barriosJS;

// Reset de Resaltado de la capa
function resetHightlight(e) {
  barriosJS.resetStyle(e.target);
  info.update();
}

// Zoom de la Capa
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

//Condiciones de resaltado
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHightlight,
    click: zoomToFeature,
  });
}

// Crea una capa en Formato GeoJson
barriosJS = L.geoJson(barrios, {
  style: style,
  onEachFeature: onEachFeature,
}).addTo(map);

//Agregar Atribución
map.attributionControl.addAttribution(
  'Viviendas en Bogotá &copy <a href= "https://www.dane.gov.co">DANE</a>'
);

// Agregar función Volar al lugar | funcional para Sidebar

const volar = (coord) => {
  const zoom = map.getMaxZoom();
  map.flyTo(coord, zoom);
};

// Funnción para que el Alert Muestre las Coords
const definirAlert = ([latitud, longitud]) => {
  alert.classList.remove("hidden");
  alert.innerText = `Coordenadas:
      Latitud: ${latitud},
      Longitud: ${longitud}`;
};

// Limpiar Opciones de Lugares en Sidebar

const limpiarItems = () => {
  const listadoLi = document.querySelectorAll("li");
  listadoLi.forEach((li) => {
    li.classList.remove("active");
  });
};

//Creación del listado de lugares a partir de Sites.js
const crearListado = () => {
  const ul = document.createElement("ul");
  ul.classList.add("list-group");
  sidebar.prepend(ul);

  sites.forEach((lugar) => {
    const li = document.createElement("li");
    li.innerText = lugar.nombre;
    li.classList.add("list-group-item");
    ul.append(li);

    li.addEventListener("click", () => {
      limpiarItems();
      li.classList.add("active");
      volar(lugar.coordenadas);
      definirAlert(lugar.coordenadas);
    });
  });
};

crearListado();
