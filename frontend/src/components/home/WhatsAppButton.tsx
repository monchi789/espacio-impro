'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function WhatsAppButton() {
  const whatsappNumber = '51997971371';
  const message = encodeURIComponent('¡Hola! Me gustaría saber más sobre Espacio Impro');
  const [isHovered, setIsHovered] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [autoHideTimeout, setAutoHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const phrases = [
    "¡Hablemos por WhatsApp! 💬",
    "¿Listo para improvisar? 🎭",
    "¡Escríbenos ahora! ✨",
    "¿Te unirías a nosotros? 🌟",
    "¡Cuéntanos tu idea! 💡"
  ];

  // Tooltip automático cada 12 segundos
  useState(() => {
    const tooltipInterval = setInterval(() => {
      if (!isHovered) {
        setShowTooltip(true);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        const timeout = setTimeout(() => {
          if (!isHovered) {
            setShowTooltip(false);
          }
        }, 4000);
        setAutoHideTimeout(timeout);
      }
    }, 12000);

    return () => {
      clearInterval(tooltipInterval);
      if (autoHideTimeout) clearTimeout(autoHideTimeout);
    };
  });

  // Cambiar frase en hover y mantener visible
  const handleHoverStart = () => {
    setIsHovered(true);
    setShowTooltip(true);
    // Cancelar el auto-hide si existe
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout);
      setAutoHideTimeout(null);
    }
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    setShowTooltip(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.a
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ 
          scale: 1, 
          rotate: 0, 
          opacity: 1,
          y: [0, -8, 0],
        }}
        transition={{
          scale: { delay: 1, duration: 0.5, type: "spring", bounce: 0.5 },
          rotate: { delay: 1, duration: 0.6 },
          opacity: { delay: 1, duration: 0.3 },
          y: {
            delay: 1.8,
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
        whileHover={{ 
          scale: 1.15,
          rotate: [0, -10, 10, -10, 0],
          transition: { 
            rotate: { duration: 0.5 },
            scale: { duration: 0.2 }
          }
        }}
        whileTap={{ 
          scale: 0.9,
          rotate: -15
        }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      >
        {/* Círculos de pulsación múltiples */}
        <motion.div
          className="absolute inset-0 bg-[#25D366] rounded-full"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            repeatDelay: 0.5
          }}
        />
        <motion.div
          className="absolute inset-0 bg-[#25D366] rounded-full"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1
          }}
        />

        {/* Icono de WhatsApp con animación */}
        <motion.svg
          className="w-9 h-9 relative z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          animate={{
            rotate: isHovered ? [0, 15, -15, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </motion.svg>

        {/* Partículas decorativas en hover */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0
                }}
                animate={{ 
                  x: Math.cos((i * 60) * Math.PI / 180) * 40,
                  y: Math.sin((i * 60) * Math.PI / 180) * 40,
                  opacity: 0,
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}

        {/* Brillo en hover */}
        <motion.div
          className="absolute inset-0 bg-white rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.a>

      {/* Texto flotante que cambia de frase */}
      <motion.div
        className="absolute bottom-full right-0 mb-6 bg-white px-6 py-4 sm:px-8 sm:py-5 rounded-2xl shadow-2xl min-w-[220px] sm:min-w-[280px]"
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ 
          opacity: showTooltip ? 1 : 0,
          y: showTooltip ? 0 : 10,
          scale: showTooltip ? 1 : 0.8
        }}
        transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
        style={{ pointerEvents: 'none' }}
      >
        <motion.p 
          className="font-inter text-base sm:text-lg md:text-xl font-bold text-gris-900 text-center"
          key={currentPhraseIndex}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {phrases[currentPhraseIndex]}
        </motion.p>
        <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white" />
      </motion.div>
    </div>
  );
}
