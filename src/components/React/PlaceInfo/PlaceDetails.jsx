import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  IconLocation,
  IconPhone,
  IconStar,
  IconWebsite,
  IconChevronDown,
  IconClock,
} from "../../../assets/icons/icons";

const PlaceHeader = ({ name, rating, totalReviews, isOpen, types }) => (
  <div className="flex flex-col gap-2">
    <p className="text-[16px] font-bold line-clamp-2">{name}</p>
    {rating && (
      <div className="flex items-center gap-2">
        <IconStar />
        <span className="text-[14px] text-gray-300">
          {rating} ({totalReviews?.toLocaleString() ?? "0"})
        </span>
      </div>
    )}
    <div className="flex items-center gap-2 flex-nowrap">
      <p
        className={`text-[14px] font-semibold ${
          isOpen === null
            ? "text-gray-400"
            : isOpen
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {isOpen === null ? "Sin horario" : isOpen ? "ABIERTO" : "CERRADO"}
      </p>
      {types && (
        <>
          <span className="text-gray-500">•</span>
          <p className="text-[14px] text-[#9A9AA5] capitalize text-nowrap">
            {types.toLowerCase().replaceAll("_", " ")}
          </p>
        </>
      )}
    </div>
  </div>
);

const PlaceImage = ({ photos, name, onImageClick, className = "" }) => (
  <div className={`max-w-[100px] max-h-[100px] w-[100px] h-[100px] min-w-[100px] min-h-[100px] flex items-center ${className}`}>
    <button 
      className="cursor-pointer hover:opacity-80 transition-opacity rounded-xl overflow-hidden" 
      onClick={onImageClick}
    >
      <img
        src={photos}
        alt={name}
        className="rounded-xl border border-[#585870] hover:border-[#4C46CC] w-[100px] h-[100px] object-cover transition-colors"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    </button>
  </div>
);

const ContactInfo = ({ phone, address, website }) => (
  <div className="flex flex-col gap-2">
    {phone && (
      <div className="flex items-center gap-2">
        <IconPhone />
        <a 
          href={`tel:${phone}`}
          className="text-[14px] text-gray-300 hover:text-white transition-colors"
        >
          {phone}
        </a>
      </div>
    )}
    {address && (
      <div className="flex items-start gap-2">
        <IconLocation className="mt-0.5 flex-shrink-0" />
        <p className="text-[14px] text-gray-300 flex-1 leading-relaxed">
          {address}
        </p>
      </div>
    )}
    {website && (
      <div className="flex items-center gap-2">
        <IconWebsite />
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-[#6C63FF] hover:text-[#4C46CC] transition-colors flex-1 truncate"
        >
          {website}
        </a>
      </div>
    )}
  </div>
);

const ScheduleSection = ({ schedule }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <IconClock />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer flex items-center gap-2 hover:text-[#6C63FF] transition-colors"
        >
          <span className="font-semibold">Horarios</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <IconChevronDown />
          </motion.div>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="schedule-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-6 space-y-1">
              {schedule.map((day, index) => (
                <p
                  key={index}
                  className="text-[14px] text-gray-300"
                >
                  {day}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReviewsSection = ({ reviews }) => {
  if (!reviews) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-300">Reseña destacada:</h4>
      <p className="text-[14px] text-gray-300 line-clamp-3 leading-relaxed">
        {reviews}
      </p>
    </div>
  );
};

const Divider = () => <div className="border-t border-[#585870] h-[1px] my-3" />;

export default function PlaceDetails({ 
  placeInformation, 
  onImageClick,
  className = ""
}) {
  if (!placeInformation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ borderColor: "#4C46CC" }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col gap-3 rounded-xl border border-[#585870] bg-[#161720] p-4 text-white w-full ${className}`}
    >
      {/* Header card con imagen */}
      <div className="flex items-start gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <PlaceHeader
            name={placeInformation.name}
            rating={placeInformation.rating}
            totalReviews={placeInformation.totalReviews}
            isOpen={placeInformation.isOpen}
            types={placeInformation.types}
          />
        </div>
        {placeInformation.photos && (
          <PlaceImage
            photos={placeInformation.photos}
            name={placeInformation.name}
            onImageClick={onImageClick}
          />
        )}
      </div>

      <Divider />

      {/* Información de contacto */}
      <ContactInfo
        phone={placeInformation.formatted_phone_number}
        address={placeInformation.formatted_address}
        website={placeInformation.website}
      />

      {/* Horarios */}
      <ScheduleSection schedule={placeInformation.schedule} />

      {/* Reseñas */}
      {placeInformation.reviews && (
        <>
          <Divider />
          <ReviewsSection reviews={placeInformation.reviews} />
        </>
      )}
    </motion.div>
  );
}