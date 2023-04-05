import {Nav, Dropdown, Avatar, Input} from '@douyinfe/semi-ui';
import {IconSemiLogo, IconSearch} from '@douyinfe/semi-icons';

export const MyNav = () => {
    return (
        <>
            <div style={{width: '100%'}}>
                <Nav
                    mode={'horizontal'}
                    items={[
                        {itemKey: 'home', text: 'Home'},
                        {itemKey: 'explore', text: 'Explore'},
                        <Input prefix={<IconSearch/>} placeholder="Search"></Input>,
                    ]}
                    onSelect={key => console.log(key)}
                    header={{
                        logo: <IconSemiLogo style={{height: '36px', fontSize: 36}}/>,
                        text: 'Easychef'
                    }}
                    footer={
                        <Dropdown
                            position={'bottomRight'}
                            render={
                                <Dropdown.Menu>
                                    <Dropdown.Item>详情</Dropdown.Item>
                                    <Dropdown.Item>退出</Dropdown.Item>
                                </Dropdown.Menu>
                            }>
                            <Avatar size="small" color='light-blue' style={{ margin: 4 }}>BD</Avatar>
                            <span>Bytedancer</span>
                        </Dropdown>
                    }
                />
            </div>
        </>
    )
}

export default MyNav