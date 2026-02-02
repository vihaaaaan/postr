import { useState, useEffect } from "react";
import { MdSearch } from 'react-icons/md';
import { movieSearchWithValidImages, type MovieSearchResult } from "../services/tmdb/movieSearch";
import SearchResult from "./SearchResult";
import { PulseLoader } from 'react-spinners';


export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchResults = async () => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
      const search_results  = await movieSearchWithValidImages(query, 5)
      setResults(search_results)
      setIsLoading(false)
    }
    setIsLoading(true)
    const timeout_id = setTimeout(() => {
      fetchResults()
    }, 600)

    return () => {
      clearTimeout(timeout_id)
    }
  }, [query])
  

  return (
    <div className="w-full max-w-lg mx-auto relative">
      {/* Search input */}
      <div className={`bg-white border border-gray-300 shadow-lg ${query && query !== '' && !isLoading ? 'rounded-t-lg' : 'rounded-lg'}`}>
        <div className="relative flex items-center px-4 py-2">
          <MdSearch className="text-gray-400 text-xl mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 outline-none text-md bg-transparent"
          />
          {isLoading && (
            <PulseLoader color="#9ca3af" size={4} speedMultiplier={0.9} />
          )}
        </div>
      </div>

      {/* Results dropdown - Absolute positioned */}
      {query && query !== '' && !isLoading && (
        <div className="absolute top-full w-full rounded-b-lg overflow-hidden border border-t-0 border-gray-300 bg-black text-white text-sm shadow-lg z-10 
                        animate-[slideIn_0.3s_ease-out_forwards]">
          {results.length > 0 ? (
            results.map((movie) => (
              <SearchResult 
                key={movie.id} 
                movie={movie}
                onClick={() => console.log('Selected:', movie.title, movie.poster_url_w92)}
              />
            ))
          ) : (
            <div className="px-4 py-2">No results</div>
          )}
        </div>
      )}
    </div>
  );
}