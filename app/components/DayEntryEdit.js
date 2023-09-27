"use client";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { updatePropertyField } from '../constants';

export default function DayEntryEdit({ user, entry, setEntry, open, hideEdit, save, remove }) {

  const [dateRequired, setDateRequired] = useState(false);

  const saveEntry = () => {
    setDateRequired(!entry.date);

    if (entry.date) {
      if (!entry.id) {
        const dateAlreadyExists = user.entries.map(e => e.date).indexOf(entry.date) > -1;
        if (dateAlreadyExists) {
          alert('Date ' + entry.date + ' has already been logged.');
          return;
        }
      }
      save();
      hideEdit();
    }
  }

  const handleChange = (e) => {
    setEntry(updatePropertyField(entry, e));
  }

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={hideEdit}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={hideEdit}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {entry.date}
            </Typography>
            <Button autoFocus color="inherit" onClick={() => saveEntry()}>Save</Button>
          </Toolbar>
        </AppBar>
        <Stack margin={2} spacing={2}>
          <TextField required onChange={handleChange} name="date" error={dateRequired}
            type="date" label="Date" value={entry.date} InputLabelProps={{ shrink: true }} />
          <TextField onChange={handleChange} name="weight" type="number" label="Weight" value={entry.weight} />
          <TextField onChange={handleChange} name="calories" type="number" label="Calories" value={entry.calories} />
          <TextField onChange={handleChange} name="steps" type="number" label="Steps" value={entry.steps} />
        </Stack>
      </Dialog>
    </>
  )
}
