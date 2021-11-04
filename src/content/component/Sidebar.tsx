import * as React from 'react';
import { Toolbar, ListItem, ListItemIcon, ListItemText, Drawer, Typography } from '@mui/material';
import { withStyles } from "@mui/styles";
import ListAltIcon from '@mui/icons-material/ListAlt';
import { SvgIcon } from '@mui/material';
import { ReactComponent as DbSvg } from './db.svg';

const drawerWidth = 250;

const styles: any = {
    drawer: {
        width: drawerWidth,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    menuItemIcon: {
        color: '#97c05c',
    },
    taskHead: {
        marginTop: 15,
        fontWeight: "bolder",
        textAlign: "center",
    },
};

interface IProps {
    classes: any,
    viewType: number,
    sidebarMenuItemList: Array<any>,
    currentItemName: string,
    showNextView: Function
}

class Sidebar extends React.Component<IProps> {

    getListItem = (item: any) => {
        const { classes, currentItemName, showNextView } = this.props;

        return (
            <ListItem
                button
                key={item.name}
                selected={currentItemName === item.name}
                onClick={() => showNextView(item.name)}
            >
                <ListItemIcon className={classes.menuItemIcon}>
                    {this.getIcon()}
                </ListItemIcon>

                <ListItemText primary={item.name} />
            </ListItem>
        )
    }

    getIcon = () => {
        if (this.props.viewType === 0) return (<SvgIcon><DbSvg /></SvgIcon>);
        return (<ListAltIcon />);
    }

    render() {
        const { classes, viewType, sidebarMenuItemList } = this.props;
        const headLabel = viewType === 0 ? "DB list" : "Collections";
        return (
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{ paper: classes.drawerPaper }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <Typography variant="button" display="block" gutterBottom className={classes.taskHead}>{headLabel}</Typography>
                    {sidebarMenuItemList.map(item => { return this.getListItem(item) })}
                </div>
            </Drawer>
        );
    }
}

// export default Sidebar;
export default withStyles(styles)(Sidebar);