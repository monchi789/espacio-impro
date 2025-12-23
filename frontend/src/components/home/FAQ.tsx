'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    id: 1,
    question: "¿Necesito experiencia previa para participar en un taller?",
    answer: "No, tenemos talleres desde niveles básicos, así que no es problema puedes aprender. Además, si ya tienes experiencia improvisando también tenemos tallares para que sigas entrenando y descubriendo más."
  },
  {
    id: 2,
    question: "¿Qué diferencia a Espacio Impro de otras escuelas de impro?",
    answer: "Nuestra mirada es teatral, no solo cómica. Exploramos la improvisación como código interpretativo del teatro. Estamos en constante investigación esto nos permite descubrir más recursos, adquirir nuevas herramientas y profundizar en nuestra improvisación."
  },
  {
    id: 3,
    question: "¿Cuándo es su próxima función?",
    answer: "Para enterarte sobre nuestras siguientes funciones siguenos en IG @espacioimpro.cusco"
  },
  {
    id: 4,
    question: "¿Cómo puedo formar parte de la compañía o colaborar?",
    answer: "Escríbenos a nuestras redes; te contaremos sobre nuestros shows, festivales o talleres de formación."
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 md:py-32 bg-gris-50 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-lavanda-100 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-carmin-100 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-4" style={{ color: '#117cb2' }}>
            PREGUNTAS FRECUENTES
          </h2>
        </motion.div>

        {/* Acordeón */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="bg-white rounded-xl overflow-hidden border border-gris-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Pregunta */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-gris-50 transition-colors duration-200"
              >
                <span className="font-inter text-lg md:text-xl text-gris-800 font-medium pr-8">
                  {faq.question}
                </span>
                
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <svg 
                    className="w-6 h-6 text-lavanda" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </motion.div>
              </button>

              {/* Respuesta */}
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-6 pt-2">
                      <p className="font-inter text-base md:text-lg text-gris-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
