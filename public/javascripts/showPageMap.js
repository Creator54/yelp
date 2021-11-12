mapboxgl.accessToken = 'pk.eyJ1IjoidmlzaGVzIiwiYSI6ImNrdnZkMHM3dTNkc2cycGtsYTdlOHp3bHkifQ.wVxucqzYhylpTLLQQMw95Q';
// const amv = process.env.MAPBOX_TOKEN;
// console.log(amv);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom    
});