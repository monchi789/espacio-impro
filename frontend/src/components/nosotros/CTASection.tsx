'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Mail } from 'lucide-react';

export default function CTASection() {
  return (
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
            ¿TE INTERESA SER PARTE DE NOSOTROS?
          </h2>
          
          <p className="font-gliker text-xl md:text-2xl text-gris-700 italic mb-8">
            Únete a nuestra comunidad teatral
          </p>

          <p className="font-inter text-base md:text-lg text-gris-700 leading-relaxed mb-12 max-w-2xl mx-auto">
            Si quieres formar parte de Espacio Impro, ya sea como estudiante, colaborador o simplemente para conocer más sobre nuestro trabajo, estamos aquí para escucharte.
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
  );
}
