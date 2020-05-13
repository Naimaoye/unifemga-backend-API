import usersResolvers from './users';
import adminResolvers from './admin';
import creditResolvers from './credit-request';

const resolvers = {
  Query: {
    ...adminResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...adminResolvers.Mutation,
    ...creditResolvers.Mutation
  }
};

export default resolvers;
