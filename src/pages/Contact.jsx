import { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { MapPin, Phone, Mail, Send, CheckCircle, MessageCircle, Clock } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", project_interest: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.ContactMessage.create(form);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "", project_interest: "" });
    } catch (err) {
      setError("Ocurrió un error al enviar el mensaje. Intente nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent("Hola, me gustaría obtener información sobre sus proyectos.")}`;

  return (
    <div className="pt-20">
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div initial={{ width: 0 }} animate={{ width: 64 }} transition={{ duration: 0.6 }} className="h-px bg-primary mb-8" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4">
            Contacto
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight max-w-4xl">
            Conversemos sobre su próximo proyecto.
          </motion.h1>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* FORM */}
            <div className="lg:col-span-7">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-border p-12 text-center"
                >
                  <CheckCircle size={48} className="text-primary mx-auto mb-6" />
                  <h2 className="text-2xl font-heading font-bold mb-3">Mensaje enviado</h2>
                  <p className="text-muted-foreground mb-8">
                    Gracias por contactarnos. Le responderemos a la brevedad.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Nombre completo" required>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                        placeholder="Su nombre"
                      />
                    </FormField>
                    <FormField label="Teléfono">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                        placeholder="+56 9 1234 5678"
                      />
                    </FormField>
                  </div>
                  <FormField label="Correo electrónico" required>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="su@email.com"
                    />
                  </FormField>
                  <FormField label="Proyecto de interés">
                    <input
                      type="text"
                      value={form.project_interest}
                      onChange={(e) => setForm({ ...form, project_interest: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ej: Centro Comunitario, Edificio residencial..."
                    />
                  </FormField>
                  <FormField label="Mensaje" required>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Cuéntenos sobre su proyecto..."
                    />
                  </FormField>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50"
                  >
                    {submitting ? "Enviando..." : "Enviar mensaje"}
                    {!submitting && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              )}
            </div>

            {/* INFO */}
            <div className="lg:col-span-5">
              <div className="space-y-8">
                <div>
                  <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Información de contacto</h3>
                  <div className="space-y-4">
                    <ContactRow icon={MapPin} label="Dirección" value="Av. Principal 1234, Ciudad" />
                    <ContactRow icon={Phone} label="Teléfono" value="+56 9 1234 5678" href="tel:+56912345678" />
                    <ContactRow icon={Mail} label="Correo" value="contacto@constructora.cl" href="mailto:contacto@constructora.cl" />
                    <ContactRow icon={Clock} label="Horario" value="Lun – Vie · 9:00 a 18:00 hrs" />
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-6 border border-border hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all"
                >
                  <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center">
                    <MessageCircle size={22} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">WhatsApp directo</h4>
                    <p className="text-sm text-muted-foreground">Converse con un asesor ahora</p>
                  </div>
                </a>

                <div className="aspect-[4/3] border border-border overflow-hidden">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-70.65,-33.45,-70.55,-33.40&layer=mapnik"
                    className="w-full h-full"
                    title="Mapa de ubicación"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <div>
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{label}</p>
        {href ? (
          <a href={href} className="text-foreground hover:text-primary transition-colors">{value}</a>
        ) : (
          <p className="text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}