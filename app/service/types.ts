export interface UserProfileData {
    uid: string;
    email: string;
    purdueEmail: string | null;
    displayName: string;
    rating: number;
    bio?: string;
    admin: boolean;
    banned: boolean;
}