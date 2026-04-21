// import React from "react";
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DataTable from "../components/DataTable";
//import ViewUser from "./ViewUser";       // create this if you have a view modal for users
//import EditUser from "./EditUser";       // your user edit/form modal
//import ConfirmDialog from "./ConfirmDialog"; // your delete confirm dialog (optional)

// ── Column definition for users ──────────────
const USER_COLUMNS = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "role", headerName: "Role", flex: 1 },
];

const User = () => {
    const [users, setUsers] = useState([]);
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // ── Fetch users on mount ──────────────────
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // replace with your actual API call
            // const res = await api.get("/users");
            // setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    // ── Action handlers ───────────────────────
    const handleView = (row) => {
        setSelectedUser(row);
        setOpenView(true);
    };

    const handleEdit = (row) => {
        setSelectedUser(row);
        setOpenEdit(true);
    };

    const handleDeleteClick = (row) => {
        setSelectedUser(row);
        setOpenConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            // replace with your actual API call
            // await api.delete(`/users/${selectedUser.userId}`);
            setUsers((prev) => prev.filter((u) => u.userId !== selectedUser.userId));
            setOpenConfirm(false);
            setSelectedUser(null);
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const handleEditSave = (updatedUser) => {
        setUsers((prev) =>
            prev.map((u) => (u.userId === updatedUser.userId ? updatedUser : u))
        );
        setOpenEdit(false);
    };

    // ── Role-based access (adjust to your auth logic) ──
    const isAdmin = true; // e.g. currentUser.role === "admin"

    return (
        <Box sx={{ p: 3 }}>
            {/* ── Header ── */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h5" fontWeight={600}>
                    User Management
                </Typography>

                {isAdmin && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedUser(null);
                            setOpenEdit(true);
                        }}
                    >
                        Add User
                    </Button>
                )}
            </Box>

            {/* ── Table ── */}
            <DataTable
                rows={users.map((u) => ({ id: u.userId, ...u }))}
                columns={USER_COLUMNS}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                canManage={isAdmin}
            />

            {/* ── View Modal ── */}
            <ViewUser
                open={openView}
                onClose={() => setOpenView(false)}
                data={selectedUser}
            />

            {/* ── Edit / Add Modal ── */}
            <EditUser
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                data={selectedUser}       // null = add mode, object = edit mode
                onSave={handleEditSave}
            />

            {/* ── Delete Confirm Dialog ── */}
            <ConfirmDialog
                open={openConfirm}
                title="Delete User"
                message={`Are you sure you want to delete "${selectedUser?.username}"? This cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setOpenConfirm(false)}
            />
        </Box>
    );
};

export default User;