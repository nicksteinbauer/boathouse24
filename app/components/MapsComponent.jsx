import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 41.653624,
  lng: -82.815565
};

function MapsComponent() {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBmuZ4dB6S3kpFgkUviSfAoP5h9QoH8Pbg"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={18}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
    </LoadScript>
  )
}

export default MapsComponent