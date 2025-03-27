import React from "react";
import { useSearch } from "../components/MainLayout";
import { ListingCard } from "~/components/ListingCard";
import { useTheme } from "~/components/ThemeContext";
import "./search.css";

const Search: React.FC = () => {
  const { listings, sortBy, setSortBy, sortDirection, setSortDirection } = useSearch();
  const { theme } = useTheme();

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div
      className={`search-container ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        }`}
    >
      <div className="p-6">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="sort-label">
            Sort:
          </label>
          <select id="sort" className="sort-select" value={sortBy} onChange={handleSortChange}>
            <option value="dateListed">Date</option>
            <option value="price">Price</option>
          </select>
          <button
            className="sort-direction"
            onClick={toggleSortDirection}
          >
            {sortDirection === "asc" ? "▲" : "▼"}
          </button>
        </div>
      </div>


      {listings.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
          {listings.map((listing, index) => (
            <ListingCard key={index} listing={listing} />
          ))}
        </div>
      ) : (
        <p>No listings found.</p>
      )}
    </div>
  );
};

export default Search;
