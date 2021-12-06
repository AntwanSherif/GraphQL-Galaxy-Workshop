import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } from 'graphql';

export const USERS = [
  {
    id: 1,
    name: 'Antwan',
    email: 'antwansherif@gmail.com'
  },
  {
    id: 2,
    name: 'Hassan',
    email: 'hassan@gmail.com'
  }
];

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a user',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'This is the root query',
  fields: () => ({
    hello: {
      type: GraphQLString,
      description: 'Just saying hello',
      resolve: () => 'Hello world!'
    },
    getUsers: {
      type: new GraphQLList(UserType),
      description: 'List all users',
      resolve: () => USERS
    },
    getUser: {
      type: UserType,
      description: 'Get a single user',
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => USERS.find(user => user.id === args.id)
    }
  })
});

const schema = new GraphQLSchema({
  query: RootQueryType
});

// Initialize express app
const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(4001, () => {
  console.log(`Server is running on localhost:4001/graphql`);
});
