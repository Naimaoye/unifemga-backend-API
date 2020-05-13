/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { UserInputError, AuthenticationError } from 'apollo-server';

import User from '../../models/Users';
import Credit from '../../models/CreditRequest';
import { SECRET_KEY } from '../../config/config';
import {
  validateCreditRequestInput
} from '../../utils/validation';
import sendEmail from '../../utils/mailer';
import transporter from '../../utils/transporter';
import { checkAuth } from '../../utils/checkAuth';

const composeCreditRequestDecisionEmail = (email, decision, first_name) => ({
  recipientEmail: `${email}`,
  subject: 'Unifemga Credit Request Decisions',
  body: `<p>Hi ${first_name}<br> This is to notify you that your credit request has been ${decision}</p>`
});

const composeAdminCreditRequestDecisionEmail = (adminEmail, decision, fullname, unifemga_chapter, email) => ({
  recipientEmail: `${adminEmail}`,
  subject: 'Unifemga Credit Request Decisions',
  body: `<p>Hi Admin <br> This is to notify you that credit request of requester:<br> 
  <b>FULL NAME</b>: ${fullname}<br>
  <b>EMAIL ADDRESS</b>: ${email}<br>
  <b>CHAPTER</b>: ${unifemga_chapter}<br>has been ${decision}</p>`
});

const creditResolvers = {
  Query: {
    async getAllApprovedCreditRequestsBySCAO(_, {}, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const user = await User.findOne({ _id: id });
      if (user.role !== 'Steering Committee Credit Approving Officer') {
        throw new AuthenticationError('action not allowed');
      }
      try {
        const credits = await Credit.find({ SCAO_decision: 'approved' }).sort({ createdAt: -1 });
        return credits;
      } catch (e) {
        return {
          message: 'Something went wrong',
          status: 500
        };
      }
    },
    async getCreditRequestByChapter(_, {}, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const user = await User.findOne({ _id: id });
      if (user.role !== 'State Credit Approving Officer') {
        throw new AuthenticationError('action not allowed');
      }
      try {
        const credits = await Credit.find({ unifemga_chapter: user.unifemga_chapter }).sort({ createdAt: -1 });
        return credits;
      } catch (e) {
        return {
          message: 'Something went wrong',
          status: 500
        };
      }
    }
  },
  Mutation: {
    async approveOrRejectCreditRequestBySCCAO(_, { creditId, decision }, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const admin = await User.findOne({ _id: id });
      const credit = await Credit.findById(creditId);
      if (admin.role !== 'Steering Committee Credit Approving Officer') {
        throw new AuthenticationError('action not allowed');
      }
      if (creditId === '') {
        throw new Error('credit ID must be provided');
      }
      try {
        if (credit.id !== creditId) {
          throw new Error('credit request not found');
        }
        credit.SCCAO_decision = decision;
        credit.loan_application_status = decision;
        credit.save();
        const user = await User.findOne({ _id: credit.user });
        const email = user.email_address;
        const { first_name } = user;
        const userMailData = composeCreditRequestDecisionEmail(email, decision, first_name);
        sendEmail(transporter(), userMailData);
        const sysAdmin = await User.findOne({ role: 'System Administrator' });
        const adminEmail = sysAdmin.email_address;
        const { fullname } = credit;
        const { unifemga_chapter } = user;
        const adminMailData = composeAdminCreditRequestDecisionEmail(adminEmail, decision, fullname, unifemga_chapter, email);
        sendEmail(transporter(), adminMailData);
        return {
          status: 200,
          message: `Your credit request has finally been ${decision}`,
          SCCAO_decision: credit.SCCAO_decision,
          loan_application_status: credit.loan_application_status
        };
      } catch (e) {
        return {
          status: 500,
          message: 'Something went wrong'
        };
      }
    },
    async chapterApproveOrRejectCreditRequest(_, { creditId, decision }, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const admin = await User.findOne({ _id: id });
      const credit = await Credit.findById(creditId);
      if (admin.role !== 'State Credit Approving Officer' || credit.unifemga_chapter !== admin.unifemga_chapter) {
        throw new AuthenticationError('action not allowed');
      }
      if (creditId === '') {
        throw new Error('credit ID must be provided');
      }
      try {
        if (credit.id !== creditId) {
          throw new Error('credit request not found');
        }
        credit.SCAO_decision = decision;
        credit.save();
        return {
          status: 200,
          message: `Your credit request has been ${decision} by state approving officer`,
        };
      } catch (e) {
        return {
          status: 500,
          message: 'Unable to update registration status'
        };
      }
    },
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
          createdAt: new Date().toISOString()
        });
        const res = await newCredit.save().then(data => {
          Credit.findOne({ _id: data.id }).populate('user').then(result => {
            result.username = result.user.username;
            result.unifemga_chapter = result.user.unifemga_chapter;
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
