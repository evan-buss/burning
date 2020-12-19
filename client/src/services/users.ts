import { fetcher } from "./fetcher";

export interface PlexAccountUser {
  id: number;
  name: string;
  thumbnail: string;
  email?: string;
}

export async function getUsers(): Promise<PlexAccountUser[]> {
  const res = await fetcher.get("users");
  if (res.status !== 200) return Promise.reject("Error fetching users.");
  return res.data as PlexAccountUser[];
}
