'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

const MARQUEE_TEXT = "REPUESTOS ORIGINALES • ENVÍO A TODO EL PAÍS • GARANTÍA CERTIFICADA • SOPORTE TÉCNICO ESPECIALIZADO • ";

export default function GradientHero() {
  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-black text-white -mt-8 -mx-4 md:-mx-8 mb-12 rounded-b-[3rem]">
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_60deg,transparent_120deg,#ef4444_180deg,transparent_240deg,#3b82f6_300deg,transparent_360deg)] blur-[100px] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0),rgba(0,0,0,1))]" />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">Tienda Online Activa 24/7</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]"
          >
            TODO PARA <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
              TU REFRIGERACIÓN
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-xl"
          >
            La plataforma más completa de repuestos y equipos. 
            Encuentra lo que necesitas en segundos con nuestro buscador inteligente.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg rounded-xl font-bold">
              Explorar Catálogo
            </Button>
            <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white px-8 py-6 text-lg rounded-xl">
              Ofertas del Mes
            </Button>
          </motion.div>
        </div>

        {/* Right Side Cards */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative z-10 grid gap-4">
            {[
              { icon: Zap, title: "Entrega Express", desc: "Envíos en 24 horas", color: "bg-yellow-500" },
              { icon: Shield, title: "Garantía Total", desc: "Protección de compra", color: "bg-blue-500" },
              { icon: Truck, title: "Envíos Gratis", desc: "En compras mayores a $500", color: "bg-green-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
                <ArrowRight className="ml-auto w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-600 py-4 overflow-hidden rotate-1 scale-105 translate-y-1/2 opacity-90">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="whitespace-nowrap flex gap-4"
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-2xl font-black uppercase tracking-widest text-white/90">
              {MARQUEE_TEXT}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
