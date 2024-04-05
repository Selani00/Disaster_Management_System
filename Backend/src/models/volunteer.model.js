import {model, Schema} from 'mongoose';

export const VolunteerSchema = new Schema(
    {
        id: {type: String, required: true},
        fullName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        phoneNumber: {type: String, required: true},
        address: {type: String, required: true},
        skills: {type: [String], default: []},
        experience: {type: String, default: "None"},
        motivation: {type: String, default: "None"}
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject : {
            virtuals: true,
        },
    }
);

export const VolunteerModel = model('volunteers', VolunteerSchema);