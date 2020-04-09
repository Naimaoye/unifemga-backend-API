import { model, Schema } from 'mongoose';

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
  home_phone_number: { type: String },
  mobile_phone_number: { type: String },
  business_phone_number: { type: String },
  household_income_from_salaries: { type: String },
  household_income_from_others: { type: String },
  household_expenses: { type: String },
  role: { type: String, default: '' },
  profile_photo: { type: String, default: '' },
  registration_status: { type: String, default: 'pending' },
  is_email_verified: { type: Boolean, default: false },
  createdAt: { type: String }
});


const User = model('User', userSchema);

export default User;
