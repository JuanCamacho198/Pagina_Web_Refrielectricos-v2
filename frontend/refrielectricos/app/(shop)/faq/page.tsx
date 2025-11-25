import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const metadata = {
  title: 'Preguntas Frecuentes | Refrielectricos',
  description: 'Respuestas a las preguntas más comunes sobre nuestros productos y servicios.',
};

export default function FAQPage() {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mb-4">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Resolvemos tus dudas más comunes.
          </p>
        </div>

        <div className="space-y-6">
          <FAQItem 
            question="¿Cuáles son los tiempos de entrega?"
            answer="Para Bogotá, el tiempo de entrega es de 1 a 2 días hábiles. Para otras ciudades principales, de 2 a 4 días hábiles. En zonas rurales puede tomar hasta 8 días hábiles."
          />
          <FAQItem 
            question="¿Qué métodos de pago aceptan?"
            answer="Aceptamos tarjetas de crédito y débito (Visa, Mastercard), PSE, Nequi, Daviplata y transferencias bancarias. También ofrecemos pago contra entrega en Bogotá."
          />
          <FAQItem 
            question="¿Tienen garantía los productos?"
            answer="Sí, todos nuestros productos cuentan con garantía de fábrica. El tiempo de garantía varía según el producto y la marca, generalmente entre 3 meses y 1 año. Consulta la descripción de cada producto para más detalles."
          />
          <FAQItem 
            question="¿Puedo devolver un producto?"
            answer="Sí, aceptamos devoluciones dentro de los 5 días hábiles siguientes a la recepción del producto, siempre que esté en su empaque original y sin uso. Los costos de envío por devolución corren por cuenta del cliente, salvo defectos de fábrica."
          />
          <FAQItem 
            question="¿Venden al por mayor?"
            answer="Sí, ofrecemos precios especiales para distribuidores y técnicos. Por favor contáctanos directamente a través de nuestro formulario o WhatsApp para recibir una cotización personalizada."
          />
          <FAQItem 
            question="¿Realizan instalaciones?"
            answer="Actualmente nos enfocamos en la venta de repuestos. Sin embargo, podemos recomendarte técnicos certificados de nuestra red de confianza en tu ciudad."
          />
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <details className="group">
        <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <span>{question}</span>
          <span className="transition group-open:rotate-180">
            <ChevronDown size={20} />
          </span>
        </summary>
        <div className="text-gray-600 dark:text-gray-300 px-6 pb-6 pt-0 animate-fadeIn">
          {answer}
        </div>
      </details>
    </div>
  );
}
