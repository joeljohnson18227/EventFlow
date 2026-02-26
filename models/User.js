import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: {
            type: String,
            enum: ["admin", "organizer", "participant", "mentor", "judge"],
            default: "participant",
        },
        bio: String,
        avatar: String,
        avatarUrl: {
            type: String,
            default: ""
        },

        // Profile Info
        skills: [String],
        socialLinks: {
            github: String,
            linkedin: String,
            website: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

function excludeSoftDeleted(next) {
    const options = this.getOptions?.() || {};
    if (!options.includeDeleted) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
}

UserSchema.pre("find", excludeSoftDeleted);
UserSchema.pre("findOne", excludeSoftDeleted);
UserSchema.pre("findOneAndUpdate", excludeSoftDeleted);
UserSchema.pre("countDocuments", excludeSoftDeleted);

export default mongoose.models.User || mongoose.model("User", UserSchema);
