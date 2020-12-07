export interface PlexAccountUser {
    id: number,
    name: string,
    thumbnail: string,
    email?: string
}

export async function getUsers(): Promise<PlexAccountUser[]> {
    const res = await fetch("http://localhost:8000/api/users", {
        headers: {
            "x-plex-token": localStorage.getItem("accessToken")!,
            "x-client-id": localStorage.getItem("clientId")!
        }
    });
    if (res.status !== 200) return Promise.reject("Error fetching users.");

    return await res.json() as PlexAccountUser[];
}