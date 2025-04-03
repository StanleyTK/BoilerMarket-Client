export async function fetchAllListings(idToken: string, sortBy: string, sortDirection: "asc" | "desc", categoryFilter: string, dateFilter: string, priceFilter: string, locationFilter: string, keyword: string) {
    const body: any = {
        sort: sortBy,
        dir: sortDirection,
    };

    if (keyword) {
        body.keyword = keyword;
    };

    if (categoryFilter) {
        body.categoryFilter = categoryFilter;
    };

    if (dateFilter) {
        body.dateFilter = dateFilter;
    }

    if (priceFilter) {
        body.priceFilter = priceFilter;
    };

    if (locationFilter) {
        body.locationFilter = locationFilter;
    }

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/get/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch listings');
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

export async function fetchSavedListings(idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/getSaved/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch saved listings');
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

export async function fetchSavedListings(idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/getSaved/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch saved listings');
    }

    return response.json();
}