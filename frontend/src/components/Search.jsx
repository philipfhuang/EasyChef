import React, {useState} from 'react';
import {AutoComplete} from '@douyinfe/semi-ui';
import {IconSearch} from '@douyinfe/semi-icons';

export const Search = () => {
    const [stringData, setStringData] = useState([]);
    const [value, setValue] = useState('');

    const handleStringSearch = (value) => {
        let result;
        if (value) {
            result = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
        } else {
            result = [];
        }
        setStringData(result);
    };

    const handleChange = (value) => {
        console.log('onChange', value);
        setValue(value);
    };

    const submitSearch = () => {
        console.log('submitSearch', value);
    }
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