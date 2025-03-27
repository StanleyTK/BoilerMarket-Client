import type { InboxRoomData } from "./types";

export async function getRooms(idToken: string): Promise<InboxRoomData[]> {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/message/get_rooms/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to get rooms');
        }
        return response.json();
    })
    .then(data => {
        return data as InboxRoomData[];
    })
    .catch(error => {
        console.error('Error getting rooms:', error);
    });
    return [];
}