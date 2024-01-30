import { ApolloServer } from "apollo-server";
import { gql } from "graphql-tag";
const typeDefs = gql `
  type User {
    id: ID
  }

  type Tweet {
    id: ID
    text: String
    author: User
  }
  type Query {
    allTweet: [Tweet]
  }
`;
const resolvers = {
    Query: {
        allTweet: () => {
            id: 1;
            text: "hello";
        },
    },
};
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});
