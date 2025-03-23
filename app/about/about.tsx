import React from "react";
import { useTheme } from "~/components/ThemeContext";

const AboutPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
    
        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
        <p className="text-lg mb-4">
          Our mission is to provide a marketplace targeted towards Purdue students that only 
          allows registered students to join the platform, ensuring that vendors are trustworthy and in-area. 
          This should prevent scams, as every vendor and seller can be identified, and 
          allow for ease of transaction that comes with close proximity.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Stanley Kim", info: "Computer Science Junior at Purdue University" },
            { name: "Varun Jasti", info: "Computer Science Senior at Purdue University" },
            { name: "Daniel Geva", info: "Computer Science Senior at Purdue University" },
            { name: "Andrew Bradley", info: "Computer Science Senior at Purdue University" },
            { name: "Ben Lin", info: "Computer Science Senior at Purdue University" },
          ].map((member, index) => (
            <div
              key={index}
              className={`p-4 border ${
                theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"
              } rounded-lg shadow-md text-center`}
            >
              <h3 className="text-xl font-medium">{member.name}</h3>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                {member.info}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
