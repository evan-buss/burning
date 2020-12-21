import axios from "axios";
import { clamp } from "lodash";
import React, { useEffect, useState, useRef } from "react";
import { useSprings, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
// import MovieCard from "../components/MovieCard";

export interface Movie {
  title: string;
  guid: string;
  rating: number;
  imdb: string;
  summary: string;
  tagline: string;
  poster: string;
  year: number;
}

const movies = [
  {
    title: "3 from Hell",
    guid: "com.plexapp.agents.imdb://tt8134742?lang=en",
    rating: null,
    imdb: "https://imdb.com/title/tt8134742?lang=en",
    summary: "Sequel to The Devil's Rejects.",
    tagline: "The Evil Returns",
    poster:
      "http://24.229.233.151:25619/library/metadata/8080/thumb/1589161716?X-Plex-Token=vMMxBYxPaUxGhkQcVsYD",
    year: 2019,
  },
  {
    title: "3:10 to Yuma",
    guid: "plex://movie/5d77682e2ec6b5001f6bb048",
    rating: null,
    imdb: null,
    summary:
      'In Arizona in the late 1800s, infamous outlaw Ben Wade and his vicious gang of thieves and murderers have plagued the Southern Railroad. When Wade is captured, Civil War veteran Dan Evans, struggling to survive on his drought-plagued ranch, volunteers to deliver him alive to the "3:10 to Yuma", a train that will take the killer to trial.',
    tagline: "Time waits for one man.",
    poster:
      "http://24.229.233.151:25619/library/metadata/11469/thumb/1606626222?X-Plex-Token=vMMxBYxPaUxGhkQcVsYD",
    year: 2007,
  },
  {
    title: "10 Things I Hate About You",
    guid: "com.plexapp.agents.imdb://tt0147800?lang=en",
    rating: 7.3,
    imdb: "https://imdb.com/title/tt0147800?lang=en",
    summary:
      "A pretty, popular teenager can't go out on a date until her ill-tempered older sister does.",
    tagline: "How do I loathe thee? Let me count the ways.",
    poster:
      "http://24.229.233.151:25619/library/metadata/8148/thumb/1589161716?X-Plex-Token=vMMxBYxPaUxGhkQcVsYD",
    year: 1999,
  },
  {
    title: "12 Angry Men",
    guid: "com.plexapp.agents.imdb://tt0050083?lang=en",
    rating: 8.9,
    imdb: "https://imdb.com/title/tt0050083?lang=en",
    summary:
      "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
    tagline: "Life is in their hands. Death is on their minds.",
    poster:
      "http://24.229.233.151:25619/library/metadata/9866/thumb/1594492734?X-Plex-Token=vMMxBYxPaUxGhkQcVsYD",
    year: 1957,
  },
  {
    title: "12 Years a Slave",
    guid: "com.plexapp.agents.imdb://tt2024544?lang=en",
    rating: 9.5,
    imdb: "https://imdb.com/title/tt2024544?lang=en",
    summary:
      "In the pre-Civil War United States, Solomon Northup, a free black man from upstate New York, is abducted and sold into slavery. Facing cruelty as well as unexpected kindnesses Solomon struggles not only to stay alive, but to retain his dignity. In the twelfth year of his unforgettable odyssey, Solomon’s chance meeting with a Canadian abolitionist will forever alter his life.",
    tagline: "The extraordinary true story of Solomon Northup",
    poster:
      "http://24.229.233.151:25619/library/metadata/1/thumb/1589161737?X-Plex-Token=vMMxBYxPaUxGhkQcVsYD",
    year: 2013,
  },
];

const SwipePage: React.FC = () => {
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [index, setIndex] = useState(0);

  // useEffect(() => {
  //   async function loadMovies() {
  //     const res = await axios.get("swipe");
  //     setMovies(res.data);
  //   }

  //   loadMovies();
  // }, []);

  const index = useRef(0);
  const [props, set] = useSprings(movies.length, (i) => ({
    x: i * window.innerWidth,
    scale: 1,
    display: "block",
  }));

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], distance, cancel }) => {
      if (active && distance > window.innerWidth / 2) {
        cancel();
        index.current = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          movies.length - 1
        );
      }

      set((i) => {
        if (i < index.current - 1 || i > index.current + 1) {
          return { display: "none" };
        }
        const x = (i - index.current) * window.innerWidth + (active ? mx : 0);
        const scale = active ? 1 - distance / window.innerWidth / 2 : 1;
        return { x, scale, display: "block" };
      });
    }
  );

  return (
    <>
      {props.map(({ x, display, scale }, i) => (
        <animated.div
          {...bind()}
          key={i}
          style={{ display: display as any, x }}
        >
          <animated.div
            style={{
              scale,
              backgroundImage: `url(${movies[i].poster})` as any,
            }}
          />
        </animated.div>
      ))}
    </>
  );
};

// if (movies.length === 0) return <h1>Loading</h1>;

// return (
//   <MovieCard
//     onClick={() => setIndex((i) => (i + 1) % movies.length)}
//     movie={movies[index]}
//   />
// <Container>
//   {movies.map((movie) => (
//     <MovieCard movie={movie} />
//   ))}
// </Container>
//   );
// };

export default SwipePage;
