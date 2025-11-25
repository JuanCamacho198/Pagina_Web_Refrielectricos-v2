import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad | Refrielectricos',
  description: 'Política de privacidad y tratamiento de datos personales de Refrielectricos G&E S.A.S.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Política de Privacidad
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Su privacidad es importante para nosotros.
          </p>
        </div>

        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock size={24} className="text-green-600" /> 1. Recopilación de Información
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Recopilamos información que usted nos proporciona directamente cuando se registra, realiza una compra, se suscribe a nuestro boletín o se comunica con nosotros. Esta información puede incluir su nombre, dirección de correo electrónico, dirección postal, número de teléfono e información de pago.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye size={24} className="text-green-600" /> 2. Uso de la Información
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Utilizamos la información que recopilamos para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Procesar sus pedidos y gestionar su cuenta.</li>
              <li>Enviarle confirmaciones de pedidos, facturas y actualizaciones de envío.</li>
              <li>Responder a sus comentarios, preguntas y solicitudes de servicio al cliente.</li>
              <li>Enviarle comunicaciones de marketing (si ha optado por recibirlas).</li>
              <li>Mejorar y optimizar nuestro sitio web y servicios.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Compartir Información</h2>
            <p className="text-gray-600 dark:text-gray-300">
              No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información con proveedores de servicios que nos ayudan a operar nuestro negocio (por ejemplo, procesadores de pagos, empresas de envío), siempre bajo estrictos acuerdos de confidencialidad.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Seguridad de Datos</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Sin embargo, ninguna transmisión por Internet es 100% segura.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envíe una cookie.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Sus Derechos</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Usted tiene derecho a acceder, corregir o eliminar su información personal. También puede oponerse al procesamiento de sus datos o solicitar la portabilidad de los mismos. Para ejercer estos derechos, contáctenos a través de los canales oficiales.
            </p>
          </section>

          <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contacto de Privacidad</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Si tiene preguntas sobre nuestra política de privacidad, por favor escriba a privacidad@refrielectricos.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
