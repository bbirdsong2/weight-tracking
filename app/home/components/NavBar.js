'use client';

import { Box, AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { Settings, AccountCircle } from '@mui/icons-material';
import { CONTAINERS } from '../util';

export default function NavBar({ person, registerPerson, setContainer }) {
    const changeContainer = () => {
        setContainer(CONTAINERS.settings);
    };

    const onRegister = () => {
        registerPerson();
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {person.name}
                    </Typography>
                    <IconButton size="large" edge="start" onClick={changeContainer} sx={{ mr: 2 }}>
                        <Settings />
                    </IconButton>
                    {/* {person.userId ? (
                        <IconButton size="large" edge="start">
                            <AccountCircle />
                        </IconButton>
                    ) : (
                        <Button color="inherit" onClick={onRegister}>
                            Register
                        </Button>
                    )} */}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
