import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        requires: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'recruiter'],
    },
    profile: {
        bio: { type: String },
        skills: {
            type: [String],
            set: skills =>
                skills.map(s =>
                    s.toLowerCase().replace(/[^a-z0-9]/g, "")
                )
        },
        resume: { type: String }, // Url of resume after uploading on coudinary
        resumeName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: "",
        }
    },
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
}, { timestamps: true })

export const User = mongoose.model('User', userSchema);