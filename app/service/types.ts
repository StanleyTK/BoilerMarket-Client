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
    views: number;
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

export interface Listing {
    id: number;
    title: string;
    description: string;
    price: number | string;
    original_price: number | string;
    image?: string;
    displayName?: string;
    uid: string;
    hidden: boolean;
    sold: boolean;
    profilePicture: string;
    media?: string[];
}

export interface Listing {
    id: number;
    title: string;
    description: string;
    price: number | string;
    original_price: number | string;
    image?: string;
    displayName?: string;
    uid: string;
    hidden: boolean;
    sold: boolean;
    profilePicture: string;
    media?: string[];
}

export interface Report {
    title: string;
    description: string;
    reportingUser: string;
    reportedUser: string;
}