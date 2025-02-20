import React, { useState } from 'react';
import { Book, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import MagazineViewer from './components/MagazineViewer';
import MagazineList from './components/MagazineList';
import { magazines, categories } from './data/magazines';
import { Magazine, CategoryInfo } from './types';

function App() {
  const [selectedMagazine, setSelectedMagazine] = useState(magazines[0]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo['id']>('science');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredMagazines = magazines.filter(mag => mag.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative w-80 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Book className="w-6 h-6" />
            Param Magazines
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">CATEGORIES</h2>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <MagazineList 
          magazines={filteredMagazines}
          selectedMagazine={selectedMagazine}
          onSelect={setSelectedMagazine}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-hidden">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{selectedMagazine.title}</h2>
              <p className="text-sm text-gray-500">
                {categories.find(c => c.id === selectedMagazine.category)?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const currentIndex = filteredMagazines.findIndex(m => m.id === selectedMagazine.id);
                  if (currentIndex > 0) {
                    setSelectedMagazine(filteredMagazines[currentIndex - 1]);
                  }
                }}
                disabled={filteredMagazines[0].id === selectedMagazine.id}
                className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  const currentIndex = filteredMagazines.findIndex(m => m.id === selectedMagazine.id);
                  if (currentIndex < filteredMagazines.length - 1) {
                    setSelectedMagazine(filteredMagazines[currentIndex + 1]);
                  }
                }}
                disabled={filteredMagazines[filteredMagazines.length - 1].id === selectedMagazine.id}
                className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <MagazineViewer magazine={selectedMagazine} />
      </div>
    </div>
  );
}

export default App;