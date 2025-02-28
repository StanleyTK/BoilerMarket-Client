import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-yellow-600 text-white py-4 text-center">
      <p>&copy; {new Date().getFullYear()} BoilerMarket. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
