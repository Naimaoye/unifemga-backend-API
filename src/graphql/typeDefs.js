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
  home_address: String!
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
  home_address: String
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
    unifemga_chapter: String!
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

  input CreditRequest {
  fullname: String!
  date_of_birth: String!
  fullname_of_nextOfKin: String!
  personal_bank_account_name: String!
  personal_bank_account_number: String!
  personal_bank: String!
  marital_status: String!
  source_of_salary: String!
  number_of_children: Int
  formal_employment_status: String!
  company_tax_ID: String!
  personal_tax_ID: String!
  annual_salary: String
  existing_loan: String!
  frequency_of_payment: String!
  existing_loan_information: String!
  home_address: String!
  home_ownership_status: String!
  email_address: String!
  guarantors_fullname: String!
  guarantors_phone_number: String!
  guarantors_email_address: String!
  guarantors_home_address: String!
  business_name: String!
  business_reg_number: String!
  date_of_incorporation: String!
  business_sector: String!
  stage_of_business: String
  customer_segments: String
  value_proposition: String
  revenue_streams: String!
  cost_structure: String!
  channels: String!
  key_partners: String
  key_activities: String!
  key_resources: String!
  customer_relationship: String!
  SCAO_decision: String
  SCCAO_decision: String
  loan_application_status: String
  loan_start_date: String
  loan_due_date: String
  loan_repayment_status: String
  createdAt: String
  username: String
  unifemga_chapter: String
  user: String
  }

  type Credit {
    id: ID!
    username: String!
    fullname: String
    guarantors_fullname: String!
    guarantors_phone_number: String!
    loan_application_status: String
    SCAO_decision: String
    SCCAO_decision: String
    createdAt: String
    status: Int
    message: String
  }


type Query {
    getAdmins: [Admins!]
    getRegisteredUsers: [User!]
    getRegisteredUsersByChapter: [User!]
    getUserDetails: UserDetails!
    getCreditRequestByChapter: [Credit!]
    getAllApprovedCreditRequestsBySCAO: [Credit!]
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
    approveOrRejectMemberRegistration(userId: String!, decision: String!): User!
    createCreditRequest(creditInput: CreditRequest): Credit!
    chapterApproveOrRejectCreditRequest(creditId: String!, decision: String!): Credit!
    approveOrRejectCreditRequestBySCCAO(creditId: String!, decision: String!): Credit
}
`;

export default typeDefs;
