'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, Award, Sparkles } from 'lucide-react';

const frasesHistoria = [
  'Desde 2015 trabajando juntos',
  'Formalizados en 2022',
  'Teatro como transformación social',
  'Intercambio cultural constante',
  'Compromiso con Cusco y el Sur del Perú'
];

export default function NuestraHistoria() {
  const [currentFrase, setCurrentFrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrase((prev) => (prev + 1) % frasesHistoria.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const eventos = [
    {
      year: '2015',
      title: 'Los Inicios',
      description: 'Las personas que integran esta agrupación comenzaron a trabajar juntas, explorando la improvisación como un espacio de encuentro creativo y libertad escénica, descubriendo en el camino múltiples posibilidades para desarrollar la improvisación como parte del teatro.',
      icon: Sparkles,
      titleColor: '#6c648b'
    },
    {
      year: '2022',
      title: 'Formalización',
      description: 'Se formalizó oficialmente como Compañía Teatral Espacio Escénico Impro, consolidando su identidad artística y pedagógica. Esta formalización marca el compromiso con la improvisación teatral, la formación constante, y la creación de espacios seguros con perspectiva de género y compromiso social.',
      icon: Calendar,
      titleColor: '#ff657a'
    },
    {
      year: 'Hoy',
      title: 'Consolidación',
      description: 'Espacio Impro continúa como referente en la improvisación teatral en Cusco y la macro región Sur del Perú. Organiza festivales nacionales, promueve el intercambio cultural con maestros locales e internacionales, y mantiene su compromiso activo con las luchas sociales desde el arte escénico.',
      icon: Award,
      titleColor: '#fed056'
    }
  ];

  return (
    <section className="py-20 bg-gris-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 
            className="font-lovelo text-3xl md:text-4xl lg:text-5xl mb-4"
            style={{ color: '#6c648b' }}
          >
            NUESTRA HISTORIA
          </h2>
          
          {/* Frase rotativa */}
          <div className="h-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFrase}
                className="font-gliker text-xl md:text-2xl italic"
                style={{ color: '#6c648b' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {frasesHistoria[currentFrase]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Grid de Bentos - 2 columnas, última ocupa el ancho completo */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {eventos.map((evento, index) => (
            <motion.div
              key={evento.year}
              className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                index === eventos.length - 1 ? 'md:col-span-2' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
            >
              {/* Ícono circular con animación flotante */}
              <motion.div 
                className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center mb-6 mx-auto"
                style={{ 
                  background: `linear-gradient(135deg, ${evento.titleColor}20, ${evento.titleColor}40)` 
                }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.15 }}
              >
                <evento.icon className="w-8 h-8" style={{ color: evento.titleColor }} />
              </motion.div>

              {/* Año */}
              <h3 
                className="font-lovelo text-3xl text-center mb-2"
                style={{ color: evento.titleColor }}
              >
                {evento.year}
              </h3>

              {/* Título */}
              <p className="font-gliker text-xl text-center text-gris-900 mb-4">
                {evento.title}
              </p>

              {/* Descripción */}
              <p className={`font-inter text-base text-gris-700 leading-relaxed ${
                index === eventos.length - 1 ? 'text-center max-w-4xl mx-auto' : 'text-center'
              }`}>
                {evento.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
