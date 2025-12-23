'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Todas las imágenes incluyendo cuadradas para metodología
const imagenesDisponibles = [
  'IMG_20250515_195645.webp',
  'IMG-20251003-WA0031.webp',
  'IMG-20251028-WA0035.webp',
  'WhatsApp Image 2025-07-20 at 6.42.55 PM (4).webp',
  'IMG_20250515_204459.webp',
  'IMG-20251003-WA0046.webp',
  'sin título-4352.webp'
];

// Seleccionar 5 imágenes aleatorias para el carrusel
const seleccionarImagenesAleatorias = () => {
  const shuffled = [...imagenesDisponibles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
};

const imagenesCarousel = seleccionarImagenesAleatorias();

export default function Metodologia() {
  const [currentImage, setCurrentImage] = useState(0);

  // Cambiar imagen cada 3.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imagenesCarousel.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-dorado-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lavanda-100 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-8" style={{ color: '#117cb2' }}>
              NUESTRA METODOLOGÍA
            </h2>

            <div className="space-y-6 font-inter text-lg md:text-xl text-gris-700 leading-relaxed">
              <p>
                No enseñamos a hacer impro <strong className="text-gris-900">"correctamente"</strong>,
                enseñamos a <strong className="text-dorado-700">habitarla genuinamente</strong>.
              </p>

              <p>
                Desde el juego espontáneo hasta la escena encarnada,
                acompañamos a cada persona a descubrir su propia voz escénica,
                a escuchar con el cuerpo y crear desde la presencia.
              </p>
            </div>

            {/* Elementos decorativos */}
            <div className="mt-12 flex gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-dorado rounded-full" />
                <span className="font-gliker text-dorado-700 text-lg">Permitirse</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-carmin rounded-full" />
                <span className="font-gliker text-carmin-700 text-lg">Profundizar</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-lavanda rounded-full" />
                <span className="font-gliker text-lavanda-700 text-lg">Pertenecer</span>
              </div>
            </div>
          </motion.div>

          {/* Carrusel de imágenes */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-linear-to-br from-lavanda-100 to-carmin-100 relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={`/images/nuestra_metodologia/${imagenesCarousel[currentImage]}`}
                  alt="Proceso pedagógico en Espacio Impro"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>

              {/* Botones de navegación */}
              <button
                onClick={() => setCurrentImage((prev) => (prev - 1 + imagenesCarousel.length) % imagenesCarousel.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6 text-gris-800" />
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev + 1) % imagenesCarousel.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-6 h-6 text-gris-800" />
              </button>

              {/* Indicadores del carrusel */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {imagenesCarousel.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImage 
                        ? 'bg-white w-8 shadow-lg' 
                        : 'bg-white/50 w-1.5 hover:bg-white/70'
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Elemento decorativo flotante */}
            <motion.div
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-dorado-200 rounded-full opacity-40 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
