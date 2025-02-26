import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getApp } from "firebase/app";
import { useParams, useNavigate } from "react-router";
import { createListing } from '~/service/listing-service';



const Create_Listing: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();
    const { uid } = useParams<{ uid: string }>();
    const auth = getAuth(getApp());
    

    const handleCreateListing = async () => {
        console.log("sub");
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
              throw new Error("User not authenticated");
            }
            const idToken = await currentUser.getIdToken();
            console.log(String(uid))  
            await createListing(idToken, title, description, Number(price), "None", String(uid) , false);
            console.log("Success")
        } catch (e) {
            console.log(e)
            console.log("Fail")
        }
              
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Listing</h2>
            <input
                type="title"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <input
                type="description"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <input
                type="price"
                placeholder="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <button className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
            onClick={handleCreateListing}>
                Post Listing
            </button>
    </div>
    );
};
export default Create_Listing;