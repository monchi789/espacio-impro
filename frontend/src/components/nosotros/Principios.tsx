'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, Users, Search } from 'lucide-react';

const frasesPrincipios = [
  'Permitirse, pertenecer y profundizar',
  'Descubrir para dejarse sorprender',
  'Habitar el presente con presencia',
  'Creación compartida y colectiva',
  'Transformarnos improvisando'
];

export default function Principios() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentFrase, setCurrentFrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrase((prev) => (prev + 1) % frasesPrincipios.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const principios = [
    {
      id: 1,
      icon: Sparkles,
      titleColor: '#fed056', // Dorado
      title: 'PERMITIRSE',
      subtitle: 'Todo es cuestión de permisos',
      resumen: 'Me permito ser, estar, hacer, desafiar mis límites internos.',
      content: `Asumo la libertad y doy consentimiento interno a mi propia existencia, más allá de las imposiciones externas o los "deber ser". Aceptar la libertad propia implica también aceptar el proyecto vital como construcción continua, no es un estado pasivo, sino una afirmación activa del derecho a existir en singularidad.

Permitirse estar significa habitar el mundo con presencia, escuchando al cuerpo que sabe antes que lo que la mente juzga. Dejar que el deseo, el temblor, la quietud y el impulso tengan voz.

Permitirse también es desobedecer lo heredado cuando lo heredado oprime. El permiso es un acto político: autorizarse a ser lo que no fue previsto, romper la idea del "no se puede", reapropiarse del cuerpo como lugar de invención y libertad.

Cuando me permito, me afirmo en el devenir, más allá del miedo, del deber y del molde. Me abro al riesgo de habitarme.`,
    },
    {
      id: 2,
      icon: Users,
      titleColor: '#ff657a', // Carmin
      title: 'PERTENECER',
      subtitle: 'Todxs estamos en la misma barca',
      resumen: 'Pertenezco a un grupo, tengo responsabilidad social y conciencia de clase.',
      content: `Somos cuerpos vulnerables, interdependientes. Pertenecer implica aceptar que nadie se basta a sí mismo, y que la performance de cualquier identidad (y escena) se construye siempre en lo colectivo. El cuerpo en la impro no actúa solo: escucha, reacciona, acompaña, se afecta.

La conciencia de clase es una forma radical de pertenencia crítica. En escena, no hay neutralidad: el cuerpo lleva historia, desigualdad y memoria. Improvisar no borra eso, lo convoca y lo transforma. Pertenecer es saberse parte de una coreografía más grande, en la que cada gesto tiene un eco en lxs otrxs.

Lo político no es el Estado, sino el espacio de aparición entre seres humanos. Pertenecer es tener un lugar en ese espacio, donde se actúa y se habla como alguien que cuenta, que importa, que deja huella.

Al pertenecer me reconozco en la red de interdependencias. Acepto que mi libertad se construye con la de lxs otrxs y que toda escena es una forma de mundo compartido. Reconozco que somos lenguaje mutuo y escena compartida.`,
    },
    {
      id: 3,
      icon: Search,
      titleColor: '#117cb2', // Azul acero
      title: 'PROFUNDIZAR',
      subtitle: 'Detrás de todas las paredes está el cielo',
      resumen: 'Me cuestiono, me formo, busco sentido en el hacer.',
      content: `El ser humano no está simplemente "ahí", sino que es en la medida en que se pregunta por el ser. Profundizar es habitar el misterio, no conformarse con la superficie del hacer. En la impro, lo efímero no es lo superficial: es la materia viva del sentido.

El sentido no se da, se construye en capas. Improvisar es leer y reescribir continuamente los signos de la realidad y del cuerpo. El cuerpo piensa, recuerda, imagina: no es un instrumento de la mente, sino un lugar de pensamiento en movimiento.

Profundizar es resistir la banalidad y la reproducción. Es formarse para transformar, no solo para repetir. Es preguntarse por qué hacemos lo que hacemos y desde dónde lo hacemos.

Cuando profundizo, dejo que el cuerpo filosofe.`,
    },
  ];

  return (
    <section className="py-20 bg-gris-50 relative overflow-hidden">
      {/* Sin fondo decorativo para estilo más limpio */}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 
            className="font-lovelo text-3xl md:text-4xl lg:text-5xl mb-4"
            style={{ color: '#fed056' }}
          >
            NUESTROS PRINCIPIOS
          </h2>
          <p className="font-gliker text-xl md:text-2xl text-gris-700 italic mb-6">
            Los pilares de nuestra práctica teatral
          </p>
          {/* Frase rotativa */}
          <div className="h-16 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFrase}
                className="font-gliker text-xl md:text-2xl italic"
                style={{ color: '#fed056' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {frasesPrincipios[currentFrase]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="max-w-3xl mx-auto font-inter text-base md:text-lg text-gris-700 leading-relaxed space-y-4">
            <p className="italic">
              Improvisar no es llenar un vacío con ocurrencias, sino habitar el presente con todo lo que somos: nuestras dudas, nuestras historias, <strong>nuestras ganas de sentido, para descubrir infinitud de universos en el escenario.</strong>  En esta escuela, permitirse, pertenecer y profundizar no son solo actos escénicos: son decisiones.
            </p>
            <p className="font-gliker text-lg">
              Decimos sí al riesgo de vivir en presencia.<br />
              Decimos sí a la creación compartida.<br />
              Decimos sí al vértigo de descubrir lo inesperado.
            </p>
          </div>
        </motion.div>

        {/* Grid de Bentos - 2 columnas, último abajo ocupando todo el ancho */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {principios.map((principio, index) => (
            <motion.div
              key={principio.id}
              className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                index === principios.length - 1 ? 'md:col-span-2' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              onClick={() => setExpandedId(expandedId === principio.id ? null : principio.id)}
            >
              {/* Ícono circular con animación flotante y gradiente suave */}
              <motion.div 
                className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center mb-6 mx-auto"
                style={{ 
                  background: `linear-gradient(135deg, ${principio.titleColor}20, ${principio.titleColor}40)` 
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
                <principio.icon className="w-10 h-10" style={{ color: principio.titleColor }} />
              </motion.div>

              {/* Título */}
              <h3 
                className="font-lovelo text-2xl text-center mb-2"
                style={{ color: principio.titleColor }}
              >
                {principio.title}
              </h3>

              {/* Subtítulo */}
              <p className="font-gliker text-lg text-center text-gris-700 italic mb-4">
                "{principio.subtitle}"
              </p>

              {/* Resumen */}
              <p className={`font-inter text-sm text-gris-600 mb-4 ${
                index === principios.length - 1 ? 'text-center max-w-4xl mx-auto' : 'text-center'
              }`}>
                {principio.resumen}
              </p>

              {/* Botón expandir */}
              <motion.button
                className="w-full flex items-center justify-center gap-2 text-sm font-gliker text-gris-600 hover:text-gris-900 transition-colors"
                animate={{ rotate: expandedId === principio.id ? 180 : 0 }}
              >
                <span>{expandedId === principio.id ? 'Ver menos' : 'Leer más'}</span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              {/* Contenido expandible */}
              <AnimatePresence>
                {expandedId === principio.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 mt-6 border-t border-gris-200">
                      <p className="font-inter text-sm leading-relaxed text-gris-700 whitespace-pre-line">
                        {principio.content}
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
