import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, description, align = "left", light = false }) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignment} gap-4 mb-16`}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span className="w-8 h-px bg-primary" />
          <span className={`font-mono text-xs tracking-[0.2em] uppercase ${light ? "text-white/60" : "text-primary"}`}>
            {eyebrow}
          </span>
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-balance max-w-3xl ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-lg leading-relaxed max-w-2xl ${light ? "text-white/70" : "text-muted-foreground"}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}