'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const frases = [
  "Decimos si al riesgo de vivir en presencia.",
  "Decimos sí a la creación compartida.",
  "Decimos sí al vértigo de descubrir lo inesperado.",
  "Decimos sí al error y lo transformamos en un regalo.",
];

export default function Manifiesto() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % frases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-6 pb-16 md:pt-8 md:pb-24 bg-linear-to-br from-lavanda-50 to-carmin-50 relative overflow-hidden">
      {/* Textura de fondo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentIndex}
              className="font-gliker text-3xl md:text-5xl text-gris-800 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              {frases[currentIndex]}
            </motion.h2>
          </AnimatePresence>

          {/* Indicadores */}
          <div className="flex justify-center gap-3 mt-12">
            {frases.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-lavanda w-8' : 'bg-lavanda-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
