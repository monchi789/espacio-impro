'use client';

import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';

export default function MisionVision() {
  const cards = [
    {
      icon: Target,
      title: 'MISIÓN',
      content: 'Somos una Escuela y Compañía Teatral, con perspectiva de género, responsable y comprometida con la sociedad, que a través de los espectáculos y puestas en escena que realiza, busca transmitir diferentes emociones, ideas y sensaciones. Además de crear espacios seguros dentro y fuera del escenario, para el elenco y el público espectador.',
      titleColor: '#ff657a'
    },
    {
      icon: Eye,
      title: 'VISIÓN',
      content: 'Aspiramos ser un referente en la improvisación teatral en Cusco y la macro región Sur del Perú, con una identidad propia, promoviendo la creación colectiva, la investigación constante y la construcción de espacios seguros y libres, donde el arte se convierta en herramienta de transformación social y voz plural para nuestras realidades.',
      titleColor: '#fed056'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid md:grid-cols-2 gap-8 md:gap-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              className="bg-white rounded-2xl p-8 md:p-10 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8 }}
            >
              {/* Ícono en contenedor circular con animación flotante */}
              <motion.div 
                className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center mb-6"
                style={{ 
                  background: `linear-gradient(135deg, ${card.titleColor}20, ${card.titleColor}40)` 
                }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.1 }}
              >
                <card.icon className="w-8 h-8" style={{ color: card.titleColor }} />
              </motion.div>

              <h3 
                className="font-lovelo text-2xl md:text-3xl mb-6"
                style={{ color: card.titleColor }}
              >
                {card.title}
              </h3>

              <p className="font-inter text-base md:text-lg leading-relaxed text-gris-700">
                {card.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
