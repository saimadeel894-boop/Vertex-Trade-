import nodemailer from "nodemailer";

type VerificationEmailInput = {
  code: string;
  expiresInMinutes: number;
  name: string;
  to: string;
};

export class EmailConfigurationError extends Error {
  missing: string[];

  constructor(missing: string[]) {
    super(`Missing email configuration: ${missing.join(", ")}`);
    this.name = "EmailConfigurationError";
    this.missing = missing;
  }
}

export async function sendVerificationEmail({ code, expiresInMinutes, name, to }: VerificationEmailInput) {
  const config = getEmailConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject: "Your Vertex Markets verification code",
    text: buildTextEmail({ code, expiresInMinutes, name }),
    html: buildHtmlEmail({ code, expiresInMinutes, name })
  });
}

function getEmailConfig() {
  const missing = [
    ["SMTP_HOST", process.env.SMTP_HOST],
    ["SMTP_PORT", process.env.SMTP_PORT],
    ["SMTP_USER", process.env.SMTP_USER],
    ["SMTP_PASS", process.env.SMTP_PASS],
    ["SMTP_FROM", process.env.SMTP_FROM]
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new EmailConfigurationError(missing);
  }

  const port = Number(process.env.SMTP_PORT);
  return {
    host: process.env.SMTP_HOST as string,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
    from: process.env.SMTP_FROM as string
  };
}

function buildTextEmail({ code, expiresInMinutes, name }: Omit<VerificationEmailInput, "to">) {
  return [
    `Hello ${name},`,
    "",
    `Your Vertex Markets verification code is ${code}.`,
    `This code expires in ${expiresInMinutes} minutes.`,
    "",
    "If you did not create a Vertex Markets account, you can safely ignore this email.",
    "",
    "Vertex Markets"
  ].join("\n");
}

function buildHtmlEmail({ code, expiresInMinutes, name }: Omit<VerificationEmailInput, "to">) {
  const safeName = escapeHtml(name);
  return `<!doctype html>
<html>
  <body style="margin:0;background:#050709;color:#ffffff;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050709;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#0a0e16;border:1px solid rgba(255,255,255,0.12);border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:34px 34px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:18px;font-weight:800;letter-spacing:0.18em;">VERTEX</div>
                <div style="margin-top:4px;color:#6b7585;font-size:10px;font-weight:600;letter-spacing:0.28em;">MARKETS</div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px;">
                <h1 style="margin:0 0 10px;color:#fff;font-size:24px;line-height:1.25;">Verify your email</h1>
                <p style="margin:0 0 24px;color:#a0aab8;font-size:14px;line-height:1.7;">Hello ${safeName}, use this code to complete your Vertex Markets account registration.</p>
                <div style="margin:0 0 24px;padding:18px;border-radius:12px;background:rgba(37,99,235,0.1);border:1px solid rgba(37,99,235,0.28);text-align:center;">
                  <div style="color:#fff;font-size:32px;font-weight:800;letter-spacing:0.34em;">${code}</div>
                </div>
                <p style="margin:0;color:#6b7585;font-size:12px;line-height:1.7;">This code expires in ${expiresInMinutes} minutes. If you did not create a Vertex Markets account, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
