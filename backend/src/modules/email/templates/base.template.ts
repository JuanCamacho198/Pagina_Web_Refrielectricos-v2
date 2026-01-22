/**
 * Base email template with brand colors and styling
 * Uses Refrielectricos G&E brand colors: Blue (#2563EB) and professional design
 */

interface BaseTemplateParams {
  title: string;
  preheader?: string;
  content: string;
}

export function getBaseEmailTemplate({
  title,
  preheader,
  content,
}: BaseTemplateParams): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f3f4f6;
      padding: 0;
      margin: 0;
    }
    
    .email-wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 40px 20px;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .email-header {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .logo-subtitle {
      font-size: 14px;
      opacity: 0.9;
      font-weight: 400;
      letter-spacing: 1px;
    }
    
    .email-body {
      padding: 40px 30px;
      background-color: #ffffff;
    }
    
    h1 {
      color: #111827;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.3;
    }
    
    h2 {
      color: #374151;
      font-size: 20px;
      font-weight: 600;
      margin: 24px 0 12px;
    }
    
    p {
      color: #4b5563;
      font-size: 15px;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      margin: 24px 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
    }
    
    .button:hover {
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
      transform: translateY(-1px);
    }
    
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .warning-box {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .success-box {
      background-color: #f0fdf4;
      border-left: 4px solid #22c55e;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 32px 0;
    }
    
    .email-footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-text {
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 12px;
    }
    
    .footer-links {
      margin: 16px 0;
    }
    
    .footer-link {
      color: #2563eb;
      text-decoration: none;
      font-size: 13px;
      margin: 0 8px;
    }
    
    .social-links {
      margin-top: 20px;
    }
    
    .social-link {
      display: inline-block;
      margin: 0 8px;
      color: #6b7280;
      text-decoration: none;
      font-size: 13px;
    }
    
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }
      
      .email-header {
        padding: 30px 20px;
      }
      
      .email-body {
        padding: 30px 20px;
      }
      
      .email-footer {
        padding: 20px;
      }
      
      h1 {
        font-size: 22px;
      }
      
      .button {
        padding: 12px 24px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header with Logo -->
      <div class="email-header">
        <div class="logo">Refrielectricos G&E</div>
        <div class="logo-subtitle">TU ALIADO EN REFRIGERACIÓN</div>
      </div>
      
      <!-- Email Content -->
      <div class="email-body">
        ${content}
      </div>
      
      <!-- Footer -->
      <div class="email-footer">
        <p class="footer-text">
          <strong>Refrielectricos G&E</strong><br>
          Especialistas en Refrigeración y Equipos Eléctricos<br>
          Curumaní, Cesar, Colombia
        </p>
        
        <div class="footer-links">
          <a href="https://frontend-production-4178.up.railway.app" class="footer-link">Visitar Tienda</a>
          <span style="color: #d1d5db;">|</span>
          <a href="https://frontend-production-4178.up.railway.app/contact" class="footer-link">Contacto</a>
          <span style="color: #d1d5db;">|</span>
          <a href="https://frontend-production-4178.up.railway.app/help" class="footer-link">Ayuda</a>
        </div>
        
        <div class="social-links">
          <a href="#" class="social-link">Facebook</a>
          <a href="#" class="social-link">Instagram</a>
          <a href="#" class="social-link">WhatsApp</a>
        </div>
        
        <p class="footer-text" style="margin-top: 20px;">
          © ${currentYear} Refrielectricos G&E. Todos los derechos reservados.
        </p>
        
        <p class="footer-text" style="font-size: 11px; margin-top: 12px;">
          Este correo fue enviado a tu cuenta registrada.<br>
          Si no solicitaste este correo, puedes ignorarlo de forma segura.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
