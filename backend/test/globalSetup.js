import { startServer } from "../server.js";

export default async () => {
    console.log("Initiating Setup");
    const server = await startServer();
    global.__SERVER__ = server;
}
