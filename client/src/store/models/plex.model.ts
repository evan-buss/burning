export interface Server {
  name: string;
  ip: string;
  id: string;
  device: string;
  selected: boolean;
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
  selected: boolean;
}

export interface PinResponse {
  id?: string;
  code?: string;
}
