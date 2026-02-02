
export async function tmdbApiCLient<T>(endpoint: string): Promise<T>{

    const TMDB_READ_ACCESS_TOKEN: string = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN
    const root_url: string = 'https://api.themoviedb.org/3'
    const options = {
        method: 'GET',
        headers: {
            Authorization:`Bearer ${TMDB_READ_ACCESS_TOKEN}`,
            accept: 'application/json'
        }
    }

    const response = await fetch(root_url + endpoint, options)
    const data = await response.json()
    return data


}