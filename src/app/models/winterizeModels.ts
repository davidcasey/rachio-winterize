import { Device, Zone } from 'app/models/rachioModels';

export type WinterizeSettings = {
  blowOutTime: number;
  recoveryTime: number;
  selectedDevice: Device | null;
  activeAction: WinterizeAction | null;
}

export type WinterizeAction = {
  id: string;
  name: string;
  active: boolean;
  selected: boolean;
  blowOutTime: number;
  recoveryTime: number;
  zone: Zone;
}

export type WinterizeSequence = {
  id: string;
  name: string;
  actions: WinterizeAction[];
}
