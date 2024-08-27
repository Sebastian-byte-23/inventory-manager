// src/components/ProductFilter.js
import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FilterList as FilterListIcon } from '@mui/icons-material';


const ProductFilter = ({ anchorEl, handleClick, handleClose, searchTerm, setSearchTerm, minPrice, setMinPrice, maxPrice, setMaxPrice, minQuantity, setMinQuantity, maxQuantity, setMaxQuantity }) => {
    return (
        <>
            <IconButton
                aria-controls="filter-menu"
                aria-haspopup="true"
                onClick={handleClick}
                color="primary"
            >
                <FilterListIcon />
            </IconButton>
            <Menu
                id="filter-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem>
                    <TextField
                        label="Buscar por nombre"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </MenuItem>
                <MenuItem>
                    <TextField
                        label="Precio Mínimo"
                        variant="outlined"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </MenuItem>
                <MenuItem>
                    <TextField
                        label="Precio Máximo"
                        variant="outlined"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </MenuItem>
                <MenuItem>
                    <TextField
                        label="Cantidad Mínima"
                        variant="outlined"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={minQuantity}
                        onChange={(e) => setMinQuantity(e.target.value)}
                    />
                </MenuItem>
                <MenuItem>
                    <TextField
                        label="Cantidad Máxima"
                        variant="outlined"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={maxQuantity}
                        onChange={(e) => setMaxQuantity(e.target.value)}
                    />
                </MenuItem>
                <MenuItem>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleClose();
                            // Trigger filtering if needed
                        }}
                    >
                        Aplicar Filtros
                    </Button>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ProductFilter;
