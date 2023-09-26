"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { calculateAverageIntake, calculateDayAverageLoss, sortEntries } from '../constants';
import { Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

export default function ChartModal({ user }) {

    const [show, setShow] = useState(false);
    const [days, setDays] = useState(30);
    
    const data = [];
    const lastDayEntries = user.entries.slice(0, days);
    const entries = sortEntries(lastDayEntries, true);
    for (var i = 1; i < entries.length; i++) {
        const curEntry = entries[i - 1];
        const nextEntry = entries[i];

        const curWeekWeight = calculateDayAverageLoss(user, curEntry, 7);
        const nextWeekWeight = calculateDayAverageLoss(user, nextEntry, 7);

        const curWeekCalories = calculateAverageIntake(user, curEntry, 7);
        const nextWeekCalories = calculateAverageIntake(user, nextEntry, 7);

        const prevDataWeightVariance = data.length > 0 ? data[i - 2].weightVariance : 0;
        const prevDataCaloricVariance = data.length > 0 ? data[i - 2].caloricVariance : 0;
        const prevWeightChange = data.length > 0 ? data[i - 2].weightChange : 0;
        const prevCaloricChange = data.length > 0 ? data[i - 2].caloricChange : 0;

        data.push({
            date: curEntry.date,
            weightChange: ((nextWeekWeight - curWeekWeight)) + prevWeightChange,
            caloricChange: ((nextWeekCalories - curWeekCalories)) + prevCaloricChange,
            weightVariance: ((nextWeekWeight - curWeekWeight)),
            caloricVariance: ((nextWeekCalories - curWeekCalories)),
        });
    }

    if (user.entries.length <= 1) {
        return;
    }

    var lastEntry = entries[0];

    return (
        <>
            <Button sx={{marginTop: 2, marginLeft: 2}} color="primary" variant="contained" size="small" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'} Charts</Button>
            {show && 
            <>
                <Stack margin={2} spacing={2}>
                    <TextField onChange={(e) => setDays(parseInt(e.target.value))} name="steps" type="number" label="Days" value={days} />
                </Stack>
                <h5 style={{marginTop: 10, color: 'black'}}>Weight Average</h5>
                <ResponsiveContainer width="95%" height={300}>
                    <LineChart data={entries}>
                        <XAxis dataKey="date" />
                        <YAxis domain={[lastEntry.weight - 10, lastEntry.weight + 10]} />
                        <CartesianGrid stroke="black" strokeDasharray="5 5"/>
                        <Line label="Weight" type="monotone" dataKey="weight" stroke="blue" />
                    </LineChart>
                </ResponsiveContainer>

                <h5 style={{color: 'black'}}>Weight Change</h5>
                <ResponsiveContainer width="95%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="black" strokeDasharray="5 5"/>
                        <Line label="Weight" type="monotone" dataKey="weightChange" stroke="blue" />
                    </LineChart>
                </ResponsiveContainer>

                <h5 style={{color: 'black'}}>Weight Variance</h5>
                <ResponsiveContainer width="95%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="black" strokeDasharray="5 5"/>
                        <Line label="Weight" type="monotone" dataKey="weightVariance" stroke="blue" />
                    </LineChart>
                </ResponsiveContainer>

                <h5 style={{color: 'black'}}>Caloric Average</h5>
                <ResponsiveContainer width="95%" height={300}>
                    <LineChart data={entries}>
                        <XAxis dataKey="date" />
                        <YAxis domain={[lastEntry.calories - 1000, lastEntry.calories + 1000]} />
                        <CartesianGrid stroke="black" strokeDasharray="5 5"/>
                        <Line label="Calories" type="monotone" dataKey="calories" stroke="blue" />
                    </LineChart>
                </ResponsiveContainer>

                <h5 style={{color: 'black'}}>Caloric Change</h5>
                <ResponsiveContainer width="95%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="black" strokeDasharray="5 5"/>
                        <Line label="Weight" type="monotone" dataKey="caloricChange" stroke="blue" />
                    </LineChart>
                </ResponsiveContainer>

                <h5 style={{color: 'black'}}>Caloric Variance</h5>
                <ResponsiveContainer width="95%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="black" strokeDasharray="5 5"/>
                        <Line label="Weight" type="monotone" dataKey="caloricVariance" stroke="blue" />
                    </LineChart>
                </ResponsiveContainer>
            </>
            }
        </>
    )
}
