import { TextField } from "@mui/material";

 const Search = (props) => {
    const { onChange, value, handleSearch} = props;

      //обработчик клавиш
    const handleKeyPress = (e) => {
        if (e.key === "Enter")
        handleSearch();
    };

    return (
        <>
            <TextField
                fullWidth
                label="Search"
                variant="filled"
                type="search"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyPress}
            />
        </> 
    )

};

export default Search;