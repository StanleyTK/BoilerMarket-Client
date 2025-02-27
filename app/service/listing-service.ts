export async function createListing(
  idToken: string,
  title: string,
  description: string,
  price: number,
  category: string,
  user: string,
  hidden: boolean
) {
  console.log(
    JSON.stringify({ title, description, price, category, user, hidden })
  );
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/listing/create/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        title,
        description,
        price,
        category,
        user,
        hidden,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create listing");
  }

  return response.json();
}

export async function deleteListing(
  idToken: string,
  listingId: number,
  user: string
) {
  console.log(JSON.stringify({ idToken, listingId, user }));
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/listing/delete/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ idToken, listingId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create listing");
  }

  return response.json();
}

// wip
export async function updateListing(
  idToken: string,
  listingId: number,
  updateData: { title: string; description: string; price: number }
) {
  // todo - add category/hidden in when implemented
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/listing/update/${listingId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
}
