import * as React from 'react';
import Switch from '@mui/material/Switch';
import { Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function ControlledSwitch({ control, name, label }) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Switch
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
          label={label}
        />
      )}
    />
  );
}
