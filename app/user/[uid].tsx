import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import type { User } from "firebase/auth";
import { getApp } from "firebase/app";
import { deleteUserWrapper, getUser, sendPurdueVerification } from '~/service/user-service';
import type { UserProfileData } from "~/service/types";
import { fetchListingByUser } from '~/service/fetch-listings';
import { useTheme } from "~/components/ThemeContext";
import { ListingCard } from '~/components/ListingCard';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | string;
  image?: string;
  displayName?: string;
  uid: string;
  hidden: boolean;
  sold: boolean;
}


const UserProfile: React.FC = () => {
  const auth = getAuth(getApp());
  const { uid: uidFromURL } = useParams<{ uid: string }>();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purdueEmail, setPurdueEmail] = useState<string>("");
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const fetchUserListings = useCallback(async () => {
      if (!firebaseUser) return;
      setLoading(true);
      try {
        const idToken = await firebaseUser.getIdToken();
        const data = await fetchListingByUser(String(firebaseUser.uid), idToken);
        setUserListings(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }, [firebaseUser]);

  // Listen for Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!uidFromURL) {
      setError("Invalid user ID.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        getUser(uidFromURL).then((data) => {
          if (data.email == null) {
            setError("User not found"); 
          } else {
            setUser(data);
            setPurdueEmail(data.purdueEmail || "");
          }
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const getUserListings = async () => {
      try {
        console.log(auth.currentUser)
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        const idToken = await currentUser.getIdToken();
        console.log(uidFromURL);
        const data = await fetchListingByUser(String(uidFromURL) , idToken );
        setUserListings(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching user listings:', error);
      }
    };
    getUserListings();

  }, [uidFromURL, fetchUserListings]);

  


  const handlePurdueEmailVerification = async () => {
    if (!firebaseUser) {
      alert("You must be logged in to verify your Purdue email.");
      return;
    }
    if (!purdueEmail.endsWith("@purdue.edu")) {
      alert("Purdue email must end with '@purdue.edu'.");
      return;
    }
    const idToken = await firebaseUser.getIdToken();
    sendPurdueVerification(firebaseUser.uid, purdueEmail, idToken)
      .then(() => {
        alert("Verification email sent!");
      })
      .catch((err: Error) => {
        console.error("Error sending verification email:", err);
        alert(err.message);
      });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} p-6 flex flex-col items-center relative`}>
      <div className={`w-full max-w-2xl ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} shadow-lg rounded-xl p-8 relative`}>
        {/* Plus Button: Only visible if this is your profile */}
        {firebaseUser && firebaseUser.uid === uidFromURL && (
          <button
            onClick={() => navigate(`/u/${uidFromURL}/createlisting`)}
            className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
            title="Create Listing"
          >
            <span className="text-2xl">+</span>
          </button>
        )}

        {/* Avatar and Display Name */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-500 text-white text-3xl font-bold rounded-full flex items-center justify-center shadow-lg">
            {user?.displayName?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold mt-4">{user?.displayName}</h1>
        </div>

        {/* User Info Section */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} w-1/3 font-semibold`}>Email:</span>
            <span className="w-2/3">
              {user?.email} {firebaseUser?.emailVerified ? "(Verified)" : "(Unverified)"}
            </span>
          </div>

          {firebaseUser && firebaseUser.uid === uidFromURL && !firebaseUser.emailVerified && (
            <div className="flex items-center">
              <button
                onClick={async () => {
                  try {
                    await sendEmailVerification(firebaseUser);
                    alert("Verification email sent!");
                  } catch (err) {
                    console.error("Error resending verification email:", err);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Resend Verification Email
              </button>
            </div>
          )}

          <div className="flex items-center">
            <span className="w-1/3 text-gray-300 font-semibold">Purdue Email:</span>
            {user?.purdueEmailVerified ? (
              <span className="w-2/3">{user?.purdueEmail} (Verified)</span>
            ) : (
              <div>
                <input
                  type="email"
                  placeholder="@purdue.edu"
                  defaultValue={purdueEmail}
                  onChange={(e) => setPurdueEmail(e.target.value)}
                  className="w-2/3 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => {
                    handlePurdueEmailVerification();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2"
                >
                  Verify
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} w-1/3 font-semibold`}>Rating:</span>
            <span className="w-2/3">{user?.rating.toFixed(1)} ⭐</span>
          </div>

          {user?.bio && (
          <div>
            <h3 className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-semibold`}>Bio:</h3>
            <p className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} p-4 rounded-lg mt-1`}>
              {user.bio}
            </p>
          </div>
        )}
        </div>


        {/* Edit Account Button */}
        {firebaseUser && firebaseUser.uid === uidFromURL && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => navigate(`/u/${uidFromURL}/edit`)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded border border-white"
            >
              Edit Account
            </button>
          </div>
        )}

        {firebaseUser && firebaseUser.uid === uidFromURL && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => navigate(`/u/${uidFromURL}/manage_listings`)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded border border-white"
            >
              Manage Listings
            </button>
          </div>
        )}
      </div>
      <div className="user-listing-container">
            {userListings.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
                    {userListings.map((userListings, index) => (
                        <ListingCard key={index} listing={userListings} userOwnsListing={(firebaseUser?.uid === uidFromURL)}/>
                    ))}
                </div>
            ) : (
                <p>No listings found.</p>
            )}
      </div>
    </div>
    
  );
};

export default UserProfile;
