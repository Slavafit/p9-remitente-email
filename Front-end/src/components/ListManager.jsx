import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Paper, TextField, Button, IconButton } from '@mui/material';
import _ from 'lodash';
import axios from 'axios';
import { addTokenToHeaders } from "../service/AuthUser";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteValueModal from './modals/delValueModal' 



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedItem, theme) {
  return {
    fontWeight:
      selectedItem.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function ListManager({ updateLists, search, showSnack, setLoading, refreshFlag }) {
  const [isDelOpen, setDelOpen] = useState(false);  //окно удаления
  const theme = useTheme();
  const [lists, setLists] = useState({});
  const [newItems, setNewItems] = useState({
    cargo: '',
    provincia: '',
    entidad: '',
    categoria: '',
    territorio: '',
  });
  const [editItem, setEditItem] = useState({ listName: '', itemIndex: null, newValue: '' });


  const fetchLists = async () => {
    try {
      setLoading(true);
      addTokenToHeaders();
      const response = await axios.get(`http://localhost:5000/lists`);
      let fetchedLists = response.data[0]; // Получаем первый объект из массива
      // console.log("get",fetchedLists);
      setLists(fetchedLists);
      updateLists(fetchedLists)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [refreshFlag]);


    //добавление новых значений в массивы
  const handleNewChange = (listName) => (event) => {
    // console.log("handleNewChange",listName);
    setNewItems({
      ...newItems,
      [listName]: event.target.value
    });
  };

  const handleAddItem = (listName) => async () => {
    try {
      setLoading(true);
      addTokenToHeaders();
      const updatedList = {
        _id: lists._id,
        [listName]: [...lists[listName], newItems[listName]] // Добавить новый элемент к массиву
      };
      // console.log("post-patch",listName)
      const response = await axios.patch(`http://localhost:5000/lists/`,updatedList);
      // console.log(response.data);
      if (response.status === 200) {
        showSnack(`"${newItems[listName]}" added in "${listName}" successfully`);
        setTimeout(() => {
          fetchLists();
        }, 1000);
      }
      setLoading(false);
    } catch (error) {
        showSnack(error.data.message);
        console.error(`Error adding item to ${listName}:`, error);
    }
  };



  //метод редактирования list
  const handleSelectItem = (listName, itemIndex) => {
    // console.log("handleSelectItem",editItem);
    setEditItem({
      listName,
      itemIndex,
      newValue: lists[listName][itemIndex],
    });
  };

  const handleEditChange = (event) => {
    // console.log("handleEditChange",editItem);
    setEditItem(prevEditItem => ({ ...prevEditItem, newValue: event.target.value }));
  };

  const handleEditItem = async () => {
    try {
      setLoading(true);
      addTokenToHeaders();
      const updatedData = { ...lists };
      const { listName, newValue, itemIndex } = editItem;
          // Обновление массива
        updatedData[listName][itemIndex] = newValue;
      await axios.put(`http://localhost:5000/lists/`, updatedData);
      showSnack(`"${newValue}" edited in "${listName}"`);
      setTimeout(() => {
        fetchLists();
      }, 1000);
      setLoading(false);
    } catch (error) {
      // showSnack(error.data.message);
      console.error(`Error editing item in ${editItem.listName}:`, error);
    }
  };

    // Метод удаления элемента из массива
    const handleDeleteItem = async () => {
      try {
        setLoading(true);
        addTokenToHeaders();
        const { listName, itemIndex } = editItem;
        // console.log("Метод удаления элемента",listName,itemIndex)
        const updatedData = { ...lists };
        const valueToDelete = updatedData[listName][itemIndex];
        updatedData[listName] = updatedData[listName].filter((_, index) => index !== itemIndex);
        // console.log("updatedData after deletion:",updatedData);
        const response = await axios.put(`http://localhost:5000/lists/`, updatedData);
        if (response.status === 200) {
          setDelOpen(false);
          showSnack(`Value "${valueToDelete}" from "${listName}" was deleted`);
          setTimeout(() => {
            fetchLists();
          }, 1000);
        }
        setLoading(false);
      } catch (error) {
        // Обработка ошибки
        console.error(`Error deleting item from ${editItem.listName}:`, error);
      }
    };

  return (
    <>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: '100%',
        },
      }}
    >
      <Paper elevation={3} sx={{ backgroundColor: 'grey.300' }}>
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel id="list-name">Select List</InputLabel>
          <Select
            labelId="list-name"
            title="Select list"
            value={editItem.listName}
            onChange={(event) => setEditItem({ ...editItem, listName: event.target.value, newValue: '' })}
            input={<OutlinedInput label="Select List" />}
            MenuProps={MenuProps}
          >
            {Object.keys(lists).filter(key => Array.isArray(lists[key])).map((listName) => (
              <MenuItem key={listName} value={listName}>
                {listName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* добавление нового */}
        {editItem.listName && (
          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id="selected-list">Select Value</InputLabel>
            <Select
              title="Select value"
              labelId="selected-value"
              value={editItem.newValue}
              onChange={(event) => handleEditChange(event)}
              input={<OutlinedInput label="Select Value" />}
              MenuProps={MenuProps}
            >
              {lists[editItem.listName].map((name, index) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, editItem.newValue, theme)}
                  onClick={() => handleSelectItem(editItem.listName, index)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl sx={{ m: 1, width: "auto" }}>
        <TextField
          labelId="selected-value"
          value={newItems[editItem.listName]}
          onChange={handleNewChange(editItem.listName)}
          label={`New value in ${editItem.listName}`}
        />
          <IconButton title="Add item">
            <ControlPointIcon onClick={handleAddItem(editItem.listName)}/>
          </IconButton>
        {/* <Button title="Add item" onClick={handleAddItem(editItem.listName)}>Add Item</Button> */}
        </FormControl>
        {/* редактирование */}
        <FormControl sx={{ m: 1, width: 200 }}>

        <TextField
          value={editItem.newValue}
          onChange={handleEditChange}
          label={`Edit value item ${editItem.listName}`}
        />
          <IconButton title="Edit item">
            <EditRoundedIcon onClick={handleEditItem}/>
          </IconButton>
        </FormControl>

          <IconButton sx={{ m: 1, ml: 6 }} size="large"
            title="Delete item" onClick={()=>{setDelOpen(true)}}>
            <DeleteIcon />
          </IconButton>


          {/* <Button variant="outlined" onClick={handleDeleteItem}>Delete Item</Button> */}

      </Paper>
      </Box>
        <DeleteValueModal
        deleteOpen={isDelOpen}
        deleteClose={()=>{setDelOpen(false)}}
        onDelete={handleDeleteItem}
      />
    </>
  );
  
  
}

export default ListManager;