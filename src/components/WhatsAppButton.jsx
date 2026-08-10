import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

export default function WhatsAppButton() {
  const [expanded, setExpanded] = useState(false);
  const phone = "56912345678";
  const message = encodeURIComponent("Hola, me gustaría obtener más información sobre sus proyectos.");
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
          aria-label="WhatsApp"
        >
          {!expanded && (
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          )}
          {expanded ? <X size={24} className="text-white" /> : <MessageCircle size={26} className="text-white" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-40 w-80 bg-card border border-border shadow-2xl"
          >
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm">Conversar con un asesor</h4>
                  <p className="text-xs text-muted-foreground">Responde en minutos</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-muted-foreground mb-4">
                ¿Tienes un proyecto en mente? Escríbenos y te ayudaremos a hacerlo realidad.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] text-white text-sm font-medium hover:bg-[#1da851] transition-colors"
              >
                <Send size={16} />
                Iniciar conversación
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}