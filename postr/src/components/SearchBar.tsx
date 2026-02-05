import { useState, useEffect } from "react";
import { MdSearch } from 'react-icons/md';
import { movieSearchWithValidImages, type MovieSearchResult } from "../services/tmdb/movieSearch";
import SearchResult from "./SearchResult";
import { PulseLoader } from 'react-spinners';
import { generatePoster } from "../services/pdf/generatePoster";


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
    <div className="w-full max-w-xl mx-auto relative pt-32">
      {/* Search input */}
      <div className={`bg-white border border-gray-200 shadow-lg ${query && query !== '' && !isLoading ? 'rounded-t-lg' : 'rounded-lg'}`}>
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
            <PulseLoader color="#2a3a52" size={4} speedMultiplier={0.9} />
          )}
        </div>
      </div>

      {/* Results dropdown - Absolute positioned */}
      {query && query !== '' && !isLoading && (
        <div className="absolute top-full w-full rounded-b-lg overflow-hidden border border-t-0 border-gray-200 bg-brand text-white text-sm shadow-lg z-10 
                        animate-[slideIn_0.3s_ease-out_forwards]">
          {results.length > 0 ? (
            results.map((movie) => (
              <SearchResult 
                key={movie.id} 
                movie={movie}
                onClick={() => generatePoster(movie.id)}
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