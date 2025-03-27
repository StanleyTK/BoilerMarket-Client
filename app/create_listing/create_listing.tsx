import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";
import { useParams, useNavigate } from "react-router";
import { createListing } from "~/service/listing-service";
import { checkEmailAuth } from "~/service/user-service";
import { useTheme } from "~/components/ThemeContext";

const Create_Listing: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { uid } = useParams<{ uid: string }>();
  const auth = getAuth(getApp());
  const { theme } = useTheme();

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
      } catch {
        navigate(`/u/${uid}`);
        return;
      }
      setVerifying(false);
    };

    verifyEmail();
  }, [auth, uid, navigate]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous error

    // Frontend validation
    if (!title.trim() || !description.trim() || !price.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mediaFiles.length === 0) {
      setError("Please upload at least one image or video.");
      return;
    }

    setSubmitting(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not authenticated");

      const idToken = await currentUser.getIdToken();
      await createListing(
        idToken,
        title,
        description,
        Number(price),
        "None",
        String(uid),
        false,
        mediaFiles
      );

      navigate(`/u/${uid}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      setError("An error occurred while creating the listing. Please try again.");
      setSubmitting(false);
    }
  };

  if (verifying || submitting) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <form onSubmit={handleCreateListing} className={`w-full max-w-lg p-8 rounded-lg shadow-md space-y-5 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}>
        <h2 className="text-3xl font-bold text-center mb-6">Create a Listing</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
        />

        <div>
          <label className="block mb-2 font-semibold">Upload Images or Videos</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {mediaFiles.length > 0 && (
            <ul className="mt-2 text-sm text-green-600 list-disc list-inside">
              {mediaFiles.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <div className="text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded bg-green-500 hover:bg-green-600 text-white font-bold transition"
        >
          Post Listing
        </button>
      </form>
    </div>
  );
};

export default Create_Listing;
