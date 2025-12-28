'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Mail } from 'lucide-react';
import { shows, type Show } from '../../data/shows';

// Paleta de colores para las categorías
const categoryColors: Record<string, string> = {
  "OBRAS Y FORMATOS LARGOS IMPROVISADOS": "#19b2c0", // turquesa
  "ESPECTÁCULOS DE IMPRO CON TOQUE DE ESPACIO": "#622f88", // morado
  "FORMATOS AMIGOS (PRESTADOS A ESPACIO)": "#fdd70e", // amarillo
  "ESPECTÁCULOS PRODUCIDOS POR ESPACIO IMPRO": "#e03d8e", // rosado
  "TALLERES PRODUCIDOS POR ESPACIO IMPRO": "#19b2c0", // turquesa
};

// Nombres más cortos para los botones de filtro
const categoryShortNames: Record<string, string> = {
  "OBRAS Y FORMATOS LARGOS IMPROVISADOS": "Obras Largas",
  "ESPECTÁCULOS DE IMPRO CON TOQUE DE ESPACIO": "Espectáculos",
  "FORMATOS AMIGOS (PRESTADOS A ESPACIO)": "Formatos Amigos",
  "ESPECTÁCULOS PRODUCIDOS POR ESPACIO IMPRO": "Producciones",
  "TALLERES PRODUCIDOS POR ESPACIO IMPRO": "Talleres"
};

