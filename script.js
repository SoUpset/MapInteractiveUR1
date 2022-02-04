const btn = document.getElementById('btn')
const nav = document.getElementById('nav')
const btn2D = document.getElementById('2D')
const btn3D = document.getElementById('3D')
const container = document.getElementById('container')
const darkMode = document.getElementById('toggle')

btn2D.addEventListener("click", () => {
    createNotification("2D")
});

btn3D.addEventListener("click", () => {
    createNotification("3D")
});

toggle.addEventListener("change", (event) => {
    document.body.classList.toggle('dark', event.target.checked);
})

function createNotification(dimension) {
    const notif = document.createElement('div');
    notif.classList.add('toast');

    container.appendChild(notif);

    notif.innerText = "Vous êtes passé en " + dimension;

    setTimeout(() => {
        notif.remove();
    }, 3000);
}

btn.addEventListener("click", () => {
    nav.classList.toggle('active');
    btn.classList.toggle('active');
});

function removeAllMarkers(list) {
    for (var i = currentMarkers.length - 1; i >= 0; i--) {
        list[i].remove()
    }
}

const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-1.6364151881843991, 48.118105356676736]
            },
            properties: {
                title: 'DON DU SANG',
                description: 'ESIR'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-1.635005, 48.118632]
            },
            properties: {
                title: 'DON DU SANG',
                description: 'RU'
            }
        }
    ]
};

map.on('click', (e) => {
    document.getElementById('info').innerHTML =
        //  Coordonées x y de la position de la souris lors de l'event click de souris
        JSON.stringify(e.point) +
        '<br />' +
        // Position en terme de latitude et longitude de l'event
        JSON.stringify(e.lngLat.wrap());

    // Ajout de la donnée d'un lieu dans le geojson
    feature = {}
    feature['type'] = 'Feature'
    feature['geometry'] = {
        'type': 'Point',
        'coordinates': e.lngLat,
    }
    feature['properties'] = { 'title': 'osef', 'description': 'UN LIEU INCROYABLE' }
    geojson['features'].push(feature)
    sourceRefresh();
    console.log(geojson['features'])
});

var currentMarkers = [];
function sourceRefresh() {
    currentMarkers
    // On ajoute le marker à la map
    for (const feature of geojson.features) {
        // On crée l'élement html pour toutes les features
        const el = document.createElement('div');
        el.className = 'marker';
        // et on les ajoute à la map
        var m = new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                // Ajout du popup
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
            )
            .addTo(map);
        currentMarkers.push(m)
    }
}

function empty() {
    removeAllMarkers(currentMarkers)
    currentMarkers = []
    geojson.features = []
}
