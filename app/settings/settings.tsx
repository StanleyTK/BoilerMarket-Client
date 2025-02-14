"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelope,
  faHeadphones,
  faRightToBracket,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

const Settings: React.FC = () => {
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
          // Changed icon to faSun (can be replaced with a moon icon if desired)
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
