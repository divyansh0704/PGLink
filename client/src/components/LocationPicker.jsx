import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markericon from 'leaflet/dist/images/marker-icon.png';
import markershadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markericon,
  shadowUrl:markershadow,
});


function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const LocationPicker = ({ onLocationChange }) => {
  // Default to a central location in India until a point is clicked
  const [position, setPosition] = useState(null);
  const defaultCenter = [20.5937, 78.9629];

  useEffect(() => {
    if (position) {
      onLocationChange({ lat: position.lat, lng: position.lng });
    }
  }, [position, onLocationChange]);

  return (
    <div style={{ height: '400px', width: '100%', border: '1px solid #ccc', borderRadius: '8px', marginTop: '10px' }}>
      <p style={{textAlign: 'center', margin: '10px 0', color: '#555'}}>Click on the map to set your PG's exact location.</p>
      <MapContainer center={defaultCenter} zoom={5} scrollWheelZoom={true} style={{ height: 'calc(100% - 40px)', width: '100%', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;