export default async () => {
    if (global.__SERVER__) {
        console.log("Beginning Teardown");
        await global.__SERVER__.close();
    }
}