import { tmdbApiCLient } from "../../api/tmdb/client";
import { movieContainsImages } from "./movieImages";

export interface MovieSearchResult {
    id: number;
    title: string | null;
    release_date: Date | null;
    overview: string | null;
    poster_url_w92: string | null;
    tmdb_avg_rating: number | null;
}

type MovieSearchResponseRaw = {
    results: MovieResultRaw[];
    total_results: number;
    page: number;
    total_pages: number;
}

interface MovieResultRaw {
  id: number;
  title: string;
  release_date: string;
  overview: string | null;
  poster_path: string | null;
  vote_average: number | null;
}


// Return type that includes pagination info
interface MovieSearchResponse {
    results: MovieSearchResult[];
    page: number;
    total_pages: number;
    total_results: number;
}

export async function movieSearch(query: string, page: number = 1): Promise<MovieSearchResponse> {
    const url_path = `/search/movie?query=${query}&language=en-US&page=${page}`
    const search_results_raw = await tmdbApiCLient<MovieSearchResponseRaw>(url_path)
    
    const search_results: MovieSearchResult[] = search_results_raw.results.map(movie => ({
        id: movie.id,
        title: movie.title || null,
        release_date: /^\d{4}-\d{2}-\d{2}$/.test(movie.release_date) ? new Date(movie.release_date) : null,
        overview: movie.overview || null,
        poster_url_w92: movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : null,
        tmdb_avg_rating: movie.vote_average || null
    }))

    return {
        results: search_results,
        page: search_results_raw.page,
        total_pages: search_results_raw.total_pages,
        total_results: search_results_raw.total_results
    }
}

export async function movieSearchWithValidImages(
    query: string, 
    num_results: number = 5,
    min_images: number = 1
): Promise<MovieSearchResult[]> {
    const MAX_PAGES_TO_CHECK = 5;
    const valid_results: MovieSearchResult[] = [];
    let current_page = 1;
    
    while (valid_results.length < num_results && current_page <= MAX_PAGES_TO_CHECK) {
        // Fetch page of results
        const search_response = await movieSearch(query, current_page);
        
        // Check if we've run out of results
        if (search_response.results.length === 0 || current_page > search_response.total_pages) {
            break;
        }
        
        // Check images for each movie in parallel
        const results_with_image_check = await Promise.all(
            search_response.results.map(async (movie) => {
                const has_images = await movieContainsImages(movie.id, min_images);
                return has_images ? movie : null;
            })
        );
        
        // Filter out null results (movies without enough images)
        const valid_movies_from_page = results_with_image_check.filter(
            (movie): movie is MovieSearchResult => movie !== null
        );
        
        // Only add number of movies neccesary to hit amount requested by user
        const remaining_needed = num_results - valid_results.length;
        valid_results.push(...valid_movies_from_page.slice(0, remaining_needed));
        
        // Break early if we have enough results
        if (valid_results.length >= num_results) {
            break;
        }
        
        // Move to next page
        current_page++;
    }
    
    // Return only the requested number of results
    return valid_results;
}