'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

// Todas las imágenes disponibles
const imagenes = [
  { src: '/images/galeria/IMG_20250829_200500.webp', alt: 'Escena teatral', ratio: 'tall' },
  { src: '/images/galeria/WhatsApp Image 2025-06-13 at 9.55.17 AM (2).webp', alt: 'Momentos creativos', ratio: 'wide' },
  { src: '/images/galeria/DSC04216.webp', alt: 'Performance grupal', ratio: 'wide' },
  { src: '/images/galeria/IMG-20251028-WA0038 1.webp', alt: 'Improvisación escénica', ratio: 'wide' },
  { src: '/images/galeria/Dia 2 Carol.webp', alt: 'Arte en acción', ratio: 'tall' },
  { src: '/images/galeria/Foto-12.webp', alt: 'Escena teatral', ratio: 'tall' },
  { src: '/images/galeria/IMG_20250718_203035.webp', alt: 'Juego escénico', ratio: 'tall' },
  { src: '/images/galeria/IMG_9951.webp', alt: 'Trabajo en equipo', ratio: 'wide' },
  { src: '/images/galeria/FOTOS SONDER_20240814_140957_0001.webp', alt: 'Arte creativo', ratio: 'square' },
  { src: '/images/galeria/Dani.webp', alt: 'Improvisación grupal', ratio: 'wide' },
  { src: '/images/galeria/Foto-69.webp', alt: 'Creatividad escénica', ratio: 'wide' },
  { src: '/images/galeria/1730222664204.webp', alt: 'Expresión artística', ratio: 'wide' },
  { src: '/images/galeria/1741538025696.webp', alt: 'Escena teatral', ratio: 'square' },
  { src: '/images/galeria/IMG-20250724-WA0001.webp', alt: 'Improvisación divertida', ratio: 'wide' },
  { src: '/images/galeria/FOTOS SONDER_20240814_140957_0000.webp', alt: 'Arte creativo', ratio: 'square' },
  { src: '/images/galeria/FOTOS SONDER_20240814_140957_0004.webp', alt: 'Performance teatral', ratio: 'square' },
  { src: '/images/galeria/IMG_20250404_173519.webp', alt: 'Escena en movimiento', ratio: 'wide' },
  { src: '/images/galeria/sin título-4326.webp', alt: 'Momentos escénicos', ratio: 'tall' },
  { src: '/images/galeria/Foto-169.webp', alt: 'Improvisación grupal', ratio: 'wide' },
  { src: '/images/galeria/WhatsApp Image 2025-07-20 at 6.42.50 PM (3).webp', alt: 'Arte en acción', ratio: 'tall' },
  { src: '/images/galeria/Foto-36.webp', alt: 'Escena teatral', ratio: 'wide' },
  { src: '/images/galeria/IMG_20250829_202059.webp', alt: 'Performance grupal', ratio: 'tall' },
  { src: '/images/galeria/Foto-75.webp', alt: 'Improvisación escénica', ratio: 'wide' },
  { src: '/images/galeria/1741538026100.webp', alt: 'Arte creativo', ratio: 'square' },
  { src: '/images/galeria/Foto-50.webp', alt: 'Expresión artística', ratio: 'wide' },
  { src: '/images/galeria/IMG_0632.webp', alt: 'Momento creativo', ratio: 'wide' },
  { src: '/images/galeria/IMG_9929.webp', alt: 'Juego escénico', ratio: 'wide' },
  { src: '/images/galeria/Foto.webp', alt: 'Arte escénico', ratio: 'wide' },
  { src: '/images/galeria/Foto-161.webp', alt: 'Improvisación teatral', ratio: 'wide' },
  { src: '/images/galeria/IMG_20250829_203422.webp', alt: 'Escena en acción', ratio: 'tall' },
  { src: '/images/galeria/IMG-20250404-WA0026.webp', alt: 'Performance grupal', ratio: 'tall' },
  { src: '/images/galeria/marcos y gaby día 2.webp', alt: 'Trabajo en equipo', ratio: 'wide' },
  { src: '/images/galeria/WhatsApp Image 2025-07-20 at 6.42.50 PM (4).webp', alt: 'Arte escénico', ratio: 'tall' },
  { src: '/images/galeria/IMG-20250525-WA0113.webp', alt: 'Improvisación divertida', ratio: 'tall' },
  { src: '/images/galeria/FOTOS SONDER_20240814_140957_0006.webp', alt: 'Escena teatral', ratio: 'square' },
  { src: '/images/galeria/Foto-37.webp', alt: 'Arte creativo', ratio: 'wide' },
  { src: '/images/galeria/Foto-5.webp', alt: 'Expresión artística', ratio: 'tall' },
  { src: '/images/galeria/Foto-42.webp', alt: 'Improvisación grupal', ratio: 'wide' },
  { src: '/images/galeria/Foto-29.webp', alt: 'Momento creativo', ratio: 'tall' },
  { src: '/images/galeria/DANI presentador.webp', alt: 'Escena teatral', ratio: 'tall' },
  { src: '/images/galeria/DSC04135.webp', alt: 'Arte en acción', ratio: 'wide' },
  { src: '/images/galeria/IMG_20250315_190214.webp', alt: 'Performance teatral', ratio: 'wide' },
  { src: '/images/galeria/DSC04204.webp', alt: 'Improvisación escénica', ratio: 'wide' },
  { src: '/images/galeria/IMG_20250329_172857.webp', alt: 'Momentos creativos', ratio: 'tall' },
  { src: '/images/galeria/Foto-57.webp', alt: 'Arte escénico', ratio: 'wide' },
  { src: '/images/galeria/IMG_9964.webp', alt: 'Escena teatral', ratio: 'wide' },
  { src: '/images/galeria/Foto-64.webp', alt: 'Improvisación creativa', ratio: 'tall' },
  { src: '/images/galeria/WhatsApp Image 2025-06-13 at 9.55.21 AM (3).webp', alt: 'Escena teatral', ratio: 'wide' },
  { src: '/images/galeria/WhatsApp Image 2025-06-13 at 9.55.17 AM (1).webp', alt: 'Arte escénico', ratio: 'wide' },
  { src: '/images/galeria/1741538025511.webp', alt: 'Escena teatral', ratio: 'square' },
  { src: '/images/galeria/WhatsApp Image 2025-06-15 at 8.29.02 AM (1).webp', alt: 'Improvisación teatral', ratio: 'wide' },
  { src: '/images/galeria/IMG-20240516-WA0022.webp', alt: 'Arte creativo', ratio: 'wide' },
  { src: '/images/galeria/WhatsApp Image 2025-07-20 at 6.42.45 PM (2).webp', alt: 'Escena grupal', ratio: 'tall' },
  { src: '/images/galeria/IMG_20250829_203304.webp', alt: 'Arte escénico', ratio: 'tall' },
  { src: '/images/galeria/Foto-53.webp', alt: 'Escena teatral', ratio: 'wide' },
  { src: '/images/galeria/11_20240402_123130_0000.webp', alt: 'Arte creativo', ratio: 'square' },
  { src: '/images/galeria/WhatsApp Image 2025-07-20 at 6.42.41 PM (1).webp', alt: 'Improvisación escénica', ratio: 'tall' },
  { src: '/images/galeria/IMG-20250321-WA0002.webp', alt: 'Escena teatral', ratio: 'tall' },
  { src: '/images/galeria/IMG-20250220-WA0061.webp', alt: 'Performance grupal', ratio: 'tall' },
  { src: '/images/galeria/sin título-4268.webp', alt: 'Arte escénico', ratio: 'square' },
  { src: '/images/galeria/sin título-4292.webp', alt: 'Improvisación teatral', ratio: 'square' },
  { src: '/images/galeria/IMG_20250829_195454.webp', alt: 'Escena creativa', ratio: 'tall' },
  { src: '/images/galeria/sin título-4311.webp', alt: 'Arte escénico', ratio: 'square' }
];

