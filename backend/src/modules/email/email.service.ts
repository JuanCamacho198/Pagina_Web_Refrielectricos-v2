import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { getWelcomeEmailTemplate } from './templates/welcome.template';
import { getOrderConfirmationEmailTemplate } from './templates/order-confirmation.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private frontendUrl: string;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    this.fromEmail =
      this.configService.get<string>('FROM_EMAIL') ||
      'noreply@refrielectricos.com';

    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn(
        'RESEND_API_KEY not configured. Email sending will be disabled.',
      );
    }
  }

  /**
   * Send email verification link to user
   */
  async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `Skipping verification email to ${email} (Resend not configured)`,
      );
      return;
    }

    const verificationUrl = `${this.frontendUrl}/verify-email?token=${token}`;

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Verifica tu correo electrónico - Refrielectricos G&E',
        html: this.getVerificationEmailTemplate(name, verificationUrl),
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw error;
    }
  }

  /**
   * Send password reset link to user
   */
  async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `Skipping password reset email to ${email} (Resend not configured)`,
      );
      return;
    }

    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Recupera tu contraseña - Refrielectricos G&E',
        html: this.getPasswordResetEmailTemplate(name, resetUrl),
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Send welcome email after email verification
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `Skipping welcome email to ${email} (Resend not configured)`,
      );
      return;
    }

    try {
      const htmlContent = getWelcomeEmailTemplate({
        userName: name,
        userEmail: email,
        frontendUrl: this.frontendUrl,
      });

      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: '¡Bienvenido a Refrielectricos G&E! 🎉',
        html: htmlContent,
      });

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
      // Don't throw - we don't want to fail verification if email fails
      // Just log the error
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmationEmail(orderData: {
    orderNumber: string;
    userName: string;
    userEmail: string;
    items: Array<{
      productName: string;
      variantName?: string;
      quantity: number;
      price: number;
      imageUrl?: string;
    }>;
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
    orderDate: Date;
    estimatedDelivery?: string;
  }): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `Skipping order confirmation email to ${orderData.userEmail} (Resend not configured)`,
      );
      return;
    }

    try {
      const htmlContent = getOrderConfirmationEmailTemplate({
        ...orderData,
        frontendUrl: this.frontendUrl,
      });

      await this.resend.emails.send({
        from: this.fromEmail,
        to: orderData.userEmail,
        subject: `Pedido Confirmado #${orderData.orderNumber} - Refrielectricos G&E`,
        html: htmlContent,
      });

      this.logger.log(
        `Order confirmation email sent to ${orderData.userEmail} for order ${orderData.orderNumber}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send order confirmation email to ${orderData.userEmail}`,
        error,
      );
      // Don't throw - we don't want to fail order creation if email fails
    }
  }

  /**
   * Email verification template
   */
  private getVerificationEmailTemplate(
    name: string,
    verificationUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #2563eb; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Refrielectricos G&E</h1>
            </div>
            <div class="content">
              <h2>¡Hola ${name || 'Usuario'}!</h2>
              <p>Gracias por registrarte en Refrielectricos G&E.</p>
              <p>Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verificar mi correo</a>
              </div>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
              <p><strong>Este enlace expirará en 24 horas.</strong></p>
              <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Refrielectricos G&E. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Password reset email template
   */
  private getPasswordResetEmailTemplate(
    name: string,
    resetUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #2563eb; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Refrielectricos G&E</h1>
            </div>
            <div class="content">
              <h2>¡Hola ${name || 'Usuario'}!</h2>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer mi contraseña</a>
              </div>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
              <p><strong>Este enlace expirará en 1 hora.</strong></p>
              <div class="warning">
                <strong>⚠️ Importante:</strong> Si no solicitaste restablecer tu contraseña, ignora este correo. Tu cuenta está segura.
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Refrielectricos G&E. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
