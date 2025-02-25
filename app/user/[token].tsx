import { getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { verifyPurdueEmailToken } from "~/service/user-service";

const VerifyPurdueEmail: React.FC = () => {
    const auth = getAuth(getApp());
    const { token } = useParams<{ token: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setFirebaseUser(user);
            console.log(user);
          }
        });
        
        const verifyEmail = async () => {
            setLoading(true);
            try {
                if (!firebaseUser) {
                    console.log(firebaseUser);
                    setError("You must be logged in to verify your Purdue email.");
                } else if (!token) {
                    setError("Invalid token.");
                } else {
                    const idToken = await firebaseUser.getIdToken();
                    await verifyPurdueEmailToken(firebaseUser.uid, token, idToken);
                    setSuccess(true);
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        verifyEmail();

        return () => unsubscribe();
    }, [auth, firebaseUser, token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
                <p className="text-green-400 text-lg">Email verified successfully!</p>
            </div>
        );
    }

    if (error) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
            <p className="text-red-400 text-lg">{error}</p>
            <p className="text-red-400 text-lg">{success ? "true" : "false"}</p>
        </div>
        );
    }

    return null;
}

export default VerifyPurdueEmail;
