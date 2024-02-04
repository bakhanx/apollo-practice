import { getClient } from "@/app/api/apolloClient";
import { gql, useQuery } from "@apollo/client";
import React, { ButtonHTMLAttributes, MouseEventHandler } from "react";

type ParamseType = {
  params: {
    movieId: string;
  };
};
type MovieType = {
  id: number;
  title: string;
  year: number;
  isLiked: boolean;
};
type MovieResponse = {
  movie: MovieType;
};

const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
      year
      isLiked @client
    }
  }
`;

const MovieDetail = async ({ params }: ParamseType) => {
  // client, server 나누기
  const client = getClient();
  const { data, loading } = await client.query<MovieResponse>({
    query: GET_MOVIE,
    variables: {
      movieId: params.movieId,
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    client.cache.writeFragment({
      id: `Movie:${params.movieId}`,
      fragment: gql`
        fragment MovieFragment on Movie {
          isLiked
        }
      `,
      data: {
        isLiked: true,
      },
    });
  };

  return (
    <div>
      {loading && <div>로딩중...</div>}
      <div>ID : {data.movie.id}</div>
      <div>Title : {data.movie.title}</div>
      <div>Year : {data.movie.year}</div>
      <button onClick={handleClick}>
        {data.movie.isLiked ? "Unlike" : "Like"}
      </button>
    </div>
  );
};

export default MovieDetail;
