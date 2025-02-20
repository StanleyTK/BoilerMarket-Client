import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";
import { getUser, updateUser } from "~/service/user-service";
import type { UserProfileData } from "~/service/types";

const EditAccount: React.FC = () => {
  const auth = getAuth(getApp());
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for editable fields
  const [displayName, setDisplayName] = useState("");
  const [purdueEmail, setPurdueEmail] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!uid) {
      setError("Invalid user ID.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const data = await getUser(uid);
        if (!data || data.email == null) {
          setError("User not found");
        } else {
          setUser(data);
          setDisplayName(data.displayName || "");
          setPurdueEmail(data.purdueEmail || "");
          setBio(data.bio || "");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleSave = async () => {
    if (!uid) return;

    try {
      // Get the current Firebase user token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      const idToken = await currentUser.getIdToken();

      // Call updateUser with the updated fields
      await updateUser(idToken, { displayName, purdueEmail, bio });
      navigate(`/u/${uid}`); // Navigate back to the profile page after saving
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-700 shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Account</h1>
        <div className="space-y-4">
          {/* Display Name Field */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2 rounded bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Purdue Email Field */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Purdue Email
            </label>
            <input
              type="email"
              value={purdueEmail}
              onChange={(e) => setPurdueEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 rounded bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
        </div>

        {/* Save / Cancel Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={() => navigate(`/u/${uid}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default EditAccount;
