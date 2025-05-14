import React, { useEffect, useRef } from 'react';

function Map({ clinics, location }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      const defaultLocation = { lat: 40.7128, lng: -74.0060 };
      const initialLocation =
        location && location.lat && location.lng
          ? { lat: location.lat, lng: location.lng }
          : defaultLocation;

      const map = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 12,
      });

      mapInstanceRef.current = map;

      const bounds = new window.google.maps.LatLngBounds();

      // Add user location marker
      if (location && location.lat && location.lng) {
        const userMarker = new window.google.maps.Marker({
          position: initialLocation,
          map,
          title: 'Your Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          },
        });

        bounds.extend(initialLocation);
      }

      // Add clinic markers
      if (clinics && clinics.length > 0) {
        clinics.forEach((clinic) => {
          if (clinic.latitude && clinic.longitude) {
            const marker = new window.google.maps.Marker({
              position: { lat: clinic.latitude, lng: clinic.longitude },
              map,
              title: clinic.name || 'Clinic',
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div>
                  <strong>${clinic.name || 'Clinic'}</strong><br>
                  ${clinic.address || ''}<br>
                  ${clinic.phone || ''}
                </div>
              `,
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });

            bounds.extend(marker.getPosition());
          }
        });
      }

      // Adjust map view
      if (clinics.length || (location && location.lat)) {
        map.fitBounds(bounds);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [clinics, location]);

  return (
    <div
      ref={mapRef}
      id="map-container"
      className="bg-gray-200 rounded-lg overflow-hidden h-64 w-full relative"
      style={{ minHeight: '400px' }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
        Loading map...
      </div>
    </div>
  );
}

export default Map;
