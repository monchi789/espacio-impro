'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Mail } from 'lucide-react';

interface Proyecto {
  titulo: string;
  color: string;
  descripcion: string;
  imagenes: string[];
}

const proyectos: Proyecto[] = [
  {
    titulo: "Escenas Improvisadas",
    color: "#117cb2", // azul
    descripcion: "Un viaje por las emociones y la espontaneidad donde cada función es única e irrepetible. Nuestros actores crean historias únicas en cada presentación, conectando con el público de manera auténtica y sorprendente. El escenario se transforma en un espacio de posibilidades infinitas donde la creatividad fluye libremente.",
    imagenes: ['/images/Foto-106.jpg', '/images/Foto-12.jpg', '/images/Foto-123.jpg']
  },
  {
    titulo: "Teatro Comunitario",
    color: "#6c648b", // lavanda
    descripcion: "Espacios de encuentro donde la comunidad se reúne para explorar, aprender y crear juntos. El arte como herramienta de transformación social y conexión humana, construyendo vínculos que trascienden el escenario. Cada participante aporta su voz única para tejer historias colectivas llenas de significado.",
    imagenes: ['/images/Foto-137.jpg', '/images/Foto-14.jpg', '/images/Foto-161.jpg']
  },
  {
    titulo: "Workshops Intensivos",
    color: "#fed056", // dorado
    descripcion: "Talleres de formación donde profundizamos en técnicas de improvisación, expresión corporal y juego escénico. Experiencias transformadoras que van más allá del teatro, explorando la creatividad como herramienta de autoconocimiento. Un espacio seguro para arriesgar, experimentar y descubrir nuevas facetas de nuestra expresión artística.",
    imagenes: ['/images/Foto-23.jpg', '/images/Foto-27.jpg', '/images/Foto-3.jpg']
  },
  {
    titulo: "Presentaciones Especiales",
    color: "#ff657a", // carmin
    descripcion: "Shows únicos diseñados para eventos corporativos, festivales y celebraciones especiales. Adaptamos nuestra propuesta a cada contexto manteniendo la esencia de la improvisación y el juego teatral. Cada presentación es una experiencia memorable que sorprende y emociona al público, creando momentos de conexión auténtica.",
    imagenes: ['/images/Foto-37.jpg', '/images/Foto-6.jpg', '/images/Foto-7.jpg']
  },
  {
    titulo: "Exploración Escénica",
    color: "#117cb2", // azul
    descripcion: "Investigación constante de nuevas formas de expresión teatral y performativa. Fusionamos técnicas tradicionales con propuestas contemporáneas para crear experiencias innovadoras que desafían los límites del teatro. Un laboratorio de creatividad donde todo es posible y cada experimento nos acerca a nuevas formas de contar historias.",
    imagenes: ['/images/sin título-4269.jpg', '/images/sin título-4295.jpg', '/images/sin título-4311.jpg']
  },
  {
    titulo: "Formación Continua",
    color: "#6c648b", // lavanda
    descripcion: "Programas de desarrollo artístico para todos los niveles de experiencia. Desde principiantes hasta profesionales, cada persona encuentra su espacio para crecer y explorar su potencial creativo. Acompañamos procesos de largo aliento donde la improvisación se convierte en una forma de vida, una manera de estar presente y conectar con el mundo.",
    imagenes: ['/images/sin título-4330.jpg', '/images/Foto-13.jpg', '/images/Foto-161.jpg']
  },
  {
    titulo: "Experiencias Colectivas",
    color: "#fed056", // dorado
    descripcion: "Creamos espacios donde el teatro se convierte en un ritual de encuentro y celebración. Performances participativas que borran la línea entre escenario y público, donde todos somos co-creadores de la experiencia. El arte como puente para construir comunidad y generar momentos de conexión profunda entre las personas.",
    imagenes: ['/images/Foto-7.jpg', '/images/sin título-4311.jpg', '/images/Foto-27.jpg']
  }
];

