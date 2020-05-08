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
  ho

});

const Credit = model('Credit', creditSchema);

export default Credit;
