import { getBaseEmailTemplate } from './base.template';

interface OrderItem {
  productName: string;
  variantName?: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface OrderConfirmationParams {
  orderNumber: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount?: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip?: string;
  };
  frontendUrl: string;
  orderDate: Date;
  estimatedDelivery?: string;
}

/**
 * Format currency in Colombian Pesos
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date in Spanish
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getOrderConfirmationEmailTemplate({
  orderNumber,
  userName,
  items,
  subtotal,
  shippingCost,
  discount,
  total,
  shippingAddress,
  frontendUrl,
  orderDate,
  estimatedDelivery,
}: OrderConfirmationParams): string {
  // Generate items HTML
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${
            item.imageUrl
              ? `<img src="${item.imageUrl}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;" />`
              : `<div style="width: 60px; height: 60px; background-color: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af;">📦</div>`
          }
          <div>
            <p style="margin: 0; font-weight: 600; color: #111827; font-size: 15px;">
              ${item.productName}
            </p>
            ${
              item.variantName
                ? `<p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">${item.variantName}</p>`
                : ''
            }
            <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">
              Cantidad: ${item.quantity}
            </p>
          </div>
        </div>
      </td>
      <td style="padding: 16px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827;">
        ${formatCurrency(item.price * item.quantity)}
      </td>
    </tr>
  `,
    )
    .join('');

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">
        ✓ Pedido Confirmado
      </div>
    </div>

    <h1 style="text-align: center;">¡Gracias por tu pedido, ${userName}!</h1>
    
    <p style="text-align: center; font-size: 16px;">
      Hemos recibido tu pedido y comenzaremos a procesarlo de inmediato.
      Te enviaremos actualizaciones sobre el estado de tu envío.
    </p>
    
    <div class="success-box">
      <p style="margin: 0;">
        <strong>Número de Pedido:</strong> #${orderNumber}<br>
        <strong>Fecha:</strong> ${formatDate(orderDate)}
        ${estimatedDelivery ? `<br><strong>Entrega Estimada:</strong> ${estimatedDelivery}` : ''}
      </p>
    </div>
    
    <h2>Resumen del Pedido</h2>
    
    <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin: 20px 0;">
      ${itemsHtml}
    </table>
    
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Subtotal:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Envío:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">
            ${shippingCost === 0 ? '<span style="color: #22c55e;">GRATIS</span>' : formatCurrency(shippingCost)}
          </td>
        </tr>
        ${
          discount && discount > 0
            ? `
        <tr>
          <td style="padding: 8px 0; color: #22c55e;">Descuento:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #22c55e;">
            -${formatCurrency(discount)}
          </td>
        </tr>
        `
            : ''
        }
        <tr style="border-top: 2px solid #e5e7eb;">
          <td style="padding: 12px 0; font-size: 18px; font-weight: 700; color: #111827;">Total:</td>
          <td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: 700; color: #2563eb;">
            ${formatCurrency(total)}
          </td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${frontendUrl}/account/orders/${orderNumber}" class="button">
        Ver Detalles del Pedido
      </a>
    </div>
    
    <div class="divider"></div>
    
    <h2>Información de Envío</h2>
    
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #111827; margin-bottom: 8px;">
        ${shippingAddress.name}
      </p>
      <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
        ${shippingAddress.address}<br>
        ${shippingAddress.city}, ${shippingAddress.state}${shippingAddress.zip ? ` ${shippingAddress.zip}` : ''}<br>
        Teléfono: ${shippingAddress.phone}
      </p>
    </div>
    
    <div class="info-box">
      <p style="margin: 0;">
        <strong>📦 ¿Qué sigue?</strong><br>
        Procesaremos tu pedido y te enviaremos un correo con la información de rastreo
        una vez que tu paquete sea enviado. Puedes seguir el estado de tu pedido en cualquier
        momento desde tu cuenta.
      </p>
    </div>
    
    <div class="divider"></div>
    
    <h2>¿Necesitas ayuda?</h2>
    
    <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:</p>
    
    <table style="width: 100%; margin: 20px 0;">
      <tr>
        <td style="padding: 12px; background-color: #f9fafb; border-radius: 8px; text-align: center;">
          <a href="${frontendUrl}/contact" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            📧 Enviar un mensaje
          </a>
        </td>
        <td style="width: 20px;"></td>
        <td style="padding: 12px; background-color: #f9fafb; border-radius: 8px; text-align: center;">
          <a href="${frontendUrl}/account/orders" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            📋 Ver mis pedidos
          </a>
        </td>
      </tr>
    </table>
    
    <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
      <strong>¡Gracias por confiar en nosotros!</strong><br>
      Equipo de Refrielectricos G&E
    </p>
  `;

  return getBaseEmailTemplate({
    title: `Pedido Confirmado #${orderNumber}`,
    preheader: `Tu pedido #${orderNumber} ha sido recibido y será procesado pronto.`,
    content,
  });
}
