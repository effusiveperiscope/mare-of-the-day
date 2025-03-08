import { initializeWork } from "./app/work";

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        initializeWork();
    }
}