"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationTokenModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const verificationTokenSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    type: {
        type: String,
        enum: ['email_verification', 'password_reset'],
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Auto-delete after 24 hours
    },
});
// Static method to create verification token
verificationTokenSchema.statics.createVerificationToken = async function (userId, type) {
    // Generate token
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    // Email verification: 24 hours, Password reset: 15 minutes
    if (type === 'email_verification') {
        expiresAt.setHours(expiresAt.getHours() + 24);
    }
    else {
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    }
    // Delete any existing tokens for this user and type
    await this.deleteMany({ userId, type });
    // Create new token
    return await this.create({
        userId,
        token,
        type,
        expiresAt,
    });
};
// Static method to verify token
verificationTokenSchema.statics.verifyToken = async function (token, type) {
    const tokenDoc = await this.findOne({
        token,
        type,
        expiresAt: { $gt: new Date() },
    }).populate('userId');
    if (!tokenDoc) {
        return null;
    }
    return tokenDoc;
};
exports.VerificationTokenModel = mongoose_1.default.model('VerificationToken', verificationTokenSchema);
//# sourceMappingURL=verification-token.model.js.map