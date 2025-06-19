'use client';

import { ArrowBackIosNew } from '@mui/icons-material';
import { Box, Card, CardContent, Fab } from '@mui/material';
import { CONTAINERS, convert } from '../util';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { convertToJs, convertToString, getNowJs } from '../dates';
import Graph from './Graph';

export default function ChartContainer({
  person,
  updateSettings,
  setContainer,
}) {
  const [startDate, setStartDate] = useState(
    convertToJs(person.settings.chartDate),
  );
  const changeDate = (newStartDate) => {
    setStartDate(newStartDate);
    updateSettings({
      ...person.settings,
      chartDate: convertToString(newStartDate),
    });
  };

  const changeContainer = () => {
    setContainer(CONTAINERS.home);
  };

  // Calculate charts data
  const weightChangeSums = [];
  const calChangeSums = [];
  let curDate = startDate;
  let tomorrow = getNowJs().add(1, 'day');
  while (curDate.isBefore(tomorrow)) {
    const entry = person.entries.find(
      (e) => e.date === convertToString(curDate),
    );
    curDate = curDate.add(1, 'day');
    if (entry) {
      if (entry.deltas.day.weight) {
        const prevSum =
          weightChangeSums.length > 0
            ? parseFloat(weightChangeSums[weightChangeSums.length - 1].weight)
            : 0;
        weightChangeSums.push({
          weight: (prevSum + parseFloat(entry.deltas.day.weight)).toFixed(2),
          date: entry.date,
        });
      }

      if (entry.calories && entry.mbr) {
        const prevSum =
          calChangeSums.length > 0
            ? calChangeSums[calChangeSums.length - 1].calories
            : 0;
        calChangeSums.push({
          calories: prevSum + entry.calories - entry.mbr,
          date: entry.date,
        });
      }
    }
  }

  const charts = [
    {
      label: `Total Weight Change ${weightChangeSums.length > 0 ? `(${weightChangeSums[weightChangeSums.length - 1].weight} lbs)` : ''}`,
      tooltipName: 'Change:',
      desc: 'This chart shows your total weight change over time',
      data: weightChangeSums,
      xAxisKey: 'date',
      dataKey: 'weight',
      unit: 'lbs',
    },
    {
      label: `Total Calorie Change ${calChangeSums.length > 0 ? `(${calChangeSums[calChangeSums.length - 1].calories} kcals)` : ''}`,
      tooltipName: 'Change:',
      desc: 'This chart shows your total calorie change over time',
      data: calChangeSums,
      xAxisKey: 'date',
      dataKey: 'calories',
      unit: 'kcals',
    },
  ];

  return (
    <>
      <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={changeDate}
          />
        </Box>
        <Fab size="medium" onClick={changeContainer}>
          <ArrowBackIosNew />
        </Fab>
      </Box>

      <Card>
        <CardContent>
          {charts.map((c, i) => (
            <Graph
              key={i}
              desc={c.desc}
              tooltipName={c.tooltipName}
              label={c.label}
              data={c.data}
              xAxisKey={c.xAxisKey}
              dataKey={c.dataKey}
              unit={c.unit}
            />
          ))}
        </CardContent>
      </Card>
    </>
  );
}
