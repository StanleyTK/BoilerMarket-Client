export async function createListing(
  idToken: string,
  title: string,
  description: string,
  price: number,
  category: string,
  location: string,
  user: string,
  hidden: boolean,
  mediaFiles: File[]
) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price.toString());
  formData.append("category", category);
  formData.append("location", location);
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



export async function getListing(
  lid: number,
) {

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/listing/getListing/${lid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Listing not found");
  }

  return response.json();
}

export async function saveListing(
  lid: number,
  idToken: string
) {

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/listing/save/${lid}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${idToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to save listing");
  }

  return response.json();
}

export async function unsaveListing(
  lid: number,
  idToken: string
) {

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/listing/unsave/${lid}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${idToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to unsave isting");
  }

  return response.json();

}


export async function incrementListingView(
  lid: number
): Promise<{ views: number }> {
  // console.log("incrementing view count");
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/listing/incrementView/${lid}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Unable to increment view count");
  }
  return response.json();
}