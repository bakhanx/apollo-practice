import { ApolloServer } from "apollo-server";
import { gql } from "graphql-tag";

let tweets = [
  {
    id: "1",
    text: "first",
    userId: "2",
  },
  {
    id: "2",
    text: "second",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "kim",
    lastName: "A",
  },
  {
    id: "2",
    firstName: "Park",
    lastName: "B",
  },
];

const typeDefs = gql`
  """
  유저에 관한 정보
  """
  type User {
    """
    유저 아이디
    """
    id: ID!
    """
    성
    """
    firstName: String!
    """
    이름
    """
    lastName: String!
    """
    전체 이름
    """
    fullName: String!
  }
  """
  트윗 정보
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }

  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    movie(id: String!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;
// resolve
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(_, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      return users;
    },
    allMovies() {
      return fetch("https://yts.torrentbay.st/api/v2/list_movies.json")
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.torrentbay.st/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      if (!users.find((user) => user.id === userId))
        throw new Error("유저를 찾을 수 없습니다.");
      const newTweet = {
        id: String(tweets.length + 1),
        userId,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const findTweet = tweets.find((tweet) => tweet.id === id);
      if (!findTweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} and ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
