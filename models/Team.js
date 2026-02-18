import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, "Team name is required"],
            trim: true,
            maxlength: [50, "Team name cannot exceed 50 characters"]
        },
        description: {
            type: String,
            maxlength: [500, "Description cannot exceed 500 characters"]
        },
        event: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Event", 
            required: [true, "Event is required for team creation"]
        },
        leader: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        members: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }],
        inviteCode: { 
            type: String, 
            unique: true,
            uppercase: true
        },
        maxMembers: {
            type: Number,
            default: 5,
            min: [2, "Team must have at least 2 members"],
            max: [10, "Team cannot have more than 10 members"]
        },
        status: {
            type: String,
            enum: ["active", "completed", "disbanded"],
            default: "active"
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for member count
TeamSchema.virtual('memberCount').get(function() {
    return this.members.length + 1; // +1 for leader
});

// Check if team is full
TeamSchema.virtual('isFull').get(function() {
    return this.members.length >= this.maxMembers;
});

// Generate unique invite code before saving
TeamSchema.pre('save', async function(next) {
    if (!this.inviteCode) {
        this.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    next();
});

// Index for faster queries
TeamSchema.index({ event: 1 });
TeamSchema.index({ leader: 1 });
TeamSchema.index({ 'members': 1 });
TeamSchema.index({ inviteCode: 1 });

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
