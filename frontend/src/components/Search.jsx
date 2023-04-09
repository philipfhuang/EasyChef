import React, {useState} from 'react';
import {AutoComplete} from '@douyinfe/semi-ui';
import {IconSearch} from '@douyinfe/semi-icons';
import axios from "axios";
import {useNavigate} from "react-router-dom";

export const Search = () => {
    const [stringData, setStringData] = useState([]);
    const [value, setValue] = useState('');
    let navigate = useNavigate();

    var timer;
    const handleStringSearch = async (value) => {
        if (!value) return;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(async () => {
            await axios.get(`http://127.0.0.1:8000/search/aid/?content=${value}`)
                .then(response => {
                    setStringData(response.data.results);
                })
        }, 500)
    };

    const handleChange = (value) => {
        setValue(value);
    };

    const submitSearch = () => {
        navigate(`/search?search=${value}`);
    }

    if (window.location.pathname === '/search') return <></>

    return (
        <AutoComplete
            data={stringData}
            value={value}
            showClear
            prefix={<IconSearch />}
            placeholder="Search... "
            onSearch={handleStringSearch}
            onChange={handleChange}
            style={{ width: 300 }}
            onKeyDown={e => {
                if (e.keyCode === 13) {
                    submitSearch();
                }
            }}
        />
    );
}

export default Search