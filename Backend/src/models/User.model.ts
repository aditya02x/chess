import mongoose, { Schema } from "mongoose";

interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  rating: number;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    default: 1000,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>("User", userSchema);

