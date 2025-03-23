export async function fetchAllListings(idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/get/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch listings');
    }

    return response.json();
}

export async function fetchListingByKeyword(keyword: string, idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/get/${keyword}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch listings with keyword: ' + keyword);
    }

    return response.json();
}

export async function fetchListingByUser(uid: string, idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/getUserListing/${uid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch listings with keyword: ' + uid);
    }

    return response.json();
}


export async function fetchTopListings() {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/homepage`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed');
    }
  

    return response.json();
}

