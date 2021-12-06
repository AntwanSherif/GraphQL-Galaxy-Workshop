import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList
} from 'graphql';

// add dummy users data
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

// add dummy todos
const TODOS = [
  {
    id: 1,
    userId: 1,
    task: 'Learn GraphQL',
    completed: true
  },
  {
    id: 2,
    userId: 1,
    task: 'Create a GraphQL API',
    completed: false
  },
  {
    id: 3,
    userId: 2,
    task: 'learn React',
    completed: false
  }
];

// define Todos type
const TodosType = new GraphQLObjectType({
  name: 'Todos',
  description: 'These are a list of user todos',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    userId: { type: GraphQLNonNull(GraphQLInt) },
    task: { type: GraphQLString },
    completed: { type: GraphQLBoolean }
  })
});

// define User type
export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a user',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    todos: {
      type: new GraphQLList(TodosType),
      resolve: user => TODOS.filter(todo => todo.userId === user.id)
    }
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

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'This is the root mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      description: 'Add a new user',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const user = {
          id: USERS.length + 1,
          name: args.name,
          email: args.email
        };

        USERS.push(user);
        return user;
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
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
