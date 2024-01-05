import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";

interface ReactGoogleMapProps {
  location: string;
  sx?: Object;
}

const ReactGoogleMap = ({ location, sx }: ReactGoogleMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 15, lng: 15 });
  const [zoom, setZoom] = useState(5);
  const [isCorrectAddress, setIsCorrectAddress] = useState(true);

  const geocode = (request: google.maps.GeocoderRequest) => {
    const geocoder = new google.maps.Geocoder();
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        console.log(`lat ${lat} lng ${lng}`);

        setCenter({
          lat: lat,
          lng: lng,
        });

        setZoom(17);
        map?.panTo(center);
      })
      .catch((_) => {
        setIsCorrectAddress(false);
      });
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    geocode({ address: location });
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded && isCorrectAddress ? (
    <GoogleMap
      mapContainerStyle={sx}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: true,
      }}
    >
      <Marker position={center} />
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(ReactGoogleMap);
