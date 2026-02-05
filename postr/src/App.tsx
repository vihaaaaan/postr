import SearchBar from "./components/SearchBar"
import Sidebar from "./components/Sidebar";
import WelcomeModal from "./components/WelcomeModal";


function App() {
    
    return (
        <>
            <WelcomeModal />
            <div className="min-h-screen bg-gray-50 flex">
                <Sidebar/>
                <div className="flex-1 overflow-auto">
                    <SearchBar/>
                </div>
            </div>

        </>
    );
}

export default App;
