import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql' ;

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'This is the root query',
    fields: () => ({
        hello: {
            type: GraphQLString,
            description: 'Just saying hello',
            resolve: () => 'Hello world!'
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType
});


// Initialize express app
const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4001, () => {
    console.log(`Server is running on localhost:4001/graphql`);
});