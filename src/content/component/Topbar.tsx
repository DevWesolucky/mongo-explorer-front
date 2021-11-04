import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Stack from '@mui/material/Stack';
import { SvgIcon } from '@mui/material';
import { ReactComponent as DbSvg } from './db.svg';
import { IMenuItem } from '../../model/IMenuItem';

export interface IProps {
    menuItemList: Array<any>,
    goToViewType: Function
}

export default class Topbar extends React.Component<IProps> {

    getButton = (item: IMenuItem, index: number) => {
        const variant = "outlined";
        const disabled = index === this.props.menuItemList.length - 1;
        return (
            <Button key={index} variant={variant} size="small" disabled={disabled} 
                startIcon={this.getIcon(item)} onClick={() => { this.props.goToViewType(item.type) }}>
                {item.name}
            </Button>
        )
    }

    getIcon = (item: IMenuItem) => {
        switch (item.type) {
            case "MONGO":
                return (<HomeIcon />)
            case "DB":
                return (<SvgIcon><DbSvg /></SvgIcon>)
            case "COLLECTION":
                return (<ListAltIcon />)
            case "ITEM":
                return (<InsertDriveFileIcon />)
        }
    }

    render() {
        const { menuItemList } = this.props;
        return (
            <AppBar color="default">
                <Toolbar>
                    <Stack direction="row" spacing={2}>
                        {menuItemList.map((item, index) => this.getButton(item, index))}
                    </Stack>
                </Toolbar>
            </AppBar>
        );
    }

}
