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
