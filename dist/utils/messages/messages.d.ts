export declare const MESSAGES: {
    readonly USER: {
        readonly CREATED: "User created successfully.";
        readonly UPDATED: "User updated successfully.";
        readonly DELETED: "User deleted successfully.";
        readonly NOT_FOUND: "User not found.";
        readonly NOT_FOUND_AGAINST_EMAIL: "User not found against email";
        readonly EXISTS: "User already exists.";
        readonly INCORRECT_PASSWORD: "Incorrect Password";
    };
    readonly AUTH: {
        readonly LOG_IN: "User logged in successfully";
        readonly LOG_OUT: "User logged out successfully";
        readonly INVALID: "Invalid credentials.";
        readonly TOKEN_EXPIRED: "Access token expired. Please login again.";
    };
    readonly OTP: {
        readonly OTP_SENT: "Otp sent";
        readonly OTP_EXPIRED: "Otp expired";
        readonly OTP_INVALID: "Invalid Otp";
        readonly OTP_VERIFIED: "Otp verified successfully";
    };
    readonly LOGGING: {};
    readonly COMMON: {
        readonly SERVER_ERROR: "Something went wrong. Please try again later.";
        readonly UNAUTHORIZED: "You are not authorized to perform this action.";
    };
};
//# sourceMappingURL=messages.d.ts.map