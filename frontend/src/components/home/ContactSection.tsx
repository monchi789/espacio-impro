'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-20 md:py-32 bg-gris-50 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-lavanda-100 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-carmin-100 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título centrado */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-6" style={{ color: '#117cb2' }}>
            CONTÁCTANOS
          </h2>
          <p className="font-gliker text-2xl md:text-3xl text-lavanda mb-6">
            Improvisar empieza con un primer "sí".
          </p>
          <p className="font-inter text-lg md:text-xl text-gris-700 max-w-2xl mx-auto">
            Escríbenos, visítanos o únete a un taller.
            Queremos seguir creando contigo.
          </p>
        </motion.div>

        {/* Formulario centrado con diseño mejorado */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gris-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-inter text-base font-medium text-gris-800 mb-3">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 bg-gris-50 border-2 border-gris-200 rounded-xl focus:ring-2 focus:ring-lavanda focus:border-lavanda focus:bg-white transition-all font-inter"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block font-inter text-base font-medium text-gris-800 mb-3">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 bg-gris-50 border-2 border-gris-200 rounded-xl focus:ring-2 focus:ring-lavanda focus:border-lavanda focus:bg-white transition-all font-inter"
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <div>
                <label className="block font-inter text-base font-medium text-gris-800 mb-3">
                  Mensaje
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-5 py-4 bg-gris-50 border-2 border-gris-200 rounded-xl focus:ring-2 focus:ring-lavanda focus:border-lavanda focus:bg-white transition-all resize-none font-inter"
                  placeholder="Cuéntanos en qué te gustaría participar o colaborar"
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-carmin hover:bg-carmin-600 text-white font-inter font-semibold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Enviar mensaje
              </motion.button>
            </form>

            {/* Elementos decorativos */}
            <div className="mt-8 pt-8 border-t border-gris-100 flex items-center justify-center gap-8 text-sm text-gris-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-lavanda rounded-full" />
                <span className="font-inter">Cusco, Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-carmin rounded-full" />
                <span className="font-inter">Respuesta en 24h</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
