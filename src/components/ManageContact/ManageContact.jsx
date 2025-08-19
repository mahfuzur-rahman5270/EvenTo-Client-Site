import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    IconButton,
    Box,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemSecondaryAction,
    Paper,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import useAxios from "../../hooks/useAxios";

export default function ManageContact() {
    const [contacts, setContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [axiosSecure] = useAxios();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axiosSecure.get("/api/contacts");
                setContacts(response.data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };
        fetchContacts();
    }, [axiosSecure]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            try {
                await axiosSecure.delete(`/api/contacts/${id}`);
                setContacts(contacts.filter((contact) => contact._id !== id));
            } catch (error) {
                console.error("Error deleting contact:", error);
            }
        }
    };

    const handleEdit = (contact) => {
        setEditingContact({ ...contact }); // Clone to avoid directly mutating state
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setEditingContact(null);
    };

    const handleUpdate = async () => {
        try {
            const response = await axiosSecure.put(
                `/api/contacts/${editingContact._id}`,
                editingContact
            );
            setContacts((prev) =>
                prev.map((contact) =>
                    contact._id === editingContact._id ? response.data : contact
                )
            );
            handleDialogClose();
        } catch (error) {
            console.error("Error updating contact:", error);
        }
    };

    const handleAddItem = (field) => {
        setEditingContact((prev) => ({
            ...prev,
            [field]: [...(prev[field] || []), field === 'socialLinks' ? { title: "", link: "" } : ""],
        }));
    };

    const handleEditItem = (field, index, key, value) => {
        const updatedArray = [...(editingContact[field] || [])];
        if (field === "socialLinks") {
            updatedArray[index][key] = value;
        } else {
            updatedArray[index] = value;
        }
        setEditingContact((prev) => ({
            ...prev,
            [field]: updatedArray,
        }));
    };

    const handleDeleteItem = (field, index) => {
        const updatedArray = [...(editingContact[field] || [])];
        updatedArray.splice(index, 1);
        setEditingContact((prev) => ({
            ...prev,
            [field]: updatedArray,
        }));
    };

    return (
        <Box sx={{ p: 2 }}>
            <Paper
                sx={{
                    p: 2,
                    boxShadow: 3,
                    borderTop: "4px solid #9333ea",
                    borderRadius: "4px 4px 0 0",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Manage Contacts
                </Typography>

                {contacts.length === 0 ? (
                    <Typography>No contacts found.</Typography>
                ) : (
                    contacts.map((contact) => (
                        <Box
                            key={contact._id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 2,
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                p: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="h6">
                                    {contact.name || "Unnamed Contact"}
                                </Typography>
                                <Typography>
                                    Social Links:{" "}
                                    {(contact.socialLinks || []).map((link) => link.link).join(", ")}
                                </Typography>
                                <Typography>
                                    Emails: {(contact.emails || []).join(", ")}
                                </Typography>
                                <Typography>
                                    Phone Numbers:{" "}
                                    {(contact.phoneNumbers || []).join(", ")}
                                </Typography>
                                <Typography>
                                    Address: {contact.address || "N/A"}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(contact)}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    onClick={() => handleDelete(contact._id)}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Box>
                    ))
                )}

                {/* Dialog for editing */}
                <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
                    <DialogTitle>Edit Contact</DialogTitle>
                    <DialogContent>
                        {/* Social Links */}
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Social Links
                        </Typography>
                        <List>
                            {(editingContact?.socialLinks || []).map((link, index) => (
                                <ListItem key={index}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        value={link.title}
                                        onChange={(e) =>
                                            handleEditItem("socialLinks", index, "title", e.target.value)
                                        }
                                        size="small"
                                        sx={{
                                            backgroundColor: "#fff",
                                            borderRadius: 1,
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Link"
                                        value={link.link}
                                        onChange={(e) =>
                                            handleEditItem("socialLinks", index, "link", e.target.value)
                                        }
                                        size="small"
                                        sx={{
                                            backgroundColor: "#fff",
                                            borderRadius: 1,
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            ml: 1,
                                        }}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDeleteItem("socialLinks", index)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            <Button startIcon={<Add />} onClick={() => handleAddItem("socialLinks")}>
                                Add Social Link
                            </Button>
                        </List>

                        {/* Emails */}
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Emails
                        </Typography>
                        <List>
                            {(editingContact?.emails || []).map((email, index) => (
                                <ListItem key={index}>
                                    <TextField
                                        fullWidth
                                        value={email}
                                        onChange={(e) =>
                                            handleEditItem("emails", index, null, e.target.value)
                                        }
                                        size="small"
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDeleteItem("emails", index)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            <Button startIcon={<Add />} onClick={() => handleAddItem("emails")}>
                                Add Email
                            </Button>
                        </List>

                        {/* Phone Numbers */}
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Phone Numbers
                        </Typography>
                        <List>
                            {(editingContact?.phoneNumbers || []).map((phone, index) => (
                                <ListItem key={index}>
                                    <TextField
                                        fullWidth
                                        value={phone}
                                        onChange={(e) =>
                                            handleEditItem("phoneNumbers", index, null, e.target.value)
                                        }
                                        size="small"
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDeleteItem("phoneNumbers", index)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            <Button startIcon={<Add />} onClick={() => handleAddItem("phoneNumbers")}>
                                Add Phone Number
                            </Button>
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button color="primary" variant="contained" onClick={handleUpdate}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
}
