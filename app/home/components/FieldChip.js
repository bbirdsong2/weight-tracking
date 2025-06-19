'use client';

import { Chip } from '@mui/material';

export default function FieldChip({ value, field }) {
  return (
    <Chip
      style={{ padding: 5 }}
      icon={<field.Icon />}
      label={!value ? '--' : value}
      variant="outlined"
    />
  );
}
