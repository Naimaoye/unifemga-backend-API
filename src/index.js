/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';

import { URI } from './config/config';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers/index';

const server = new ApolloServer({
  cors: {
    origin: '*',
    credentials: true
  },
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

mongoose.connect(URI, {
  useNewUrlParser: true
}).then(() => {
  console.log('MongoDB connected');
  return server.listen({ port: 5000 });
}).then(res => {
  console.log(`server running at ${res.url}`);
}).catch(err => console.log(err));
