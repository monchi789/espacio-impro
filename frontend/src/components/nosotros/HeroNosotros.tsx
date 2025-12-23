'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const imagenes = [
  '17_20240402_123131_0006.webp',
  'dani.webp',
  'Foto-39.webp',
  'IMG_20250515_202048.webp',
  'WhatsApp Image 2025-06-13 at 9.55.23 AM (2).webp',
  '1730222664463.webp',
  'Dia 3_5.webp',
  'FOTOS SONDER_20240814_140957_0003.webp',
  'IMG-20250614-WA0048.webp',
  'WhatsApp Image 2025-06-15 at 8.29.05 AM.webp',
  '1730223165037.webp',
  'DSC04109.webp',
  'IMG_20240530_232827.webp',
  'IMG_20250829_200203.webp',
  'WhatsApp Image 2025-07-20 at 6.42.45 PM.webp',
  '1731981090754.webp',
  'Foto-14.webp',
  'IMG-20250324-WA0015.webp',
  'IMG_9930.webp',
  'WhatsApp Image 2025-07-20 at 6.42.55 PM (2).webp',
  '1741538025965.webp',
  'Foto-31.webp',
  'IMG_20250329_151940.webp',
  'IMG_9949.webp',
  'WhatsApp Image 2025-07-20 at 6.42.58 PM (1).webp'
];

const frases = [
  'Creando espacios seguros y libres',
  'Arte como herramienta de transformación social',
  'Con perspectiva de género y compromiso social'
];

export default function HeroNosotros() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentFrase, setCurrentFrase] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imagenes.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  // Cambio automático de frases cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrase((prev) => (prev + 1) % frases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden bg-gris-50 pt-24 md:pt-28 pb-12 md:pb-0">
      {/* Sin fondo decorativo para estilo limpio */}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Texto izquierda */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <motion.h1 
                className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-4"
                style={{ color: '#117cb2' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                COMPAÑÍA TEATRAL
                <br />
                ESPACIO ESCENICO IMPRO
              </motion.h1>
              <p className="font-gliker text-xl md:text-2xl text-gris-700 italic mb-6">
                Escuela y Compañía Teatral en Cusco, Perú
              </p>

              {/* Frase rotativa con efecto typewriter */}
              <div className="h-16 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentFrase}
                    className="font-gliker text-lg md:text-xl italic"
                    style={{ color: '#117cb2' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {frases[currentFrase]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-6 font-inter text-base md:text-lg text-gris-700 leading-relaxed">
              <p>
                Espacio Impro es una Escuela y Compañía Teatral que explora la técnica de la improvisación en Cusco, Perú, <strong className="text-acero">promoviendo salir del "cliché" convencional</strong> de la impro orientada solo a la comedia y explorando la técnica como un código interpretativo del teatro.
              </p>
              <p>
                Desde su fundación, Espacio Impro se ha propuesto <strong className="text-gris-900">descentralizar el teatro y la improvisación en el Perú</strong>, apostando por la formación constante de actorxs improvisadorxs a través de talleres y espacios de aprendizaje compartidos.
              </p>
              <p>
                La búsqueda permanente de Espacio Impro es consolidar una comunidad artística que cuestione y exprese nuestra cultura, siempre desde una <strong className="text-carmin">perspectiva de género</strong> y un compromiso activo con las luchas sociales actuales.
              </p>
            </div>
          </motion.div>

          {/* Carousel derecha */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="h-[500px] md:h-[600px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={`/images/nosotros/${imagenes[currentImage]}`}
                    alt="Espacio Impro - Compañía teatral"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                  />
                </AnimatePresence>

                {/* Controles del carousel */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-gris-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-6 h-6 text-gris-800" />
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {imagenes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentImage 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 w-2'
                      }`}
                      aria-label={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
