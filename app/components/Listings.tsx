import React from 'react';

// temporary file to store listings for homepage idk
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
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
        >
          <div className="relative h-48 w-full">
            {listing.image ? (
              <img
                src={listing.image}
                alt={listing.title}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="bg-gray-300 h-full w-full flex items-center justify-center text-gray-500">
                No image
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {listing.title}
            </h3>
            <p className="mt-2 text-gray-700 font-medium">
              Price: {listing.price}
            </p>
            <p className="mt-2 text-gray-600 text-sm">
              {listing.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Listings;
