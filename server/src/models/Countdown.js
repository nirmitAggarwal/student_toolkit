import mongoose from 'mongoose';

const countdownSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    targetDate: { type: Date, required: true },
    notes: { type: String, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

const Countdown = mongoose.model('Countdown', countdownSchema);
export default Countdown;
