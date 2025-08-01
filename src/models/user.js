import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  email: String,
  team: String,
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
