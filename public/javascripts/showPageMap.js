mapboxgl.accessToken = mapToken;
// const amv = process.env.MAPBOX_TOKEN;
// console.log(amv);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom    
});

//now for adding marker.

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.tittle}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)