//import { initializeWork } from "./app/work";
let initializeWork: typeof import("./app/work").initializeWork;

// https://github.com/vercel/next.js/discussions/56968

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        initializeWork = await import("./app/work").then(m => m.initializeWork);
        initializeWork();
    }
}