const WebSocketServer = require('ws').Server;
const geolib = require('geolib');

const wss = new WebSocketServer({port: 40510});

const Player = require('../models/player');

const pitchLocationSouthWest = {
    lat: 51.446534,
    lon: 5.438344
};

const pitchLocationSouthEast = geolib.computeDestinationPoint(pitchLocationSouthWest, 33, 90);
const pitchLocationNorthWest = geolib.computeDestinationPoint(pitchLocationSouthWest, 60, 0);
const pitchLocationNorthEast = geolib.computeDestinationPoint(pitchLocationNorthWest, 33, 90);

const midpointLocation = {
    latitude: (pitchLocationSouthWest.lat + pitchLocationNorthEast.latitude) / 2,
    longitude: (pitchLocationSouthWest.lon + pitchLocationNorthEast.longitude) / 2
};


console.log("South West point is: lat " + pitchLocationSouthWest.lat + " lon: " + pitchLocationSouthWest.lon);
console.log("South East point is: lat " + pitchLocationSouthEast.latitude + " lon: " + pitchLocationSouthEast.longitude);
console.log("North West point is: lat " + pitchLocationNorthWest.latitude + " lon: " + pitchLocationNorthWest.longitude);
console.log("North East point is: lat " + pitchLocationNorthEast.latitude + " lon: " + pitchLocationNorthEast.longitude);

const pitch = [
    {
        latitude: pitchLocationSouthWest.lat,
        longitude: pitchLocationSouthWest.lon
    },
    {
        latitude: pitchLocationSouthEast.latitude,
        longitude: pitchLocationSouthEast.longitude
    },
    {
        latitude: pitchLocationNorthEast.latitude,
        longitude: pitchLocationNorthEast.longitude
    },
    {
        latitude: pitchLocationNorthWest.latitude,
        longitude: pitchLocationNorthWest.longitude
    },
];

function startingLocation() {
    const distance = Math.random() * 16.5;
    const bearing = Math.random() * 90 * Math.floor(Math.random() * 2) === 1 ? 1 : -1;

    return geolib.computeDestinationPoint(midpointLocation, distance, bearing);
}

function movePlayer(location) {
    const distance = Math.random();
    const bearing = Math.random() * 90 * Math.floor(Math.random() * 2) === 1 ? 1 : -1;

    const newLocation = geolib.computeDestinationPoint(location, distance, bearing);

    if (geolib.isPointInside(newLocation, pitch)) {
        console.log(newLocation);

        return newLocation;
    } else {
        console.log("Reset used!");
        return midpointLocation
    }
}

wss.on('connection', function (ws) {
    ws.isAlive = true;

    console.log('Hello there');

    Player.find()
        .select('_id name position location')
        .exec()
        .then(players => {
            console.log('General Kenobi');
            console.log(players);

            interval = setInterval(() => {

                for (const player of players) {
                    console.log(player.location);

                    if (player.location) {
                        player.location = movePlayer(player.location);
                    } else {
                        player.location = startingLocation();
                    }


                    player.save()
                        .then(() => {
                            if (ws.readyState === ws.CLOSED) {
                                clearInterval(interval);
                                console.log("Connection closed");

                                return ws.terminate();
                            }

                            ws.send(JSON.stringify(player));
                        });
                }

            }, 1000);
        })
        .catch(err => {
            ws.send(err);
        });
});

wss.on('close', function connection(ws) {
    ws.isAlive = false;
});