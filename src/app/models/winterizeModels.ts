import { Zone } from 'app/models/rachioModels';

export type WinterizeSettings = {
  blowOutTime: number;
  recoveryTime: number;
}

export type WinterizeStep = {
  id: string;
  name: string;
  active: boolean;
  selected: boolean;
  blowOutTime: number;
  recoveryTime: number;
  zone: Zone;
  cycleId: string;
}
