import { Book, books as mockBooks } from "./books";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for demo authentication
  location?: string;
  role: UserRole;
  createdAt: string;
}

export type BookStatus = "AVAILABLE" | "PENDING" | "ACCEPTED" | "EXCHANGED" | "SOLD" | "UNAVAILABLE";

export interface StoredBook extends Omit<Book, 'condition'> {
  condition: string;
  exchangeAvailable?: boolean;
  location?: string;
  ownerId?: string;
  status: BookStatus;
  createdAt: string;
}

export type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export interface BookRequest {
  id: string;
  bookId: string;
  requesterId: string;
  ownerId: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  userId: string;
  bookId: string;
}

// Initial default data if none exists
const initializeStorage = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("bookcycle_users")) {
    const defaultUser: User = {
      id: "demo-user-1",
      name: "Demo Student",
      email: "demo@bookcycle.com",
      password: "password123", // basic demo auth
      role: "student",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("bookcycle_users", JSON.stringify([defaultUser]));
  }

  if (!localStorage.getItem("bookcycle_books")) {
    const initializedBooks: StoredBook[] = mockBooks.map(b => ({
      ...b,
      ownerId: "demo-user-1",
      status: "AVAILABLE",
      exchangeAvailable: true,
      createdAt: new Date().toISOString()
    }));
    localStorage.setItem("bookcycle_books", JSON.stringify(initializedBooks));
  }

  if (!localStorage.getItem("bookcycle_requests")) {
    localStorage.setItem("bookcycle_requests", JSON.stringify([]));
  }

  if (!localStorage.getItem("bookcycle_favorites")) {
    localStorage.setItem("bookcycle_favorites", JSON.stringify([]));
  }
};

// Generic read/write helpers
const read = <T>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const write = <T>(key: string, data: T[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const storage = {
  init: initializeStorage,
  
  users: {
    get: () => read<User>("bookcycle_users"),
    set: (users: User[]) => write("bookcycle_users", users),
  },
  
  books: {
    get: () => read<StoredBook>("bookcycle_books"),
    set: (books: StoredBook[]) => write("bookcycle_books", books),
  },
  
  requests: {
    get: () => read<BookRequest>("bookcycle_requests"),
    set: (requests: BookRequest[]) => write("bookcycle_requests", requests),
  },

  favorites: {
    get: () => read<Favorite>("bookcycle_favorites"),
    set: (favorites: Favorite[]) => write("bookcycle_favorites", favorites),
  }
};

// --- Workflow Helper Functions ---

export const acceptRequest = (requestId: string, ownerId: string) => {
  const requests = storage.requests.get();
  const reqIndex = requests.findIndex(r => r.id === requestId && r.ownerId === ownerId);
  if (reqIndex === -1) return false;

  const req = requests[reqIndex];
  if (req.status !== "PENDING") return false;

  // Mark this request as ACCEPTED
  req.status = "ACCEPTED";
  req.updatedAt = new Date().toISOString();
  
  // Reject all other pending requests for this book
  for (let i = 0; i < requests.length; i++) {
    if (requests[i].bookId === req.bookId && requests[i].id !== requestId && requests[i].status === "PENDING") {
      requests[i].status = "REJECTED";
      requests[i].updatedAt = new Date().toISOString();
    }
  }
  
  storage.requests.set(requests);
  
  // Keep the book in PENDING state (reserved)
  return true;
};

export const rejectRequest = (requestId: string, ownerId: string) => {
  const requests = storage.requests.get();
  const reqIndex = requests.findIndex(r => r.id === requestId && r.ownerId === ownerId);
  if (reqIndex === -1) return false;

  const req = requests[reqIndex];
  if (req.status !== "PENDING") return false;

  req.status = "REJECTED";
  req.updatedAt = new Date().toISOString();
  storage.requests.set(requests);

  // If no other PENDING or ACCEPTED requests exist for this book, revert book to AVAILABLE
  const otherActive = requests.some(r => r.bookId === req.bookId && (r.status === "PENDING" || r.status === "ACCEPTED"));
  if (!otherActive) {
    const books = storage.books.get();
    const bIndex = books.findIndex(b => b.id === req.bookId);
    if (bIndex !== -1) {
      books[bIndex].status = "AVAILABLE";
      storage.books.set(books);
    }
  }
  
  return true;
};

export const completeExchange = (requestId: string, ownerId: string) => {
  const requests = storage.requests.get();
  const reqIndex = requests.findIndex(r => r.id === requestId && r.ownerId === ownerId);
  if (reqIndex === -1) return false;

  const req = requests[reqIndex];
  if (req.status !== "ACCEPTED") return false;

  req.status = "COMPLETED";
  req.updatedAt = new Date().toISOString();
  storage.requests.set(requests);

  // Mark book as EXCHANGED
  const books = storage.books.get();
  const bIndex = books.findIndex(b => b.id === req.bookId);
  if (bIndex !== -1) {
    books[bIndex].status = "EXCHANGED";
    storage.books.set(books);
  }
  
  return true;
};
