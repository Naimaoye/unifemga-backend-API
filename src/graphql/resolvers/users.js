/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';

import User from '../../models/Users';
import { SECRET_KEY, senderEmail } from '../../config/config';
import {
  validateRegisterInput,
  validateLoginInput
} from '../../utils/validation';
import sendEmail from '../../utils/mailer';
import transporter from '../../utils/transporter';
import resetMailer from '../../utils/reset_mailer';

const composeEmailVerification = (email, origin, token) => ({
  recipientEmail: `${email}`,
  subject: 'Email verification',
  body: `<p>Your registration was successful. Please click on the link below to verify your email</p></br>
    <a href='${origin}/api/v1/users/verify/${token}'>click here to verify your email</a>`
});

const verifyToken = token => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
};

const constructResetEmail = (email_address, origin) => {
  const recipients = [email_address];
  const issued = Date.now();
  const expiryDate = parseInt(Date.now(), 10) + 3600000;
  const payload = { email_address, issued, expiryDate };
  const token = jwt.sign(payload, SECRET_KEY);
  const link = `${origin}/api/v1/users/reset/${token}`;
  const text = `
           <h2>Hi, there</h2>
           <p>you can reset your password <a href='${link}'>here</a></p>
    `;
  return {
    from: `Unifemga <${senderEmail}>`,
    to: [...recipients],
    subject: 'Unifemga Password Reset Link',
    html: text
  };
};

const usersResolvers = {
  Query: {
    hello: () => 'hello world!'
  },
  Mutation: {
    async sendForgotPasswordEmail(_, { email_address }, context) {
      const { origin } = context.req.headers;
      const emailOptions = constructResetEmail(email_address, origin);
      const user = await User.findOne({ email_address });
      if (!user) {
        return {
          status: 400,
          message: 'User not found'
        };
      }
      try {
        resetMailer(transporter(), emailOptions);
        return {
          status: 200,
          message: 'a password reset link has been sent to your email'
        };
      } catch (err) {
        return {
          status: 500,
          message: err
        };
      }
    },
    async forgotPasswordChange(_, { newPassword }, context) {
      const auth = context.req.headers.authorization;
      const token = auth.split('Bearer ')[1];
      console.log(token);
      const data = verifyToken(token);
      const hasExpired = data.expiryDate < Date.now();
      if (hasExpired) {
        return {
          status: 400,
          message: 'this link has expired'
        };
      }
      try {
        const { email_address } = data;
        const user = await User.findOne({ email_address });
        user.password = newPassword;
        user.save();
        console.log(user.password);
        return {
          status: 201,
          message: 'Password update successful'
        };
      } catch (err) {
        return {
          status: 500,
          message: err
        };
      }
    },
    async verify(_, { token }) {
      const { email_address } = verifyToken(token);
      if (!email_address) {
        return {
          message: 'Unable to complete verification',
          status: 500,
        };
      }
      const user = await User.findOne({ email_address });
      user.is_email_verified = true;
      user.save();
      return {
        message: 'Your email Address has been verified successfully',
        status: 200
      };
    },
    async login(_, { email_address, password }) {
      const { errors, valid } = validateLoginInput(email_address, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ email_address });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('Wrong credentials', { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }
      if (!user.is_email_verified) {
        errors.general = 'Email not verified';
        throw new UserInputError('Please verify your email to login');
      }
      const token = jwt.sign({
        id: user.id,
        email_address: user.email_address,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }, SECRET_KEY, { expiresIn: '24h' });
      return {
        ...user._doc,
        status: 200,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      {
        registerInput: {
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
          unifemga_chapter,
          home_phone_number,
          mobile_phone_number,
          business_phone_number,
          household_income_from_salaries,
          household_income_from_others,
          household_expenses,
          registration_status,
          is_email_verified,
          profile_photo,
          role
        }
      },
      context
    ) {
    // validate user data.
      const { valid, errors } = validateRegisterInput(
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
        home_phone_number,
        mobile_phone_number,
        business_phone_number,
        household_income_from_salaries,
        household_income_from_others,
        household_expenses,
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      // check for existing user.
      const user = await User.findOne({ email_address });
      if (user) {
        throw new UserInputError('EmailAddress already exist', {
          errors: {
            email_address: 'This emailAddress already exist',
            status: 409
          }
        });
      }
      // hash passwords and create token.
      // password = await bcrypt.hash(password, 12);
      try {
        const newUser = new User({
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
          unifemga_chapter,
          home_phone_number,
          mobile_phone_number,
          business_phone_number,
          household_income_from_salaries,
          household_income_from_others,
          household_expenses,
          profile_photo,
          registration_status,
          is_email_verified,
          role,
          createdAt: new Date().toISOString()
        });
        const res = await newUser.save();
        const token = jwt.sign({
          id: res.id,
          email_address: res.email_address,
          username: res.username,
          createdAt: res.createdAt
        }, SECRET_KEY);
        const { origin } = context.req.headers;
        const msg = 'Kindly confirm the link sent to your email account to complete your registration';
        const email = res.email_address;
        const mailData = composeEmailVerification(email, origin, token);
        sendEmail(transporter(), mailData);
        return {
          ...res._doc,
          status: 201,
          id: res._id,
          token,
          message: msg
        };
      } catch (error) {
        console.log(error);
        return {
          status: 500,
          error: 'database error'
        };
      }
    }
  }
};

export default usersResolvers;