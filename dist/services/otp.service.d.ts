export declare const OtpService: {
    generateOtp(identifier: string): Promise<string>;
    getOtp(identifier: string): Promise<string>;
    deleteOtp(identifier: string): Promise<void>;
    sendOtp(email: string): Promise<void>;
    processOtpJob(email: string, otp: string): Promise<boolean>;
    sendTokenVerificationEmail(email: string, name: string, verificationUrl: string): Promise<void>;
};
//# sourceMappingURL=otp.service.d.ts.map