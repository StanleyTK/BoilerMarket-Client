import { getApp, type FirebaseApp } from "firebase/app";

export class ServiceContainer {
    private static _instance: ServiceContainer | null = null;
    // Add services here

    public static initialize(app?: FirebaseApp) {
        const firebaseApp = app ?? getApp();
        this._instance = new ServiceContainer(firebaseApp)
    }

    public static instance(): ServiceContainer {
        if (!this._instance) {
            ServiceContainer.initialize();
        }
        return this._instance!;
    }

    private constructor(firebaseApp: FirebaseApp) {
        // Initialize services here
    }
}