export default function PortafolioBento() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Agrupar shows por categoría
  const showsByCategory = shows.reduce((acc, show) => {
    if (!acc[show.category]) {
      acc[show.category] = [];
    }
    acc[show.category].push(show);
    return acc;
  }, {} as Record<string, Show[]>);

  // Ordenar categorías
  const categoryOrder = [
    "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    "ESPECTÁCULOS DE IMPRO CON TOQUE DE ESPACIO",
    "FORMATOS AMIGOS (PRESTADOS A ESPACIO)",
    "ESPECTÁCULOS PRODUCIDOS POR ESPACIO IMPRO",
    "TALLERES PRODUCIDOS POR ESPACIO IMPRO"
  ];

  // Determinar qué categorías mostrar
  const categoriesToShow = selectedCategory 
    ? [selectedCategory]
    : categoryOrder;

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
              style={{ color: '#19b2c0' }}
            >
              NUESTRO PORTAFOLIO
            </h1>
            <p className="font-gliker text-xl md:text-2xl text-gris-700 italic">
              Nuestros proyectos y experiencias
            </p>
          </motion.div>

          {/* Filtro de categorías */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 flex flex-wrap gap-3 justify-center"
          >
            {/* Botón "Ver Todo" */}
            <motion.button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full font-gliker text-sm md:text-base transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-turquesa text-white shadow-lg scale-105'
                  : 'bg-white text-gris-700 border-2 border-turquesa hover:bg-turquesa hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Todo
            </motion.button>

            {/* Botones de categorías */}
            {categoryOrder.map((category, idx) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`px-6 py-3 rounded-full font-gliker text-sm md:text-base transition-all duration-300 ${
                  selectedCategory === category
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white text-gris-700 border-2 hover:shadow-md'
                }`}
                style={
                  selectedCategory === category
                    ? {
                        backgroundColor: categoryColors[category],
                        borderColor: categoryColors[category],
                      }
                    : {
                        borderColor: categoryColors[category],
                        color: categoryColors[category],
                      }
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {categoryShortNames[category]}
              </motion.button>
            ))}
          </motion.div>

          {/* Categorías */}
          <AnimatePresence mode="wait">
            {categoriesToShow.map((category, categoryIndex) => {
              if (!showsByCategory[category]) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  className="mb-20"
                >
                  {/* Título de la categoría */}
                  {!selectedCategory && (
                    <motion.h2
                      className="font-lovelo text-2xl md:text-3xl mb-8 pb-4"
                      style={{ 
                        color: categoryColors[category] || '#19b2c0',
                        borderBottom: `3px solid ${categoryColors[category] || '#19b2c0'}`
                      }}
                    >
                      {category}
                    </motion.h2>
                  )}

                  {selectedCategory && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="font-lovelo text-2xl md:text-3xl mb-8 pb-4"
                      style={{ 
                        color: categoryColors[category] || '#19b2c0',
                        borderBottom: `3px solid ${categoryColors[category] || '#19b2c0'}`
                      }}
                    >
                      {category}
                    </motion.h2>
                  )}

                  {/* Grid de shows */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {showsByCategory[category].map((show, showIndex) => (
                      <ShowCard 
                        key={show.title}
                        show={show} 
                        color={categoryColors[category] || '#19b2c0'}
                        index={showIndex}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section - Full Width */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-morado rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-rosado rounded-full blur-3xl" />
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
                style={{ color: '#19b2c0' }}
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
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-rosado text-white font-gliker text-lg rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-rosado-600 to-rosado opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <MessageCircle className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Escríbenos por WhatsApp</span>
                </motion.a>

                {/* Botón Contacto */}
                <motion.a
                  href="/contactanos"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-turquesa text-white font-gliker text-lg rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-turquesa-600 to-turquesa opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

interface ShowCardProps {
  show: Show;
  color: string;
  index: number;
}

function ShowCard({ show, color, index }: ShowCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  // Auto-advance carousel siempre está activo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % show.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [show.images.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % show.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + show.images.length) % show.images.length);
  };

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  // Información adicional que se muestra
  const getAdditionalInfo = () => {
    const info = [];
    if (show.director) info.push(`Dir: ${show.director}`);
    if (show.author) info.push(`Autor: ${show.author}`);
    if (show.cast) info.push(`Elenco: ${show.cast}`);
    if (show.original_format) info.push(`Formato original: ${show.original_format}`);
    if (show.original_idea) info.push(`Idea original: ${show.original_idea}`);
    if (show.note) info.push(`${show.note}`);
    return info;
  };

  const additionalInfo = getAdditionalInfo();
  const isCurrentImageLoaded = imageLoaded[currentImageIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-lg group"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Imagen / Carousel con blur placeholder */}
      <div className="relative h-96 md:h-112 overflow-hidden bg-gris-200">
        {show.images.length > 0 ? (
          <>
            {/* Blur Placeholder */}
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-gray-300 to-gray-200"
              animate={{ opacity: isCurrentImageLoaded ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ zIndex: 1 }}
            />

            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={show.images[currentImageIndex]}
                alt={`${show.title} - ${currentImageIndex + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isCurrentImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ zIndex: isCurrentImageLoaded ? 10 : 0 }}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: isCurrentImageLoaded ? 1 : 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                loading="lazy"
                onLoad={() => handleImageLoad(currentImageIndex)}
              />
            </AnimatePresence>

            {/* Botones de navegación */}
            {show.images.length > 1 && isHovered && (
              <>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-2 rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-gris-800" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-2 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-gris-800" />
                </motion.button>
              </>
            )}

            {/* Indicador de imágenes */}
            {show.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {show.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(i);
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
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-5" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gris-300">
            <span className="text-gris-600">Sin imágenes disponibles</span>
          </div>
        )}
      </div>

      {/* Contenido de texto */}
      <div className="relative p-8">
        <h3 
          className="font-lovelo text-2xl md:text-3xl mb-4 transition-colors duration-300"
          style={{ color }}
        >
          {show.title}
        </h3>

        {/* Información adicional siempre visible con mejor formato */}
        {additionalInfo.length > 0 && (
          <div className="space-y-2 mb-4 pb-4 border-b border-gris-200">
            {additionalInfo.map((info, i) => {
              // Extraer tipo de información y valor
              const [type, ...valueParts] = info.split(': ');
              const value = valueParts.join(': ');
              
              return (
                <div key={i} className="flex flex-col md:flex-row md:items-start gap-1 md:gap-2">
                  <span className="font-gliker text-sm font-semibold" style={{ color, minWidth: 'fit-content' }}>
                    {type}:
                  </span>
                  <p className="font-inter text-sm text-gris-700 leading-relaxed">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Descripción que se despliega suavemente */}
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0,
            marginTop: isHovered ? 8 : 0
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <p className="font-inter text-base text-gris-700 leading-relaxed">
            {show.description}
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
          {additionalInfo.length > 0 ? 'Hover para ver descripción completa →' : 'Hover para ver más →'}
        </motion.p>
      </div>
    </motion.div>
  );
}

