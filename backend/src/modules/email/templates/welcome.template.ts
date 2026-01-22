import { getBaseEmailTemplate } from './base.template';

interface WelcomeEmailParams {
  userName: string;
  userEmail: string;
  frontendUrl: string;
}

export function getWelcomeEmailTemplate({
  userName,
  userEmail,
  frontendUrl,
}: WelcomeEmailParams): string {
  const content = `
    <h1>¡Bienvenido a Refrielectricos G&E, ${userName}! 🎉</h1>
    
    <p>
      ¡Gracias por unirte a nuestra comunidad! Estamos emocionados de tenerte con nosotros.
      Tu cuenta ha sido verificada exitosamente y ya puedes disfrutar de todos los beneficios
      de ser parte de Refrielectricos G&E.
    </p>
    
    <div class="success-box">
      <p style="margin: 0;">
        <strong>✓ Tu cuenta está activa</strong><br>
        Email: ${userEmail}
      </p>
    </div>
    
    <h2>¿Qué puedes hacer ahora?</h2>
    
    <p>Como miembro registrado, ahora tienes acceso a:</p>
    
    <ul style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 16px 0; padding-left: 20px;">
      <li><strong>Compras Rápidas:</strong> Guarda tu información y completa tus pedidos en segundos</li>
      <li><strong>Historial de Pedidos:</strong> Revisa y rastrea todos tus pedidos desde tu perfil</li>
      <li><strong>Lista de Deseos:</strong> Guarda tus productos favoritos para después</li>
      <li><strong>Ofertas Exclusivas:</strong> Recibe descuentos y promociones especiales</li>
      <li><strong>Soporte Prioritario:</strong> Atención personalizada para todas tus consultas</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="${frontendUrl}/products" class="button">
        Explorar Productos
      </a>
    </div>
    
    <div class="divider"></div>
    
    <h2>Categorías Populares</h2>
    
    <p>Descubre nuestra amplia gama de productos de refrigeración y equipos eléctricos:</p>
    
    <table style="width: 100%; margin: 20px 0;">
      <tr>
        <td style="padding: 12px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 8px;">
          <a href="${frontendUrl}/products?category=refrigeracion" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            ❄️ Refrigeración
          </a>
        </td>
        <td style="padding: 12px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 8px;">
          <a href="${frontendUrl}/products?category=equipos-electricos" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            ⚡ Equipos Eléctricos
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px; background-color: #f9fafb; border-radius: 8px;">
          <a href="${frontendUrl}/products?category=repuestos" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            🔧 Repuestos
          </a>
        </td>
        <td style="padding: 12px; background-color: #f9fafb; border-radius: 8px;">
          <a href="${frontendUrl}/products?category=herramientas" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            🛠️ Herramientas
          </a>
        </td>
      </tr>
    </table>
    
    <div class="info-box">
      <p style="margin: 0;">
        <strong>💡 Consejo:</strong> Agrega productos a tu lista de deseos para recibir notificaciones
        cuando haya ofertas especiales o cambios de precio.
      </p>
    </div>
    
    <div class="divider"></div>
    
    <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
      ¿Tienes alguna pregunta? No dudes en <a href="${frontendUrl}/contact" style="color: #2563eb;">contactarnos</a>.
      Estamos aquí para ayudarte.
    </p>
    
    <p style="color: #6b7280; font-size: 14px; text-align: center;">
      <strong>Equipo de Refrielectricos G&E</strong><br>
      Tu aliado en refrigeración
    </p>
  `;

  return getBaseEmailTemplate({
    title: '¡Bienvenido a Refrielectricos G&E!',
    preheader:
      'Tu cuenta ha sido verificada exitosamente. Comienza a explorar nuestros productos.',
    content,
  });
}
