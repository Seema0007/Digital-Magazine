export interface Magazine {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  pdfUrl: string;
  category: 'science' | 'kannada' | 'newsletter' | 'general';
  totalPages?: number;
}

export interface CategoryInfo {
  id: 'science' | 'kannada' | 'newsletter' | 'general';
  name: string;
  description: string;
  icon: string;
}