const IMAGES_PER_PAGE = 16;

export default function GaleriaMasonry() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [displayedCount, setDisplayedCount] = useState(IMAGES_PER_PAGE);
  const [imageStates, setImageStates] = useState<Record<number, boolean>>({});
  const loaderRef = useRef<HTMLDivElement>(null);

  // Cargar más imágenes cuando el usuario scrollea cerca del final
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedCount < imagenes.length) {
        setDisplayedCount(prev => Math.min(prev + IMAGES_PER_PAGE, imagenes.length));
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [displayedCount]);

  const handleImageLoad = useCallback((index: number) => {
    setImageStates(prev => ({ ...prev, [index]: true }));
  }, []);

  const displayedImages = imagenes.slice(0, displayedCount);
  const hasMoreImages = displayedCount < imagenes.length;

  return (
    <section className="min-h-screen bg-gris-50 pt-32 md:pt-40 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 
            className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-4"
            style={{ color: '#19b2c0' }}
          >
            GALERÍA
          </h1>
          <p className="font-gliker text-xl md:text-2xl text-gris-700 italic">
            Momentos que construyen nuestra historia
          </p>
        </motion.div>

        {/* Grid Masonry con carga progresiva */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
          {displayedImages.map((imagen, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer group ${
                imagen.ratio === 'big' ? 'col-span-2 row-span-2' :
                imagen.ratio === 'tall' ? 'row-span-2' :
                imagen.ratio === 'wide' ? 'col-span-2' :
                ''
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: (index % IMAGES_PER_PAGE) * 0.02 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(index)}
            >
              {/* Placeholder blur */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                imageStates[index] ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'
              }} />
              
              {/* Imagen real con lazy loading */}
              <img
                src={imagen.src}
                alt={imagen.alt}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  imageStates[index] ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => handleImageLoad(index)}
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Loader Reference */}
        {hasMoreImages && (
          <div ref={loaderRef} className="mt-12 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              <div className="w-10 h-10 border-3 border-turquesa border-t-transparent rounded-full animate-spin" />
            </motion.div>
            <p className="text-gris-600 mt-4 font-gliker">Cargando más momentos...</p>
          </div>
        )}

        {!hasMoreImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-gris-600 font-gliker text-lg">
              ✨ {imagenes.length} momentos capturados en tu pantalla ✨
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal para imagen ampliada */}
      {selectedImage !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <motion.img
            src={imagenes[selectedImage].src}
            alt={imagenes[selectedImage].alt}
            className="max-w-full max-h-[90vh] object-contain"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </section>
  );
}
