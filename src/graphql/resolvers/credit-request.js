/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { UserInputError } from 'apollo-server';

import User from '../../models/Users';
import Credit from '../../models/CreditRequest';
import { SECRET_KEY } from '../../config/config';
import {
  validateCreditRequestInput
} from '../../utils/validation';
import sendEmail from '../../utils/mailer';
import transporter from '../../utils/transporter';
import { checkAuth } from '../../utils/checkAuth';

const creditResolvers = {
  Mutation: {
    async createCreditRequest(_, {
      creditInput: {
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
        SCAO_decision,
        SCCAO_decision,
        loan_application_status,
        loan_start_date,
        loan_due_date,
        loan_repayment_status,
      }
    }, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const userExist = await User.findOne({ _id: id });
      const { valid, errors } = validateCreditRequestInput(
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
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      if (userExist.role !== 'user') {
        throw new Error('You are not eligible to apply');
      }
      if (userExist.registration_status !== 'approved') {
        throw new Error('Your registration has not been approved');
      }
      const creditExist = await Credit.findOne({ user: id });
      if (creditExist) {
        throw new Error('Your credit request form has already been submitted');
      }
      try {
        const newCredit = new Credit({
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
          SCAO_decision,
          SCCAO_decision,
          loan_application_status,
          loan_start_date,
          loan_due_date,
          loan_repayment_status,
          user: id,
        });
        const res = await newCredit.save().then(data => {
          Credit.findOne({ _id: data.id }).populate('user').then(result => {
            result.username = result.user.username;
            result.save();
          });
        });
        return {
          ...res,
          status: 201,
          message: 'Credit request form submitted successfully',
        };
      } catch (error) {
        return {
          status: 500,
          error: 'database error'
        };
      }
    }
  },
};

export default creditResolvers;
