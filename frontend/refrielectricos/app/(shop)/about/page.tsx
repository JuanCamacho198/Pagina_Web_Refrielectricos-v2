'use client';

import { CheckCircle, Users, Award, TrendingUp, Target, Zap, Shield, Heart, Calendar, MapPin, Package, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { label: 'Años de Experiencia', value: '15+', icon: Calendar },
    { label: 'Productos en Catálogo', value: '5,000+', icon: Package },
    { label: 'Clientes Satisfechos', value: '10,000+', icon: ThumbsUp },
    { label: 'Ciudades Cubiertas', value: '50+', icon: MapPin },
  ];

  const values = [
    { 
      title: 'Calidad', 
      desc: 'Productos certificados y garantizados que cumplen con los más altos estándares de la industria.',
      icon: Shield,
      color: 'blue' as const
    },
    { 
      title: 'Integridad', 
      desc: 'Transparencia en cada negociación y compromiso con prácticas éticas.',
      icon: Heart,
      color: 'red' as const
    },
    { 
      title: 'Servicio', 
      desc: 'El cliente es nuestra prioridad, brindando asesoría experta y soporte continuo.',
      icon: Users,
      color: 'green' as const
    },
    { 
      title: 'Innovación', 
      desc: 'Mejora continua en procesos y adopción de nuevas tecnologías.',
      icon: Zap,
      color: 'yellow' as const
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-100 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/50',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-100 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/50',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-100 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section with Gradient */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 dark:from-blue-900 dark:via-blue-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
            <span className="text-blue-100 text-sm font-medium">Desde 2010 al servicio de Colombia</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Tu Aliado Experto en <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
              Refrigeración y Electricidad
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Somos líderes en la distribución de repuestos para refrigeración, aire acondicionado y electricidad en Colombia.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx}
                  className={`text-center transition-all duration-700 delay-${idx * 100} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 text-blue-600 dark:text-blue-400">
                    <Icon size={32} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white shrink-0">
                  <Target size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Nuestra Misión
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                Proveer soluciones integrales y de alta calidad en repuestos de refrigeración y electricidad, garantizando la satisfacción de nuestros clientes a través de un servicio experto, ágil y confiable.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 p-8 rounded-3xl border border-green-100 dark:border-green-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-green-600 dark:bg-green-500 rounded-xl flex items-center justify-center text-white shrink-0">
                  <TrendingUp size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Nuestra Visión
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                Ser reconocidos en 2030 como la empresa referente en el sector de refrigeración y electricidad en Colombia, destacándonos por nuestra innovación, cobertura nacional y compromiso con la sostenibilidad.
              </p>
            </div>
          </div>

          <div className="relative lg:h-[600px] h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-3xl overflow-hidden shadow-2xl">
              {/* Placeholder for team/office image */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8">
                <Users size={80} className="mb-4" />
                <span className="text-lg font-medium text-center">Imagen del Equipo / Instalaciones</span>
                <span className="text-sm text-center mt-2 max-w-xs">
                  Reemplazar con foto real del equipo o instalaciones
                </span>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-2xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-green-400/20 dark:bg-green-600/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Lo que nos define</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Los principios que guían cada decisión y acción en Refrielectricos
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              const colors = colorClasses[value.color];
              return (
                <div 
                  key={idx}
                  className={`${colors.bg} ${colors.border} border-2 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group`}
                >
                  <div className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 ${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para trabajar con nosotros?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contáctanos hoy y descubre cómo podemos ayudarte con tus proyectos de refrigeración y electricidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Contáctanos
            </a>
            <a 
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors duration-300 border-2 border-white/20"
            >
              Ver Catálogo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
