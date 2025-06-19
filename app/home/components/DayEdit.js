'use client';

import { Stack, TextField } from '@mui/material';
import { updatePropertyField } from '@/app/constants';
import { mapFields } from '../util';

export default function DayEdit({ day, setDay }) {
  const handleChange = (e) => {
    setDay(updatePropertyField(day, e));
  };
  return (
    <>
      <Stack marginTop={2} marginBottom={2} spacing={2}>
        {mapFields((key, field) => (
          <TextField
            key={key}
            name={field.prop}
            type="number"
            label={field.label}
            value={day[field.prop]}
            onChange={handleChange}
          />
        ))}
      </Stack>
    </>
  );
}
