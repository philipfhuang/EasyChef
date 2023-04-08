import {createContext, useState} from "react";

export const useSearcContext = () => {
    const [search, setSearch] = useState();

    return {
        search,
        setSearch
    }
}

const SearchContext = createContext(
    {
        search: null,
        setSearch: () => {}
    }
)

export default SearchContext