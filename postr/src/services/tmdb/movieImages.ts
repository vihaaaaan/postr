import { tmdbApiCLient } from "../../api/tmdb/client";

export interface MovieImage {
    aspect_ratio: number;
    height: number | null;
    width: number | null;
    url: string,
}

type MovieImagesResponseRaw = {
    backdrops: BackdropResultRaw[]
}

interface BackdropResultRaw {
    aspect_ratio: number,
    height: number,
    file_path: string,
    width: number,
}

export async function getImages(movie_id: number): Promise<MovieImage[]> {
    const url_path = `/movie/${movie_id}/images`
    const movie_img_results_raw = await tmdbApiCLient<MovieImagesResponseRaw>(url_path)
    const movie_backdrops_raw = movie_img_results_raw.backdrops
    if (movie_backdrops_raw.length) {
        const movie_backdrops_validated: MovieImage[] = movie_backdrops_raw.map((img) => ({
            aspect_ratio: img.aspect_ratio,
            height: img.height || null,
            width: img.width || null,
            url: `https://image.tmdb.org/t/p/original${img.file_path}`,
        }))
        return movie_backdrops_validated
    } else {
        return []
    }
}

export async function movieContainsImages(movie_id: number, min_images: number = 1): Promise<boolean> {
    const url_path = `/movie/${movie_id}/images`
    const movie_img_results_raw = await tmdbApiCLient<MovieImagesResponseRaw>(url_path)
    const movie_backdrops_raw = movie_img_results_raw.backdrops
    return movie_backdrops_raw.length >= min_images
}