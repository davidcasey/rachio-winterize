export type Entity = {
  id: string;
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
