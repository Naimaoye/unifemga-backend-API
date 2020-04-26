/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError, AuthenticationError } from 'apollo-server';

import User from '../../models/Users';
import { SECRET_KEY } from '../../config/config';
import { checkAuth } from '../../utils/checkAuth';
import {
  validateCreateAdminInput,
} from '../../utils/validation';
import sendEmail from '../../utils/mailer';
import transporter from '../../utils/transporter';

const composeEmailVerification = (email, origin, token) => ({
  recipientEmail: `${email}`,
  subject: 'Email verification',
  body: `<p>Your registration was successful. Please click on the link below to verify your email</p></br>
    <a href='${origin}/verify/${token}'>click here to verify your email</a>`
});

const verifyToken = token => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
};


const adminResolvers = {
  Query: {
    // TODO: admin can get all admin
    async getAdmins() {
      try {
        const admins = await User.find().sort({ createdAt: -1 })
          .filter(admin => admin.role !== '' && admin.role !== 'superAdmin');
        return admins;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    // TODO: admin can delete admin
    // TODO: admin can edit admin
    // TODO: Account settings
    // TODO: Upload profile photo
    async editAdmin(_, {
      adminId,
      email_address,
      first_name,
      surname,
      role,
    }, context) {
      const admin = checkAuth(context);
      if (admin.role !== 'superAdmin') {
        console.log(admin.role);
        throw new AuthenticationError('action not allowed');
      }
      try {
        const user = await User.findById(adminId);
        if (user.id === adminId) {
          console.log(user.id);
          user.email_address = email_address;
          user.first_name = first_name;
          user.surname = surname;
          user.role = role;
          user.save();
          return {
            status: 200,
            message: 'admin details updated successfully'
          };
        }
      } catch (err) {
        return {
          status: 500,
          error: 'something went wrong'
        };
      }
    },
    async deleteAdmin(_, { adminId }, context) {
      const admin = checkAuth(context);
      if (admin.role !== 'superAdmin') {
        console.log(admin.role);
        throw new AuthenticationError('action not allowed');
      }
      try {
        const user = await User.findById(adminId);
        if (user.id === adminId) {
          console.log(user.id);
          await user.delete();
          user.save();
          return {
            status: 200,
            message: 'admin deleted successfully'
          };
        }
      } catch (err) {
        return {
          status: 500,
          error: 'something went wrong'
        };
      }
    },
    async verifyAdmin(_, { token, password }) {
      if (!token || !password) {
        throw new AuthenticationError('token and password must be provided !');
      }
      try {
        const { email_address } = verifyToken(token);
        const user = await User.findOne({ email_address });
        user.is_email_verified = true;
        user.password = password;
        user.save();
        return {
          message: 'Your email Address has been verified and password saved successfully',
          status: 200
        };
      } catch (error) {
        throw new AuthenticationError('Invalid/expired token');
      }
    },
    async createAdmin(_, {
      email_address,
      first_name,
      surname,
      role,
      profile_photo,
      is_email_verified,
    }, context) {
      const admin = checkAuth(context);
      if (admin.role !== 'superAdmin') {
        console.log(admin.role);
        return {
          status: 409,
          message: 'You are not authorized'
        };
      }
      const { valid, errors } = validateCreateAdminInput(
        email_address,
        first_name,
        surname,
        role
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
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
          email_address,
          first_name,
          surname,
          role,
          profile_photo,
          is_email_verified,
          createdAt: new Date().toISOString()
        });
        const res = await newUser.save();
        const token = jwt.sign({
          id: res.id,
          email_address: res.email_address,
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
      } catch (err) {
        return {
          status: 500,
          error: 'database error'
        };
      }
    }
  },
};

export default adminResolvers;
