import type { FirebaseApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, type Auth } from "firebase/auth";

export class AuthService {
    private readonly auth: Auth;

    public constructor(firebaseApp: FirebaseApp) {
        this.auth = getAuth(firebaseApp);
    }


    async getIdToken(): Promise<string | null> {
        if (this.auth) {
            const user = this.auth.currentUser;
            if (user) {
                return await user.getIdToken();
            }
        }
        return null;
    }

    async register(email: string, password: string) {
        const userCred =  await createUserWithEmailAndPassword(this.auth, email, password);
        sendEmailVerification(userCred.user).then(() => {
            console.log('Email verification sent');
        });
        return userCred;
    }

    async login(email: string, password: string) {
        return await signInWithEmailAndPassword(this.auth, email, password);
    }
}