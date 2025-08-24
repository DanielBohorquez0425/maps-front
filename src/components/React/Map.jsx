// Map.jsx
import { useEffect, useRef, useCallback, useMemo } from "react";
import { darkThemeMap } from "../../styles/dark_theme_map";

// Constantes
const PLACE_FIELDS = [
  "name",
  "formatted_address",
  "rating",
  "formatted_phone_number",
  "website",
  "photos",
  "opening_hours",
  "reviews",
  "types",
  "user_ratings_total",
  "geometry",
];

const AUTOCOMPLETE_FIELDS = [
  "place_id",
  "geometry",
  "formatted_address",
  "name",
  "rating",
  "formatted_phone_number",
  "website",
  "photos",
];

const READABLE_TYPES = {
  airport: "Aeropuerto",
  shopping_mall: "Centro Comercial",
  restaurant: "Restaurante",
  park: "Parque",
  school: "Escuela",
  hospital: "Hospital",
  establishment: "Establecimiento",
  amusement_park: "Parque de diversiones",
  bakery: "Pastelería",
};

const processPlaceData = (placeDetails) => {
  const typeLabel = placeDetails.types?.[0]
    ? READABLE_TYPES[placeDetails.types[0]] || placeDetails.types[0]
    : "";

  return {
    name: placeDetails.name,
    formatted_address: placeDetails.formatted_address,
    rating: placeDetails.rating,
    formatted_phone_number: placeDetails.formatted_phone_number,
    website: placeDetails.website,
    photos: placeDetails.photos?.[0]?.getUrl({ maxWidth: 400 }),
    isOpen: placeDetails.opening_hours?.open_now ?? null,
    schedule: placeDetails.opening_hours?.weekday_text ?? [],
    reviews: placeDetails.reviews?.[0]?.text ?? "",
    types: typeLabel,
    totalReviews: placeDetails.user_ratings_total,
  };
};

export default function Map({
  center = { lat: 4.711, lng: -74.072 },
  zoom = 12,
  onPlaceSelect = () => {},
  selectedPlace = null,
}) {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const serviceRef = useRef(null);

  const baseMapConfig = useMemo(() => ({
    center,
    zoom,
    styles: darkThemeMap,
    mapTypeControl: true,
  }), [center, zoom]);

  const handlePlaceDetails = useCallback((placeDetails, location) => {
    const newPlace = processPlaceData(placeDetails);

    if (markerRef.current && location) {
      markerRef.current.setPosition(location);
    }
    if (mapInstanceRef.current && location) {
      mapInstanceRef.current.setCenter(location);
      mapInstanceRef.current.setZoom(15);
    }

    onPlaceSelect(newPlace);
  }, [onPlaceSelect]);

  const handleMapClick = useCallback((e) => {
    if (!e.placeId || !serviceRef.current) return;
    e.stop();

    serviceRef.current.getDetails(
      { placeId: e.placeId, fields: PLACE_FIELDS },
      (placeDetails, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          handlePlaceDetails(placeDetails, placeDetails.geometry.location);
        }
      }
    );
  }, [handlePlaceDetails]);

  const handlePlaceChanged = useCallback((autocomplete) => {
    const place = autocomplete.getPlace();
    if (!place.geometry?.location || !serviceRef.current) return;

    const loc = new window.google.maps.LatLng(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );

    serviceRef.current.getDetails(
      { placeId: place.place_id, fields: PLACE_FIELDS },
      (placeDetails, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          handlePlaceDetails(placeDetails, loc);
        }
      }
    );
  }, [handlePlaceDetails]);

  const centerOnPlace = useCallback((place) => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    if (place.geometry?.location) {
      const location = new window.google.maps.LatLng(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      mapInstanceRef.current.setCenter(location);
      mapInstanceRef.current.setZoom(15);
      markerRef.current.setPosition(location);
    }
  }, []);

  useEffect(() => {
    if (selectedPlace) {
      centerOnPlace(selectedPlace);
    }
  }, [selectedPlace, centerOnPlace]);

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      try {
        const { Loader } = await import("@googlemaps/js-api-loader");
        
        const loader = new Loader({
          apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
          version: "beta",
          libraries: ["places"],
        });

        const google = await loader.load();
        
        if (!mounted || !mapRef.current) return;

        const fullMapConfig = {
          ...baseMapConfig,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            mapTypeIds: [
              google.maps.MapTypeId.ROADMAP,
              google.maps.MapTypeId.SATELLITE,
              google.maps.MapTypeId.HYBRID,
              google.maps.MapTypeId.TERRAIN,
            ],
          },
        };

        const map = new google.maps.Map(mapRef.current, fullMapConfig);
        const marker = new google.maps.Marker({ position: center, map });
        const service = new google.maps.places.PlacesService(map);

        mapInstanceRef.current = map;
        markerRef.current = marker;
        serviceRef.current = service;
        map.addListener("click", handleMapClick);

        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            inputRef.current,
            { fields: AUTOCOMPLETE_FIELDS }
          );

          autocomplete.addListener("place_changed", () => {
            handlePlaceChanged(autocomplete);
          });
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={mapRef}
        className="h-[90vh] w-full rounded-2xl shadow-2xl shadow-black"
        style={{ background: "#161720" }}
      />
      <div className="absolute top-0 w-full flex justify-center pt-5 pointer-events-none">
        <input
          ref={inputRef}
          placeholder="Buscar lugares, restaurantes, hoteles..."
          className="w-[500px] rounded-full border border-white/10 bg-[#292935] px-4 py-3 text-white placeholder-white/60 outline-none shadow-2xl shadow-black pointer-events-auto"
        />
      </div>
    </div>
  );
}