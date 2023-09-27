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
   * 2. Add sign up page
   * 3. Add body fat percentage to daily entries so it can be updated, default to whatever is set on the main user, make it readonly?
   * 4. Calculate diff from previous X day and show, maybe add stats button to show in modal
   *      - i.e. add input to select which day to compare, (7 days ago, 1 day ago, etc.)
   *      - then show the diff against the current day calc's
   */

  const metrics = [
    ["Estimated Calories", calculateDayMetabolicRate(user, entry), "kcals", "lightgrey"],
    ["Weekly Average Intake", calculateAverageIntake(user, entry, 7), "kcals", "lightcyan"],
    ["2 Week Average Intake", calculateAverageIntake(user, entry, 14), "kcals", "lightyellow"],
    ["Monthly Average Intake", calculateAverageIntake(user, entry, 30), "kcals", "lightblue"],
    ["Weekly Average Weight", calculateDayAverageLoss(user, entry, 7), "lbs", "lightcyan"],
    ["2 Week Average Weight", calculateDayAverageLoss(user, entry, 14), "lbs", "lightyellow"],
    ["Monthly Average Weight", calculateDayAverageLoss(user, entry, 30), "lbs", "lightblue"]
  ];

  if (entry.steps) {
    metrics.push(["Steps", entry.steps, null, "seashell"])
  }

  return (
    <>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {moment(entry.date).format("ddd")}
          <Typography variant="subtitle2">{moment(entry.date).format("MM/DD")}</Typography>
        </Typography>
        {entry.weight && <Chip size="small" sx={{ marginLeft: 1 }} icon={<MonitorWeightIcon />} label={entry.weight} />}
        {entry.calories && <Chip size="small" sx={{ marginLeft: 1 }} icon={<FireplaceIcon />} label={entry.calories} />}
      </AccordionSummary>
      <AccordionDetails>
        <Table size="small">
          <TableBody>
            {metrics.map(m => 
              <TableRow key={m[0]} sx={{backgroundColor: m[3]}}>
                <TableCell scope="row">{m[0]}</TableCell>
                <TableCell>{isNaN(m[1]) ? "--" : m[1]} {m[2]}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Button sx={{margin: 1}}  color="secondary" variant="contained" size="small" onClick={showEdit}>Change</Button>
        <Button sx={{margin: 1}} color="error" variant="contained" size="small" onClick={remove}>Remove</Button>
      </AccordionDetails>
    </Accordion>
    </>
  )
}
