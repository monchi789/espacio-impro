'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const principios = [
  {
    title: "Me Permito",
    subtitle: "Todo es cuestión de permisos",
    description: "En la improvisación, nos damos permiso para explorar, equivocarnos, y crear sin juicio. Es la libertad de ser auténticos.",
    icon: "icon1.svg",
  },
  {
    title: "Pertenezco",
    subtitle: "Todxs estamos en la misma barca",
    description: "Creamos juntos. La improvisación es un acto colectivo donde cada voz importa y cada presencia enriquece la escena.",
    icon: "icon2.svg",
  },
  {
    title: "Profundizo",
    subtitle: "Detrás de todas las paredes está el cielo",
    description: "Vamos más allá de lo superficial. Exploramos las capas profundas de la humanidad, las emociones y las historias.",
    icon: "icon3.svg",
  },
];

export default function Principios() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="font-lovelo text-4xl md:text-5xl text-center text-gris-800 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Nuestros Principios
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {principios.map((principio, index) => (
            <motion.div
              key={index}
              className="relative bg-gris-50 rounded-2xl p-8 cursor-pointer overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {/* Acento de color */}
              <div className="absolute top-0 left-0 w-2 h-full bg-lavanda group-hover:w-full transition-all duration-300 opacity-10" />

              <div className="relative z-10">
                {/* Ícono placeholder */}
                <div className="w-16 h-16 mb-6 bg-lavanda-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎭</span>
                </div>

                <h3 className="font-gliker text-2xl text-lavanda mb-2">
                  {principio.title}
                </h3>
                
                <p className="font-inter text-sm text-gris-600 italic mb-4">
                  "{principio.subtitle}"
                </p>

                {/* Descripción expandida al hover */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: hoveredIndex === index ? 'auto' : 0,
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="font-inter text-sm text-gris-700 leading-relaxed pt-4 border-t border-gris-200">
                    {principio.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
