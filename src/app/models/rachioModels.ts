export type Entity = {
  token: string;
  id: string;
};

export type EntityInfo = {
  fullName: string;
  devices: Device[];
};

export type Device = {
  name: string;
  id: string;
  latitude: number;
  longitude: number;
  zones: Zone[];
};

export type Zone = {
  name: string;
  id: string;
  imageUrl: string;
  enabled: boolean;
  zoneNumber: number;
};
