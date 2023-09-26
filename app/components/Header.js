"use client";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

export default function Header({ user, updateUser }) {

  const handleChange = (e) => {
    updateUser({
      ...user,
      [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    });
  }

  return (
    <Accordion elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{user.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack margin={2} spacing={2}>
          <TextField required onChange={handleChange} name="birthDate" type="date" 
                label="Birth Date" value={user.birthDate} InputLabelProps={{ shrink: true }} />
          <TextField required onChange={handleChange} name="bodyFatPercentage" type="number"
                label="Body Fat Percentage" value={user.bodyFatPercentage} InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select required value={user.gender} label="Gender" name="gender" onChange={handleChange}>
              <MenuItem disabled value=""><em>Gender</em></MenuItem>
              <MenuItem value={"M"}>Male</MenuItem>
              <MenuItem value={"F"}>Female</MenuItem>
            </Select>
          </FormControl>
          <TextField required onChange={handleChange} name="activityModifier" type="number"
                label="Activity Modifier" value={user.activityModifier} InputLabelProps={{ shrink: true }} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
