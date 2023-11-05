import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';





export default function Remitente({contacts}) {
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [filteredContacts, setFilteredContacts] = React.useState(contacts);

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue !== '') {
      const newFilteredContacts = contacts.filter((contact) => contact.nombre === selectedValue);
      setFilteredContacts(newFilteredContacts);
    } else {
      setFilteredContacts(contacts);
    }
  };
  
  const uniqueNames = [...new Set(contacts.map((contact) => contact.nombre))];
  
  const columns = [
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 150,
      sortable: false,

      renderHeader: (params) => (
        <select onChange={handleDropdownChange}>
          <option value="">Todos</option>
          {uniqueNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
      ),
    },
    // { field: 'nombre', headerName: 'Nombre', width: 130 },
    { field: 'cargo', headerName: 'Cargo', width: 130 },
    { field: 'categoria', headerName: 'Categoria', width: 130 },
    { field: 'provincia', headerName: 'Provincia', width: 130 },
    { field: 'territorio', headerName: 'Territorio', width: 130 },
    {
      field: 'email',
      headerName: 'Email',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.email || ''}`,
    },
    {
      field: 'telefono',
      headerName: 'Telefono',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      filterable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.telefono || ''}`,
    },
  ];

  const handleSelectionModelChange = (selectionModel) => {
    setSelectedIds(selectionModel);
    console.log(selectionModel);
  };



  return (
    <Paper elevation={3} sx={{ height: 'auto', width: '100%', backgroundColor: 'grey.300' }}>
      <DataGrid
        // rows={contacts}
        rows={filteredContacts}
        columns={columns}
        getRowId={(contacts) => contacts._id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        selectionModel={selectedIds}
        onRowSelectionModelChange={handleSelectionModelChange}
        autoHeight={true}
      />
    </Paper>
  );
}
