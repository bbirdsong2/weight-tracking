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

export default function DayEntryEdit({ entry, setEntry, open, hideEdit, save, remove }) {

  const [dateRequired, setDateRequired] = useState(false);

  const saveEntry = () => {
    setDateRequired(!entry.date);

    if (entry.date) {
      save();
      hideEdit();
    }
  }

  const handleChange = (e) => {
    setEntry({
      ...entry,
      [e.target.name]: e.target.type === 'number' ? (!isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : '') : e.target.value
    });
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