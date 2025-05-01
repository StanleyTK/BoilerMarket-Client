export async function createReview(
  idToken: string,
  userUid: string,
  reviewedUserUid: string,
  comment: string,
  rating: number,
) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/review/create/`, {
    method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
    body: JSON.stringify({ user:userUid, reviewed_user:reviewedUserUid, comment:comment, rating:rating }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to create review");
  }

  return response.json();
}

export async function getReviews(idToken: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/review/get/`, {
    method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to fetch reviews");
  }

  return response.json();
}
export async function deleteReview(idToken: string, reviewId: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/review/delete/${reviewId}/`, {
    method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to delete review");
  }

  return response.json();
}

export async function getAboutReviews(uid: string, idToken: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/review/about/${uid}/`, {
    method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to fetch reviews");
  }

  return response.json();
}

export async function getByReviews(uid: string, idToken: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/review/by/${uid}/`, {
    method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to fetch reviews");
  }

  return response.json();
}