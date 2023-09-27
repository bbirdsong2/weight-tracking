"use client";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { updatePropertyField } from '../constants';

export default function Header({ user, updateUser }) {

  const handleChange = (e) => {
    updateUser(updatePropertyField(user, e));
  }

  return (
    <Accordion elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{user.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack margin={2} spacing={2}>
          <TextField onChange={handleChange} name="birthDate" type="date" 
                label="Birth Date" value={user.birthDate} InputLabelProps={{ shrink: true }} />
          <TextField onChange={handleChange} name="bodyFatPercentage" type="number"
                label="Body Fat Percentage" value={user.bodyFatPercentage} InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select value={user.gender} label="Gender" name="gender" onChange={handleChange}>
              <MenuItem disabled value=""><em>Gender</em></MenuItem>
              <MenuItem value={"M"}>Male</MenuItem>
              <MenuItem value={"F"}>Female</MenuItem>
            </Select>
          </FormControl>
          <TextField onChange={handleChange} name="activityModifier" type="number"
                label="Activity Modifier (1.55 is relatively active)" value={user.activityModifier} InputLabelProps={{ shrink: true }} />
          <TextField onChange={handleChange} name="daysToAverage" type="number" placeholder='Leave blank to show 7, 14, and 30 day averages'
                label="Number of days to average weight and calories" value={user.daysToAverage} InputLabelProps={{ shrink: true }} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
