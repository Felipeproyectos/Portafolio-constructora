import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function StatCounter({ value, label, suffix = "", icon: Icon }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, numericValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-2"
    >
      {Icon && <Icon size={20} className="text-primary" />}
      <div className="flex items-baseline gap-1">
        <span className="text-5xl md:text-6xl font-heading font-bold tracking-tight">
          {displayValue}
        </span>
        {suffix && (
          <span className="text-3xl md:text-4xl font-heading font-bold text-primary">
            {suffix}
          </span>
        )}
      </div>
      <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
        {label}
      </span>
    </motion.div>
  );
}