import usersResolvers from './users';
import adminResolvers from './admin';

const resolvers = {
  Query: {
    ...adminResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...adminResolvers.Mutation
  }
};

export default resolvers;
