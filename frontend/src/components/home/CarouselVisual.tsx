'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const frases = [
  "Actuar es investigación.",
  "Actuar es comunidad.",
  "Actuar es memoria.",
  "Actuar es riesgo.",
  "Actuar es libertad.",
  "Actuar es presente.",
  "Actuar es descubrir.",
  "Actuar es jugar."
];

// Lista de imágenes con mejor relación de aspecto para el carrusel (horizontales 3:2)
const todasLasImagenes = [
  '1730222663979.webp',
  'DSC04105.webp',
  'IMG_20250108_190730.webp',
  'IMG_20250829_202101.webp',
  'impro-73.webp',
  '4-1.webp',
  'IMG_20240530_232848.webp',
  'IMG-20250220-WA0008.webp',
  'IMG-20251028-WA0048.webp',
  'WhatsApp Image 2025-07-20 at 6.42.51 PM.webp'
];

// Seleccionar 5 imágenes aleatorias para el carousel
const seleccionarImagenesAleatorias = () => {
  const shuffled = [...todasLasImagenes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
};

// Imágenes seleccionadas para esta sesión
const imagenesCarousel = seleccionarImagenesAleatorias();

export default function CarouselVisual() {
  const [currentFrase, setCurrentFrase] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imagenesCarousel.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imagenesCarousel.length) % imagenesCarousel.length);
  };

  // Cambiar frase cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrase((prev) => (prev + 1) % frases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-avance de imágenes cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imagenesCarousel.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-20 pb-6 md:pt-32 md:pb-8 bg-white relative overflow-hidden">
      {/* Título y texto - con container */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-6" style={{ color: '#117cb2' }}>
            IMPROVISAMOS DESDE EL PRESENTE
          </h2>
          <p className="font-inter text-lg md:text-xl text-gris-700 max-w-3xl mx-auto leading-relaxed">
            Cada creación es distinta, pero todas comparten:
            <strong> la escucha colectiva, el cuerpo disponible y el descubrir.</strong>
          </p>

          {/* Frases animadas */}
          <div className="mt-12 mb-16 md:mb-20 min-h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentFrase}
                className="font-gliker text-3xl md:text-4xl lg:text-5xl text-lavanda text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {frases[currentFrase]}
              </motion.h3>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Carrusel con padding y contenedor */}
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-[400px] md:h-[500px] lg:h-[600px] bg-gris-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                className="w-full h-full"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7 }}
              >
                <img 
                  src={`/images/inicio/${imagenesCarousel[currentImage]}`} 
                  alt="Espacio Impro en acción"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controles del carousel */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6 text-gris-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-6 h-6 text-gris-800" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          {imagenesCarousel.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImage 
                  ? 'bg-white w-12 shadow-lg' 
                  : 'bg-white/50 w-2 hover:bg-white/70'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
