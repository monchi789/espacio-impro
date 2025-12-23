'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

// Todas las imágenes disponibles (17 fotos reales) con variedad de tamaños
const imagenes = [
  { src: '/images/galeria/IMG_20250829_200500.webp', alt: 'Escena teatral', ratio: 'tall' }, // 3060x4080
  { src: '/images/galeria/WhatsApp Image 2025-06-13 at 9.55.17 AM (2).webp', alt: 'Momentos creativos', ratio: 'wide' }, // 1280x913
  { src: '/images/galeria/DSC04216.webp', alt: 'Performance grupal', ratio: 'wide' }, // 3072x2048
  { src: '/images/galeria/IMG-20251028-WA0038 1.webp', alt: 'Improvisación escénica', ratio: 'wide' }, // 4160x1873
  { src: '/images/galeria/Dia 2 Carol.webp', alt: 'Arte en acción', ratio: 'tall' }, // 3011x4255
  { src: '/images/galeria/Foto-12.webp', alt: 'Escena teatral', ratio: 'tall' }, // 2557x3196
  { src: '/images/galeria/IMG_20250718_203035.webp', alt: 'Juego escénico', ratio: 'tall' }, // 3060x4080
  { src: '/images/galeria/IMG_9951.webp', alt: 'Trabajo en equipo', ratio: 'wide' }, // 5184x3456
  { src: '/images/galeria/FOTOS SONDER_20240814_140957_0001.webp', alt: 'Arte creativo', ratio: 'square' }, // 1080x1080
  { src: '/images/galeria/Dani.webp', alt: 'Improvisación grupal', ratio: 'wide' }, // 3259x2893
  { src: '/images/galeria/Foto-69.webp', alt: 'Creatividad escénica', ratio: 'wide' }, // 2973x2378
  { src: '/images/galeria/1730222664204.webp', alt: 'Expresión artística', ratio: 'wide' }, // 4032x3024
  { src: '/images/galeria/1741538025696.webp', alt: 'Escena teatral', ratio: 'square' }, // 3056x3056
  { src: '/images/galeria/IMG-20250724-WA0001.webp', alt: 'Improvisación divertida', ratio: 'wide' }, // 1280x507
  { src: '/images/galeria/FOTOS SONDER_20240814_140957_0000.webp', alt: 'Arte creativo', ratio: 'square' }, // 1080x1080
  { src: '/images/galeria/FOTOS SONDER_20240814_140957_0004.webp', alt: 'Performance teatral', ratio: 'square' }, // 1080x1080
  { src: '/images/galeria/IMG_20250404_173519.webp', alt: 'Escena en movimiento', ratio: 'wide' }, // 3200x1440
  { src: '/images/galeria/sin título-4326.webp', alt: 'Momentos escénicos', ratio: 'tall' }, // 3767x4000
  { src: '/images/galeria/Foto-169.webp', alt: 'Improvisación grupal', ratio: 'wide' }, // 3000x2000
  { src: '/images/galeria/WhatsApp Image 2025-07-20 at 6.42.50 PM (3).webp', alt: 'Arte en acción', ratio: 'tall' }, // 3060x4080
  { src: '/images/galeria/Foto-36.webp', alt: 'Escena teatral', ratio: 'wide' }, // 3048x2438
  { src: '/images/galeria/IMG_20250829_202059.webp', alt: 'Performance grupal', ratio: 'tall' }, // 1080x1920
  { src: '/images/galeria/Foto-75.webp', alt: 'Improvisación escénica', ratio: 'wide' }, // 3927x3142
  { src: '/images/galeria/1741538026100.webp', alt: 'Arte creativo', ratio: 'square' }, // 3056x3056
  { src: '/images/galeria/Foto-50.webp', alt: 'Expresión artística', ratio: 'wide' }, // 4314x3451
  { src: '/images/galeria/IMG_0632.webp', alt: 'Momento creativo', ratio: 'wide' }, // 5184x3456
  { src: '/images/galeria/IMG_9929.webp', alt: 'Juego escénico', ratio: 'wide' }, // 5184x3456
  { src: '/images/galeria/Foto.webp', alt: 'Arte escénico', ratio: 'wide' }, // 4440x3552
  { src: '/images/galeria/Foto-161.webp', alt: 'Improvisación teatral', ratio: 'wide' }, // 3000x2000
  { src: '/images/galeria/IMG_20250829_203422.webp', alt: 'Escena en acción', ratio: 'tall' }, // 1080x1920
  { src: '/images/galeria/IMG-20250404-WA0026.webp', alt: 'Performance grupal', ratio: 'tall' }, // 3119x4160
  { src: '/images/galeria/marcos y gaby día 2.webp', alt: 'Trabajo en equipo', ratio: 'wide' }, // 4470x3317
  { src: '/images/galeria/WhatsApp Image 2025-07-20 at 6.42.50 PM (4).webp', alt: 'Arte escénico', ratio: 'tall' }, // 3060x4080
  { src: '/images/galeria/IMG-20250525-WA0113.webp', alt: 'Improvisación divertida', ratio: 'tall' }, // 1200x1600
  { src: '/images/galeria/FOTOS SONDER_20240814_140957_0006.webp', alt: 'Escena teatral', ratio: 'square' }, // 1080x1080
  { src: '/images/galeria/Foto-37.webp', alt: 'Arte creativo', ratio: 'wide' }, // 3072x2458
  { src: '/images/galeria/Foto-5.webp', alt: 'Expresión artística', ratio: 'tall' }, // 3118x3898
  { src: '/images/galeria/Foto-42.webp', alt: 'Improvisación grupal', ratio: 'wide' }, // 3854x3083
  { src: '/images/galeria/Foto-29.webp', alt: 'Momento creativo', ratio: 'tall' }, // 3090x3863
  { src: '/images/galeria/DANI presentador.webp', alt: 'Escena teatral', ratio: 'tall' }, // 1832x2719
  { src: '/images/galeria/DSC04135.webp', alt: 'Arte en acción', ratio: 'wide' }, // 3072x2048
  { src: '/images/galeria/IMG_20250315_190214.webp', alt: 'Performance teatral', ratio: 'wide' }, // 4640x2088
  { src: '/images/galeria/DSC04204.webp', alt: 'Improvisación escénica', ratio: 'wide' }, // 3072x2048
  { src: '/images/galeria/IMG_20250329_172857.webp', alt: 'Momentos creativos', ratio: 'tall' }, // 1080x1224
  { src: '/images/galeria/Foto-57.webp', alt: 'Arte escénico', ratio: 'wide' }, // 4876x3901
  { src: '/images/galeria/IMG_9964.webp', alt: 'Escena teatral', ratio: 'wide' }, // 5184x3456
  { src: '/images/galeria/Foto-64.webp', alt: 'Improvisación creativa', ratio: 'tall' }, // 3656x4570
  { src: '/images/galeria/WhatsApp Image 2025-06-13 at 9.55.21 AM (3).webp', alt: 'Escena teatral', ratio: 'wide' }, // 1280x913
  { src: '/images/galeria/WhatsApp Image 2025-06-13 at 9.55.17 AM (1).webp', alt: 'Arte escénico', ratio: 'wide' }, // 1280x913
  { src: '/images/galeria/1741538025511.webp', alt: 'Escena teatral', ratio: 'square' }, // 3056x3056
  { src: '/images/galeria/WhatsApp Image 2025-06-15 at 8.29.02 AM (1).webp', alt: 'Improvisación teatral', ratio: 'wide' }, // 3417x2916
  { src: '/images/galeria/IMG-20240516-WA0022.webp', alt: 'Arte creativo', ratio: 'wide' }, // 1280x720
  { src: '/images/galeria/WhatsApp Image 2025-07-20 at 6.42.45 PM (2).webp', alt: 'Escena grupal', ratio: 'tall' }, // 2296x4080
  { src: '/images/galeria/IMG_20250829_203304.webp', alt: 'Arte escénico', ratio: 'tall' }, // 1080x1920
  { src: '/images/galeria/Foto-53.webp', alt: 'Escena teatral', ratio: 'wide' }, // 3390x2712
  { src: '/images/galeria/11_20240402_123130_0000.webp', alt: 'Arte creativo', ratio: 'square' }, // 3000x3000
  { src: '/images/galeria/WhatsApp Image 2025-07-20 at 6.42.41 PM (1).webp', alt: 'Improvisación escénica', ratio: 'tall' }, // 3060x4080
  { src: '/images/galeria/IMG-20250321-WA0002.webp', alt: 'Escena teatral', ratio: 'tall' }, // 720x1280
  { src: '/images/galeria/IMG-20250220-WA0061.webp', alt: 'Performance grupal', ratio: 'tall' }, // 1280x1600
  { src: '/images/galeria/sin título-4268.webp', alt: 'Arte escénico', ratio: 'square' }, // 3663x3616
  { src: '/images/galeria/sin título-4292.webp', alt: 'Improvisación teatral', ratio: 'square' }, // 3349x3616
  { src: '/images/galeria/IMG_20250829_195454.webp', alt: 'Escena creativa', ratio: 'tall' }, // 3060x4080
  { src: '/images/galeria/sin título-4311.webp', alt: 'Arte escénico', ratio: 'square' } // 3965x3767
];




export default function GaleriaMasonry() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

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
            style={{ color: '#117cb2' }}
          >
            GALERÍA
          </h1>
          <p className="font-gliker text-xl md:text-2xl text-gris-700 italic">
            Momentos que construyen nuestra historia
          </p>
        </motion.div>

        {/* Grid Masonry con CSS Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
          {imagenes.map((imagen, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer group ${
                imagen.ratio === 'big' ? 'col-span-2 row-span-2' :
                imagen.ratio === 'tall' ? 'row-span-2' :
                imagen.ratio === 'wide' ? 'col-span-2' :
                ''
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={imagen.src}
                alt={imagen.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
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
