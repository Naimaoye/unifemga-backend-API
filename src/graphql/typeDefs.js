import { gql } from 'apollo-server';

const typeDefs = gql`
input UserInput {
  username: String!
  password: String!
  email_address: String!
  first_name: String!
  surname: String!
  middle_name: String!
  marital_status: String!
  gender: String!
  oau_matric_number: String!
  year_of_graduation: String!
  course_of_study: String!
  bvn: String!
  unifemga_member: String!
  unifemga_chapter: String!
  home_phone_number: String
  mobile_phone_number: String!
  business_phone_number: String
  household_income_from_salaries: String!
  household_income_from_others: String!
  household_expenses: String!
  profile_photo: String
  registration_status: String
  is_email_verified: Boolean
  role: String
  createdAt: String
}

type User {
    id: ID!
    email_address: String!
    token: String!
    username: String!
    profile_photo: String!
    role: String!
    status: Int!
    registration_status: String
    message: String
    createdAt: String!
}

type Status {
    status: Int!
    message: String!
}

type Query {
    hello: String!
}

type Mutation {
    register(registerInput: UserInput): User!
    login(email_address: String!, password: String!): User!
    verify(token: String): Status
    sendForgotPasswordEmail(email_address: String!): Status!
    forgotPasswordChange(newPassword: String!): Status!
}
`;

export default typeDefs;