export default function PortafolioBento() {
  return (
    <>
      <section className="min-h-screen bg-gris-50 pt-32 md:pt-40 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 
              className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-4"
              style={{ color: '#117cb2' }}
            >
              PORTAFOLIO
            </h1>
            <p className="font-gliker text-xl md:text-2xl text-gris-700 italic">
              Nuestros proyectos y experiencias
            </p>
          </motion.div>

          {/* Grid Bento 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {proyectos.map((proyecto, index) => (
              <ProyectoCard key={index} proyecto={proyecto} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-lavanda rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-carmin rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 
                className="font-lovelo text-3xl md:text-4xl lg:text-5xl mb-6"
                style={{ color: '#117cb2' }}
              >
                ¿TE INTERESA TRABAJAR CON NOSOTROS?
              </h2>
              
              <p className="font-gliker text-xl md:text-2xl text-gris-700 italic mb-8">
                Llevemos tu proyecto al siguiente nivel
              </p>

              <p className="font-inter text-base md:text-lg text-gris-700 leading-relaxed mb-12 max-w-2xl mx-auto">
                Si quieres colaborar en un proyecto, contratar nuestros servicios o ser parte de Espacio Impro, estamos aquí para escucharte y crear juntos.
              </p>

              {/* Botones CTA */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Botón WhatsApp */}
                <motion.a
                  href="https://wa.me/51997971371"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-carmin text-white font-gliker text-lg rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-carmin-600 to-carmin opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <MessageCircle className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Escríbenos por WhatsApp</span>
                </motion.a>

                {/* Botón Contacto */}
                <motion.a
                  href="/contactanos"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-acero text-white font-gliker text-lg rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-acero-600 to-acero opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Mail className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Ir a Contacto</span>
                </motion.a>
              </motion.div>

              {/* Texto adicional */}
              <motion.p
                className="font-inter text-sm text-gris-600 mt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                También puedes encontrarnos en nuestras redes sociales y mantenerte al tanto de nuestras actividades
              </motion.p>
            </motion.div>
          </div>
        </section>
    </>
  );
}

interface ProyectoCardProps {
  proyecto: Proyecto;
  index: number;
}

function ProyectoCard({ proyecto, index }: ProyectoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselActive, setIsCarouselActive] = useState(false);

  // Auto-advance carousel cuando está en hover
  useEffect(() => {
    if (!isCarouselActive) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % proyecto.imagenes.length);
    }, 2000); // Cambio más rápido: 2 segundos

    return () => clearInterval(interval);
  }, [isCarouselActive, proyecto.imagenes.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCarouselActive(false); // Pausar auto-advance
    setCurrentImageIndex((prev) => (prev + 1) % proyecto.imagenes.length);
    // Reactivar después de 5 segundos
    setTimeout(() => setIsCarouselActive(true), 5000);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCarouselActive(false); // Pausar auto-advance
    setCurrentImageIndex((prev) => (prev - 1 + proyecto.imagenes.length) % proyecto.imagenes.length);
    // Reactivar después de 5 segundos
    setTimeout(() => setIsCarouselActive(true), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-lg group"
      onMouseEnter={() => {
        setIsHovered(true);
        setIsCarouselActive(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsCarouselActive(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Imagen / Carousel */}
      <div className="relative h-96 md:h-112 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={proyecto.imagenes[currentImageIndex]}
            alt={`${proyecto.titulo} - ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            loading="lazy"
          />
        </AnimatePresence>

        {/* Indicador de imágenes en la parte inferior */}
        {proyecto.imagenes.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {proyecto.imagenes.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(i);
                  setIsCarouselActive(false);
                  setTimeout(() => setIsCarouselActive(true), 3000);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === currentImageIndex 
                    ? 'bg-white w-8 h-2.5 shadow-lg' 
                    : 'bg-white/60 w-2.5 h-2.5 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Contenido de texto */}
      <div className="relative p-8">
        <h3 
          className="font-lovelo text-2xl md:text-3xl mb-2 transition-colors duration-300"
          style={{ color: proyecto.color }}
        >
          {proyecto.titulo}
        </h3>

        {/* Descripción que se despliega suavemente */}
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0,
            marginTop: isHovered ? 16 : 0
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <p className="font-inter text-base text-gris-700 leading-relaxed">
            {proyecto.descripcion}
          </p>
        </motion.div>

        {/* Indicador de "hover para ver más" */}
        <motion.p
          animate={{ 
            opacity: isHovered ? 0 : 1,
            y: isHovered ? -10 : 0
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="font-inter text-sm text-gris-500 italic mt-3"
        >
          Hover para ver más →
        </motion.p>
      </div>
    </motion.div>
  );
}
