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
    rid: string;
    seller: string;
    buyer: string;
    listingTitle: string;
    listingId: string;
    recentMessage: string;
}