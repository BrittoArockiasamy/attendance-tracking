import mongoose from 'mongoose';

// Leave Schema
const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dates: [{ type: String, required: true }], // array of YYYY-MM-DD
  reason: String,
}, { timestamps: true });

export default mongoose.models.Leave || mongoose.model('Leave', LeaveSchema);




