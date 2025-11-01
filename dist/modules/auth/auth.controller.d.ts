export declare const AuthController: {
    register: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    login: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    loginWithOtp: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    verifyOtp: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    linkedInAuth: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    linkedInAuthCallback: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    googleAuth: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    googleAuthCallback: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    verifyEmail: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    resendVerification: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    forgotPassword: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    resetPassword: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    logout: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    logoutAll: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    refreshToken: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    getCurrentUser: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=auth.controller.d.ts.map