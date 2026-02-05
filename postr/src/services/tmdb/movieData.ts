import { tmdbApiCLient } from "../../api/tmdb/client";

export interface MovieData {
    title: string;
    release_date: Date | null;
    director: string | null;
    writers: string[];
    actors: string[];
}

// Movie details response from /movie/{movie_id}
interface MovieDetailsResponse {
    title: string;
    release_date: string;
    // Add other fields you might need later
}

// Credits response from /movie/{movie_id}/credits
interface MovieCreditsResponse {
    cast: CastMember[];
    crew: CrewMember[];
}

interface CastMember {
    name: string;
    order: number;
    character: string;
}

interface CrewMember {
    name: string;
    job: string;
    department: string;
}

export async function getMovieData(movie_id: number): Promise<MovieData> {
    // Fetch movie details and credits in parallel
    const [details_response, credits_response] = await Promise.all([
        tmdbApiCLient<MovieDetailsResponse>(`/movie/${movie_id}`),
        tmdbApiCLient<MovieCreditsResponse>(`/movie/${movie_id}/credits`)
    ]);

    // Extract director from crew
    const director = credits_response.crew.find(
        member => member.job === "Director"
    );

    // Extract writers from crew (screenwriters, writers, story writers)
    const writer_jobs = ["Writer", "Screenplay", "Story", "Screenstory"];
    const writers = credits_response.crew
        .filter(member => writer_jobs.includes(member.job))
        .map(member => member.name);
    
    // Remove duplicates from writers
    const unique_writers = [...new Set(writers)];

    // Get top actors (sorted by order, typically top 5-10)
    const actors = credits_response.cast
        .sort((a, b) => a.order - b.order)
        .slice(0, 10) // Get top 10 actors
        .map(actor => actor.name);

    // Parse release date
    const release_date = /^\d{4}-\d{2}-\d{2}$/.test(details_response.release_date)
        ? new Date(details_response.release_date)
        : null;

    return {
        title: details_response.title,
        release_date,
        director: director ? director.name : null,
        writers: unique_writers,
        actors
    };
}
