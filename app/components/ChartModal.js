"use client";

import {
  calculateAverageIntake,
  calculateDayAverageLoss,
  calculateDayMetabolicRate,
  sortEntries,
} from "../constants";
import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import Graph from "./Graph";
import { getCharts } from "../charts";

export default function ChartModal({ user }) {
  const [show, setShow] = useState(false);
  const [daysToGraph, setDaysToGraph] = useState(30);
  const [daysToAverage, setDaysToAverage] = useState(user.daysToAverage ? user.daysToAverage : 7);

  const data = [];
  var entries = [];

  if (daysToGraph && daysToAverage) {
    const lastDayEntries = user.entries.slice(0, daysToGraph);
    entries = sortEntries(lastDayEntries, true);
    for (var i = 1; i < entries.length; i++) {
      const curEntry = entries[i - 1];
      const nextEntry = entries[i];

      const curBasalRate = parseFloat(
        calculateDayMetabolicRate(user, curEntry)
      );

      const curWeight = parseFloat(
        calculateDayAverageLoss(user, curEntry, daysToAverage)
      );
      const nextWeight = parseFloat(
        calculateDayAverageLoss(user, nextEntry, daysToAverage)
      );

      const curCalories = parseFloat(
        calculateAverageIntake(user, curEntry, daysToAverage)
      );
      const nextCalories = parseFloat(
        calculateAverageIntake(user, nextEntry, daysToAverage)
      );

      // i - 2 because i starts at 1
      const prevWeightChange = data.length > 0 ? data[i - 2].totalWeightChange : 0;
      // const prevCaloricChange =
      //   data.length > 0 ? data[i - 2].totalCaloricChange : 0;
      const prevCaloricDiff = data.length > 0 ? data[i - 2].totalCaloricDiff : 0;
      const prevCaloricBasalDiff = data.length > 0 ? data[i - 2].totalCaloricBasalDiff : 0;

      data.push({
        date: curEntry.date,
        totalWeightChange: nextWeight - curWeight + prevWeightChange,
        // totalCaloricChange: nextCalories - curCalories + prevCaloricChange,
        dailyWeightChange: nextWeight - curWeight,
        dailyCaloricChange: nextCalories - curCalories,
        dailyActualCaloricChange: nextEntry.calories - curEntry.calories,
        totalCaloricDiff: curEntry.calories - curCalories + prevCaloricDiff,
        totalCaloricBasalDiff: curEntry.calories - curBasalRate + prevCaloricBasalDiff,
      });
    }
    data.forEach((e) => {
      e.totalWeightChange = e.totalWeightChange.toFixed(2);
      e.dailyWeightChange = e.dailyWeightChange.toFixed(2);
    });
  }

  if (user.entries.length <= 1) {
    return;
  }

  return (
    <>
      <Button
        sx={{ marginTop: 2, marginLeft: 2 }}
        color="primary"
        variant="contained"
        size="small"
        onClick={() => setShow(!show)}
      >
        {show ? "Hide" : "Show"} Charts
      </Button>
      {show && (
        <>
          <Stack style={{ marginBottom: 15 }} margin={2} spacing={2}>
            <TextField
              onChange={(e) => setDaysToGraph(parseInt(e.target.value))}
              name="steps"
              type="number"
              label="Number of Days to show on Graph"
              value={daysToGraph}
            />
            <TextField
              onChange={(e) => setDaysToAverage(parseInt(e.target.value))}
              name="steps"
              type="number"
              label="Number of Days used to average your Weight"
              value={daysToAverage}
            />
          </Stack>

          {getCharts(data, entries).map((c, i) => (
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
        </>
      )}
    </>
  );
}
