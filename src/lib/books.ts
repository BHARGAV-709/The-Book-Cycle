export type BookCondition = "Like New" | "Very Good" | "Good" | "Acceptable";

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  year: number;
  condition: BookCondition;
  language?: string;
  category: string;
  image: string;
  description?: string;
}

const img = {
  mockingbird: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
  orwell: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80",
  hobbit: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?auto=format&fit=crop&w=800&q=80",
  telugu: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
  code1: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  code2: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
  code3: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
  code4: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  classic: "https://images.unsplash.com/photo-1576872381149-7847515ce5d8?auto=format&fit=crop&w=800&q=80",
};

export const books: Book[] = [
  { id: "1", title: "To Kill a Mockingbird", author: "Harper Lee", price: 399, originalPrice: 799, year: 1960, condition: "Very Good", category: "classics", image: img.mockingbird },
  { id: "2", title: "1984", author: "George Orwell", price: 449, year: 1949, condition: "Good", category: "dystopian", image: img.orwell },
  { id: "3", title: "Pride and Prejudice", author: "Jane Austen", price: 299, year: 1813, condition: "Good", category: "romance", image: img.mockingbird },
  { id: "4", title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 499, originalPrice: 899, year: 1925, condition: "Very Good", category: "classics", image: img.orwell },
  { id: "5", title: "The Catcher in the Rye", author: "J.D. Salinger", price: 349, year: 1951, condition: "Good", category: "coming-of-age", image: img.classic },
  { id: "6", title: "Moby-Dick", author: "Herman Melville", price: 549, year: 1851, condition: "Acceptable", category: "classics", image: img.mockingbird },
  { id: "7", title: "Jane Eyre", author: "Charlotte Brontë", price: 299, year: 1847, condition: "Very Good", category: "classics", image: img.mockingbird },
  { id: "8", title: "The Hobbit", author: "J.R.R. Tolkien", price: 599, originalPrice: 999, year: 1937, condition: "Like New", category: "fantasy", image: img.hobbit },
  { id: "9", title: "Brave New World", author: "Aldous Huxley", price: 399, year: 1932, condition: "Good", category: "dystopian", image: img.orwell },
  { id: "10", title: "Frankenstein", author: "Mary Shelley", price: 349, year: 1818, condition: "Acceptable", category: "gothic", image: img.telugu },
  { id: "11", title: "The Lord of the Rings", author: "J.R.R. Tolkien", price: 999, year: 1954, condition: "Very Good", category: "fantasy", image: img.hobbit },
  { id: "12", title: "Crime and Punishment", author: "Fyodor Dostoevsky", price: 449, year: 1866, condition: "Good", category: "philosophical", image: img.classic },
  { id: "13", title: "మహాభారతం (Mahabharatam)", author: "నన్నయ (Nannaya)", price: 799, originalPrice: 1299, year: 2015, condition: "Like New", language: "Telugu", category: "telugu", image: img.telugu },
  { id: "14", title: "రామాయణం (Ramayanam)", author: "వాల్మీకి (Valmiki)", price: 699, originalPrice: 1199, year: 2010, condition: "Very Good", language: "Telugu", category: "telugu", image: img.mockingbird },
  { id: "15", title: "భాగవతం (Bhagavatam)", author: "పోతన (Pothana)", price: 599, originalPrice: 999, year: 2018, condition: "Good", language: "Telugu", category: "telugu", image: img.telugu },
  { id: "16", title: "అంధ్ర మహాభాగవతం", author: "బమ్మెర పోతన", price: 499, year: 2012, condition: "Good", language: "Telugu", category: "telugu", image: img.orwell },
  { id: "17", title: "గరుడ పురాణం (Garuda Puranam)", author: "పింగళి సూరన", price: 449, year: 2014, condition: "Very Good", language: "Telugu", category: "telugu", image: img.classic },
  { id: "18", title: "The C Programming Language", author: "Brian W. Kernighan, Dennis M. Ritchie", price: 399, originalPrice: 799, year: 1988, condition: "Good", category: "programming", image: img.code1 },
  { id: "19", title: "Python Crash Course", author: "Eric Matthes", price: 449, originalPrice: 899, year: 2019, condition: "Like New", category: "programming", image: img.code2 },
  { id: "20", title: "Effective Java", author: "Joshua Bloch", price: 549, originalPrice: 1099, year: 2018, condition: "Very Good", category: "programming", image: img.code3 },
  { id: "21", title: "HTML and CSS: Design and Build Websites", author: "Jon Duckett", price: 399, originalPrice: 799, year: 2011, condition: "Good", category: "web-development", image: img.code4 },
  { id: "22", title: "Node.js Design Patterns", author: "Mario Casciaro, Luciano Mammino", price: 499, originalPrice: 999, year: 2020, condition: "Like New", category: "programming", image: img.code3 },
  { id: "23", title: "C++ Primer", author: "Stanley B. Lippman", price: 599, originalPrice: 1199, year: 2012, condition: "Good", category: "programming", image: img.code2 },
];

export const featuredIds = ["1", "2", "3", "4", "8", "13", "14", "18", "19", "20"];
export const techIds = ["18", "19", "20", "21", "22", "23"];
export const teluguIds = ["13", "14", "15", "16", "17"];
export const classicsIds = ["5", "6", "7", "9", "10", "11", "12"];

export const categories = [
  { slug: "fiction", label: "Fiction", count: 12 },
  { slug: "classics", label: "Classics", count: 16 },
  { slug: "romance", label: "Romance", count: 2 },
  { slug: "fantasy", label: "Fantasy", count: 2 },
  { slug: "dystopian", label: "Dystopian", count: 2 },
  { slug: "telugu", label: "Telugu", count: 5 },
  { slug: "mythology", label: "Mythology", count: 5 },
  { slug: "programming", label: "Programming", count: 6 },
  { slug: "web-development", label: "Web Development", count: 2 },
  { slug: "philosophical", label: "Philosophical", count: 2 },
  { slug: "gothic", label: "Gothic", count: 1 },
  { slug: "coming-of-age", label: "Coming of Age", count: 1 },
  { slug: "poetry", label: "Poetry", count: 2 },
  { slug: "devotional", label: "Devotional", count: 2 },
];

export const getBook = (id: string) => books.find((b) => b.id === id);
export const booksByIds = (ids: string[]) => ids.map(getBook).filter((b): b is Book => !!b);
export const booksByCategory = (slug: string) => books.filter((b) => b.category === slug);
