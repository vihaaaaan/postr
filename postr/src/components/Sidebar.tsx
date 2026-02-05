import { useState } from 'react';
import { MdChevronLeft, MdSearch, MdHistory, MdSettings } from 'react-icons/md';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: MdSearch, label: 'Search', active: true, shortcut: '(⌘)-K'},
    { icon: MdHistory, label: 'Recent', active: false, shortcut: ''},
  ];

  return (
    <div 
      className={`sticky top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <h1 className="text-2xl font-normal text-gray-900 font-serif">
            postr
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
          aria-label="Toggle sidebar"
        >
          <MdChevronLeft 
            className={`text-gray-600 text-xl transition-transform duration-300 ${
              isOpen ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-2 mt-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 mb-1 justify-between ${
              item.active
                ? 'bg-[#2a3a52] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className='flex gap-4'>
                <item.icon className="text-xl flex-shrink-0" />
                {isOpen && (<span className="text-sm font-medium ">{item.label}</span>)}
            </div>
            <div>
                {isOpen && (<span className="text-sm font-medium">{item.shortcut}</span>)}
            </div>

          </button>
        ))}
      </nav>

      {/* Footer - Settings */}
      <div className="absolute bottom-0 w-full border-t border-gray-200">
        <button
          className="w-full flex items-center gap-3 px-3 py-4 text-[#0f172a]"
        >
          <MdSettings className="text-xl flex-shrink-0 ml-2" />
          {isOpen && (
            <span className="text-sm font-medium">Settings</span>
          )}
        </button>
      </div>
    </div>
  );
}
