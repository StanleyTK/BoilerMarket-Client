export async function createListing(
  idToken: string,
  title: string,
  description: string,
  price: number,
  category: string,
  user: string,
  hidden: boolean,
  mediaFiles: File[]
) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price.toString());
  formData.append("category", category);
  formData.append("user", user);
  formData.append("hidden", hidden.toString());

  // Add all files to formData
  mediaFiles.forEach((file) => formData.append("media", file));

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/create/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create listing");
  }

  return response.json();
}


export async function deleteListing(
  idToken: string,
  listingId: number
) {
  console.log(JSON.stringify({ listingId }));
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/listing/delete/${listingId}/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ listingId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create listing");
  }

  return response.json();
}

export async function updateListing(
  idToken: string,
  listingId: number,
  updateData: { title: string; description: string; price: number; hidden: boolean, sold: boolean }
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
