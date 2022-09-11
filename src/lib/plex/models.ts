export interface PlexServer {
  name: string;
  product: string;
  productVersion: string;
  platform: string;
  platformVersion: string;
  device: string;
  clientIdentifier: string;
  createdAt: string;
  lastSeenAt: string;
  provides: string;
  ownerId: number;
  sourceTitle: string;
  publicAddress: string;
  accessToken: string;
  owned: boolean;
  home: boolean;
  synced: boolean;
  relay: boolean;
  presence: boolean;
  httpsRequired: boolean;
  publicAddressMatches: boolean;
  dnsRebindingProtection: boolean;
  natLoopbackSupported: boolean;
  connections: PlexServerConnection[];

  // custom property that contains the URI of a connection that was tested and working
  preferredConnection: string;
}

export interface PlexServerConnection {
  protocol: string;
  address: string;
  port: number;
  uri: string;
  local: boolean;
  relay: boolean;
  IPv6: boolean;
}

export interface MediaContainer {
  size: number;
  allowSync: boolean;
  title1: string;
  Directory: Directory[];
}

export interface Directory {
  allowSync: boolean;
  art: string;
  composite: string;
  filters: boolean;
  refreshing: boolean;
  thumb: string;
  key: string;
  type: string;
  title: string;
  agent: string;
  scanner: string;
  language: string;
  uuid: string;
  updatedAt: number;
  createdAt: number;
  scannedAt: number;
  content: boolean;
  directory: boolean;
  contentChangedAt: number;
  hidden: number;
  Location: Location[];

  // We set these after fetching for easy access.
  accessToken: string;
  connection: string;
}

export interface Location {
  id: number;
  path: string;
}

export interface UsersRoot {
  id: number;
  name: string;
  guestUserID: number;
  guestUserUUID: string;
  guestEnabled: boolean;
  subscription: boolean;
  users: User[];
}

export interface User {
  id: number;
  uuid: string;
  title: string;
  username?: string;
  email?: string;
  friendlyName?: string;
  thumb: string;
  hasPassword: boolean;
  restricted: boolean;
  updatedAt: number;
  restrictionProfile: any;
  admin: boolean;
  guest: boolean;
  protected: boolean;
  pin?: string;
}

export interface AccountInfo {
  id: number;
  uuid: string;
  username: string;
  title: string;
  email: string;
  friendlyName: string;
  locale: any;
  confirmed: boolean;
  joinedAt: number;
  emailOnlyAuth: boolean;
  hasPassword: boolean;
  protected: boolean;
  thumb: string;
  authToken: string;
  mailingListStatus: string;
  mailingListActive: boolean;
  scrobbleTypes: string;
  country: string;
  pin: string;
  subscription: Subscription;
  subscriptionDescription: string;
  restricted: boolean;
  anonymous: any;
  home: boolean;
  guest: boolean;
  homeSize: number;
  homeAdmin: boolean;
  maxHomeSize: number;
  rememberExpiresAt: number;
  profile: Profile;
  entitlements: string[];
  roles: string[];
  services: Service[];
  adsConsent: any;
  adsConsentSetAt: any;
  adsConsentReminderAt: any;
  experimentalFeatures: boolean;
  twoFactorEnabled: boolean;
  backupCodesCreated: boolean;
}

export interface Subscription {
  active: boolean;
  subscribedAt: string;
  status: string;
  paymentService: string;
  plan: string;
  features: string[];
}

export interface Profile {
  autoSelectAudio: boolean;
  defaultAudioLanguage: string;
  defaultSubtitleLanguage: string;
  autoSelectSubtitle: number;
  defaultSubtitleAccessibility: number;
  defaultSubtitleForced: number;
}

export interface Service {
  identifier: string;
  endpoint: string;
  token?: string;
  secret?: string;
  status: string;
}

// Library Contents

export interface PlexLibrary {
  Metadata: PlexLibraryMetadata;
}

export interface PlexLibraryMetadata {
  size: number;
  allowSync: boolean;
  art: string;
  identifier: string;
  librarySectionID: number;
  librarySectionTitle: string;
  librarySectionUUID: string;
  mediaTagPrefix: string;
  mediaTagVersion: number;
  thumb: string;
  title1: string;
  title2: string;
  viewGroup: string;
  viewMode: number;
  Metadata: PlexContentMetadata[];
}

export interface PlexContentMetadata {
  ratingKey: string;
  key: string;
  guid: string;
  studio?: string;
  type: string;
  title: string;
  contentRating?: string;
  summary: string;
  audienceRating?: number;
  year?: number;
  tagline?: string;
  thumb: string;
  art: string;
  duration: number;
  originallyAvailableAt?: string;
  addedAt: number;
  updatedAt: number;
  audienceRatingImage?: string;
  chapterSource?: string;
  primaryExtraKey?: string;
  Media: Medum[];
  Genre?: Genre[];
  Director?: Director[];
  Writer?: Writer[];
  Country?: Country[];
  Role?: Role[];
  viewCount?: number;
  lastViewedAt?: number;
  titleSort?: string;
  originalTitle?: string;
  viewOffset?: number;
  skipCount?: number;
}

export interface Medum {
  id: number;
  duration: number;
  bitrate: number;
  width: number;
  height: number;
  aspectRatio: number;
  audioChannels: number;
  audioCodec: string;
  videoCodec: string;
  videoResolution: string;
  container: string;
  videoFrameRate: string;
  audioProfile?: string;
  videoProfile: string;
  Part: Part[];
  optimizedForStreaming?: number;
  has64bitOffsets?: boolean;
}

export interface Part {
  id: number;
  key: string;
  duration: number;
  file: string;
  size: number;
  audioProfile?: string;
  container: string;
  videoProfile: string;
  has64bitOffsets?: boolean;
  optimizedForStreaming?: boolean;
  hasThumbnail?: string;
  hasChapterVideoStream?: boolean;
}

interface ITag {
  tag: string;
}

export type Genre = ITag;

export type Director = ITag;

export type Writer = ITag;

export type Country = ITag;

export type Role = ITag;
