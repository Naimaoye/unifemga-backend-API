/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/prefer-default-export
export const validateRegisterInput = (
  username,
  password,
  email_address,
  first_name,
  surname,
  middle_name,
  marital_status,
  gender,
  oau_matric_number,
  year_of_graduation,
  course_of_study,
  bvn,
  unifemga_member,
  home_address,
  mobile_phone_number,
  household_income_from_salaries,
  household_income_from_others,
  household_expenses
) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }
  if (email_address.trim() === '') {
    errors.email_address = 'email must not be empty';
  } else {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email_address.match(regEx)) {
      errors.email_address = 'Email must be a valid one';
    }
  }
  if (password === '') {
    errors.password = 'Password must not be empty';
  }
  if (first_name.trim() === '') {
    errors.first_name = 'Firstname must not be empty';
  }
  if (surname.trim() === '') {
    errors.surname = 'Surname must not be empty';
  }
  if (middle_name.trim() === '') {
    errors.middle_name = 'middlename must not be empty';
  }
  if (marital_status.trim() === '') {
    errors.marital_status = 'maritalStatus must not be empty';
  }
  if (gender.trim() === '') {
    errors.gender = 'Gender must not be empty';
  }
  if (oau_matric_number.trim() === '') {
    errors.oau_matric_number = 'MatricNumber must not be empty';
  }
  if (year_of_graduation.trim() === '') {
    errors.year_of_graduation = 'Year must not be empty';
  }
  if (course_of_study.trim() === '') {
    errors.course_of_study = 'courseOfStudy must not be empty';
  }
  if (bvn.trim() === '') {
    errors.bvn = 'Bvn must not be empty';
  }
  if (unifemga_member.trim() === '') {
    errors.unifemga_member = 'Member must not be empty';
  }
  if (home_address === '') {
    errors.home_address = 'home address must not be empty';
  }
  if (mobile_phone_number.trim() === '') {
    errors.mobile_phone_number = 'PhoneNumber must not be empty';
  }
  if (household_income_from_salaries.trim() === '') {
    errors.household_income_from_salaries = 'Income must not be empty';
  }
  if (household_income_from_others.trim() === '') {
    errors.household_income_from_others = 'Income must not be empty';
  }
  if (household_expenses.trim() === '') {
    errors.household_expenses = 'Expenses must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

export const validateLoginInput = (email_address, password) => {
  const errors = {};
  if (email_address.trim() === '') {
    errors.email_address = 'email must not be empty';
  } else {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email_address.match(regEx)) {
      errors.email_address = 'Email must be a valid one';
    }
  }
  if (password === '') {
    errors.password = 'Password must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

export const validateCreateAdminInput = (
  email_address,
  first_name,
  surname,
  unifemga_chapter,
  role
) => {
  const errors = {};
  if (email_address.trim() === '') {
    errors.email_address = 'email must not be empty';
  } else {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email_address.match(regEx)) {
      errors.email_address = 'Email must be a valid one';
    }
  }
  if (first_name.trim() === '') {
    errors.first_name = 'firstname must not be empty';
  }
  if (surname.trim() === '') {
    errors.surname = 'surname must not be empty';
  }
  if (role.trim() === '') {
    errors.role = 'admin role must not be empty';
  }
  if (unifemga_chapter.trim() === '') {
    errors.unifemga_chapter = 'unifemga chapter must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

export const validateEditInput = (
  username,
  password,
  email_address,
  first_name,
  surname,
  middle_name,
  mobile_phone_number,
) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }
  if (email_address.trim() === '') {
    errors.email_address = 'email must not be empty';
  } else {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email_address.match(regEx)) {
      errors.email_address = 'Email must be a valid one';
    }
  }
  if (password === '') {
    errors.password = 'Password must not be empty';
  }
  if (first_name.trim() === '') {
    errors.first_name = 'Firstname must not be empty';
  }
  if (surname.trim() === '') {
    errors.surname = 'Surname must not be empty';
  }
  if (middle_name.trim() === '') {
    errors.middle_name = 'middlename must not be empty';
  }
  if (mobile_phone_number.trim() === '') {
    errors.mobile_phone_number = 'MobilePhoneNumber must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

export const validateCreditRequestInput = (
  fullname,
  date_of_birth,
  fullname_of_nextOfKin,
  personal_bank_account_name,
  personal_bank_account_number,
  personal_bank,
  marital_status,
  source_of_salary,
  number_of_children,
  formal_employment_status,
  company_tax_ID,
  personal_tax_ID,
  annual_salary,
  existing_loan,
  frequency_of_payment,
  existing_loan_information,
  home_address,
  home_ownership_status,
  email_address,
  guarantors_fullname,
  guarantors_phone_number,
  guarantors_email_address,
  guarantors_home_address,
  business_name,
  business_reg_number,
  date_of_incorporation,
  business_sector,
  stage_of_business,
  customer_segments,
  value_proposition,
  revenue_streams,
  cost_structure,
  channels,
  key_partners,
  key_activities,
  key_resources,
  customer_relationship,
) => {
  const errors = {};
  if (fullname === '') {
    errors.fullname = 'fullname must not be empty';
  }
  if (date_of_birth.trim() === '') {
    errors.date_of_birth = 'date of birth must not be empty';
  }
  if (fullname_of_nextOfKin.trim() === '') {
    errors.fullname_of_nextOfKin = 'fullname of nextOfKin must not be empty';
  }
  if (personal_bank_account_name.trim() === '') {
    errors.personal_bank_account_name = 'personal bank account name must not be empty';
  }
  if (personal_bank_account_number.trim() === '') {
    errors.personal_bank_account_number = 'personal bank account number must not be empty';
  }
  if (personal_bank === '') {
    errors.personal_bank = 'personal bank must not be empty';
  }
  if (marital_status.trim() === '') {
    errors.marital_status = 'marital status must not be empty';
  }
  if (source_of_salary.trim() === '') {
    errors.source_of_salary = 'source of salary must not be empty';
  }
  if (number_of_children === null) {
    errors.number_of_children = 'number of children must not be empty';
  }
  if (formal_employment_status.trim() === '') {
    errors.formal_employment_status = 'formal employment status must not be empty';
  }
  if (company_tax_ID.trim() === '') {
    errors.company_tax_ID = 'company tax ID must not be empty';
  }
  if (personal_tax_ID.trim() === '') {
    errors.personal_tax_ID = 'personal tax ID must not be empty';
  }
  if (annual_salary.trim() === '') {
    errors.annual_salary = 'annual salary must not be empty';
  }
  if (existing_loan.trim() === '') {
    errors.existing_loan = 'existing loan must not be empty';
  }
  if (frequency_of_payment.trim() === '') {
    errors.frequency_of_payment = 'frequency of payment must not be empty';
  }
  if (existing_loan_information.trim() === '') {
    errors.existing_loan_information = 'existing loan information must not be empty';
  }
  if (home_address.trim() === '') {
    errors.home_address = 'home address must not be empty';
  }
  if (home_ownership_status.trim() === '') {
    errors.home_ownership_status = 'home ownership status must not be empty';
  }
  if (email_address.trim() === '') {
    errors.email_address = 'email address must not be empty';
  }
  if (guarantors_fullname.trim() === '') {
    errors.guarantors_fullname = 'guarantors fullname must not be empty';
  }
  if (guarantors_phone_number.trim() === '') {
    errors.guarantors_phone_number = 'guarantors phone number must not be empty';
  }
  if (guarantors_email_address.trim() === '') {
    errors.guarantors_email_address = 'guarantors email address must not be empty';
  }
  if (guarantors_home_address.trim() === '') {
    errors.guarantors_home_address = 'guarantors home address must not be empty';
  }
  if (business_name.trim() === '') {
    errors.business_name = 'business name must not be empty';
  }
  if (business_reg_number.trim() === '') {
    errors.business_reg_number = 'business reg_number must not be empty';
  }
  if (date_of_incorporation.trim() === '') {
    errors.date_of_incorporation = 'date of incorporation must not be empty';
  }
  if (business_sector.trim() === '') {
    errors.business_sector = 'business sector must not be empty';
  }
  if (stage_of_business.trim() === '') {
    errors.stage_of_business = 'stage of business must not be empty';
  }
  if (customer_segments.trim() === '') {
    errors.customer_segments = 'customer segments must not be empty';
  }
  if (value_proposition.trim() === '') {
    errors.value_proposition = 'value proposition must not be empty';
  }
  if (revenue_streams.trim() === '') {
    errors.revenue_streams = 'revenue streams must not be empty';
  }
  if (cost_structure === '') {
    errors.cost_structure = 'cost structure must not be empty';
  }
  if (channels === '') {
    errors.channels = 'channels must not be empty';
  }
  if (key_partners.trim() === '') {
    errors.key_partners = 'key_partners must not be empty';
  }
  if (key_activities === '') {
    errors.key_activities = 'key activities must not be empty';
  }
  if (key_resources === '') {
    errors.key_resources = 'key resources must not be empty';
  }
  if (customer_relationship === '') {
    errors.customer_relationship = 'key resources must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};
