import React from "react";
import { useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import Listings from '../components/TopListings'
import { fetchAllListings, fetchListingByKeyword } from "../service/fetch-listings";
import { getApp } from "firebase/app";

import './search.css';


const Search: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [listings, setListings] = useState<any[]>([]);
    const auth = getAuth(getApp());



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const handleSearch = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("User not authenticated");
        }
        const idToken = await currentUser.getIdToken();
        try {
            let fetchedListings;
            if (searchInput === '') {
                fetchedListings = await fetchAllListings(idToken);
            } else {
                fetchedListings = await fetchListingByKeyword(searchInput, idToken);
            }
            setListings(fetchedListings);
            console.log('Fetched listings:', fetchedListings);
        } catch (e) {
            console.error('Failed to fetch listings:', e);
        }
    };


    return (
        <div>
            <input
                type="text"
                value={searchInput}
                onChange={handleChange}
                placeholder="Search..."
                style={{ padding: '10px', width: '200px' }}
            />
            <button onClick={handleSearch} className="search-button">
                Search
            </button>
        </div>
    );
};

export default Search;