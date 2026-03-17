const NodeGeocoder = require('node-geocoder');

const options ={
    provider: 'openstreetmap',
    
    userAgent: 'PGLink-App/1.0',
    
    email: 'sainidivyansh2005@gmail.com',
   
    osmServer: 'https://nominatim.openstreetmap.org'

};

const geocoder = NodeGeocoder(options);
module.exports = geocoder;