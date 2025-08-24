import { AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

import PlaceDetails from "./PlaceInfo/PlaceDetails";
import SearchHistory from "./PlaceInfo/SearchHistory";
import UserProfile from "./PlaceInfo/UserProfile";
import ImageModal from "./PlaceInfo/ImageModal";

export default function PlaceInfoSidebar({
  placeInformation = null,
  searchHistory = [],
  onPlaceSelect = () => {},
  userName = "Daniel Bohorquez",
  userStatus = "activo",
  userAvatar = null,
  userAvatarColor = "bg-amber-200",
  onLogout = () => {},
  showUserProfile = true,
  maxHistoryItems = 5,
  className = ""
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = useCallback(() => {
    if (placeInformation?.photos) {
      setIsModalOpen(true);
    }
  }, [placeInformation?.photos]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSelectPlace = useCallback((place) => {
    onPlaceSelect(place);
  }, [onPlaceSelect]);

  const handleLogout = useCallback(() => {
    console.log("Logout clicked");
    onLogout();
  }, [onLogout]);

  return (
    <div className={`flex flex-col justify-between h-[90vh] w-[400px] ${className}`}>
      {/* Contenido principal */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 flex-1">
        {/* Información del lugar */}
        <AnimatePresence mode="wait">
          {placeInformation && (
            <PlaceDetails
              key={`${placeInformation.name}-${placeInformation.formatted_address}`}
              placeInformation={placeInformation}
              onImageClick={handleImageClick}
            />
          )}
        </AnimatePresence>

        {/* Historial de búsquedas */}
        <SearchHistory
          searchHistory={searchHistory}
          onSelectPlace={handleSelectPlace}
          maxItems={maxHistoryItems}
        />

        {/* Placeholder cuando no hay información */}
        {!placeInformation && searchHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="rounded-full bg-[#585870]/20 p-6 mb-4">
              <svg 
                className="w-12 h-12 text-[#585870]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Explora lugares
            </h3>
            <p className="text-gray-400 text-sm">
              Busca o haz clic en el mapa para descubrir información sobre lugares interesantes
            </p>
          </div>
        )}
      </div>

      {/* Perfil de usuario */}
      {showUserProfile && (
        <UserProfile
          userName={userName}
          userStatus={userStatus}
          avatarSrc={userAvatar}
          avatarColor={userAvatarColor}
          onLogout={handleLogout}
          className="mt-4"
        />
      )}

      {/* Modal de imagen */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageSrc={placeInformation?.photos}
        imageAlt={placeInformation?.name || "Imagen del lugar"}
      />
    </div>
  );
}