import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { visuallyHidden } from '@mui/utils';
import AddEventModal from "./modals/addEventModal"
import axios from "axios";
import { addTokenToHeaders } from "../Service/AuthUser";



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'image',
    numeric: false,
    disablePadding: true,
    label: 'Image',
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Event',
  },
  {
    id: 'description',
    numeric: true,
    disablePadding: false,
    label: 'Event description',
  },
  {
    id: 'startDate',
    numeric: true,
    disablePadding: false,
    label: 'Start date and time',
  },
  {
    id: 'endDate',
    numeric: true,
    disablePadding: false,
    label: 'End date and time',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};



//Расширенная панель инструментов таблицы
function EnhancedTableToolbar(props) {
  const { numSelected, handleAddEvent, isAddOpen, setAddOpen } = props;
    //закрытие модального окна через пропсы из EventTable
  const closeAddModal = () => {
    setAddOpen(false);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <>
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Events List
        </Typography>
            <Tooltip title="Add event">
              <IconButton size='large'>
                <AddCircleOutlineIcon
                onClick={() => setAddOpen(true)}/>
              </IconButton>
          </Tooltip>
        </>
      )}

      {numSelected > 0 ? (
        <>
        <Tooltip title="Edit">
          <IconButton>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
          <AddEventModal
          open={isAddOpen}
          // close={() => setAddOpen(false)}
          close={closeAddModal}
          onSubmit={handleAddEvent}
        />
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};



// Чтобы передать данные события из модального окна в функцию handleAddEvent в EventTable, 
// вы должны передать их из AddEventModal в EnhancedTableToolbar, 
// а затем из EnhancedTableToolbar в EventTable

const EventTable = forwardRef (({ showSnack }, ref) => {
  const tableRef = useRef(null);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('image');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [events, setEvents] = useState([]);
  const [isAddOpen, setAddOpen] = React.useState(false);  //состояние модального окна


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = events.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (_id) => selected.indexOf(_id) !== -1;

  // Избегайте перехода макета при достижении последней страницы с пустыми строками.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - events.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(events, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );


    //отображение GET
    useEffect(() => {
      fetchEvents();
    }, []);
    
    const fetchEvents = async () => {
      try {
        addTokenToHeaders();
        const response = await axios.get(`http://localhost:5000/events`);
        let fetchedEvents = response.data;
        console.log(fetchedEvents)
        setEvents(fetchedEvents);
        if (tableRef.current && tableRef.current.refresh) {
          tableRef.current.refresh();
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    useImperativeHandle(ref, () => ({
      refresh: fetchEvents,
    }));
  
    //добавление event
    const handleAddEvent = async (eventData) => {
      try {
        addTokenToHeaders();
        // console.log(eventData);
        const formData = new FormData();
        formData.append('name', eventData.name);
        formData.append('description', eventData.description);
        formData.append('image', eventData.image);
        formData.append('startDate', eventData.startDate);
        formData.append('endDate', eventData.endDate);
        const response = await axios.post(
          "http://localhost:5000/events/", eventData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        setTimeout(() => {
          // fetchEvents();
        }, 2000);
        setAddOpen(false);
        showSnack(response.data.message);
        // console.log("Event created:", response.data.message);
      } catch (error) {
        if (error.response) {
          const errorMessage = error.response.data;
          showSnack(errorMessage.message)
          // console.log(errorMessage.message)
          console.error("Error create event:", error);
        } else {
          console.error("Network error:", error);
        }
      }
    };


  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
        numSelected={selected.length}
        handleAddEvent={handleAddEvent}
        isAddOpen={isAddOpen} //передаю setAddOpen из EventTable в EnhancedTableToolbar
        setAddOpen={setAddOpen}
        refreshEvents={fetchEvents}
         />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={events.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {row.description}
                    </TableCell>
                    <TableCell align="right">
                    {row.image && row.image.data && row.image.data.type === 'Buffer' ? (
                        <img
                          src={`data:${row.image.contentType};base64,${Buffer.from(row.image.data.data).toString('base64')}`}
                          alt="Event"
                        />
                      ) : null}
                      </TableCell>
                    <TableCell align="right">{row.startDate}</TableCell>
                    <TableCell align="right">{row.endDate}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height:53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>  
  );
});

export default EventTable;