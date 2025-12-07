import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@tahfidz.ai';
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Tahfidz.ai';

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendOTPEmail(email: string, otp: string): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Kode Verifikasi - ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0D5C3D 0%, #1A8A5C 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #0D5C3D; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0D5C3D; }
            .warning { background: #FFF3CD; border-left: 4px solid #C9A227; padding: 10px 15px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${APP_NAME}</h1>
              <p>Verifikasi Email Anda</p>
            </div>
            <div class="content">
              <p>Assalamu'alaikum,</p>
              <p>Berikut adalah kode verifikasi Anda:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p>Kode ini berlaku selama <strong>5 menit</strong>.</p>
              
              <div class="warning">
                <strong>⚠️ Penting:</strong> Jangan bagikan kode ini kepada siapapun. Tim ${APP_NAME} tidak akan pernah meminta kode OTP Anda.
              </div>
            </div>
            <div class="footer">
              <p>Jika Anda tidak melakukan permintaan ini, abaikan email ini.</p>
              <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Selamat Datang di ${APP_NAME}! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0D5C3D 0%, #1A8A5C 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { display: flex; align-items: center; margin: 15px 0; }
            .feature-icon { font-size: 24px; margin-right: 15px; }
            .cta-button { display: inline-block; background: #0D5C3D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Selamat Datang!</h1>
              <p>Akun Anda telah berhasil dibuat</p>
            </div>
            <div class="content">
              <p>Assalamu'alaikum ${name},</p>
              <p>Alhamdulillah, akun ${APP_NAME} Anda sudah aktif! Sekarang Anda bisa mulai perjalanan hafalan dengan fitur-fitur berikut:</p>
              
              <div class="feature">
                <span class="feature-icon">📖</span>
                <span><strong>Hafalan Al-Quran</strong> - 30 Juz dengan tajweed</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🎤</span>
                <span><strong>Setoran AI</strong> - Koreksi otomatis dari AI</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🔄</span>
                <span><strong>Muroja'ah</strong> - Jadwal review otomatis</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📊</span>
                <span><strong>Progress Tracking</strong> - Pantau perkembangan</span>
              </div>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">
                  Mulai Hafalan Sekarang
                </a>
              </center>
              
              <p>Barakallahu fiikum,<br>Tim ${APP_NAME}</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<SendEmailResult> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Reset Password - ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0D5C3D 0%, #1A8A5C 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .cta-button { display: inline-block; background: #0D5C3D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .warning { background: #FFF3CD; border-left: 4px solid #C9A227; padding: 10px 15px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${APP_NAME}</h1>
              <p>Reset Password</p>
            </div>
            <div class="content">
              <p>Assalamu'alaikum,</p>
              <p>Kami menerima permintaan untuk reset password akun Anda. Klik tombol di bawah untuk membuat password baru:</p>
              
              <center>
                <a href="${resetUrl}" class="cta-button">
                  Reset Password
                </a>
              </center>
              
              <p>Link ini berlaku selama <strong>1 jam</strong>.</p>
              
              <div class="warning">
                <strong>⚠️</strong> Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
