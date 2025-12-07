import Link from 'next/link';
import { ArrowRight, Box, Layers, Zap } from 'lucide-react';

export default function ConceptsIndexPage() {
  const concepts = [
    {
      title: "3D Product Stage",
      description: "Presentación de producto inmersiva con efectos de paralaje y profundidad 3D.",
      href: "/concepts/3d-stage",
      icon: Box,
      color: "bg-blue-500"
    },
    {
      title: "Scroll Storytelling",
      description: "Narrativa visual que se revela a medida que el usuario hace scroll.",
      href: "/concepts/scroll-story",
      icon: Layers,
      color: "bg-purple-500"
    },
    {
      title: "Gradient Marquee",
      description: "Diseño moderno con gradientes animados y textos en movimiento continuo.",
      href: "/concepts/gradient-marquee",
      icon: Zap,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Conceptos de Diseño</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Exploración de alternativas creativas para la sección Hero de la página principal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {concepts.map((concept) => (
            <Link 
              key={concept.href} 
              href={concept.href}
              className="group relative bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${concept.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150`} />
              
              <div className={`w-14 h-14 ${concept.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                <concept.icon className="w-7 h-7" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                {concept.title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {concept.description}
              </p>
              
              <div className="flex items-center text-sm font-bold text-blue-500 uppercase tracking-wider">
                Ver Demo <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
