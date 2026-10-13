import nodemailer from "nodemailer"

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  fromName: string
  fromEmail: string
}

function getEmailConfig(): EmailConfig {
  return {
    host: process.env.SMTP_HOST || "smtp.resend.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "resend",
      pass: process.env.SMTP_PASS || "",
    },
    fromName: process.env.FROM_NAME || "HerStyle",
    fromEmail: process.env.FROM_EMAIL || "orders@herstyle.com",
  }
}

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    const config = getEmailConfig()
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    })
  }
  return transporter
}

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  fromName?: string
  fromEmail?: string
  }

  export async function sendEmail(options: SendEmailOptions) {
    const config = getEmailConfig()
    const transporter = getTransporter()

    const from = options.fromName && options.fromEmail
      ? `${options.fromName} <${options.fromEmail}>`
      : `${config.fromName} <${config.fromEmail}>`

    const mailOptions = {
      from,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }

    try {
      const info = await transporter.sendMail(mailOptions)
      console.log("Email sent:", info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error("Failed to send email:", error)
      return { success: false, error }
    }
  }

export function generateOrderConfirmationEmail(order: {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    productName: string
    variantName?: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  shippingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  createdAt: Date
}) {
  const formatPrice = (amount: number) => `GHS ${amount.toLocaleString()}`

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
        <strong>${item.productName}</strong>
        ${item.variantName ? `<br><small style="color: #6b6b6b;">${item.variantName}</small>` : ""}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${formatPrice(item.price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${formatPrice(item.total)}</td>
    </tr>
  `).join("")

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${order.orderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-family: Georgia, serif; font-size: 28px; font-weight: 500;">HerStyle</h1>
          <p style="margin: 8px 0 0; color: #cccccc; font-size: 14px;">Trendy • Elegant • You</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 24px; font-weight: 500;">Order Confirmed!</h2>
          <p style="margin: 0 0 24px; color: #6b6b6b; font-size: 16px; line-height: 1.6;">
            Hi ${order.customerName},<br>
            Thank you for your order! We've received your order <strong>${order.orderNumber}</strong> and it's being processed.
          </p>

          <!-- Order Details -->
          <div style="background-color: #fafafa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px; color: #1a1a1a; font-size: 16px; font-weight: 500;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #e5e5e5;">
                  <th style="padding: 12px; text-align: left; color: #6b6b6b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                  <th style="padding: 12px; text-align: center; color: #6b6b6b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                  <th style="padding: 12px; text-align: right; color: #6b6b6b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                  <th style="padding: 12px; text-align: right; color: #6b6b6b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div style="background-color: #fafafa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b6b6b;">Subtotal</td>
                <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b6b6b;">Shipping</td>
                <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${formatPrice(order.shipping)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b6b6b;">Tax</td>
                <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${formatPrice(order.tax)}</td>
              </tr>
              ${order.discount > 0 ? `
              <tr>
                <td style="padding: 8px 0; color: #6b6b6b;">Discount</td>
                <td style="padding: 8px 0; text-align: right; color: #10b981;">-${formatPrice(order.discount)}</td>
              </tr>
              ` : ""}
              <tr style="border-top: 2px solid #e5e5e5;">
                <td style="padding: 12px 0 0; font-weight: 600; color: #1a1a1a; font-size: 18px;">Total</td>
                <td style="padding: 12px 0 0; text-align: right; font-weight: 600; color: #1a1a1a; font-size: 18px;">${formatPrice(order.total)}</td>
              </tr>
            </table>
          </div>

          <!-- Shipping Address -->
          <div style="margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a1a; font-size: 16px; font-weight: 500;">Shipping Address</h3>
            <address style="font-style: normal; color: #6b6b6b; line-height: 1.8;">
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}<br>` : ""}
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </address>
          </div>

          <!-- Payment Method -->
          <div style="margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a1a; font-size: 16px; font-weight: 500;">Payment Method</h3>
            <p style="margin: 0; color: #6b6b6b;">${order.paymentMethod.replace("_", " ")}</p>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; text-align: center;">
            <p style="margin: 0 0 8px; color: #6b6b6b; font-size: 14px;">
              If you have any questions, please contact us at <a href="mailto:hello@herstyle.com" style="color: #000000;">hello@herstyle.com</a>
            </p>
            <p style="margin: 0; color: #999999; font-size: 12px;">
              HerStyle • Accra, Ghana
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0; color: #999999; font-size: 12px;">
            © ${new Date().getFullYear()} HerStyle. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Order Confirmation - ${order.orderNumber}

Hi ${order.customerName},

Thank you for your order! We've received your order ${order.orderNumber} and it's being processed.

Order Summary:
${order.items.map(item => `- ${item.productName}${item.variantName ? ` (${item.variantName})` : ""} x${item.quantity} @ ${formatPrice(item.price)} = ${formatPrice(item.total)}`).join("\n")}

Subtotal: ${formatPrice(order.subtotal)}
Shipping: ${formatPrice(order.shipping)}
Tax: ${formatPrice(order.tax)}
${order.discount > 0 ? `Discount: -${formatPrice(order.discount)}` : ""}
Total: ${formatPrice(order.total)}

Shipping Address:
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.addressLine1}
${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + "\n" : ""}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
${order.shippingAddress.country}
Phone: ${order.shippingAddress.phone}

Payment Method: ${order.paymentMethod.replace("_", " ")}

If you have any questions, please contact us at hello@herstyle.com

HerStyle • Accra, Ghana
  `

  return { html, text }
}

export function generateShippingConfirmationEmail(order: {
  orderNumber: string
  customerName: string
  customerEmail: string
  trackingNumber?: string
  trackingUrl?: string
  estimatedDelivery?: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Order Has Shipped - ${order.orderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-family: Georgia, serif; font-size: 28px; font-weight: 500;">HerStyle</h1>
          <p style="margin: 8px 0 0; color: #cccccc; font-size: 14px;">Trendy • Elegant • You</p>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 24px; font-weight: 500;">Your Order Has Shipped! 📦</h2>
          <p style="margin: 0 0 24px; color: #6b6b6b; font-size: 16px; line-height: 1.6;">
            Hi ${order.customerName},<br>
            Great news! Your order <strong>${order.orderNumber}</strong> is on its way.
          </p>

          ${order.trackingNumber ? `
          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <h3 style="margin: 0 0 8px; color: #0369a1; font-size: 16px;">Tracking Information</h3>
            <p style="margin: 0 0 12px; color: #6b6b6b;">Tracking Number: <strong style="color: #1a1a1a;">${order.trackingNumber}</strong></p>
            ${order.trackingUrl ? `
            <a href="${order.trackingUrl}" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">Track Your Package</a>
            ` : ""}
          </div>
          ` : ""}

          ${order.estimatedDelivery ? `
          <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <h3 style="margin: 0 0 8px; color: #166534; font-size: 16px;">Estimated Delivery</h3>
            <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">${order.estimatedDelivery}</p>
          </div>
          ` : ""}

          <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; text-align: center;">
            <p style="margin: 0 0 8px; color: #6b6b6b; font-size: 14px;">
              If you have any questions, please contact us at <a href="mailto:hello@herstyle.com" style="color: #000000;">hello@herstyle.com</a>
            </p>
          </div>
        </div>

        <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0; color: #999999; font-size: 12px;">
            © ${new Date().getFullYear()} HerStyle. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return { html, text: `Your order ${order.orderNumber} has shipped!${order.trackingNumber ? ` Tracking: ${order.trackingNumber}` : ""}${order.estimatedDelivery ? ` Est. delivery: ${order.estimatedDelivery}` : ""}` }
}
