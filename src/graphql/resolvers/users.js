/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createWriteStream, mkdir } from 'fs';
import { UserInputError, AuthenticationError } from 'apollo-server';

import User from '../../models/Users';
import { SECRET_KEY } from '../../config/config';
import {
  validateRegisterInput,
  validateLoginInput,
  validateEditInput
} from '../../utils/validation';
import sendEmail from '../../utils/mailer';
import transporter from '../../utils/transporter';
import { checkAuth } from '../../utils/checkAuth';

const composeEmailVerification = (email, origin, token) => ({
  recipientEmail: `${email}`,
  subject: 'Email verification',
  body: `<p>Your registration was successful. Please click on the link below to verify your email</p></br>
    <a href='${origin}/verify?token=${token}'>click here to verify your email</a>`
});

const verifyToken = token => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
};

const constructResetEmail = (email_address, id, origin) => {
  const recipients = `${email_address}`;
  const issued = Date.now();
  const expiryDate = parseInt(Date.now(), 10) + 3600000;
  const payload = { id, issued, expiryDate };
  const token = jwt.sign(payload, SECRET_KEY);
  const link = `${origin}/reset?token=${token}`;
  const text = `
           <h2>Hi, there</h2>
           <p>you can reset your password <a href='${link}'>here</a></p>
    `;
  return {
    recipientEmail: recipients,
    subject: 'Unifemga Password Reset Link',
    body: text
  };
};

const usersResolvers = {
  // TODO: user account settings
  // TODO: upload profile picture
  Mutation: {
    async userProfileSettings(_,
      {
        editUser: {
          username,
          password,
          email_address,
          first_name,
          surname,
          middle_name,
          mobile_phone_number,
        }
      },
      context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const { valid, errors } = validateEditInput(
        username,
        password,
        email_address,
        first_name,
        surname,
        middle_name,
        mobile_phone_number
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      try {
        const user = await User.findOne({ _id: id });
        user.username = username;
        user.password = password;
        user.email_address = email_address;
        user.first_name = first_name;
        user.surname = surname;
        user.middle_name = middle_name;
        user.mobile_phone_number = mobile_phone_number;
        user.save();
        return {
          message: 'Profile update successful',
          status: 200,
          email_address: user.email_address,
          username: user.username,
          profile_photo: user.profile_photo
        };
      } catch (e) {
        throw new Error('Unable to update profile');
      }
    },
    async uploadImage(_, { file }, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const user = await User.findOne({ _id: id });
      mkdir('UploadedImages', { recursive: true }, err => {
        if (err) throw err;
      });
      try {
        const { createReadStream, filename } = await file;
        const path = `UploadedImages/${filename}`;
        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path))
            .on('close', res)
        );
        user.profile_photo = filename;
        user.save();
        return {
          status: 200,
          message: 'Profile photo uploaded successfully',
          profile_photo: user.profile_photo
        };
      } catch (err) {
        return {
          status: 500,
          message: 'Database error'
        };
      }
    },
    async resendVerifyEmail(_, { email_address }, context) {
      const { origin } = context.req.headers;
      const user = await User.findOne({ email_address });
      if (!user) {
        return {
          status: 400,
          message: 'User not found'
        };
      }
      try {
        const token = jwt.sign({
          id: user.id,
        }, SECRET_KEY);
        const mailData = composeEmailVerification(email_address, origin, token);
        sendEmail(transporter(), mailData);
        return {
          status: 200,
          message: 'a link has been sent to your email address'
        };
      } catch (e) {
        return {
          status: 500,
          message: 'Something went wrong'
        };
      }
    },
    async resendForgotPasswordEmail(_, { email_address }, context) {
      const { origin } = context.req.headers;
      const user = await User.findOne({ email_address });
      if (!user) {
        return {
          status: 400,
          message: 'User not found'
        };
      }
      try {
        const { id } = user;
        const emailOptions = constructResetEmail(email_address, id, origin);
        sendEmail(transporter(), emailOptions);
        return {
          status: 200,
          message: 'a password reset link has been sent to your email'
        };
      // eslint-disable-next-line arrow-body-style
      } catch (err) {
        return {
          status: 500,
          message: err
        };
      }
    },
    async sendForgotPasswordEmail(_, { email_address }, context) {
      const { origin } = context.req.headers;
      const user = await User.findOne({ email_address });
      if (!user) {
        return {
          status: 400,
          message: 'User not found'
        };
      }
      try {
        const { id } = user;
        const emailOptions = constructResetEmail(email_address, id, origin);
        sendEmail(transporter(), emailOptions);
        return {
          status: 200,
          message: 'a password reset link has been sent to your email'
        };
      // eslint-disable-next-line arrow-body-style
      } catch (err) {
        return {
          status: 500,
          message: err
        };
      }
    },
    async forgotPasswordChange(_, { newPassword }, context) {
      const data = checkAuth(context);
      const hasExpired = data.expiryDate < Date.now();
      if (hasExpired) {
        return {
          status: 400,
          message: 'the password reset link has expired'
        };
      }
      try {
        const { id } = data;
        const user = await User.findOne({ _id: id });
        user.password = newPassword;
        user.save();
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
      if (!token) {
        throw new AuthenticationError('token must be provided !');
      }
      try {
        const { id } = verifyToken(token);
        const user = await User.findOne({ _id: id });
        user.is_email_verified = true;
        user.save();
        return {
          message: 'Your email Address has been verified successfully',
          status: 200
        };
      } catch (err) {
        throw new AuthenticationError('Invalid/expired token');
      }
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
      const token = jwt.sign({
        id: user.id,
      }, SECRET_KEY, { expiresIn: '10h' });
      if (!user.is_email_verified) {
        return {
          ...user._doc,
          status: 200,
          id: user._id,
          message: 'please verify your email address',
          token,
        };
      }
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
        return {
          status: 500,
          error: 'database error'
        };
      }
    }
  }
};

export default usersResolvers;
