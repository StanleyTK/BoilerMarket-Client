// MainLayout.tsx
import React, { createContext, useState, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ThemeProvider } from "./ThemeContext";
import { getAuth } from 'firebase/auth';
import { fetchAllListings } from "../service/fetch-listings";
import { getApp } from "firebase/app";

interface SearchContextProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  listings: any[];
  setListings: React.Dispatch<React.SetStateAction<any[]>>;
  handleSearch: () => Promise<void>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  sortDirection: "asc" | "desc";
  setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  priceFilter: string;
  setPriceFilter: React.Dispatch<React.SetStateAction<string>>;
  locationFilter: string;
  setLocationFilter: React.Dispatch<React.SetStateAction<string>>;
  dateFilter: string;
  setDateFilter: React.Dispatch<React.SetStateAction<string>>;
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
  const [sortBy, setSortBy] = useState('dateListed');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const handleSearch = async () => {
    const auth = getAuth(getApp());
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const idToken = await currentUser.getIdToken();
    try {
      let fetchedListings;
      fetchedListings = await fetchAllListings(idToken, sortBy, sortDirection, categoryFilter, dateFilter, priceFilter, locationFilter, searchQuery);
      setListings(fetchedListings);
      console.log('Fetched listings:', fetchedListings);
    } catch (e) {
      console.error('Failed to fetch listings:', e);
    }
  };

  return (
    <ThemeProvider>
      <SearchContext.Provider value={{
        searchQuery,
        setSearchQuery,
        listings,
        setListings,
        handleSearch,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        categoryFilter,
        setCategoryFilter,
        priceFilter,
        setPriceFilter,
        dateFilter,
        setDateFilter,
        locationFilter,
        setLocationFilter
      }}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
          <Navbar />
          <Footer />
        </div>
      </SearchContext.Provider>
    </ThemeProvider>
  );
};

export default MainLayout;
