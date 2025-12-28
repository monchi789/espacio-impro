'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const apiUrl = (import.meta.env.PUBLIC_API_URL as string | undefined) || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/contacto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.name,
          email: formData.email,
          mensaje: formData.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al enviar el mensaje');
      }

      const result = await response.json();
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Ocurrió un error al enviar el mensaje'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gris-50 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-morado-100 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-rosado-100 rounded-full blur-3xl" />
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
          <h2 className="font-lovelo text-4xl md:text-5xl lg:text-6xl mb-6" style={{ color: '#19b2c0' }}>
            CONTÁCTANOS
          </h2>
          <p className="font-gliker text-2xl md:text-3xl text-morado mb-6">
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
                  className="w-full px-5 py-4 bg-gris-50 border-2 border-gris-200 rounded-xl focus:ring-2 focus:ring-morado focus:border-morado focus:bg-white transition-all font-inter"
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
                  className="w-full px-5 py-4 bg-gris-50 border-2 border-gris-200 rounded-xl focus:ring-2 focus:ring-morado focus:border-morado focus:bg-white transition-all font-inter"
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
                  className="w-full px-5 py-4 bg-gris-50 border-2 border-gris-200 rounded-xl focus:ring-2 focus:ring-morado focus:border-morado focus:bg-white transition-all resize-none font-inter"
                  placeholder="Cuéntanos en qué te gustaría participar o colaborar"
                  required
                />
              </div>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <p className="font-inter text-green-800 text-center">
                    ¡Gracias por tu mensaje! Nos pondremos en contacto pronto.
                  </p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="font-inter text-red-800 text-center">
                    {errorMessage}
                  </p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-rosado hover:bg-rosado-600 disabled:bg-gris-400 text-white font-inter font-semibold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </motion.button>
            </form>

            {/* Elementos decorativos */}
            <div className="mt-8 pt-8 border-t border-gris-100 flex items-center justify-center gap-8 text-sm text-gris-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-morado rounded-full" />
                <span className="font-inter">Cusco, Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rosado rounded-full" />
                <span className="font-inter">Respuesta en 24h</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
