import { JSX, useState } from 'react';
import { Zone } from 'app/models/devices';
import { ZoneSettingsRow } from './ZoneSettingsRow';

export type ZoneSettingsTableProps = {
  zones: Zone[];
}

export const ZoneSettingsTable = ({ zones }: ZoneSettingsTableProps): JSX.Element => {

  return (
    <table>
      <thead>
        <tr>
          <th>Enabled</th>
          <th>Zone Name</th>
          <th>Blow Out Time (seconds)</th>
          <th>Recovery Time (seconds)</th>
        </tr>
      </thead>
      <tbody>
        { zones.map((zone: Zone, zoneIndex) => (
          <ZoneSettingsRow zone={zone} key={zoneIndex} />
        ))}
      </tbody>
    </table>
  );
}
