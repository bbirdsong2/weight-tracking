'use client';

import { Alert, Box, Card, CardContent, Fab, Grid2 as Grid, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { BarChart, EditNote, MonitorWeight, Whatshot } from '@mui/icons-material';
import { CONTAINERS, mapFields } from '../util';
import FieldChip from './FieldChip';

export default function HomeContainer({ date, changeDate, stats, deltas, setContainer }) {
    const changeContainer = (container) => {
        setContainer(container);
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                    <DatePicker label="Stat Day" value={date} onChange={changeDate} />
                </Box>
                <Fab sx={{ marginRight: 2 }} size="medium" onClick={() => changeContainer(CONTAINERS.charts)}>
                    <BarChart />
                </Fab>
                <Fab size="medium" onClick={() => changeContainer(CONTAINERS.data)}>
                    <EditNote />
                </Fab>
            </Box>

            <Card style={{ marginTop: 20 }}>
                <CardContent>
                    <Typography variant="h6">My Stats</Typography>
                    {stats &&
                        stats.map((stat, i) => (
                            <Grid key={i}>
                                <Grid key={i} padding={2} size={12}>
                                    <FieldChip value={stat.value} field={stat} />
                                </Grid>
                                <Grid size={12}>
                                    {stat.missing > 0 && (
                                        <Alert severity="warning">
                                            Missing {stat.missing} measurement
                                            {stat.missing > 1 ? 's' : ''}
                                        </Alert>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                </CardContent>
            </Card>

            {deltas && (
                <Card style={{ marginTop: 20 }}>
                    {Object.keys(deltas)
                        .sort((a, b) => (deltas[a].days > deltas[b].days ? 1 : 0))
                        .map((prop) => (
                            <CardContent key={deltas[prop].days}>
                                <Typography variant="h6">{deltas[prop].name}</Typography>
                                <Grid container spacing={2}>
                                    {mapFields((key, field) => (
                                        <Grid key={key} padding={2} size={6}>
                                            <FieldChip value={deltas[prop][field.prop]} field={field} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        ))}
                </Card>
            )}
        </>
    );
}
