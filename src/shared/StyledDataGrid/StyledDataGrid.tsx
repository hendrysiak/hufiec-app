
import { darken, lighten, styled } from '@mui/material/styles';

import {
    DataGrid,
} from '@mui/x-data-grid';

export const getBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

export const getHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

export const getSelectedBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

export const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .super-app-theme--Open': {
        backgroundColor: getBackgroundColor(theme.palette.info.main, theme.palette.mode),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.info.main,
                theme.palette.mode,
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.info.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.info.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .super-app-theme--Filled': {
        backgroundColor: getBackgroundColor(
            theme.palette.success.main,
            theme.palette.mode,
        ),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode,
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.success.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .super-app-theme--PartiallyFilled': {
        backgroundColor: getBackgroundColor(
            theme.palette.warning.main,
            theme.palette.mode,
        ),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.warning.main,
                theme.palette.mode,
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.warning.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.warning.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .super-app-theme--Rejected': {
        backgroundColor: getBackgroundColor(
            theme.palette.error.main,
            theme.palette.mode,
        ),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.error.main,
                theme.palette.mode,
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.error.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.error.main,
                    theme.palette.mode,
                ),
            },
        },
    },
}));  
