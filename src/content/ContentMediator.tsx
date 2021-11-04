import * as React from 'react';
import Topbar from './component/Topbar';
import { Toolbar } from '@mui/material';
import MongoView from './MongoView';
import SelectedDbView from './SelectedDbView';
import SelectedCollectionView from './SelectedCollectionView';
import { IMenuItem } from '../model/IMenuItem';
import SelectedItemView from './SelectedItemView';

export interface IProps {
}
export interface IState {
    viewType: string,
    menuItemList: Array<IMenuItem>,
    selectedItem: any,
}

enum ViewType { MONGO = "MONGO", DB = "DB", COLLECTION = "COLLECTION", ITEM = "ITEM" }

export default class ContentMediator extends React.Component<IProps, IState> {

    state = { viewType: ViewType.MONGO, menuItemList: [{ name: "mongo", type: "MONGO" }], selectedItem: {} };

    showNextView = (menuItem: IMenuItem, selectedItem: any ={}) => {
        const menuItemList = [...this.state.menuItemList, menuItem];
        switch (this.state.viewType) {
            case ViewType.MONGO:
                this.setState({ menuItemList, viewType: ViewType.DB });
                break;
            case ViewType.DB:
                this.setState({ menuItemList, viewType: ViewType.COLLECTION });
                break;
            case ViewType.COLLECTION:
                this.setState({ menuItemList, viewType: ViewType.ITEM, selectedItem });
                break;
        }
    }

    goToViewType = (type: string) => {
        const index = this.state.menuItemList.findIndex((item: IMenuItem) => item.type === type);
        if (index === -1) return;
        const menuItemList = this.state.menuItemList.slice(0, index + 1);
        this.setState({ menuItemList, viewType: type });
    }

    showView = (data: any) => {
        switch (data.action) {
            case "NEXT_VIEW":
                this.showNextView(data.menuItem, data.item);
                break;
            case "GO_TO_VIEW_TYPE":
                this.goToViewType(data.type);
                break;
        }
    }

    render() {
        const { viewType, menuItemList, selectedItem } = this.state;
        return (
            <div style={{ display: "flex" }}>

                <div style={{ position: "fixed", zIndex: 5000 }}>
                    <Topbar menuItemList={menuItemList} goToViewType={this.goToViewType} />
                </div>

                <div style={{ padding: 20, width: "100%" }}>
                    <Toolbar />

                    {viewType === ViewType.MONGO &&
                        <MongoView showNextView={this.showNextView} />
                    }
                    {viewType === ViewType.DB &&
                        <SelectedDbView menuItemList={menuItemList} showNextView={this.showNextView} />
                    }
                    {viewType === ViewType.COLLECTION &&
                        <SelectedCollectionView menuItemList={menuItemList} showView={this.showView} />
                    }
                    {viewType === ViewType.ITEM &&
                        <SelectedItemView menuItemList={menuItemList} item={selectedItem} goToViewType={this.goToViewType} />
                    }

                </div>

            </div>
        );
    }

}
