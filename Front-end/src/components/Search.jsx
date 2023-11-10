import { TextField } from "@mui/material";

 const Search = (props) => {
    const { onChange, value } = props;


    return (
        <>
            <TextField
                fullWidth
                title="Búsqueda" 
                label="Búsqueda"
                variant="filled"
                type="search"
                value={value}
                onChange={onChange}
            />
        </> 
    )

};

export default Search;