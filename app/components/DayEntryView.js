"use client";

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Chip } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import { calculateDayMetabolicRate, calculateAverageIntake, calculateDayAverageLoss } from '../constants';

export default function DayEntryView({ user, entry, showEdit, remove }) {

  /**
   * TODO:
   * 1. Add daily activity modifier and use it for calculation (make it a dropdown)
   * 2. Deploy
   * 3. Add tooltips / instructions / explanations
   * 4. Add sign up page
   * 5. Add body fat percentage to daily entries so it can be updated, default to whatever is set on the main user, make it readonly?
   */

  const metrics = [
    ["Current Metabolic Rate", calculateDayMetabolicRate(user, entry), "kcals"],
    ["Weekly Average Intake", calculateAverageIntake(user, entry, 7), "kcals"],
    ["2 Week Average Intake", calculateAverageIntake(user, entry, 14), "kcals"],
    ["Monthly Average Intake", calculateAverageIntake(user, entry, 30), "kcals"],
    ["Weekly Average Weight", calculateDayAverageLoss(user, entry, 7), "lbs"],
    ["2 Week Average Weight", calculateDayAverageLoss(user, entry, 14), "lbs"],
    ["Monthly Average Weight", calculateDayAverageLoss(user, entry, 30), "lbs"]
  ];

  if (entry.steps) {
    metrics.push(["Steps", entry.steps])
  }

  return (
    <>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{moment(entry.date).format("MM/DD/YYYY")}</Typography>
        {entry.weight && <Chip size="small" sx={{ marginLeft: 1 }} icon={<MonitorWeightIcon />} label={entry.weight} />}
        {entry.calories && <Chip size="small" sx={{ marginLeft: 1 }} icon={<FireplaceIcon />} label={entry.calories} />}
      </AccordionSummary>
      <AccordionDetails>
        <Table size="small">
          <TableBody>
            {metrics.map(m => 
              <TableRow key={m[0]} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell scope="row">{m[0]}</TableCell>
                <TableCell>{isNaN(m[1]) ? "--" : m[1]} {m[2]}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Button color="secondary" variant="contained" size="small" onClick={showEdit}>Change</Button>
        <Button sx={{marginLeft: 1}} color="error" variant="contained" size="small" onClick={remove}>Remove</Button>
      </AccordionDetails>
    </Accordion>
    </>
  )
}
