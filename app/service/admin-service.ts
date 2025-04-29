export async function getConncetedUsers(idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/getConnectedUsers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch connected users');
    }

    const data = await response.json();

    return data["connected_users"];
}

export async function isAdmin(idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/isAdmin`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (response.status === 403) {
        return false; // User is not an admin
    }

    if (!response.ok) {
        throw new Error('Failed to fetch admin status');
    }

    return true;
}

export async function getActiveListings(idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/getActiveListings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch active listings');
    }
    const data = await response.json();
    return data["active_listings"];
}