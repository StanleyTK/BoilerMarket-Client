import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";
import { useParams, useNavigate } from "react-router";
import { createListing } from "~/service/listing-service";
import { checkEmailAuth } from "~/service/user-service";
import { useTheme } from "~/components/ThemeContext";

const Create_Listing: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { uid } = useParams<{ uid: string }>();
  const auth = getAuth(getApp());
  const { theme } = useTheme();

  // Verify email authentication on component mount.
  useEffect(() => {
    const verifyEmail = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate(`/u/${uid}`);
        return;
      }
      try {
        const idToken = await currentUser.getIdToken();
        await checkEmailAuth(idToken);
      } catch (error) {
        // If email verification fails, redirect to profile page.
        navigate(`/u/${uid}`);
        return;
      }
      setVerifying(false);
    };

    verifyEmail();
  }, [auth, uid, navigate]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      const idToken = await currentUser.getIdToken();
      await createListing(
        idToken,
        title,
        description,
        Number(price),
        "None",
        String(uid),
        false
      );
      alert("Listing has been successfully created");
      // Navigate back to the profile page after successful creation.
      navigate(`/u/${uid}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      setSubmitting(false);
    }
  };

  // Show a loading screen while verifying or submitting.
  if (verifying || submitting) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <form
        onSubmit={handleCreateListing}
        className={`w-80 p-8 rounded-lg shadow-md ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      >
        <h2
          className={`text-2xl font-bold text-center mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Create Listing
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={`w-full mb-4 p-2 border rounded ${
            theme === "dark"
              ? "bg-gray-600 text-white border-gray-500"
              : "bg-gray-200 text-black border-gray-300"
          }`}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className={`w-full mb-4 p-2 border rounded ${
            theme === "dark"
              ? "bg-gray-600 text-white border-gray-500"
              : "bg-gray-200 text-black border-gray-300"
          }`}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className={`w-full mb-4 p-2 border rounded ${
            theme === "dark"
              ? "bg-gray-600 text-white border-gray-500"
              : "bg-gray-200 text-black border-gray-300"
          }`}
        />
        <button
          type="submit"
          className={`w-full py-2 rounded transition ${
            theme === "dark"
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-gray-800 hover:bg-gray-700 text-white"
          }`}
        >
          Post Listing
        </button>
      </form>
    </div>
  );
};

export default Create_Listing;
