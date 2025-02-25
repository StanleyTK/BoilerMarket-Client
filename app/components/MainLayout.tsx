// MainLayout.tsx
import React, { createContext, useState, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ThemeProvider } from "./ThemeContext";
import { getAuth } from 'firebase/auth';
import { fetchAllListings, fetchListingByKeyword } from "../service/fetch-listings";
import { getApp } from "firebase/app";

interface SearchContextProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  listings: any[];
  setListings: React.Dispatch<React.SetStateAction<any[]>>;
  handleSearch: () => Promise<void>;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};


const MainLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<any[]>([]);

  const handleSearch = async () => {
    const auth = getAuth(getApp());
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const idToken = await currentUser.getIdToken();
    try {
      let fetchedListings;
      if (searchQuery === '') {
        fetchedListings = await fetchAllListings(idToken);
      } else {
        fetchedListings = await fetchListingByKeyword(searchQuery, idToken);
      }
      setListings(fetchedListings);
      console.log('Fetched listings:', fetchedListings);
    } catch (e) {
      console.error('Failed to fetch listings:', e);
    }
  };

  return (
    <ThemeProvider>
      <SearchContext.Provider value={{ searchQuery, setSearchQuery, listings, setListings, handleSearch }}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
          <Navbar />
          <Footer />
        </div>
      </SearchContext.Provider>
    </ThemeProvider>
  );
};

export default MainLayout;
