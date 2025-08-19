import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    TablePagination,
    Typography,
    CircularProgress,
    Alert,
    AlertTitle,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled,
    Chip,
    Tooltip,
    TableSortLabel,
} from '@mui/material';
import { MdDelete, MdEvent, MdReceipt } from 'react-icons/md';
import { Helmet } from 'react-helmet';
import useAxios from '../../hooks/useAxios';
import TableLoader from '../TableLoader/TableLoader';

// Styled Components
const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%)',
    color: 'white',
    borderRadius: '5px',
    padding: '7px 16px',
    fontWeight: 500,
    fontSize: '0.875rem',
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #5B37A1 0%, #2563EB 100%)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
        transform: 'translateY(-1px)',
    },
    '&:disabled': {
        background: theme.palette.grey[300],
        color: theme.palette.grey[500],
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
        '& fieldset': {
            borderColor: '#6B46C1',
        },
        '&:hover fieldset': {
            borderColor: '#5B37A1',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#5B37A1',
            borderWidth: '2px',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#6B46C1',
        fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#5B37A1',
    },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    margin: theme.spacing(2, 0),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.grey[50],
    },
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
        transition: 'background-color 0.2s ease',
    },
}));

const OrderStatement = () => {
    const [axiosSecure] = useAxios();
    const { data: payments = [], refetch, isLoading, isError } = useQuery({
        queryKey: ['completed-payments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/order/admin/completed');
            return res.data?.data || [];
        },
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [deletingPayments, setDeletingPayments] = useState({});
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        title: '',
        message: '',
    });
    const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState({ type: '', paymentId: '' });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const showAlert = (severity, title, message) => {
        setAlert({
            open: true,
            severity,
            title,
            message,
        });
    };

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const confirmAction = (type, paymentId) => {
        setCurrentAction({ type, paymentId });
        setActionConfirmOpen(true);
    };

    const handleConfirmAction = () => {
        setActionConfirmOpen(false);
        if (currentAction.type === 'delete') {
            handleDelete(currentAction.paymentId);
        }
    };

    const handleDelete = async (paymentId) => {
        setDeletingPayments(prev => ({ ...prev, [paymentId]: true }));

        try {
            await axiosSecure.delete(`/api/order/admin/${paymentId}`);
            await refetch();
            showAlert('success', 'Deletion Successful', 'Payment record deleted successfully.');
        } catch (error) {
            console.error('Error deleting payment:', error);
            showAlert('error', 'Deletion Failed', 'Failed to delete payment record.');
        } finally {
            setDeletingPayments(prev => ({ ...prev, [paymentId]: false }));
        }
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Date(dateString).toLocaleDateString('en-BD', options);
    };

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return 'N/A';
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getTicketSummary = (tickets = []) => {
        if (!Array.isArray(tickets)) return 'No tickets';
        return tickets
            .map(
                (ticket) =>
                    `${ticket.type || 'Unknown'} (Qty: ${ticket.quantity || 0}, Price: ${formatCurrency(
                        ticket.price || 0
                    )})`
            )
            .join(', ');
    };

    const filteredPayments = useMemo(() => {
        return payments
            .filter((payment) => {
                if (!payment) return false;
                const searchLower = searchQuery.toLowerCase();
                return (
                    payment.customerEmail?.toLowerCase().includes(searchLower) ||
                    payment.eventId?.title?.toLowerCase().includes(searchLower) ||
                    payment.transactionId?.toLowerCase().includes(searchLower) ||
                    payment.customerPhone?.toLowerCase().includes(searchLower) ||
                    payment.userDetails?.designation?.toLowerCase().includes(searchLower) ||
                    payment.userDetails?.institute?.toLowerCase().includes(searchLower)
                );
            })
            .sort((a, b) => {
                const aValue = sortConfig.key === 'amount' ?
                    (a.amount || 0) - (a.discount || 0) :
                    sortConfig.key === 'eventId.title' ?
                        a.eventId?.title :
                        a[sortConfig.key];

                const bValue = sortConfig.key === 'amount' ?
                    (b.amount || 0) - (b.discount || 0) :
                    sortConfig.key === 'eventId.title' ?
                        b.eventId?.title :
                        b[sortConfig.key];

                if (sortConfig.key === 'createdAt') {
                    return sortConfig.direction === 'asc'
                        ? new Date(aValue || 0) - new Date(bValue || 0)
                        : new Date(bValue || 0) - new Date(aValue || 0);
                }
                if (sortConfig.key === 'amount') {
                    return sortConfig.direction === 'asc' ?
                        (aValue || 0) - (bValue || 0) :
                        (bValue || 0) - (aValue || 0);
                }
                return sortConfig.direction === 'asc'
                    ? String(aValue || '').localeCompare(String(bValue || ''))
                    : String(bValue || '').localeCompare(String(aValue || ''));
            });
    }, [payments, searchQuery, sortConfig]);

    const paginatedPayments = useMemo(() => {
        return filteredPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredPayments, page, rowsPerPage]);

    if (isLoading) return <TableLoader />;
    if (isError) return (
        <Alert severity="error" sx={{ m: 2, borderRadius: '8px' }}>
            <AlertTitle>Error Loading Data</AlertTitle>
            Failed to load payment records. Please try again later.
        </Alert>
    );

    return (
        <div className="overflow-hidden" style={{ position: 'relative', padding: '3px' }}>
            <Helmet>
                <title>Payment Statements | Evento</title>
            </Helmet>

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={alert.severity}
                    variant="filled"
                    onClose={handleCloseAlert}
                    sx={{ width: '100%', borderRadius: '8px' }}
                >
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                </Alert>
            </Snackbar>

            <Dialog
                open={actionConfirmOpen}
                onClose={() => setActionConfirmOpen(false)}
                aria-labelledby="alert-dialog-title"
                sx={{ '& .MuiDialog-paper': { borderRadius: '12px', padding: '16px' } }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ color: '#6B46C1', fontWeight: 'bold' }}>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ borderRadius: '8px' }}>
                        <AlertTitle>Warning</AlertTitle>
                        Are you sure you want to delete this payment record? This action cannot be undone.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setActionConfirmOpen(false)}
                        sx={{
                            color: '#6B46C1',
                            '&:hover': { backgroundColor: 'rgba(91, 55, 161, 0.04)' },
                        }}
                    >
                        Cancel
                    </Button>
                    <StyledButton onClick={handleConfirmAction}>Confirm</StyledButton>
                </DialogActions>
            </Dialog>

            <div className="bg-white mx-3 shadow-sm">
                <div className="p-3">
                    <div className="lg:flex justify-between items-center">
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e', mb: { xs: 2, lg: 0 } }}>
                            Event Payment Records
                        </Typography>
                        <StyledTextField
                            label="Search by Email, Event, Transaction, or Details"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            sx={{ width: { xs: '100%', sm: 300 }, backgroundColor: 'white' }}
                        />
                    </div>
                </div>

                {filteredPayments.length === 0 ? (
                    <Alert severity="info" sx={{ m: 2, borderRadius: '8px' }}>
                        <AlertTitle>No Records Found</AlertTitle>
                        No payment records match your search criteria.
                    </Alert>
                ) : (
                    <StyledTableContainer component={Paper}>
                        <Table size="medium" aria-label="payment records table">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f7ff' }}>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                                        <TableSortLabel
                                            active={sortConfig.key === 'customerName'}
                                            direction={sortConfig.key === 'customerName' ? sortConfig.direction : 'asc'}
                                            onClick={() => handleSort('customerName')}
                                        >
                                            Customer
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                                        <TableSortLabel
                                            active={sortConfig.key === 'eventId.title'}
                                            direction={sortConfig.key === 'eventId.title' ? sortConfig.direction : 'asc'}
                                            onClick={() => handleSort('eventId.title')}
                                        >
                                            Event Details
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>Tickets</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>Payment Method</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                                        <TableSortLabel
                                            active={sortConfig.key === 'createdAt'}
                                            direction={sortConfig.key === 'createdAt' ? sortConfig.direction : 'asc'}
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            Date
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1a237e' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedPayments.map((payment, index) => (
                                    <StyledTableRow key={payment._id || index}>
                                        <TableCell sx={{ color: '#1a237e' }}>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell sx={{ color: '#1a237e' }}>
                                            <Tooltip title={`${payment.customerName || 'N/A'} (${payment.customerEmail || 'N/A'})`}>
                                                <div>
                                                    <Typography fontWeight={600}>{payment.customerName || 'N/A'}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {payment.customerEmail || 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {payment.customerPhone || 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {payment.userDetails?.designation || 'N/A'} at {payment.userDetails?.institute || 'N/A'}
                                                    </Typography>
                                                </div>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{ color: '#1a237e' }}>
                                            {payment.eventId ? (
                                                <Tooltip title={`${payment.eventId.title || 'N/A'} at ${payment.eventId.location || 'N/A'}`}>
                                                    <div>
                                                        <Typography fontWeight={600}>
                                                            <Chip
                                                                icon={<MdEvent />}
                                                                label={payment.eventId.title || 'N/A'}
                                                                size="small"
                                                                sx={{ mb: 1, backgroundColor: '#e8e6f8', color: '#6B46C1' }}
                                                            />
                                                        </Typography>
                                                        <Typography variant="body2">{payment.eventId.location || 'N/A'}</Typography>
                                                        <Typography variant="body2">
                                                            {formatDate(payment.eventId.date)}
                                                        </Typography>
                                                    </div>
                                                </Tooltip>
                                            ) : (
                                                <Typography color="error">Event not available</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ color: '#1a237e' }}>
                                            <Tooltip title={getTicketSummary(payment.tickets)}>
                                                <Typography variant="body2">{getTicketSummary(payment.tickets)}</Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{ color: '#1a237e' }}>
                                            <Chip
                                                label={payment.paymentMethod || 'N/A'}
                                                size="small"
                                                sx={{ backgroundColor: '#e8e6f8', color: '#6B46C1' }}
                                            />
                                            <Tooltip title={payment.transactionId || 'N/A'}>
                                                <Chip
                                                    icon={<MdReceipt />}
                                                    label={payment.transactionId || 'N/A'}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ borderColor: '#6B46C1', color: '#6B46C1', my: 2 }}
                                                />
                                            </Tooltip>
                                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                {formatCurrency((payment.amount || 0) - (payment.discount || 0))}
                                            </Typography>
                                            {(payment.discount || 0) > 0 && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Discount: {formatCurrency(payment.discount)}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ color: '#1a237e' }}>
                                            {formatDate(payment.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Delete payment record">
                                                <StyledButton
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={
                                                        deletingPayments[payment._id] ? (
                                                            <CircularProgress size={20} color="inherit" />
                                                        ) : (
                                                            <MdDelete size={20} />
                                                        )
                                                    }
                                                    onClick={() => confirmAction('delete', payment._id)}
                                                    disabled={deletingPayments[payment._id] || !payment._id}
                                                >
                                                    {deletingPayments[payment._id] ? 'Deleting...' : 'Delete'}
                                                </StyledButton>
                                            </Tooltip>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={filteredPayments.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-input': {
                                    color: '#1a237e',
                                    fontWeight: 500,
                                },
                                '& .MuiSvgIcon-root': {
                                    color: '#6B46C1',
                                },
                            }}
                        />
                    </StyledTableContainer>
                )}
            </div>
        </div>
    );
};

export default OrderStatement;