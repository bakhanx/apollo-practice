import { ApolloServer } from "apollo-server";
import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID
  }

  type Tweet {
    id: ID
    text: String
    author: User
  }
  type Query {
    allTweets: [Tweet]
    tweet(id: ID): Tweet
  }
  type Mutation {
    postTwwet(text: String, userId: ID): Tweet
    deleteTwwet(id:ID) : Boolean
  }
`;
// resolve
const resolvers = {
  Query: {
    allTweets: () => {
      id: 1;
      text: "hello";
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
