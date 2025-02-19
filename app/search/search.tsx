import React from "react";
import { useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import Listings from '../components/Listings'



const Search: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const handleSearch = () => {
        console.log('Search query:', searchInput);
        // Search logic here
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
            <button onClick={handleSearch} style={{ padding: '10px' }}>
                Search
            </button>
        </div>
    );
};