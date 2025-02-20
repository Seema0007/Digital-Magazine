import { Magazine, CategoryInfo } from '../types';

export const categories: CategoryInfo[] = [
  {
    id: 'science',
    name: 'Science Magazines',
    description: 'Explore the latest in science and technology',
    icon: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop'
  },
  {
    id: 'kannada',
    name: 'ಕನ್ನಡ ಪತ್ರಿಕೆಗಳು',
    description: 'Kannada language magazines and publications',
    icon: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop'
  },
  {
    id: 'newsletter',
    name: 'Newsletters',
    description: 'Monthly newsletters and updates',
    icon: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop'
  },
  // {
  //   id: 'general',
  //   name: 'General',
  //   description: 'Other publications and magazines',
  //   icon: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop'
  // }
];

export const magazines: Magazine[] = [
  {
    id: 'June 2023',
    title: 'June 2023',
    date: 'June 2023',
    category: 'science',
    coverImage: '/magazines/Science/s1.png',
    pdfUrl: '/magazines/Science/s1.pdf'
  },
  {
    id: 'May 2023',
    title: 'May 2023',
    date: 'May 2023',
    category: 'science',
    coverImage: '/magazines/Science/s2.png',
    pdfUrl: '/magazines/Science/s2.pdf'
  },
  {
    id: 'April 2023',
    title: 'April 2023',
    date: 'April 2023',
    category: 'science',
    coverImage: '/magazines/Science/s3.png',
    pdfUrl: '/magazines/Science/s3.pdf'
  },
  {
    id: 'kannada-2024-02',
    title: 'June 2023',
    date: 'June 2023',
    category: 'kannada',
    coverImage: '/magazines/Kannada/k1.png',
    pdfUrl: '/magazines/Kannada/k1.pdf'
  },
  {
    id: 'kannada-2024-03',
    title: 'July 2023',
    date: 'July 2023',
    category: 'kannada',
    coverImage: '/magazines/Kannada/k2.png',
    pdfUrl: '/magazines/Kannada/k2.pdf'
  },
 
  {
    id: 'newsletter-2024-02',
    title: 'June Newsletter',
    date: 'June 2023',
    category: 'newsletter',
    coverImage: '/magazines/Newsletter/n1.png',
    pdfUrl: '/magazines/Newsletter/n1.pdf'
  },


  {
    id: 'newsletter-2024-01',
    title: 'May Newsletter',
    date: 'May 2023',
    category: 'newsletter',
    coverImage: '/magazines/Newsletter/n2.png',
    pdfUrl: '/magazines/Newsletter/n2.pdf'
  },

  {
    id: 'newsletter-2024-03',
    title: 'April Newsletter',
    date: 'April 2023',
    category: 'newsletter',
    coverImage: '/magazines/Newsletter/n3.png',
    pdfUrl: '/magazines/Newsletter/n3.pdf'
  },
 
 
 
];