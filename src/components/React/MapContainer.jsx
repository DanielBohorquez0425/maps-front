import { useState, useCallback } from "react";
import Map from "./Map";
import PlaceInfoSidebar from "./PlaceInfoSidebar";

export default function MapContainer({
  center = { lat: 4.711, lng: -74.072 },
  zoom = 12,
  userName = "Daniel Bohorquez",
  userStatus = "activo",
}) {
  const [placeInformation, setPlaceInformation] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const handlePlaceSelect = useCallback((newPlace) => {
    setPlaceInformation(newPlace);

    setSearchHistory((prev) => {
      const existsIndex = prev.findIndex(
        (p) =>
          p.name === newPlace.name &&
          p.formatted_address === newPlace.formatted_address
      );
      const copy = [...prev];
      if (existsIndex !== -1) copy.splice(existsIndex, 1);
      copy.unshift(newPlace);
      return copy.slice(0, 5);
    });
  }, []);

  const handleSidebarPlaceSelect = useCallback((place) => {
    setPlaceInformation(place);
  }, []);

  return (
    <div className="flex flex-row gap-3">
      {/* Componente del mapa */}
      <Map
        center={center}
        zoom={zoom}
        onPlaceSelect={handlePlaceSelect}
        selectedPlace={placeInformation}
      />

      {/* Componente de información lateral */}
      <PlaceInfoSidebar
        placeInformation={placeInformation}
        searchHistory={searchHistory}
        onPlaceSelect={handleSidebarPlaceSelect}
        userName={userName}
        userStatus={userStatus}
      />
    </div>
  );
}
