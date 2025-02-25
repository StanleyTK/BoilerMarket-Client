import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import type { User } from "firebase/auth";
import { getApp } from "firebase/app";
import { deleteUserWrapper, getUser, sendPurdueVerification } from '~/service/user-service';
import type { UserProfileData } from "~/service/types";

const UserProfile: React.FC = () => {
  const auth = getAuth(getApp());
  const { uid: uidFromURL } = useParams<{ uid: string }>();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purdueEmail, setPurdueEmail] = useState<string>("");
  const navigate = useNavigate();

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
          setUser(data);
          setPurdueEmail(data.purdueEmail || "");
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uidFromURL]);

  const handlePurdueEmailVerification = async () => {
    if (!firebaseUser) {
      alert("You must be logged in to verify your Purdue email.");
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
    <div className="min-h-screen bg-gray-800 text-white p-6 flex flex-col items-center relative">
      <div className="w-full max-w-2xl bg-gray-700 shadow-lg rounded-xl p-8 relative">
        {/* Plus Button: Only visible if this is your profile */}
        {firebaseUser && firebaseUser.uid === uidFromURL && (
          <button
            onClick={() => navigate("/createlisting")}
            className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
            title="Create Listing"
          >
            <span className="text-2xl">+</span>
          </button>
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-500 text-white text-3xl font-bold rounded-full flex items-center justify-center shadow-lg">
            {user?.displayName?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold mt-4">{user?.displayName}</h1>
        </div>

        {/* User Info Section */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <span className="w-1/3 text-gray-300 font-semibold">Email:</span>
            <span className="w-2/3">{user?.email} {firebaseUser?.emailVerified ? "(Verified)" : "(Unverified)"}</span>
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
            <span className="w-1/3 text-gray-300 font-semibold">Rating:</span>
            <span className="w-2/3">{user?.rating.toFixed(1)} ⭐</span>
          </div>

          {user?.bio && (
            <div>
              <h3 className="text-gray-300 font-semibold">Bio:</h3>
              <p className="bg-gray-600 p-4 rounded-lg mt-1">{user.bio}</p>
            </div>
          )}
        </div>
        
        {firebaseUser && firebaseUser.uid === uidFromURL && (
          <div className="mt-6">
            <button
              onClick={async () => {
                const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
                if (confirmed) {
                  try {
                    await deleteUserWrapper(firebaseUser);
                    navigate("/login");
                  } catch (err) {
                    console.error("Error deleting user:", err);
                    alert("An error occurred while deleting your account. Please try again later.");
                  }
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
