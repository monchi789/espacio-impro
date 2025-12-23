'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users, Search } from 'lucide-react';

const pilares = [
  {
    id: 1,
    title: "PERMITIRSE",
    subtitle: "Todo es cuestión de permisos",
    text: "Me permito ser, estar, hacer. Desafío mis propios límites internos. Habitar la impro es autorizarme a existir sin pedir permiso al miedo. Me abro al riesgo de habitarme y habitar la escena.",
    color: "from-dorado to-dorado-600",
    textColor: "text-dorado-900",
    icon: Sparkles,
    iconColor: "text-dorado-600"
  },
  {
    id: 2,
    title: "PERTENECER",
    subtitle: "Todxs estamos en la misma barca",
    text: "Improvisar es escucharnos. Ningún cuerpo actúa solo: nos afectamos, nos acompañamos, nos sostenemos. Pertenecer es reconocernos en sociedad, que toda escena se construye en red y que mi libertad también nace de la tuya",
    color: "from-carmin to-carmin-600",
    textColor: "text-carmin-900",
    icon: Users,
    iconColor: "text-carmin-600"
  },
  {
    id: 3,
    title: "PROFUNDIZAR",
    subtitle: "Detrás de todas las paredes está el cielo",
    text: "Profundizar es resistir la superficialidad. Cuestiono, busco sentido, dejo que el cuerpo piense. En cada improvisación hay una pregunta viva, una búsqueda que no se conforma con lo evidente.",
    color: "from-acero to-acero-600",
    textColor: "text-acero-900",
    icon: Search,
    iconColor: "text-acero-600"
  }
];

export default function Pilares() {
  return (
    <section className="py-20 md:py-32 bg-gris-50 relative overflow-hidden">
      {/* Fondo con textura sutil */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(108,100,139,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,101,122,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título de sección */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-4" style={{ color: '#117cb2' }}>
            NUESTROS PILARES
          </h2>
          <p className="font-gliker text-xl md:text-2xl text-gris-700">
            Filosofía de espacio impro
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {pilares.map((pilar, index) => (
            <motion.div
              key={pilar.id}
              className={`relative group bg-linear-to-br ${pilar.color} rounded-2xl p-8 md:p-10 overflow-hidden shadow-2xl`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.02,
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              {/* Círculo con icono flotante */}
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 opacity-30 transform rotate-12 flex items-center justify-center"
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <pilar.icon className={`w-20 h-20 ${pilar.iconColor}`} strokeWidth={1.5} />
              </motion.div>

              {/* Contenido */}
              <div className="relative z-10">
                {/* Número */}
                <div className="font-lovelo text-6xl md:text-7xl opacity-30 mb-4" style={{ color: '#ff657a' }}>
                  0{pilar.id}
                </div>

                {/* Título */}
                <h3 className="font-lovelo text-2xl md:text-3xl text-gris-900 mb-2">
                  {pilar.title}
                </h3>

                {/* Subtítulo */}
                <p className="font-gliker text-lg md:text-xl text-gris-800 mb-6 italic">
                  "{pilar.subtitle}"
                </p>

                {/* Texto descriptivo */}
                <p className="font-inter text-base md:text-lg text-gris-900 leading-relaxed">
                  {pilar.text}
                </p>
              </div>

              {/* Efecto hover */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
