import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  IconLocation,
  IconLogout,
  IconPhone,
  IconStar,
  IconWebsite,
  IconChevronDown,
  IconClose,
  IconClock,
} from "../../assets/icons/icons";
import { darkThemeMap } from "../../styles/dark_theme_map";
import defaultImg from "../../assets/images/default_img.webp";

const readableTypes = {
  airport: "Aeropuerto",
  shopping_mall: "Centro Comercial",
  restaurant: "Restaurante",
  park: "Parque",
  school: "Escuela",
  hospital: "Hospital",
  establishment: "Establecimiento",
  amusement_park: "Parque de diversiones",
};

export default function Map({
  center = { lat: 4.711, lng: -74.072 },
  zoom = 12,
}) {
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const [placeInformation, setPlaceInformation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    (async () => {
      const { Loader } = await import("@googlemaps/js-api-loader");

      const loader = new Loader({
        apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
        version: "beta",
        libraries: ["places"],
      });

      loader.load().then((google) => {
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: darkThemeMap,
        });

        const marker = new google.maps.Marker({ position: center, map });

        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              fields: [
                "place_id",
                "geometry",
                "formatted_address",
                "name",
                "rating",
                "formatted_phone_number",
                "website",
                "photos",
              ],
            }
          );

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) return;

            const loc = new google.maps.LatLng(
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );

            map.setCenter(loc);
            map.setZoom(15);
            marker.setPosition(loc);

            const service = new google.maps.places.PlacesService(map);

            service.getDetails(
              {
                placeId: place.place_id,
                fields: [
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
                ],
              },
              (placeDetails, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  const typeLabel = placeDetails.types?.[0]
                    ? readableTypes[placeDetails.types[0]] ||
                      placeDetails.types[0]
                    : "";

                  const newPlace = {
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

                  setPlaceInformation(newPlace);

                  setSearchHistory((prev) => {
                    const existsIndex = prev.findIndex(
                      (p) =>
                        p.name === newPlace.name &&
                        p.formatted_address === newPlace.formatted_address
                    );
                    let copy = [...prev];
                    if (existsIndex !== -1) {
                      copy.splice(existsIndex, 1);
                    }
                    copy.unshift(newPlace);
                    return copy.slice(0, 5);
                  });
                }
              }
            );
          });
        }
      });
    })();
  }, []);

  return (
    <div className="flex flex-row gap-3">
      {/* Contenedor del mapa */}
      <div className="relative w-full">
        <div
          ref={mapRef}
          className="h-[90vh] w-full rounded-2xl shadow-2xl shadow-black"
          style={{ background: "#161720" }}
        />
        <div className="absolute top-0 w-full flex justify-center pt-5">
          <input
            ref={inputRef}
            placeholder="Buscar lugares, restaurantes, hoteles..."
            className="w-[500px] rounded-full border border-white/10 bg-[#292935] px-4 py-3 text-white placeholder-white/60 outline-none shadow-2xl shadow-black"
          />
        </div>
      </div>

      {/* Contenedor de información */}
      <div className="flex flex-col justify-between h-[90vh] w-[400px]">
        <div className="flex flex-col gap-4 overflow-y-auto pr-2">
          <AnimatePresence mode="wait">
            {placeInformation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ borderColor: "#4C46CC" }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2 rounded-xl border border-[#585870] bg-[#161720] p-4 text-white w-full"
              >
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 justify-between h-full">
                      <div className="flex flex-col gap-2">
                        <p className="text-[16px] font-bold">
                          {placeInformation.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <IconStar />
                          <span className="text-[14px] text-gray-300">
                            {placeInformation.rating} (
                            {placeInformation.totalReviews?.toLocaleString() ??
                              "0"}
                            )
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-[14px] font-semibold ${
                            placeInformation.isOpen === null
                              ? "text-gray-400"
                              : placeInformation.isOpen
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {placeInformation.isOpen === null
                            ? "Sin horario"
                            : placeInformation.isOpen
                            ? "ABIERTO"
                            : "CERRADO"}
                        </p>
                        •
                        <div className="flex flex-nowrap overflow-hidden overflow-x-auto w-fit">
                          {placeInformation.types && (
                            <p className="text-[14px] text-[#9A9AA5] py-1 rounded-full text-nowrap">
                              {placeInformation.types
                                .toLowerCase()
                                .replaceAll("_", " ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[100px] max-h-[100px] w-[100px] h-[100px] min-w-[100px] min-h-[100px] flex items-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <img
                        src={placeInformation.photos || defaultImg}
                        alt={placeInformation.name}
                        className="rounded-xl border border-[#585870] w-[100px] h-[100px] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  </div>
                </div>
                <div className="border-t border-[#585870] h-[1px] my-2" />
                <div className="flex flex-col gap-2 justify-between">
                  {placeInformation.formatted_phone_number && (
                    <div className="flex items-center gap-2">
                      <IconPhone />
                      <p className="text-[14px] text-gray-300">
                        {placeInformation.formatted_phone_number}
                      </p>
                    </div>
                  )}
                  {placeInformation.formatted_address && (
                    <div className="flex items-center gap-2">
                      <IconLocation />
                      <p className="text-[14px] text-gray-300 w-[350px]">
                        {placeInformation.formatted_address}
                      </p>
                    </div>
                  )}
                  {placeInformation.website && (
                    <div className="flex items-center gap-2">
                      <IconWebsite />
                      <a
                        href={placeInformation.website}
                        target="_blank"
                        className="text-[14px] text-[#6C63FF] hover:text-[#4C46CC] transition-colors w-[350px] line-clamp-1 overflow-hidden overflow-ellipsis"
                      >
                        {placeInformation.website}
                      </a>
                    </div>
                  )}
                  {placeInformation.schedule &&
                    placeInformation.schedule.length > 0 && (
                      <div className="flex flex-col gap-2 font-bold list-none">
                        <div className="flex items-center gap-2">
                          <IconClock />
                          <button
                            onClick={() => setOpen(!open)}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            Horarios
                            <motion.div
                              animate={{ rotate: open ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <IconChevronDown />
                            </motion.div>
                          </button>
                        </div>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              {placeInformation.schedule.map((day, index) => (
                                <p
                                  key={index}
                                  className="text-[14px] text-gray-300 font-normal"
                                >
                                  {day}
                                </p>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                </div>
                <div className="border-t border-[#585870] h-[1px] my-2" />
                <p className="text-[14px] text-gray-300 w-[350px] line-clamp-3">
                  {placeInformation.reviews}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- Historial de últimas búsquedas --- */}
          {searchHistory.length > 0 && (
            <div className="flex flex-col gap-2 rounded-xl border border-[#585870] bg-[#1b1b24] p-3 text-white w-full">
              <p className="font-bold text-sm mb-2">Últimas búsquedas</p>
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setPlaceInformation(item)}
                  className="flex items-center gap-2 w-full text-left hover:bg-white/5 p-2 rounded-md"
                >
                  <img
                    src={item.photos || defaultImg}
                    alt={item.name}
                    className="w-10 h-10 rounded-md object-cover border border-[#585870]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-gray-400 line-clamp-1">
                      {item.formatted_address}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- Barra de usuario (siempre abajo) --- */}
        <div className="flex gap-12 items-center text-white justify-between mt-4 pt-2 border-t border-[#585870]">
          <div className="flex gap-5">
            <div className="min-w-[50px] h-[50px] rounded-full bg-amber-200"></div>
            <div className="flex flex-col">
              <p className="text-nowrap">Daniel Bohorquez</p>
              <p>activo</p>
            </div>
          </div>
          <IconLogout />
        </div>
      </div>

      {/* Modal de imagen */}
      {isModalOpen && (
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                key="modal"
                className="relative bg-transparent"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute cursor-pointer top-2 right-2 text-white text-2xl"
                  onClick={() => setIsModalOpen(false)}
                >
                  <IconClose />
                </button>
                <img
                  src={placeInformation.photos || defaultImg}
                  alt={placeInformation.name}
                  className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
