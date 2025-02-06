import type { FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

export class AuthService {
    private readonly auth: Auth;

    public constructor(firebaseApp: FirebaseApp) {
        this.auth = getAuth(firebaseApp);
    }
}