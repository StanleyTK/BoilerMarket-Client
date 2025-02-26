export async function createListing(idToken: string, title: string, description: string, price: number, category: string, user: string, hidden: boolean) {
    console.log( JSON.stringify({ title, description, price, category, user, hidden}))
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ title, description, price, category, user, hidden}),
    });

    if (!response.ok) {
        throw new Error('Failed to create listing');
    }

    return response.json();
}