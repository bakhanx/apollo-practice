import { gql, useQuery } from "@apollo/client";
import { getClient } from "./api/apolloClient";
import { useEffect, useState } from "react";
import Link from "next/link";

const GET_MOVIES = gql`
  query getMovies {
    allMovies {
      id
      title
    }
    allTweets {
      id
      text
      author {
        id
        firstName
        lastName
        fullName
      }
    }
  }
`;

type MovieType = {
  id: string;
  title: string;
};

type TweetType = {
  id: string;
  text: string;
};

const Home = async () => {
  const client = getClient();
  const { allMovies, allTweets } = await client
    .query({
      query: GET_MOVIES,
    })
    .then((res) => res.data);

  return (
    <main className="flex min-h-screen flex-col   p-24">
      {!allMovies && !allTweets && <div>로딩중...</div>}
      <h1 className="text-2xl font-bold">영화</h1>
      {allMovies.map((movie: MovieType) => (
        <li key={movie.id}>
          <Link href={`/movies/${movie.id}`}>Title : {movie.title}</Link>
        </li>
      ))}

      <div className="pt-4">트윗</div>
      {allTweets.map((tweet: TweetType) => (
        <div key={tweet.id}>Text : {tweet.text}</div>
      ))}
    </main>
  );
};

export default Home;
