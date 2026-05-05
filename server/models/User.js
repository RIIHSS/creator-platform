import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ensures no duplicate registrations
      index: true,  // ✅ ADDED: Single-field index for fast authentication lookups
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // ✅ Security: Don't return password in queries by default
    },
    // Adding avatar field usually included in these projects
    avatar: {
      type: String,
      default: null
    }
  },
  { 
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

// Alternative syntax (keeping for reference):
// userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;