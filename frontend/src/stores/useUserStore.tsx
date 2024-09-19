import create from 'zustand';

// Define User interface
interface User {
  email: string;
  name: string;
}

// Define UserStore interface
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// Helper function to get user from localStorage
const getUserFromLocalStorage = (): User | null => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Zustand store definition
export const useUserStore = create<UserStore>((set) => ({
  user: getUserFromLocalStorage(), // Initialize user from localStorage
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user)); // Persist user to localStorage
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem('user'); // Clear user from localStorage
    localStorage.removeItem('token'); // Optionally, clear token too
    set({ user: null });
  },
}));
