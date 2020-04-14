import usersResolvers from './users';

const resolvers = {
  Query: {
    ...usersResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation
  }
};

export default resolvers;
