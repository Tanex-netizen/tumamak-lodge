import mongoose from 'mongoose';

const homepageSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      enum: ['hero', 'about', 'features', 'contact'],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Homepage = mongoose.model('Homepage', homepageSchema);

export default Homepage;
