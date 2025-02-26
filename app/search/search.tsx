import React from "react";
import { useSearch } from "../components/MainLayout";
import { ListingCard } from "~/components/ListingCard";
import './search.css';

const Search: React.FC = () => {
    const { listings } = useSearch();

    return (
        <div className="search-container">
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