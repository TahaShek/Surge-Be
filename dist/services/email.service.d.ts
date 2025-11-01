import nodemailer from "nodemailer";
export declare const EmailService: {
    createTransport(): nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
    sendMail(to: string, subject: string, text: string, html?: string): Promise<void>;
    sendVerificationEmail(email: string, name: string, verificationUrl: string): Promise<void>;
    sendPasswordResetEmail(email: string, name: string, resetUrl: string): Promise<void>;
};
//# sourceMappingURL=email.service.d.ts.map