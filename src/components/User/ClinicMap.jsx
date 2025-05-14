import React, { useEffect, useRef } from 'react';

function ClinicMap({ latitude, longitude }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        disableDefaultUI: true, // remove controls
      });

      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: 'Clinic Location',
      });
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = loadMap;
      document.body.appendChild(script);
    } else {
      loadMap();
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden"
    >
      Loading map...
    </div>
  );
}

export default ClinicMap;
