import { JSX } from 'react';

export type CycleSelectorProps = {
  onChange: (cycles: number) => void;
}

export const CycleSelector = ({ onChange }: CycleSelectorProps): JSX.Element => {
  return (
    <div>
      <label htmlFor="cycles">Cycles </label>
      <select
        id="cycles"
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((cycle) => (
          <option key={cycle} value={cycle}>
            {cycle}
          </option>
        ))}
      </select>
    </div>
  );
}
