import { CheckCircle, Users, Award, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Sobre Nosotros | Refrielectricos',
  description: 'Conoce más sobre Refrielectricos G&E S.A.S, tu aliado experto en repuestos de refrigeración y electricidad.',
};

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative py-20 bg-blue-600 dark:bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-grid-lg text-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Somos líderes en la distribución de repuestos para refrigeración, aire acondicionado y electricidad en Colombia.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <TrendingUp className="text-blue-600" /> Nuestra Misión
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Proveer soluciones integrales y de alta calidad en repuestos de refrigeración y electricidad, garantizando la satisfacción de nuestros clientes a través de un servicio experto, ágil y confiable.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl border border-green-100 dark:border-green-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <Award className="text-green-600" /> Nuestra Visión
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Ser reconocidos en 2030 como la empresa referente en el sector de refrigeración y electricidad en Colombia, destacándonos por nuestra innovación, cobertura nacional y compromiso con la sostenibilidad.
              </p>
            </div>
          </div>
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
            {/* Placeholder image - replace with real team/office photo */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
              <Users size={64} />
              <span className="ml-4 text-lg">Imagen del Equipo / Instalaciones</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nuestros Valores
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Calidad', desc: 'Productos certificados y garantizados.' },
              { title: 'Integridad', desc: 'Transparencia en cada negociación.' },
              { title: 'Servicio', desc: 'El cliente es nuestra prioridad.' },
              { title: 'Innovación', desc: 'Mejora continua en procesos.' },
            ].map((value, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
