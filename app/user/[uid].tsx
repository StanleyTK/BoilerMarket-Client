import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import type { User } from "firebase/auth";
import { getApp } from "firebase/app";
import { deleteUserWrapper, getUser, sendPurdueVerification, checkEmailAuth } from '~/service/user-service';
import type { UserProfileData } from "~/service/types";
import { fetchListingByUser, fetchSavedListings } from '~/service/fetch-listings';
import { blockUser } from "~/service/user-service";
import { createReport, getByReports } from "~/service/report-service";
import { useTheme } from "~/components/ThemeContext";
import ReportCard from '~/components/ReportCard';
import { ListingCard } from '~/components/ListingCard';
import { unblockUser, fetchBlockedUsers } from "~/service/user-service"; 

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | string;
  original_price: number | string;
  image?: string;
  displayName?: string;
  uid: string;
  hidden: boolean;
  sold: boolean;
  profilePicture: string;
  saved_by: string[];
  media?: string[];
}

interface Report {
  title: string;
  description: string;
  reported_uid: string;
  uid: string;
}

const UserProfile: React.FC = () => {
  const auth = getAuth(getApp());
  const { uid: uidFromURL } = useParams<{ uid: string }>();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purdueEmail, setPurdueEmail] = useState<string>("");
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [emailAuthVerified, setEmailAuthVerified] = useState<boolean>(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [viewSaved, setViewSaved] = useState(false);
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<UserProfileData[]>([]);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const [showReports, setShowReports] = useState(false);
  const handleOpenReports = () => setShowReports(true);
  const handleCloseReports = () => setShowReports(false);
  const [reportsBy, setReportsBy] = useState<Report[]>([]);



  // Listen for authentication state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [auth]);

  // Redirect to /login if authentication is checked and no user is found.
  useEffect(() => {
    if (authChecked && !firebaseUser) {
      navigate("/login");
    }
  }, [authChecked, firebaseUser, navigate]);

  useEffect(() => {
    const verifyEmailAuth = async () => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          await checkEmailAuth(idToken);
          setEmailAuthVerified(true);
          console.log(idToken);
        } catch (error) {
          setEmailAuthVerified(false);
        }
      }
    };
    verifyEmailAuth();
  }, [firebaseUser]);

  useEffect(() => {
    if (!uidFromURL || !authChecked) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await getUser(uidFromURL);
        if (!data || !data.email) {
          setError("User not found");
        } else {
          // console.log(data);
          setUser(data);
          setPurdueEmail(data.purdueEmail || "");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const getUserListings = async () => {
      try {
        const currentUser = auth.currentUser;
        const idToken = await currentUser?.getIdToken();
        if (!idToken) throw new Error("User not authenticated");
        const data = await fetchListingByUser(uidFromURL, idToken);
        setUserListings(data);
      } catch (error) {
        console.error("Error fetching user listings:", error);
      }
    };

    const getSavedListings = async () => {
      try {
        const currentUser = auth.currentUser;
        const idToken = await currentUser?.getIdToken();
        if (!idToken) throw new Error("User not authenticated");
        const data = await fetchSavedListings(idToken);
        setSavedListings(data);
      } catch (error) {
        console.error("Error fetching saved listings:", error);
      }
    };

    const checkBlocked = async () => {
      try {
        const idToken = await firebaseUser?.getIdToken();
        if (!idToken) throw new Error("User not authenticated");
        const users = await fetchBlockedUsers(idToken);
        const isBlocked = users?.some((user: { uid: string | undefined; }) => user.uid === uidFromURL);
        console.log("Blocked users:", users);
        setBlocked(isBlocked);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    };

    const getReportsByUser = async (userId: string) => {
      if (firebaseUser && firebaseUser.uid === uidFromURL) {
        try {
          const idToken = await firebaseUser?.getIdToken();
          const reports = await getByReports(uidFromURL,idToken) 
          setReportsBy(reports);
        }
        catch (error) {
          console.error("Error fetching reports:", error);
        }
      }
    } 

    getReportsByUser(uidFromURL!);
    checkBlocked();
    getSavedListings();
    fetchUserData();
    getUserListings();
  }, [uidFromURL, authChecked]);

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

  const getTotalSaves = (): number => {
    return userListings.reduce((total, listing) => {
      return total + listing.saved_by.length;
    }, 0);
  };



  const handleViewBlockedUsers = async () => {
    try {
      const idToken = await firebaseUser?.getIdToken();
      if (!idToken) throw new Error("User not authenticated");
      const users = await fetchBlockedUsers(idToken);
      setBlockedUsers(users);
      setShowBlockedPopup(true);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      alert("Failed to fetch blocked users.");
    }
  };

  const handleUnblockUser = async (blockedUid: string, displayName: string) => {
    try {
      const idToken = await firebaseUser?.getIdToken();

      if (!idToken) throw new Error("User not authenticated");
      await unblockUser(blockedUid, idToken);
      setBlockedUsers((prev) => prev.filter((user) => user.uid !== blockedUid));
      alert(`${displayName} has been unblocked.`);
      try {
        const currentUser = auth.currentUser;
        const idToken = await currentUser?.getIdToken();
        if (!idToken) throw new Error("User not authenticated");
        const data = await fetchSavedListings(idToken);
        setSavedListings(data);
      } catch (error) {
        console.error("Error fetching saved listings:", error);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock user.");
    }
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

      {firebaseUser && firebaseUser.uid !== uidFromURL && (
        <div className="flex flex-col items-end gap-2 mt-1">
          {/* Block User Button */}
          {blocked ? (
            <span className="px-4 py-2 rounded-lg bg-gray-100 text-gray-500 border border-gray-300 shadow-sm">
              Blocked
            </span>
          ) : (
            <button
              onClick={async () => {
                const confirmBlock = confirm("Are you sure you want to block this user?");
                if (confirmBlock && firebaseUser) {
                  try {
                    const idToken = await firebaseUser.getIdToken();
                    await blockUser(uidFromURL!, idToken);
                    alert(`${user?.displayName || "User"} has been blocked.`);
                    navigate("/");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to block user: " + (err as Error).message);
                  }
                }
              }}
              className="bg-red-100 text-red-700 hover:bg-red-200 transition-colors px-4 py-2 rounded-lg shadow-sm border border-red-300 w-fit"
            >
              Block User
            </button>
          )}

          {/* Report User Button */}
          <button
            onClick={() => setShowReportPopup(true)}
            className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors px-4 py-2 rounded-lg shadow-sm border border-yellow-300 font-medium w-fit"
          >
            Report User
          </button>
        </div>
      )}


        {/* Plus Button: Only visible if this is your profile and email auth is verified */}
        {firebaseUser && firebaseUser.uid === uidFromURL && emailAuthVerified && (
          <button
            onClick={() => navigate(`/u/${uidFromURL}/createlisting`)}
            className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
            title="Create Listing"
          >
            <span className="text-2xl">+</span>
          </button>
        )}

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg items-center">
            {user?.profilePicture ? (
              <img
                src={`${user.profilePicture}?t=${new Date().getTime()}`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 text-white text-3xl font-bold flex items-center justify-center">
                {user?.displayName?.charAt(0).toUpperCase()}
              </div>
            )}
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
                  onClick={handlePurdueEmailVerification}
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

        {firebaseUser && firebaseUser.uid === uidFromURL && (
          <div className="mt-6 flex flex-wrap gap-2 w-full">
            {/* Left-aligned button with consistent sizing */}
            <div className="flex flex-col gap-2 min-w-[200px]">
              <button
                onClick={() => navigate(`/u/${uidFromURL}/edit`)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow border border-white"
              >
                Edit Account
              </button>
            </div>

            {/* Right-aligned buttons stacked vertically */}
            <div className="flex flex-col gap-2 ml-auto min-w-[200px]">
              <button
                onClick={() => handleViewBlockedUsers()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow border border-white"
              >
                View Blocked Users
              </button>

              <button
                onClick={() => handleOpenReports()}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg shadow border border-white"
              >
                View Reports
              </button>
            </div>
          </div>
        )}

        {/* Saves on Owned Listings */}
        {firebaseUser && firebaseUser.uid === uidFromURL && (
          <div className="mt-4 flex items-center">
            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} w-1/3 font-semibold`}>Saves on Owned Listings:</span>
            <span className="w-1/2">{getTotalSaves()}</span>
          </div>
        )}

         {/* # of views from each Listings */}
         {firebaseUser && firebaseUser.uid === uidFromURL && (
          <div className="mt-4 flex items-center">
            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} w-1/3 font-semibold`}>Total Views From Listings</span>
            <span className="w-1/2">{user?.views}</span>
          </div>
        )}
      </div>
      
      <div className="mt-12"></div>
      
      {/* Listings Toggle Button */}
      {firebaseUser && firebaseUser.uid === uidFromURL && emailAuthVerified && (
        <div className="flex space-x-4">
          <button
            onClick={() => setViewSaved(false)}
            className={`py-2 px-4 rounded ${!viewSaved ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Your Listings
          </button>
          <button
            onClick={() => setViewSaved(true)}
            className={`py-2 px-4 rounded ${viewSaved ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Saved Listings
          </button>
        </div>
      )}
        
      {/* UnBlock popup */}
      {showBlockedPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} rounded-lg shadow-lg p-6 w-96`}>
            <h2 className="text-xl font-bold mb-4">Blocked Users</h2>
            {blockedUsers.length > 0 ? (
              <ul className="space-y-4">
                {blockedUsers.map((blockedUser) => (
                  <li key={blockedUser.uid} className="flex justify-between items-center">
                    <span>{blockedUser.displayName || blockedUser.email}</span>
                    <button
                      onClick={() => handleUnblockUser(blockedUser.uid, blockedUser.displayName)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No blocked users found.</p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowBlockedPopup(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Report User Popup */}
      {showReportPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Report User</h2>
            
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Enter a short title"
            />

            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 h-24"
              placeholder="Provide more details..."
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowReportPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                disabled={isSubmittingReport || !reportTitle.trim()}
                onClick={async () => {
                  if (!firebaseUser) return;
                  setIsSubmittingReport(true);
                  try {
                    const idToken = await firebaseUser.getIdToken();
                    await createReport(
                        idToken,
                        firebaseUser.uid,
                        uidFromURL!,
                        reportTitle.trim(),
                        reportDescription.trim(),
                    );
                    alert(`${user?.displayName || "User"} has been reported.`);
                    setShowReportPopup(false);
                    setReportTitle("");
                    setReportDescription("");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to report user: " + (err as Error).message);
                  } finally {
                    setIsSubmittingReport(false);
                  }
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
      
        
      {/* Reports Section for Current User*/}
      {showReports && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-xl w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reports</h2>
              <button
                onClick={handleCloseReports}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {/* Replace with dynamic report data */}
              <ul className="list-disc pl-5 space-y-2">
                {reportsBy.map((report, index) => (
                  <ReportCard key={index} report={report} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
        
        {emailAuthVerified && !blocked ? (
          <>
            {/* Listings Section */}
            <div className="user-listing-container mt-6">
              {(viewSaved ? savedListings : userListings).length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
                  {(viewSaved ? savedListings : userListings).map((listing, index) => (
                    <ListingCard
                      key={index}
                      listing={listing}
                      userOwnsListing={!viewSaved && firebaseUser?.uid === uidFromURL}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center mt-4 text-gray-500">
                  {viewSaved ? "No saved listings." : "No listings found."}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center mt-6 text-red-500">
            {blocked
              ? "You cannot view listings due to blocked user."
              : "You cannot view listings until you verify your email."}
          </p>
        )}
    </div>

    
  );
};

export default UserProfile;
