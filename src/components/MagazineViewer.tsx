import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, Bookmark, Layout, List, X, Eye, Menu } from 'lucide-react';
import { Magazine } from '../types';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface MagazineViewerProps {
  magazine: Magazine;
}

interface Bookmark {
  page: number;
  title: string;
  timestamp: number;
}

function MagazineViewer({ magazine }: MagazineViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem(`bookmarks-${magazine.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [thumbnailPages, setThumbnailPages] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'single' | 'double'>('single');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem(`bookmarks-${magazine.id}`, JSON.stringify(bookmarks));
  }, [bookmarks, magazine.id]);

  // Generate thumbnail pages
  useEffect(() => {
    if (numPages) {
      const pages = [];
      for (let i = 1; i <= numPages; i += 4) {
        pages.push(i);
      }
      setThumbnailPages(pages);
    }
  }, [numPages]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setCurrentPage(p => Math.max(p - (viewMode === 'double' ? 2 : 1), 1));
      } else if (event.key === 'ArrowRight') {
        setCurrentPage(p => Math.min(p + (viewMode === 'double' ? 2 : 1), numPages || 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages, viewMode]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-adjust scale based on screen size
      if (width < 768) {
        setScale(0.6);
        setViewMode('single'); // Force single view on mobile
      } else if (width < 1024) {
        setScale(0.8);
      } else {
        setScale(1);
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Document load handlers
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setIsLoading(false);
    setError('Please make sure you have placed your PDF files in the public/magazines folder.');
  }

  // Toggle bookmark for the current page
  function toggleBookmark() {
    const existingBookmark = bookmarks.find(b => b.page === currentPage);
    if (existingBookmark) {
      setBookmarks(bookmarks.filter(b => b.page !== currentPage));
    } else {
      const newBookmark = {
        page: currentPage,
        title: `Page ${currentPage}`,
        timestamp: Date.now(),
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
  }

  const isCurrentPageBookmarked = bookmarks.some(b => b.page === currentPage);

  // Calculate responsive sidebar width
  const sidebarWidth = isMobile ? 'w-full' : isTablet ? 'w-64' : 'w-80';

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-100 overflow-hidden relative flex">
      {/* Mobile Menu Overlay */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMobileMenu(false)} />
      )}

      {/* Sidebar for Thumbnails and Bookmarks */}
      {(showThumbnails || showBookmarks) && (
        <div className={`${sidebarWidth} bg-white border-r border-gray-200 flex flex-col ${
          isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300' : ''
        } ${isMobile && !showMobileMenu ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-sm sm:text-base">
              {showThumbnails ? 'Thumbnails' : 'Bookmarks'}
            </h3>
            <button
              onClick={() => {
                setShowThumbnails(false);
                setShowBookmarks(false);
                setShowMobileMenu(false);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {showThumbnails && (
              <div className="space-y-3 sm:space-y-4">
                {thumbnailPages.map(pageNum => (
                  <div
                    key={pageNum}
                    className={`cursor-pointer transition-all ${
                      currentPage === pageNum ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      if (isMobile) setShowMobileMenu(false);
                    }}
                  >
                    <Document file={magazine.pdfUrl}>
                      <Page
                        pageNumber={pageNum}
                        scale={isMobile ? 0.2 : 0.3}
                        className="shadow-sm"
                        loading={
                          <div className="w-full h-20 sm:h-32 bg-gray-100 animate-pulse" />
                        }
                      />
                    </Document>
                    <p className="text-xs text-center mt-1">Page {pageNum}</p>
                  </div>
                ))}
              </div>
            )}

            {showBookmarks && (
              <div className="space-y-2">
                {bookmarks.length === 0 ? (
                  <p className="text-gray-500 text-sm">No bookmarks yet</p>
                ) : (
                  bookmarks
                    .sort((a, b) => a.page - b.page)
                    .map(bookmark => (
                      <button
                        key={bookmark.timestamp}
                        onClick={() => {
                          setCurrentPage(bookmark.page);
                          if (isMobile) setShowMobileMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded hover:bg-gray-50 ${
                          currentPage === bookmark.page ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="font-medium text-sm">{bookmark.title}</div>
                        <div className="text-xs text-gray-500">
                          Page {bookmark.page}
                        </div>
                      </button>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 p-2 flex justify-between items-center">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium">
              Page {currentPage} of {numPages}
            </div>
            <button
              onClick={toggleBookmark}
              className={`p-2 hover:bg-gray-100 rounded-lg ${
                isCurrentPageBookmarked ? 'text-blue-500' : ''
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Desktop Top Controls */}
        {!isMobile && (
          <div className="absolute top-4 right-4 z-10 flex flex-col sm:flex-row gap-2">
            <div className="bg-white rounded-lg shadow-md flex">
              <button
                onClick={() => {
                  setShowThumbnails(true);
                  setShowBookmarks(false);
                }}
                className={`p-2 hover:bg-gray-100 rounded-l-lg ${
                  showThumbnails ? 'bg-gray-100' : ''
                }`}
                title="Show thumbnails"
              >
                <Layout className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => {
                  setShowBookmarks(true);
                  setShowThumbnails(false);
                }}
                className={`p-2 hover:bg-gray-100 border-l border-gray-200 ${
                  showBookmarks ? 'bg-gray-100' : ''
                }`}
                title="Show bookmarks"
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={toggleBookmark}
                className={`p-2 hover:bg-gray-100 border-l border-gray-200 rounded-r-lg ${
                  isCurrentPageBookmarked ? 'text-blue-500' : ''
                }`}
                title="Toggle bookmark"
              >
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md flex">
              <button
                onClick={() => setScale(s => Math.min(s + 0.1, 2))}
                className="p-2 hover:bg-gray-100 rounded-l-lg"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setScale(s => Math.max(s - 0.1, 0.3))}
                className="p-2 hover:bg-gray-100 border-l border-gray-200"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {!isMobile && (
                <button
                  onClick={() => setViewMode(mode => (mode === 'single' ? 'double' : 'single'))}
                  className="p-2 hover:bg-gray-100 border-l border-gray-200 rounded-r-lg"
                  title="Toggle view mode"
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <div className={`h-full flex items-center justify-center overflow-auto ${
          isMobile ? 'pt-12' : ''
        }`}>
          {isLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm sm:text-base">Loading magazine...</span>
            </div>
          )}
          {error ? (
            <div className="text-center p-4 sm:p-8 mx-4">
              <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
            </div>
          ) : (
            <Document
              file={magazine.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm sm:text-base">Loading page...</span>
                </div>
              }
            >
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2 sm:gap-4 p-2 sm:p-4`}>
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  loading={
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-sm sm:text-base">Loading page...</span>
                    </div>
                  }
                  className="shadow-lg max-w-full"
                />
                {viewMode === 'double' && !isMobile && currentPage < (numPages || 0) && (
                  <Page
                    pageNumber={currentPage + 1}
                    scale={scale}
                    loading={
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-sm sm:text-base">Loading page...</span>
                      </div>
                    }
                    className="shadow-lg max-w-full"
                  />
                )}
              </div>
            </Document>
          )}
        </div>

        {/* Navigation Buttons */}
        {numPages && (
          <>
            {/* Left button */}
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className={`absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-white shadow-lg rounded-full hover:bg-gray-100 disabled:opacity-50 ${
                isMobile ? 'mt-6' : ''
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            
            {/* Right button */}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
              disabled={currentPage >= numPages}
              className={`absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-white shadow-lg rounded-full hover:bg-gray-100 disabled:opacity-50 ${
                isMobile ? 'mt-6' : ''
              }`}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Mobile Bottom Controls */}
        {isMobile && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-md flex">
            <button
              onClick={() => setScale(s => Math.min(s + 0.1, 2))}
              className="p-3 hover:bg-gray-100 rounded-l-lg"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => setScale(s => Math.max(s - 0.1, 0.3))}
              className="p-3 hover:bg-gray-100 border-l border-gray-200"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setShowThumbnails(true);
                setShowBookmarks(false);
                setShowMobileMenu(true);
              }}
              className="p-3 hover:bg-gray-100 border-l border-gray-200 rounded-r-lg"
              title="Show thumbnails"
            >
              <Layout className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MagazineViewer;
