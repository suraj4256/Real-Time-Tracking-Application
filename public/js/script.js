const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
       const {latitude, longitude} = position.coords;
       socket.emit("send-location",{latitude,longitude})
    },(error) =>{
        console.error(error);
    },
    {
        enableHighAccuracy:true,
        maximumAge: 0,
        timeout:3000,
    }
);
}

document.addEventListener("DOMContentLoaded", function() {
    const map = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 100,
    }).addTo(map);

    let markers = {};

    socket.on("recieve-location", (data) => {
        console.log(`User ${data.id} is at ${data.latitude}, ${data.longitude}`);
        map.setView([data.latitude, data.longitude]);
        if (markers[data.id]) {
            markers[data.id].setLatLng([data.latitude, data.longitude]);
        } else {
            markers[data.id] = L.marker([data.latitude, data.longitude]).addTo(map); 
        }
    });

      const popup = L.popup();
      function onMapClick(e) {
        popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}map.on('click', onMapClick);

socket.on("user-disconnected",(data)=>{
    if(markers[data.id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
});
