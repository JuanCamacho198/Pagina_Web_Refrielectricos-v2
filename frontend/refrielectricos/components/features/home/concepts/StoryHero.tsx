'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { ArrowDown } from 'lucide-react';

export default function StoryHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[120vh] -mt-8 -mx-4 md:-mx-8 mb-12">
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* Background Image with Parallax */}
        <motion.div 
          style={{ y: yBg }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src="/images/carrusel1.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <motion.div style={{ y: textY, opacity }} className="max-w-4xl mx-auto space-y-8">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block py-1 px-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-sm font-medium tracking-wider uppercase"
            >
              Innovación en Refrigeración
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black tracking-tighter"
            >
              EL FUTURO <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-white">
                ES FRÍO
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
            >
              Descubre la nueva generación de repuestos y equipos para profesionales exigentes.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Button className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-full">
                Ver Catálogo
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full">
                Contactar Ventas
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            style={{ opacity }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 text-sm font-medium tracking-widest uppercase opacity-70">
              <span>Descubre Más</span>
              <ArrowDown className="w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
