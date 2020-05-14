import { model, Schema } from 'mongoose';

const creditSchema = new Schema({
  fullname: { type: String },
  date_of_birth: { type: String },
  fullname_of_nextOfKin: { type: String },
  personal_bank_account_name: { type: String },
  personal_bank_account_number: { type: String },
  personal_bank: { type: String },
  marital_status: { type: String },
  source_of_salary: { type: String },
  number_of_children: { type: Number },
  formal_employment_status: { type: String },
  company_tax_ID: { type: String },
  personal_tax_ID: { type: String },
  annual_salary: { type: String },
  existing_loan: { type: String },
  frequency_of_payment: { type: String },
  existing_loan_information: { type: String },
  home_address: { type: String },
  home_ownership_status: { type: String },
  email_address: { type: String },
  guarantors_fullname: { type: String },
  guarantors_phone_number: { type: String },
  guarantors_email_address: { type: String },
  guarantors_home_address: { type: String },
  business_name: { type: String },
  business_reg_number: { type: String },
  date_of_incorporation: { type: String },
  business_sector: { type: String },
  stage_of_business: { type: String },
  customer_segments: { type: String },
  value_proposition: { type: String },
  revenue_streams: { type: String },
  cost_structure: { type: String },
  channels: { type: String },
  key_partners: { type: String },
  key_activities: { type: String },
  key_resources: { type: String },
  customer_relationship: { type: String },
  SCAO_decision: { type: String, default: 'pending' },
  SCCAO_decision: { type: String, default: 'pending' },
  loan_application_status: { type: String, default: 'pending' },
  loan_start_date: { type: String, default: '' },
  loan_due_date: { type: String, default: '' },
  loan_repayment_status: { type: String, default: '' },
  username: { type: String },
<<<<<<< HEAD
  unifemga_chapter: { type: String },
  createdAt: { type: String },
=======
>>>>>>> 318bb8e233dec1eed1e625164f6efe1f5f9d1c3b
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Credit = model('Credit', creditSchema);

export default Credit;
