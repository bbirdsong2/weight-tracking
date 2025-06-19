'use client';

import { Typography, Grid2 as Grid, IconButton } from '@mui/material';
import { EditCalendar, Check } from '@mui/icons-material';
import { useState } from 'react';
import DayEdit from './DayEdit';
import { mapFields } from '../util';
import FieldChip from './FieldChip';

export default function DayView({ day, updateDay }) {
  const [isEdit, setIsEdit] = useState(false);
  const [editDay, setEditDay] = useState();
  const changeIsEdit = () => {
    if (isEdit) {
      updateDay(editDay);
    } else {
      setEditDay(day);
    }
    setIsEdit(!isEdit);
  };
  return (
    <>
      <Typography variant="h6">
        {day.date}
        <IconButton size="small" onClick={changeIsEdit}>
          {isEdit ? <Check /> : <EditCalendar />}
        </IconButton>
      </Typography>
      {!isEdit ? (
        <Grid container spacing={2}>
          {mapFields((key, field) => (
            <Grid key={key} padding={2} size={6}>
              <FieldChip value={day[field.prop]} field={field} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <DayEdit day={editDay} setDay={setEditDay} />
      )}
    </>
  );
}
