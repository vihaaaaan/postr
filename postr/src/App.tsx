import SearchBar from "./components/SearchBar"
import Sidebar from "./components/Sidebar";

function App() {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar/>
            <div className="flex-1 overflow-auto">
                <SearchBar/>
            </div>
        </div>
    );
}

export default App;
