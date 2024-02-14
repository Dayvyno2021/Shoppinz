import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  verified: {type: Boolean, default: false},
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  realImage: {data: Buffer, contentType: String}
  
}, {
  timestamps: true
});

// const User = mongoose.model("User", userSchema);

// export default User;

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}
//pre is before anything get saved while post means after
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

export default mongoose.models.User || mongoose.model('User', userSchema);