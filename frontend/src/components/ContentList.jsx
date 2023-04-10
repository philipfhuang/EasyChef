import React, { useState, useEffect, useNavigate } from 'react';
import { Avatar, List, Button } from '@douyinfe/semi-ui';

const ContentList = (props) => {

    //let navigate = useNavigate();
    console.log(props.content);
    
    const get_recipe = (id) => {
        window.location.href = "/recipe/" + id + "/";
    }

    return (
        <div style={{paddng: 12, border: '1px solid var(--semi-color-border)', margin: 12}}>
            <List
                dataSource={props.content}
                layout="vertical"
                renderItem={item => 
                    (item.cover ? (
                        <List.Item
                            header={
                            <Avatar size="extra-small" style={{ margin: 4 }} onClick={() => get_recipe(item.id)} alt='User'>
                                {item.cover}
                            </Avatar>}
                            main={<li key={item.id}>{item.title}</li>}
                        />
                        ) : (
                        <List.Item 
                            header={<Avatar color="green" onClick={() => get_recipe(item.id)}>R</Avatar>}
                            main={<li key={item.id}>{item.title}</li>} 
                        />)
                              
                )
                 
            }
            />
        </div>
    )
}

export default ContentList;