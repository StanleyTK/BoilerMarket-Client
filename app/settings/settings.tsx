
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelope,
  faHeadphones,
  faRightToBracket,
  faSun,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { deleteUserWrapper, getUser } from "~/service/user-service";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getApp } from "firebase/app";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [firebaseUser, setFirebaseUser] = useState<User>();
  const auth = getAuth(getApp());


   // Listen for Firebase authentication state changes
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleDelete = async () => {
    if (!firebaseUser) {
      alert("User not found.");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      try {
        await deleteUserWrapper(firebaseUser);
        navigate("/login");
      } catch (err) {
        console.error("Error deleting user:", err);
        alert(
          "An error occurred while deleting your account. Please try again later."
        );
      }
    }
  };
  

  const toggleTheme = () => {
    // Dummy function for toggling Light/Dark Mode
    console.log("Toggling Light/Dark mode");
  };

  const handleLogout = () => {
    console.log("Logging out");
  };

  // OptionButton component for each settings option
  const OptionButton = ({
    icon,
    title,
    description,
    onClick,
  }: {
    icon: any;
    title: string;
    description: string;
    onClick: () => void;
  }) => (
    <div
      className="w-full border border-gray-600 rounded hover:bg-gray-700 cursor-pointer p-4 flex items-center space-x-4 transition-all"
      onClick={onClick}
    >
      {/* Icon container with fixed dimensions */}
      <div className="w-8 h-8 flex items-center justify-center">
        <FontAwesomeIcon
          icon={icon}
          fixedWidth
          style={{ width: "24px", height: "24px" }}
        />
      </div>
      <div>
        <h2 className="text-xl">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      {/* Container for the options */}
      <div className="w-full max-w-xl space-y-5">
        <OptionButton
          icon={faSun}
          title="Light Mode / Dark Mode"
          description="Switch between light and dark themes"
          onClick={toggleTheme}
        />
        <OptionButton
          icon={faBell}
          title="Notifications"
          description="Message & Trip Notifications"
          onClick={() => console.log("Notifications clicked")}
        />
        <OptionButton
          icon={faEnvelope}
          title="Verify Email"
          description="Confirm your email address to ensure account security"
          onClick={() => console.log("Verify Email clicked")}
        />
        <OptionButton
          icon={faTrash}
          title="Delete account"
          description="Delete your account permanently"
          onClick={handleDelete}
        />
        <OptionButton
          icon={faRightToBracket}
          title="Log Out"
          description="Log Out of Account"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Settings;
