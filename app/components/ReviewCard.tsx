import React from "react";

interface ReviewCardProps {
  review: Review;
}

interface Review {
  comment: string;
  reviewed_uid: string;
  rating: number;
  uid: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 w-full max-w-md">
      <div className="flex items-center mb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
        <span className="ml-2 text-xl font-semibold text-gray-800">{review.rating} / 5</span>
      </div>
      <div className="text-gray-600 mb-4">{review.comment}</div>
      <div className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">Reviewed By:</span> {review.reviewed_uid}
      </div>
      <div className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">User Reviewed:</span> {review.uid}
      </div>
    </div>
  );
};

export default ReviewCard;