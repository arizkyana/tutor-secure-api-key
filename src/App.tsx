import { FormEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  FilmIcon,
  MagnifyingGlassCircleIcon,
} from '@heroicons/react/24/outline';

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryValue, setQueryValue] = useState<string>();

  const refSearchForm = useRef() as any;

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api`, {
        action: 'now-playing',
      });
      const data = response.data;
      setMovies(data.results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error > ', error);
    }
  };

  const findMovie = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/search`, {
        query,
      });
      const data = response.data;
      setMovies(data.results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error > ', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formElm = refSearchForm.current as HTMLFormElement;
    const inputQueryElm = formElm.querySelector(
      'input[name=query]',
    ) as HTMLInputElement;

    const query = inputQueryElm.value;

    await findMovie(query);
    setQueryValue(query);
  };

  return (
    <div>
      <aside className="h-screen w-[15rem] fixed top-0 bottom-0 z-50 border-r bg-white">
        <div className="pl-6 py-6">
          <h1 className="font-bold text-2xl mb-5">Movie Shows</h1>
        </div>
        <div>
          <div className="px-6 mb-4 text-sm text-slate-500">Menu</div>
          <ul>
            <li className="relative active-menu">
              <a
                href="#"
                className="text-rose-500 font-semibold flex items-center justify-start space-x-1 text-sm pl-6"
              >
                <FilmIcon className="w-4 h-4" /> <span>Now Playing</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <section className="pl-[15rem] min-h-screen w-screen bg-slate-50">
        <div className="py-3 px-6">
          <div className="mb-6 py-3">
            <form
              ref={refSearchForm}
              className="w-1/3"
              onSubmit={handleSearch}
              noValidate
            >
              <div className="border rounded-full bg-white flex justify-start items-center">
                <span className="px-3">
                  <MagnifyingGlassCircleIcon className="w-6 h-6" />
                </span>
                <input
                  type="text"
                  placeholder="Find your favorite movie"
                  className="py-2 pl-1 pr-4 w-full rounded-full text-sm outline-none bg-transparent"
                  name="query"
                />
                <button
                  type="submit"
                  className="text-sm bg-rose-600 inline-block px-6 py-3 rounded-r-full text-white"
                >
                  Find
                </button>
              </div>
            </form>
          </div>
          {queryValue ? (
            <>
              <h1 className="text-lg font-semibold mb-3 inline-block mr-1">
                Result of
              </h1>
              <span className="text-rose-600 text-lg">{queryValue}</span>
            </>
          ) : (
            <h1 className="text-lg font-semibold mb-3">Now Playing</h1>
          )}
          {loading ? (
            <div className="w-full">
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 7 }, () => (
                  <div className="rounded-md h-[20rem] relative cursor-pointer bg-slate-400 animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {movies &&
                movies.length > 0 &&
                movies.map((item: Movie) => (
                  <div className="rounded-md h-[20rem] relative cursor-pointer">
                    <img
                      src={`${import.meta.env.VITE_BASE_IMAGE_URL}${
                        item.poster_path
                      }`}
                      className="h-full aspect-auto w-full object-cover rounded-md"
                    />
                    <div className="absolute bottom-0 left-0 text-white bg-slate-600/40 w-full h-full rounded-md p-3 flex flex-col justify-end items-start">
                      <h3 className="font-bold">{item.title}</h3>
                      <div>
                        <span className="text-xs">{item.release_date}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
