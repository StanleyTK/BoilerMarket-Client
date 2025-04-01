import type { InboxRoomData } from "./types";

export async function getRooms(idToken: string): Promise<InboxRoomData[]> {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/message/get_rooms/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get rooms');
        }
        const data = await response.json();
        const roomsArr = Object.values(data);
        return roomsArr[0] as InboxRoomData[];
    } catch (error) {
        console.error('Error getting rooms:', error);
        throw error; // Rethrow the error for further handling
    }
}

export async function createRoom(idToken: string, lid: number, uid: string): Promise<number> {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/message/get_or_create_room/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ lid, uid }),
        })
        if (!response.ok) {
            throw new Error('Failed to create room');
        }
        const data = await response.json();
        return data.rid as number;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error; // Rethrow the error for further handling
    }
}