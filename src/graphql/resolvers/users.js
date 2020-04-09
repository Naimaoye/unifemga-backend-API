/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';

import User from '../../models/Users';
import { SECRET_KEY } from '../../config/config';
import {
  validateRegisterInput,
  validateLoginInput
} from '../../../utils/validation';

const usersResolvers = {
  Query: {
    hello: () => 'hello world!'
  },
  Mutation: {
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
        email_address: user.email_address,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }, SECRET_KEY, { expiresIn: '24h' });
      return {
        ...user._doc,
        status: 200,
        id: user._id,
        token
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
      password = await bcrypt.hash(password, 12);
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
        return {
          ...res._doc,
          status: 201,
          id: res._id,
          token
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
