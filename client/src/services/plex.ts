export interface Server {
    name: string;
    ip: string;
}

export async function getServers(): Promise<Server[]> {
    const res = await fetch("http://localhost:8000/api/servers", {
        headers: {
            "x-plex-token": localStorage.getItem("accessToken")!,
            "x-client-id": localStorage.getItem("clientId")!
        }
    });
    if (res.status !== 200) return Promise.reject("Error fetching servers.");

    return await res.json() as Server[];
}

export async function getLibraries(): Promise<string[]> {
    const res = await fetch("http://localhost:8000/api/libraries", {
        headers: {
            "x-plex-token": localStorage.getItem("accessToken")!,
            "x-client-id": localStorage.getItem("clientId")!
        }
    });
    if (res.status !== 200) return Promise.reject("Error fetching libraries.");

    return await res.json() as string[];
}