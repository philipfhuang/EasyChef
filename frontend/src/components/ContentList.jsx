//import React, { useState, useEffect } from 'react';
import { Avatar, List } from '@douyinfe/semi-ui';

const ContentList = (props) => {
    return (
        <div style={{paddng: 12, border: '1px solid var(--semi-color-border)', margin: 12}}>
        <List
            dataSource={props.contentToShow}
            layout="vertical"
            renderItem={item => (
                <List.Item
                    header={<Avatar>{item.cover}</Avatar>}
                    main={
                        <div>
                            <span>{item.title}</span>
                        </div>
                    }
                />
            )}
        />
        </div>
    )
}

export default ContentList;