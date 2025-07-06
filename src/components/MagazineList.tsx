import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Grid, List, Search, X } from 'lucide-react';
import { Magazine } from '../types';

interface MagazineListProps {
  magazines: Magazine[];
  selectedMagazine: Magazine;
  onSelect: (magazine: Magazine) => void;
}

function MagazineList({ magazines, selectedMagazine, onSelect }: MagazineListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-adjust view mode based on screen size
      if (width < 768) {
        setViewMode('grid'); // Grid works better on mobile
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter magazines based on search term
  const filteredMagazines = magazines.filter(magazine =>
    magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    magazine.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grid column classes based on screen size
  const getGridColumns = () => {
    if (isMobile) return 'grid-cols-2';
    if (isTablet) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className="overflow-y-auto h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Your Library</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {filteredMagazines.length} of {magazines.length} magazines
            </p>
          </div>
          
          {/* Desktop Controls */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Search magazines"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Mobile Search Toggle */}
          {isMobile && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search magazines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {filteredMagazines.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">
              {searchTerm ? 'No magazines found matching your search.' : 'No magazines available.'}
            </p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className={`grid ${getGridColumns()} gap-3 sm:gap-4`}>
                {filteredMagazines.map((magazine) => (
                  <button
                    key={magazine.id}
                    onClick={() => onSelect(magazine)}
                    className={`text-left hover:bg-white rounded-lg p-2 sm:p-3 transition-all duration-200 hover:shadow-md ${
                      selectedMagazine.id === magazine.id ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="w-full aspect-[3/4] mb-2 sm:mb-3 overflow-hidden rounded-lg relative group">
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                        <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base line-clamp-2">
                      {magazine.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{magazine.date}</span>
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-2 sm:space-y-3">
                {filteredMagazines.map((magazine) => (
                  <button
                    key={magazine.id}
                    onClick={() => onSelect(magazine)}
                    className={`w-full p-3 sm:p-4 text-left hover:bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
                      selectedMagazine.id === magazine.id 
                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg relative group">
                        <img
                          src={magazine.coverImage}
                          alt={magazine.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                          <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2">
                          {magazine.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{magazine.date}</span>
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile View Mode Toggle (Bottom) */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-10 bg-white rounded-full shadow-lg p-1 border border-gray-200">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? (
              <List className="w-5 h-5" />
            ) : (
              <Grid className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default MagazineList;
