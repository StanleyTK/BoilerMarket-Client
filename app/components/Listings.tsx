import React from 'react';
// temporary file to store listigns for homepage idk

interface Listing {
  id: number;
  title: string;
  price: string;
  description: string;
  image?: string;
}

const listings: Listing[] = [
  { id: 1, title: 'TV for sale', price: '$100', description: 'Brand new TV.' },
  { id: 2, title: 'Used bed for sale', price: '$130', description: 'Bed for sale.' },
  { id: 3, title: 'Xbox for sale', price: '$80', description: 'Xbox for sale.' },
  { id: 4, title: 'Used desk for sale', price: '$80', description: 'Desk for sale.' },
  { id: 5, title: 'i dunno', price: '$12333', description: 'yolo' },
  { id: 6, title: 'Used bed for sale', price: '$130', description: 'Bed for sale.' },
  { id: 7, title: 'Xbox for sale', price: '$80', description: 'Xbox for sale.' },
  { id: 8, title: 'Used desk for sale', price: '$80', description: 'Desk for sale.' },


];

const Listings: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{listing.title}</h3>
          <p className="font-bold text-gray-700 mb-2">Price: {listing.price}</p>
          <p className="text-gray-600">{listing.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Listings;
