import { deleteUser, type User } from "firebase/auth";
import type { UserProfileData, Listing } from "./types";


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

async function deleteUserFromDatabase(uid: string, idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/delete_user/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid }),
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }

    return response.json();
}
export async function updateUser(
    idToken: string,
    updateData: {
        displayName: string;
        bio: string;
        profilePicture?: File | null;
        removeProfilePicture?: boolean;
    }
) {
    const formData = new FormData();
    formData.append("displayName", updateData.displayName);
    formData.append("bio", updateData.bio);
    if (updateData.profilePicture) {
        formData.append("profilePicture", updateData.profilePicture);
    }
    if (updateData.removeProfilePicture) {
        formData.append("removeProfilePicture", "true");
    }

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/update/`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return response.json();
}



export async function getUser(uid: string): Promise<UserProfileData> {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/info/${uid}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("User not found");
    }

    const data = await response.json() as UserProfileData;
    return data;
}

export async function deleteUserWrapper(user: User) {
    await deleteUserFromDatabase(user.uid, await user.getIdToken());
    await deleteUser(user);
    // delete listings from database
}

export async function sendPurdueVerification(uid: string, purdueEmail: string, idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/send_purdue_verification/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid, purdueEmail }),
    });

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('Verification email sent too recently');
        } else if (response.status === 400) {
            throw new Error('This Purdue email is already in use');
        }
        throw new Error('Failed to send Purdue verification');
    }

    return response.json();
}

export async function verifyPurdueEmailToken(uid: string, token: string, idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/verify_purdue_email/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid, token }),
    });

    if (!response.ok) {
        throw new Error('Failed to verify Purdue email');
    }

    return response.json();
}

export async function checkEmailAuth(idToken: string) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/check_email_auth`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to check Purdue verification');
    }

    return response.json();
}


export async function blockUser(uid: string, idToken: string) {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/blockUser/${uid}/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${idToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Block user failed");
    }
}

export async function unblockUser(uid: string, idToken: string) {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/unblockUser/${uid}/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${idToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Unblock user failed");
    }
}


export async function fetchBlockedUsers(idToken: string) {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/getBlockedUsers/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${idToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return response.json();
}


export async function addToHistory(
    lid: number,
    idToken: string,
    userId: string
): Promise<void> {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/addToHistory/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`,
            },
            body: JSON.stringify({ lid, userId }),
        }
    );
    if (!response.ok) {
        throw new Error("Unable to add to history");
    }
    return response.json();
}


export async function getHistory(
    idToken: string,
    userId: string
): Promise<Listing[]> {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/getHistory/${userId}/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`,
            },
        }
    );
    if (!response.ok) {
        throw new Error("Unable to get history");
    }
    const data: Listing[] = await response.json();
    return data;
}


export async function getRecommended(
    idToken: string,
    userId: string
): Promise<Listing[]> {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/getRec/${userId}/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`,
            },
        }
    );
    if (!response.ok) {
        throw new Error("Unable to get recommended listings");
    }
    const data: Listing[] = await response.json();
    return data;
}


export async function sendAppeal(
    idToken: string,
    userId: string,
    appeal: string
): Promise<boolean> {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/user/addAppeal/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
                body: JSON.stringify({ userId, appeal }),
            }
        );
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData?.message || "Unable to send appeal";
            throw new Error(errorMessage);
        }
        return true;
    } catch (error) {
        console.error("Error sending appeal:", error);
        return false;
    }
}


export async function getBAndAStatus(
    idToken: string,
    userId: string
): Promise<{ banned: boolean; appeal: boolean }> {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/getBAndAStatus/${userId}/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`,
            },
        }
    );
    if (!response.ok) {
        throw new Error("Unable to get B and A status");
    }
    const data = await response.json();
    return data;
}




export async function banUser(idToken: string, reportedUid: string) {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/report/ban/${reportedUid}/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ban user');
    }

    return response.json();
}


export async function fetchAllBannedUsers(idToken: string) {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/getBannedUsersAndAppeals/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        }
    );


    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ban user');
    }

    return response.json();
}



export async function unbanUser(idToken: string, userId: string) {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/unban_user/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ userId }),

        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ban user');
    }

    return response.json();
}



export async function resolveAppeal(idToken: string, userId: string) {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/resolveAppeal/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ userId }),


        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ban user');
    }

    return response.json();
}


