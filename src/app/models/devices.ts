export type Zone = {
  name: string;
  id: string;
  imageUrl: string;
  enabled: boolean;
  zoneNumber: number;
};

export type Device = {
  name: string;
  id: string;
  latitude: number;
  longitude: number;
  zones: Zone[];
};

export type DeviceInfo = {
  fullName: string;
  devices: Device[];
};
