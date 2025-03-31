import React from "react";
import { useSearch } from "../components/MainLayout";
import { ListingCard } from "~/components/ListingCard";
import { useTheme } from "~/components/ThemeContext";
import "./search.css";

const Search: React.FC = () => {
  const { listings, sortBy, setSortBy, sortDirection, setSortDirection, categoryFilter, setCategoryFilter, priceFilter, setPriceFilter, dateFilter, setDateFilter, locationFilter, setLocationFilter } = useSearch();
  const { theme } = useTheme();

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleCategoryFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(event.target.value);
  }

  const handlePriceFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceFilter(event.target.value);
  }

  const handleDateFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(event.target.value);
  }

  const handleLocationFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationFilter(event.target.value);
  }

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div
      className={`search-container ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="sort-label">
              Sort:
            </label>
            <select id="sort" className="sort-select" value={sortBy} onChange={handleSortChange}>
              <option value="dateListed">Date</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
              <option value="location">Location</option>
            </select>
            <button
              className="sort-direction"
              onClick={toggleSortDirection}
            >
              {sortDirection === "asc" ? "▲" : "▼"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-category" className="filter-label">
              Category:
            </label>
            <select id="filter-category" className="filter-select" value={categoryFilter} onChange={handleCategoryFilterChange}>
              <option value="">All</option>
              <option value="electronics">Electronics</option>
              <option value="appliances">Applicances</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>

            <label htmlFor="filter-price" className="filter-label">
              Price Range:
            </label>
            <select id="filter-price" className="filter-select" value={priceFilter} onChange={handlePriceFilterChange}>
              <option value="">Any</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-500">$200 - $500</option>
            </select>

            <label htmlFor="filter-date" className="filter-label">
              Date Listed:
            </label>
            <select id="filter-date" className="filter-select" value={dateFilter} onChange={handleDateFilterChange}>
              <option value="">Any</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>

            <label htmlFor="filter-location" className="filter-label">
              Location:
            </label>
            <select id="filter-location" className="filter-select" value={locationFilter} onChange={handleLocationFilterChange}>
              <option value="">Any</option>
              <option value="chauncy">Chauncy Area</option>
              <option value="west campus">West Campus</option>
              <option value="ross ade">Ross Ade Stadium</option>
              <option value="lafayette">Lafayette</option>
            </select>
          </div>
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
