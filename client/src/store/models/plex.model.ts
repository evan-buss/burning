export interface Server {
  name: string;
  ip: string;
  id: string;
  device: string;
}

export interface PlexAccountUser {
  id: number;
  name: string;
  thumbnail: string;
  email?: string;
}

export type LibraryType = "movie" | "show" | "artist";

export interface Library {
  title: string;
  id: string;
  type: LibraryType;
}

export interface PinResponse {
  id?: string;
  code?: string;
}
