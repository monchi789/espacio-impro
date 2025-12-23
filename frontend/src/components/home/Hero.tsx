'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const dynamicPhrases = [
  "habitar el presente.",
  "habitar el cuerpo.",
  "habitar la escena."
];

const colors = [
  '#6c648b', // lavanda
  '#ff657a', // carmin
  '#fed056', // dorado
  '#117cb2', // acero
];

// Proyectiles de estrellas - salen desde el centro del logo hacia afuera
const starProjectiles = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * 360; // Distribuidas en 360 grados
  const distance = 450 + Math.random() * 200; // Distancia que recorrerán
  
  return {
    id: i,
    angle,
    distance,
    duration: 3 + Math.random() * 2, // Duración del proyectil (3-5s)
    delay: i * 0.8, // Delay escalonado para que salgan continuamente
    size: 20 + Math.random() * 12, // Estrellas más grandes
    colorIndex: i % colors.length,
    rotationSpeed: 8 + Math.random() * 12,
  };
});

export default function Hero() {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Efecto máquina de escribir
  useEffect(() => {
    const currentText = dynamicPhrases[currentPhrase];
    let currentIndex = 0;
    
    setDisplayedText('');
    setIsTyping(true);
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= currentText.length) {
        setDisplayedText(currentText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 80); // Velocidad de escritura

    return () => clearInterval(typeInterval);
  }, [currentPhrase]);

  // Cambiar de frase cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % dynamicPhrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden bg-gris-50 pt-24 md:pt-28 pb-12 md:pb-0">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Lado izquierdo - Texto */}
        <motion.div 
          className="space-y-6 text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          {/* Título principal */}
          <motion.h1
            className="font-lovelo text-5xl md:text-6xl lg:text-7xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gris-900">COMPAÑÍA TEATRAL</span>
            <br />
            <span style={{ color: '#117cb2' }}>ESPACIO ESCÉNICO IMPRO</span>
          </motion.h1>

          {/* Frases dinámicas con efecto typewriter en la misma línea */}
          <motion.div
            className="flex flex-wrap items-baseline gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="font-gliker text-2xl md:text-3xl text-lavanda">
              Impro es...
            </span>
            <span className="font-inter text-xl md:text-2xl text-gris-700 italic min-w-[280px]">
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </span>
          </motion.div>

          {/* Texto principal */}
          <motion.div
            className="space-y-4 font-inter text-lg md:text-xl text-gris-700 leading-relaxed text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p>
              Exploramos la improvisación como un <strong>lenguaje vivo, poético y transformador</strong>.
            </p>
            <p>
              En cada escena buscamos <strong>presencia, cuerpo y encuentro</strong>: una conversación 
              entre lo que somos y lo que estamos descubriendo.
            </p>
          </motion.div>

          {/* Botón CTA */}
          <motion.a
            href="/contactanos"
            className="cta-button inline-flex items-center gap-3 bg-carmin hover:bg-carmin-600 text-white font-inter font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contáctanos
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </motion.svg>
          </motion.a>
        </motion.div>

        {/* Lado derecho - Logo con órbita de estrellas */}
        <motion.div
          className="relative flex items-center justify-center min-h-[400px] md:min-h-[600px] lg:min-h-[700px]"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Proyectiles de estrellas - salen desde detrás del logo */}
          <div className="absolute inset-0 flex items-center justify-center z-0 overflow-visible">
            {starProjectiles.map((star) => {
              const startX = 0; // Comienza desde el centro del logo
              const startY = 0;
              const endX = Math.cos((star.angle * Math.PI) / 180) * star.distance;
              const endY = Math.sin((star.angle * Math.PI) / 180) * star.distance;
              
              return (
                <motion.div
                  key={star.id}
                  className="absolute pointer-events-none"
                  style={{
                    width: star.size,
                    height: star.size,
                    left: '50%',
                    top: '50%',
                    marginLeft: -star.size / 2,
                    marginTop: -star.size / 2,
                  }}
                  animate={{
                    x: [startX, endX],
                    y: [startY, endY],
                    opacity: [0, 0.8, 0.9, 0.7, 0],
                    scale: [0.3, 1, 1.1, 0.8, 0.5],
                  }}
                  transition={{
                    duration: star.duration,
                    repeat: Infinity,
                    delay: star.delay,
                    ease: "easeOut",
                    times: [0, 0.2, 0.4, 0.7, 1],
                  }}
                >
                  <motion.svg 
                    viewBox="0 0 24 24" 
                    fill={colors[star.colorIndex]}
                    style={{
                      filter: `drop-shadow(0 0 14px ${colors[star.colorIndex]})`,
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: star.rotationSpeed,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </motion.svg>
                </motion.div>
              );
            })}
          </div>

          {/* Logo central con movimiento orbital sutil - DELANTE de las estrellas */}
          <motion.div 
            className="relative z-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: {
                duration: 80,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }
            }}
          >
            <motion.div
              className="w-full h-full flex items-center justify-center p-8"
              animate={{
                rotate: [0, -360],
              }}
              transition={{
                duration: 80,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <motion.img 
                src="/logo.png" 
                alt="Espacio Impro Logo" 
                className="w-full h-full object-contain drop-shadow-2xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
