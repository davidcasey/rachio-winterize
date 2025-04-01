import { Zone } from 'app/models/rachioModels';

export type WinterizeDefaults = {
  blowOutTime: number;
  recoveryTime: number;
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
