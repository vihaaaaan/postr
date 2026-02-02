import SearchBar from "./components/SearchBar"


function App() {

    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
            accept: 'application/json'
        }
    };

    fetch('https://api.themoviedb.org/3/authentication', options)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));
    
    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-8">
                <SearchBar/>
            </div>

        </>
    );
}

export default App;
