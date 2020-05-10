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
    first_name: String!
    surname: String!
    unifemga_chapter: String!
    profile_photo: String!
    role: String!
    status: Int!
    registration_status: String
    message: String
    createdAt: String!
}

type UserDetails {
  id: ID!
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

type Status {
    status: Int!
    message: String!
}
input UserEdit {
    email_address: String!
    first_name: String!
    surname: String!
    username: String!
    password: String!
    middle_name: String!
    mobile_phone_number: String!
}
input AdminInput {
  first_name: String!
  surname: String!
  email_address: String!
  role: String!
  unifemga_chapter: String!
  profile_photo: String
  is_email_verified: Boolean
  createdAt: String
}

type Admin {
    id: ID!
    role: String!
    token: String!
    email_address: String!
    profile_photo: String!
    first_name: String!
    unifemga_chapter: String!
    surname: String!
    status: Int!
    message: String
    createdAt: String!
}

type Admins {
    id: ID!
    surname: String!
    first_name: String!
    email_address: String!
    role: String!
    createdAt: String!
}

type File {
    id: ID!
    filename: String!
    mimetype: String!
    path: String!
    user: ID
    message: String
    status: Int
  }

type Query {
    getAdmins: [Admins!]
    getRegisteredUsers: [User!]
    getUserDetails: UserDetails!
}

type Mutation {
    register(registerInput: UserInput): User!
    login(email_address: String!, password: String!): User!
    verify(token: String): Status
    resendVerifyEmail(email_address: String!): Status
    sendForgotPasswordEmail(email_address: String!): Status!
    resendForgotPasswordEmail(email_address: String!): Status!
    forgotPasswordChange(newPassword: String!): Status!
    createAdmin(adminInput: AdminInput): Admin!
    verifyAdmin(token: String!, password: String!): Admin!
    deleteAdmin(adminId: ID!): Status!
    editAdmin(adminId: ID!, adminInput: AdminInput): Status!
    uploadFile(file: Upload!): File
    userProfileSettings(editUser: UserEdit!): User!
}
`;

export default typeDefs;
