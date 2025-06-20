'use client';

import { ArrowBackIosNew } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Fab, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { convertToJs, convertToString } from '../dates';

export default function SettingContainer({ settings, updateSettings, setContainer }) {
    const [demographics, setDemographics] = useState(settings);
    const changeContainer = () => {
        setContainer(1);
    };
    const handleDateChange = (date) => {
        if (date.isValid()) {
            handleChange({
                target: {
                    name: 'birthDate',
                    value: convertToString(date),
                },
            });
        }
    };
    const handleChange = (e) => {
        setDemographics({
            ...demographics,
            [e.target.name]: e.target.value,
        });
    };
    const updateDemographics = () => {
        updateSettings(demographics);
        changeContainer();
    };
    return (
        <>
            <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                <Fab size="medium" onClick={changeContainer}>
                    <ArrowBackIosNew />
                </Fab>
                <Box sx={{ flexGrow: 1 }}></Box>
            </Box>
            <Card>
                <CardContent>
                    <Stack marginTop={2} marginBottom={2} spacing={2}>
                        <Typography variant="h6">Base Demographics</Typography>
                        <DatePicker label="Birth Date" name="birthDate" value={convertToJs(demographics.birthDate)} onChange={handleDateChange} />
                        <FormControl fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select value={demographics.gender} label="Gender" name="gender" onChange={handleChange}>
                                <MenuItem disabled value="">
                                    <em>Gender</em>
                                </MenuItem>
                                <MenuItem value={'M'}>Male</MenuItem>
                                <MenuItem value={'F'}>Female</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography variant="h6">Variable Demographics</Typography>
                        <TextField
                            onChange={handleChange}
                            name="bodyFatPercentage"
                            type="number"
                            label="Body Fat Percentage"
                            value={demographics.bodyFatPercentage}
                        />
                        <TextField
                            onChange={handleChange}
                            name="activityModifier"
                            type="number"
                            label="Default Activity Modifier (1.55 is relatively active)"
                            value={demographics.activityModifier}
                        />
                        <Button onClick={updateDemographics} variant="outlined">
                            Update
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}
