import type { SignOptions } from "jsonwebtoken";
export interface JWTConfig {
    secret: string;
    expiresIn: SignOptions["expiresIn"];
}
export interface RedisConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
    db: number;
    tls?: boolean;
}
export interface BullMQConfig {
    prefix: string;
    maxRetries: number;
    backoffDelay: number;
}
export interface LinkedInConfig {
    client_id: string;
    client_secret: string;
    scope: string;
    api_version?: string;
    base_url?: string;
    auth_url?: string;
    token_url: string;
    organization_urn?: string;
    ugc_posts_url?: string;
    redirect_uri: string;
}
export interface GoogleConfig {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    scopes: string[];
}
export interface SocketIOConfig {
    port?: number;
    cors: {
        origin: string | string[];
        credentials: boolean;
    };
    redis: {
        enabled: boolean;
        keyPrefix: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    connection: {
        pingTimeout: number;
        pingInterval: number;
        maxPayload: number;
    };
}
export interface EmailConfig {
    user: string;
    password: string;
    fromName: string;
}
export interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
}
export interface GeminiConfig {
    api_key: string;
}
export interface AppConfig {
    MAIN: {
        port: number;
        nodeEnv: string;
        mongoUri: string;
        dbName?: string;
    };
    API: {
        prefix: string;
    };
    JWT: {
        accessToken: JWTConfig;
        refreshToken: JWTConfig;
    };
    REDIS: RedisConfig;
    BULLMQ: BullMQConfig;
    LINKEDIN: LinkedInConfig;
    GOOGLE: GoogleConfig;
    SOCKETIO: SocketIOConfig;
    EMAIL: EmailConfig;
    CLOUDINARY: CloudinaryConfig;
    GEMINI: GeminiConfig;
}
//# sourceMappingURL=config.d.ts.map