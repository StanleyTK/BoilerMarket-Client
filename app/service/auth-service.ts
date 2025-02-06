import type { FirebaseApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, type Auth } from "firebase/auth";

export class AuthService {
    private readonly auth: Auth;

    public constructor(firebaseApp: FirebaseApp) {
        this.auth = getAuth(firebaseApp);
    }

    async register(email: string, password: string) {
        return await createUserWithEmailAndPassword(this.auth, email, password);
    }
}