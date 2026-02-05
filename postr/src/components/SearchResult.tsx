import { type MovieSearchResult } from "../services/tmdb/movieSearch";
import { MdCalendarToday, MdStar } from 'react-icons/md';

interface SearchResultProps {
  movie: MovieSearchResult;
  onClick?: () => void;
}

export default function SearchResult({ movie, onClick }: SearchResultProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.getFullYear().toString();
  };

  const formatRating = (rating: number | null) => {
    if (!rating) return "N/A";
    return rating.toFixed(1);
  };

  return (
    <div
      onClick={onClick}
      className="flex gap-3 py-3 px-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800 last:border-b-0"
    >
      {/* Poster */}
      {movie.poster_url_w92 ? (
        <div className="flex-shrink-0">
          <img
            src={movie.poster_url_w92}
            alt={movie.title || "Movie poster"}
            className="w-12 h-16 object-cover rounded"
          />
        </div>
      ) :
        <div className="flex-shrink-0 w-12 h-16 object-cover rounded bg-gray-400"></div>
      }

      {/* Movie Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-white mb-1">
          {movie.title || "Untitled"}
        </h3>
        <div className="flex items-start gap-3 text-xs text-gray-400">
          {movie.release_date && (
            <span className="flex items-center gap-1">
              <MdCalendarToday className="w-3 h-3" />
              {formatDate(movie.release_date)}
            </span>
          )}
          {movie.tmdb_avg_rating && (
            <span className="flex items-start gap-1">
              <MdStar className="w-3 h-3" />
              {formatRating(movie.tmdb_avg_rating)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
