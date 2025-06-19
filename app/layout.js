'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const theme = createTheme({
    // colorSchemes: {
    //   dark: true,
    // },
});

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Weight Variance Tracking',
//   description:
//     'An app for tracking real time weight and calorie intake from previous weight and intake measurements',
// };

export default function RootLayout({ children }) {
    return (
        <html lang="en" style={{ minHeight: '100vh' }}>
            <body className={inter.className}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </LocalizationProvider>
            </body>
        </html>
    );
}
