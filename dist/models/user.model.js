"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../config/env");
const role_model_1 = require("./role.model");
const enum_1 = require("../@types/enum");
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        select: false, // hide from queries by default
        required: function () {
            // Password is required only if googleId is not present
            return !this.googleId;
        },
    },
    age: {
        type: Number,
    },
    avatar: {
        type: String,
    },
    // OAuth
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allow multiple null values
    },
    // Access
    role: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
    // Security
    refreshToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    // audits
    lastLoginAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    collection: "users",
    toJSON: {
        transform(_doc, ret) {
            delete ret.password;
            delete ret.refreshToken;
            return ret;
        },
    },
    toObject: {
        transform(_doc, ret) {
            delete ret.password;
            delete ret.refreshToken;
            return ret;
        },
    },
});
// ✅ Static method
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email }).select("+password");
};
// ✅ Pre-save hook
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    if (this.password) {
        this.password = await bcrypt_1.default.hash(this.password, salt);
    }
    next();
});
userSchema.pre("save", async function (next) {
    if (!this.role || this.role.length === 0) {
        const defaultRole = await role_model_1.RoleModel.findOne({
            name: enum_1.UserRoleEnum.USER,
        }).select("_id");
        if (!defaultRole)
            next();
        if (defaultRole)
            this.role = [defaultRole._id];
    }
    next();
});
// ✅ Instance methods
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt_1.default.compare(password, this.password);
};
userSchema.methods.generateAccessToken = async function () {
    return jsonwebtoken_1.default.sign({ _id: this._id }, env_1.config.JWT.accessToken.secret, {
        expiresIn: env_1.config.JWT.accessToken.expiresIn,
    });
};
userSchema.methods.generateRefreshToken = async function () {
    return jsonwebtoken_1.default.sign({ _id: this._id }, env_1.config.JWT.refreshToken.secret, {
        expiresIn: env_1.config.JWT.refreshToken.expiresIn,
    });
};
exports.UserModel = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.model.js.map