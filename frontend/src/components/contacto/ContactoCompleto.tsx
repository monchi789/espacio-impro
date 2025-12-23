'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactoCompleto() {
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
    <section className="min-h-screen py-32 md:py-40 bg-gris-50 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-lavanda-100 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-carmin-100 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título centrado */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-6" style={{ color: '#117cb2' }}>
            CONTÁCTANOS
          </h1>
          <p className="font-gliker text-2xl md:text-3xl text-lavanda mb-6">
            Improvisar empieza con un primer "sí".
          </p>
          <p className="font-inter text-lg md:text-xl text-gris-700 max-w-2xl mx-auto">
            Escríbenos, visítanos o únete a un taller. Queremos seguir creando contigo.
          </p>
        </motion.div>

        {/* Grid: 4 tarjetas horizontales arriba */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Tarjeta de Email */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gris-100">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 bg-acero/10 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-7 h-7 text-acero" />
              </div>
              <div>
                <h3 className="font-gliker text-lg mb-2" style={{ color: '#117cb2' }}>
                  Correo Electrónico
                </h3>
                <a 
                  href="mailto:ee.improcusco@gmail.com" 
                  className="font-inter text-sm text-gris-700 hover:text-acero transition-colors break-all"
                >
                  ee.improcusco@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Tarjeta de Teléfono */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gris-100">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 bg-carmin/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-7 h-7 text-carmin" />
              </div>
              <div>
                <h3 className="font-gliker text-lg mb-2" style={{ color: '#ff657a' }}>
                  Teléfono / WhatsApp
                </h3>
                <a 
                  href="https://wa.me/51997971371"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-sm text-gris-700 hover:text-carmin transition-colors"
                >
                  +51 997 971 371
                </a>
              </div>
            </div>
          </div>

          {/* Tarjeta de Ubicación */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gris-100">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 bg-lavanda/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-7 h-7 text-lavanda" />
              </div>
              <div>
                <h3 className="font-gliker text-lg mb-2" style={{ color: '#6c648b' }}>
                  Ubicación
                </h3>
                <p className="font-inter text-sm text-gris-700">
                  Cusco, Perú
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Horario */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gris-100">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 bg-dorado/10 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-7 h-7 text-dorado" />
              </div>
              <div>
                <h3 className="font-gliker text-lg mb-2" style={{ color: '#fed056' }}>
                  Horario de Respuesta
                </h3>
                <p className="font-inter text-sm text-gris-700">
                  Respondemos en menos de 24 horas
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid: Imagen + Formulario */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Columna de imagen/texto */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gris-100 h-full flex flex-col justify-center">
              <h2 className="font-lovelo text-2xl md:text-3xl mb-6" style={{ color: '#6c648b' }}>
                ¿POR QUÉ CONTACTARNOS?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-carmin rounded-full mt-2 shrink-0" />
                  <p className="font-inter text-base text-gris-700 leading-relaxed">
                    <strong className="text-gris-900">Talleres y formación:</strong> Aprende improvisación teatral desde cero o perfecciona tus habilidades con nuestros workshops.
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-lavanda rounded-full mt-2 shrink-0" />
                  <p className="font-inter text-base text-gris-700 leading-relaxed">
                    <strong className="text-gris-900">Presentaciones:</strong> Contrata nuestros shows para eventos corporativos, festivales o celebraciones especiales.
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-dorado rounded-full mt-2 shrink-0" />
                  <p className="font-inter text-base text-gris-700 leading-relaxed">
                    <strong className="text-gris-900">Colaboraciones:</strong> Trabaja con nosotros en proyectos teatrales, investigaciones o iniciativas culturales.
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-acero rounded-full mt-2 shrink-0" />
                  <p className="font-inter text-base text-gris-700 leading-relaxed">
                    <strong className="text-gris-900">Únete a la comunidad:</strong> Forma parte de un espacio creativo donde explorar, aprender y crecer juntos.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gris-200">
                <p className="font-inter text-sm text-gris-600 italic">
                  "Cada mensaje es una oportunidad para crear algo nuevo. Estamos emocionados de conocer tu idea."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Columna del formulario */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gris-100">
              <h2 className="font-lovelo text-2xl md:text-3xl mb-8" style={{ color: '#117cb2' }}>
                ENVÍANOS UN MENSAJE
              </h2>

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
                    rows={8}
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
