// src/components/Filament.js
import React from 'react';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const Filament = ({ status }) => {
    let icon;
    let color;

    switch (status) {
        case 'in-stock':
            icon = <CheckCircleOutlined />;
            color = 'green';
            break;
        case 'low-stock':
            icon = <ExclamationCircleOutlined />;
            color = 'orange';
            break;
        case 'out-of-stock':
            icon = <CloseCircleOutlined />;
            color = 'red';
            break;
        default:
            icon = <ExclamationCircleOutlined />;
            color = 'grey';
    }

    return <span style={{ color }}>{icon}</span>;
};

export default Filament;
