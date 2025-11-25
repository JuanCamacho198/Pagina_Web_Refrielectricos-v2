import { FileText, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Términos y Condiciones | Refrielectricos',
  description: 'Términos y condiciones de uso de la plataforma Refrielectricos G&E S.A.S.',
};

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-4">
            <FileText size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Última actualización: Noviembre 2025
          </p>
        </div>

        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Aceptación de los Términos</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Al acceder y utilizar el sitio web de Refrielectricos G&E S.A.S, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Uso del Sitio</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Se le concede una licencia limitada para acceder y hacer uso personal de este sitio. No está permitido descargar (excepto el almacenamiento en caché de páginas) o modificar cualquier parte del mismo sin nuestro consentimiento expreso por escrito.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>No debe utilizar este sitio de ninguna manera que cause, o pueda causar, daño al sitio o deterioro de la disponibilidad o accesibilidad del mismo.</li>
              <li>No debe utilizar este sitio para copiar, almacenar, alojar, transmitir, enviar, usar, publicar o distribuir material que consista en (o esté vinculado a) cualquier software espía, virus informático, troyano, gusano, registrador de pulsaciones de teclas, rootkit u otro software malicioso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Cuentas de Usuario</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Si crea una cuenta en nuestro sitio, es responsable de mantener la confidencialidad de su cuenta y contraseña y de restringir el acceso a su computadora. Acepta la responsabilidad de todas las actividades que ocurran bajo su cuenta o contraseña.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Precios y Disponibilidad</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Todos los precios se muestran en Pesos Colombianos (COP) e incluyen IVA salvo que se indique lo contrario. Nos reservamos el derecho de cambiar los precios en cualquier momento sin previo aviso. Hacemos todo lo posible para garantizar que la información de disponibilidad sea precisa, pero no podemos garantizar que todos los artículos estén en stock en todo momento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Envíos y Devoluciones</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Los tiempos de envío son estimados y pueden variar según la ubicación. Para devoluciones, consulte nuestra política de devoluciones específica. Los productos deben ser devueltos en su estado original y empaque dentro de los 30 días posteriores a la compra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Propiedad Intelectual</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Todo el contenido incluido en este sitio, como texto, gráficos, logotipos, iconos de botones, imágenes, clips de audio, descargas digitales, compilaciones de datos y software, es propiedad de Refrielectricos G&E S.A.S o de sus proveedores de contenido y está protegido por las leyes internacionales de derechos de autor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Limitación de Responsabilidad</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Refrielectricos G&E S.A.S no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar nuestros servicios o productos.
            </p>
          </section>

          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-4">
            <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">¿Dudas sobre nuestros términos?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos a través de nuestro formulario de contacto o enviando un correo a legal@refrielectricos.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
