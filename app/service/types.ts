export interface UserProfileData {
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