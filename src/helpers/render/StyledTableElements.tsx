import { styled, TableCell, tableCellClasses, TableRow } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'rgba(54, 33, 94, 1)',
        color: theme.palette.common.white,
        fontSize: 24,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 24,
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        fontSize: 24,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
