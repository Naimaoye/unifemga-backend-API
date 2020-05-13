/* eslint-disable func-names */
/* eslint-disable no-console */
import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  email_address: { type: String, unique: true },
  first_name: { type: String },
  surname: { type: String },
  middle_name: { type: String },
  marital_status: { type: String },
  gender: { type: String },
  oau_matric_number: { type: String },
  year_of_graduation: { type: String },
  course_of_study: { type: String },
  bvn: { type: String },
  unifemga_member: { type: String },
  unifemga_chapter: { type: String },
  home_address: { type: String },
  home_phone_number: { type: String },
  mobile_phone_number: { type: String },
  business_phone_number: { type: String },
  household_income_from_salaries: { type: String },
  household_income_from_others: { type: String },
  household_expenses: { type: String },
  role: { type: String, default: 'user' },
  profile_photo: { type: String, default: '' },
  registration_status: { type: String, default: 'pending' },
  is_email_verified: { type: Boolean, default: false },
  createdAt: { type: String }
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(12, (err, salt) => {
    if (err) console.error(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

const User = model('User', userSchema);

export default User;
