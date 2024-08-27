import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import Login from './Login';
import Register from './Register';
import styles from './AuthPage.module.css';

const AuthPage = () => {
    const [tab, setTab] = useState(0);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <div className={styles["auth-page-container"]}>
            <div className={styles["auth-box"]}>
                <Typography variant="h4" gutterBottom align="center" className={styles["auth-title"]}>
                    Bienvenido
                </Typography>
                <Tabs 
                    value={tab} 
                    onChange={handleChange} 
                    centered 
                    className={styles["auth-tabs"]}
                    TabIndicatorProps={{ style: { backgroundColor: '#007bff' } }} // Personaliza el color del indicador de la pestaña
                >
                    <Tab label="Iniciar Sesión" className={styles["auth-tab"]} />
                    <Tab label="Registrar" className={styles["auth-tab"]} />
                </Tabs>
                <Box className={styles["auth-content"]}>
                    {tab === 0 && <Login />}
                    {tab === 1 && <Register />}
                </Box>
            </div>
        </div>
    );
};

export default AuthPage;
