import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditModalAdmin from "./components/modals/editUserAdmin";
import DeleteUserModal from "./components/modals/deleteUserModal"
import { addTokenToHeaders } from './service/addTokenToHeaders';
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'username', label: 'Username'},
  { id: 'email', label: 'Email', },
  { id: 'roles', label: 'Roles', minWidth: 200 },
  { id: 'isActivated', label: 'Activate', minWidth: 100 },
  // { id: 'actions', label: 'Actions' },
];


export default function UsersTable( {showSnack, open, close} ) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userDeleteId, setUserDeleteId] = useState(null);

  const fetchUsers = async () => {
    try {
      addTokenToHeaders();
      const response = await axios.get("https://p9-remitente.oa.r.appspot.com/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  //показать окно редактирования
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = async (newUsername, newEmail, newRol) => {
    try {
      const userData = {
        username: newUsername,
        email: newEmail,
        roles: newRol
      };
      addTokenToHeaders();
      const response = await axios.put(
        `https://p9-remitente.oa.r.appspot.com/users/${selectedUser._id}`, 
        userData
        );
      showSnack(`New username: "${response.data.username}", new email: ${response.data.email}`);
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      let err = error.response.data.errors[0]
      showSnack(`Error: ${err.message}`);
      console.error("Error updating user:", error);
    }
  };


    //показать модальное окно delete
    const handleShow = (user) => {
      setShowDeleteModal(true);
      setUserDeleteId(user);
    };


    //метод удаления delete
    const deleteUser = async () => {
      try {
        addTokenToHeaders();
        const response = await axios.delete(
          `https://p9-remitente.oa.r.appspot.com/users/${userDeleteId._id}`
          );
        if (response.status === 200) {
          showSnack(`Usuario "${userDeleteId.username}" eliminado exitosamente`);
          setTimeout(() => {
            fetchUsers();
          }, 1000);
        };
        setShowDeleteModal(false);
        
      } catch (error) {
        console.error("Error delete user:", error);
      }
    };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Dialog open={open} onClose={close}>
      <DialogTitle>Usuarios</DialogTitle>
        <DialogContent sx={{height: 'auto', width: '100%', padding: 3, backgroundColor: 'grey.100'}}>
          <Paper sx={{boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)', backgroundColor: 'grey.300'}}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                          {columns.map((column) => {
                            const value = row[column.id];
                            let cellContent = value;
                            let cellStyle = {}; // Объект для стиля ячейки
                            if (column.id === 'isActivated' && typeof value === 'boolean') {
                              cellContent = value ? 'Activated' : 'Not activated';
                              // Настройка цвета в зависимости от значения
                              cellStyle.color = value ? 'green' : 'red';
                            } else if (column.format && typeof value === 'number') {
                              cellContent = column.format(value);
                            }
                            return (
                              <TableCell key={column.id} align={column.align} style={cellStyle}>
                                {cellContent}
                              </TableCell>
                            );
                          })}
                            <TableCell>
                              <IconButton onClick={() => handleEditUser(row)}>
                                <EditRoundedIcon />
                              </IconButton>
                              <IconButton onClick={() => handleShow(row)}>
                                <DeleteIcon />  
                              </IconButton>
                            </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <DialogActions sx={{flexDirection: 'column', gap:2, my:2}}>
            <Button 
            variant="outlined"
            onClick={close} 
            color="success">
              Cancelar
            </Button>
          </DialogActions>
      </DialogContent>
    </Dialog>
    <EditModalAdmin
        editOpen={showEditModal}
        handleClose={() => setShowEditModal(false)}
        onSubmit={handleSaveUser}
        selectedUser={selectedUser}
        />

      <DeleteUserModal
        deleteOpen={showDeleteModal}
        deleteClose={()=>setShowDeleteModal(false)}
        onDelete={deleteUser}
        />
    </>
  );
}
