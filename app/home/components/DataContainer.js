'use client';

import { ArrowBackIosNew } from '@mui/icons-material';
import { Box, Card, CardContent, Fab } from '@mui/material';
import DayView from './DayView';
import { CONTAINERS } from '../util';

export default function DataContainer({ days, updateDay, setContainer }) {
  const changeContainer = () => {
    setContainer(CONTAINERS.home);
  };
  return (
    <>
      <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Fab size="medium" onClick={changeContainer}>
          <ArrowBackIosNew />
        </Fab>
      </Box>
      <Card>
        <CardContent>
          {days.map((day) => (
            <DayView key={day.date} day={day} updateDay={updateDay} />
          ))}
        </CardContent>
      </Card>
    </>
  );
}
