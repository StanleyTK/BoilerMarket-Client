import { deleteUser, type User } from "firebase/auth";
import type { UserProfileData } from "./types";

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
    updateData: { displayName: string; purdueEmail: string; bio: string }
  ) {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/user/update/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(updateData),
      }
    );
  
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