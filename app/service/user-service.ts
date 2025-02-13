export async function registerUser(uid: string, email: string, displayName: string, bio: string, idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/create_user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid, email, displayName, bio }),
    });

    if (!response.ok) {
        throw new Error('Failed to register user');
    }

    return response.json();
}