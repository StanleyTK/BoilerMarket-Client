export interface UserProfileData {
    profilePicture: string;
    uid: string;
    email: string;
    purdueEmail: string | null;
    purdueEmailVerified: boolean;
    displayName: string;
    rating: number;
    bio?: string;
    admin: boolean;
    banned: boolean;
}

export interface InboxRoomData {
    rid: number;
    seller: string;
    buyer: string;
    listingName: string;
    listingId: number;
    recentMessage: string;
}

export interface RoomData {
    rid: number;
    seller: string;
    buyer: string;
    listingName: string;
    listingId: number;
}

export interface MessageData {
    sender: string;
    content: string;
    timeSent: string;
}