import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
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
        <div className="p-4 border rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium">Stanley Kim</h3>
          <p className="text-gray-600">Computer Science Senior at Purdue University</p>
        </div>
        <div className="p-4 border rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium">Varun Jasti</h3>
          <p className="text-gray-600">Computer Science Senior at Purdue University</p>
        </div>
        <div className="p-4 border rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium">Daniel Geva</h3>
          <p className="text-gray-600">Computer Science Senior at Purdue University</p>
        </div>
        <div className="p-4 border rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium">Andrew Bradley</h3>
          <p className="text-gray-600">Computer Science Senior at Purdue University</p>
        </div>
        <div className="p-4 border rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium">Ben Lin </h3>
          <p className="text-gray-600">Computer Science Senior at Purdue University</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
