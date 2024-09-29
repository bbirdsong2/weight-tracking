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
import FastfoodIcon from '@mui/icons-material/Fastfood';

export default function DayEntryView({ user, entry, metrics, showEdit, remove }) {

  /**
   * TODO:
   * 1. Add daily activity modifier and use it for calculation (make it a dropdown)
   * 2. Add sign up page
   * 3. Add body fat percentage to daily entries so it can be updated, default to whatever is set on the main user, make it readonly?
   * 4. Calculate diff from previous X day and show, maybe add stats button to show in modal
   *      - i.e. add input to select which day to compare, (7 days ago, 1 day ago, etc.)
   *      - then show the diff against the current day calc's
   */

  return (
    <>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {moment(entry.date).format("ddd")}
          <Typography variant="subtitle2">{moment(entry.date).format("MM/DD")}</Typography>
        </Typography>
        {entry.weight && <Chip size="small" sx={{ marginLeft: 1 }} icon={<MonitorWeightIcon />} label={entry.weight} />}
        {entry.calories && <Chip size="small" sx={{ marginLeft: 1 }} icon={<FastfoodIcon />} label={entry.calories} />}
      </AccordionSummary>
      <AccordionDetails>
        <Table size="small">
          <TableBody>
            {metrics.map(m =>
              <TableRow key={m.name} sx={{backgroundColor: m.color}}>
                <TableCell scope="row">{m.name}</TableCell>
                <TableCell>{isNaN(m.value) ? "--" : m.value} {m.unit}</TableCell>
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
