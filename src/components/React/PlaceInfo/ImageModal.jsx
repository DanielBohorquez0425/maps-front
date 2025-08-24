import { motion, AnimatePresence } from "framer-motion";
import { IconClose } from "../../../assets/icons/icons";
import defaultImg from "../../../assets/images/default_img.webp";

export default function ImageModal({ 
  isOpen, 
  onClose, 
  imageSrc, 
  imageAlt = "Imagen del lugar",
  className = ""
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            key="modal"
            className={`relative bg-transparent ${className}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute cursor-pointer top-2 right-2 text-white text-2xl z-10 hover:bg-black/20 rounded-full p-1 transition-colors"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <IconClose />
            </button>
            <img
              src={imageSrc || defaultImg}
              alt={imageAlt}
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}