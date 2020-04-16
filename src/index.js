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
const port = process.env.PORT || 3000;

mongoose.connect(URI, {
  useNewUrlParser: true
}).then(() => {
  console.log('MongoDB connected');
  return server.listen(port);
}).then(res => {
  console.log(`server running at ${res.url}`);
}).catch(err => console.log(err));
