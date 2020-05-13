/* eslint-disable no-empty-pattern */
/* eslint-disable arrow-body-style */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
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
    <a href='${origin}/verifyAdmin?token=${token}'>click here to verify your email and set password</a>`
});

const composeRegistrationStatusEmail = (email, decision) => ({
  recipientEmail: `${email}`,
  subject: 'Your Registration Status',
  body: `<p>Hi <br> This is to notify you that your registration has been ${decision}</p>`
});

const verifyToken = token => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
};


const adminResolvers = {
  Query: {
    // TODO: admin can get all admin
    // eslint-disable-next-line no-empty-pattern
    async getAdmins(_, {}, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const user = await User.findOne({ _id: id });
      if (user.role !== 'System Administrator') {
        throw new AuthenticationError('action not allowed');
      }
      try {
        const admins = await User.find({ $and: [{ role: { $ne: 'user' } }, { role: { $ne: 'System Administrator' } }] }).sort({ createdAt: -1 });
        return admins;
      } catch (err) {
        throw new Error('Something went wrong');
      }
    },
    async  getRegisteredUsers(_, {}, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const user = await User.findOne({ _id: id });
      if (user.role !== 'System Administrator') {
        throw new AuthenticationError('action not allowed');
      }
      try {
        const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
        return users;
      } catch (e) {
        return {
          message: 'Something went wrong',
          status: 500
        };
      }
    },
    async getRegisteredUsersByChapter(_, {}, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const user = await User.findOne({ _id: id });
      if (user.role !== 'Member Registration Approving Officer') {
        throw new AuthenticationError('action not allowed');
      }
      try {
        const users = await User.find({
          $and: [
            { role: 'user' },
            { unifemga_chapter: user.unifemga_chapter }
          ]
        }).sort({ createdAt: -1 });
        return users;
      } catch (e) {
        return {
          message: 'Something went wrong',
          status: 500
        };
      }
    },
    async getUserDetails(_, {}, context) {
      const user = checkAuth(context);
      const { id } = user;
      try {
        const userDetails = await User.findOne({ _id: id });
        return userDetails;
      } catch (e) {
        throw new AuthenticationError('Could not get user credentials');
      }
    },
  },
  Mutation: {
    async approveOrRejectMemberRegistration(_, { userId, decision }, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const admin = await User.findOne({ _id: id });
      if (admin.role !== 'Member Registration Approving Officer') {
        throw new AuthenticationError('action not allowed');
      }
      if (userId === '') {
        throw new Error('user ID must be provided');
      }
      try {
        const user = await User.findById(userId);
        if (user.id !== userId) {
          throw new Error('user not found');
        }
        user.registration_status = decision;
        user.save();
        const email = user.email_address;
        const mailData = composeRegistrationStatusEmail(email, decision);
        sendEmail(transporter(), mailData);
        return {
          status: 200,
          message: `Registration has been ${decision}`,
          registration_status: user.registration_status
        };
      } catch (e) {
        return {
          status: 500,
          message: 'Unable to update registration status'
        };
      }
    },
    async editAdmin(_, {
      adminId,
      adminInput: {
        email_address,
        first_name,
        surname,
        unifemga_chapter,
        role,
      }
    }, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const user = await User.findOne({ _id: id });
      if (user.role !== 'System Administrator') {
        throw new AuthenticationError('action not allowed');
      }
      const { valid, errors } = validateCreateAdminInput(
        email_address,
        first_name,
        surname,
        unifemga_chapter,
        role
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      if (adminId === '') {
        throw new Error('admin ID must be provided');
      }
      try {
        const admin = await User.findById(adminId);
        if (admin.id !== adminId) {
          console.log(user.id);
          throw new Error('admin not found');
        }
        admin.email_address = email_address;
        admin.first_name = first_name;
        admin.surname = surname;
        admin.unifemga_chapter = unifemga_chapter;
        admin.role = role;
        admin.save();
        return {
          status: 200,
          message: 'admin details updated successfully',
          email_address: admin.email_address,
          first_name: admin.first_name,
          surname: admin.surname,
          unifemga_chapter: admin.unifemga_chapter,
          role: admin.role
        };
      } catch (err) {
        return {
          status: 500,
          error: 'something went wrong'
        };
      }
    },
    async deleteAdmin(_, { adminId }, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const user = await User.findOne({ _id: id });
      if (user.role !== 'System Administrator') {
        console.log(user.role);
        throw new AuthenticationError('action not allowed');
      }
      if (adminId === '') {
        throw new AuthenticationError('admin ID must not be empty');
      }
      try {
        const admin = await User.findById(adminId);
        if (admin.id === adminId) {
          await admin.delete();
          admin.save();
          return {
            status: 200,
            message: 'admin deleted successfully'
          };
        }
      } catch (err) {
        return {
          status: 400,
          message: 'admin does not exist'
        };
      }
    },
    async verifyAdmin(_, { token, password }) {
      if (!token || !password) {
        throw new AuthenticationError('token and password must be provided !');
      }
      try {
        const { id } = verifyToken(token);
        const user = await User.findOne({ _id: id });
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
      adminInput: {
        email_address,
        first_name,
        surname,
        role,
        unifemga_chapter,
        profile_photo,
        is_email_verified,
      }
    }, context) {
      const checkLoggedIn = checkAuth(context);
      const { id } = checkLoggedIn;
      const admin = await User.findOne({ _id: id });
      if (admin.role !== 'System Administrator') {
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
        unifemga_chapter,
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
          unifemga_chapter,
          profile_photo,
          is_email_verified,
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
