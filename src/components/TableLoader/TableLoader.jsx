import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const TableLoader = () => {
    const rows = Array.from(new Array(4)); // Number of skeleton rows

    return (
        <TableContainer
            sx={{
                width: {
                    xs: '330px',
                    sm: '350px',
                    md: '100%',
                },
                mx: 'auto'
            }}
            component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Skeleton animation="wave" variant="text" width={80} />
                        </TableCell>
                        <TableCell>
                            <Skeleton animation="wave" variant="text" width={150} />
                        </TableCell>
                        <TableCell>
                            <Skeleton animation="wave" variant="text" width={100} />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton animation="wave" height={30} />
                            </TableCell>
                            <TableCell>
                                <Skeleton animation="wave" height={30} />
                            </TableCell>
                            <TableCell>
                                <Skeleton animation="wave" height={30} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableLoader;
