import { fetcher } from "./fetcher";

export async function getLibraries(): Promise<string[]> {
  const res = await fetcher("libraries");
  if (res.status) return Promise.reject("Error fetching libraries.");
  return res.data as string[];
}
