'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const theme = createTheme({
    colorSchemes: {
        dark: true,
    },
});

export default function PageWrapper({ children }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </LocalizationProvider>
    );
}
