import React, { Component } from 'react'
import { Card, CardActionArea } from '@mui/material';
import { DbService } from '../model/DbService';
import TabPagination from './component/TabPagination';
import ButtonStack from './component/ButtonStack';
import { IMenuItem } from '../model/IMenuItem';
import { ViewMode } from '../model/ViewMode';
import FailureList from './component/FailureList';

interface IProps {
    menuItemList: Array<IMenuItem>,
    showView: Function,
}
interface IState {
    mode: string,
    errorMsg: string,
    itemList: Array<any>,
}

export default class SelectedCollectionView extends Component<IProps, IState> {
    state = { mode: ViewMode.LOADING, errorMsg: "", itemList: [] }
    dbService = new DbService();
    db = this.props.menuItemList[1].name;
    collection = this.props.menuItemList[2].name;

    private page: number = 0;
    private limit: number = 10;
    private count: number = 0;

    componentDidMount() {
        this.getItemList();
    }

    async getItemList(query: any = {}) {
        this.setState({ mode: ViewMode.LOADING, errorMsg: "", itemList: [] });
        const { db, collection, page, limit } = this;
        const dbResult = await this.dbService.findItems(db, collection, limit, page, query)
        const { errorMsg, data } = dbResult;
        this.count = data.count;
        this.setState({ mode: ViewMode.DATA, errorMsg, itemList: data.itemList });
    }

    async deleteCollection() {
        this.setState({ mode: ViewMode.SENDING, errorMsg: "" });
        const dbResult = await this.dbService.deleteCollection(this.db, this.collection);
        if (dbResult.errorMsg) {
            this.setState({ mode: ViewMode.DATA, errorMsg: dbResult.errorMsg });
        } else {
            this.props.showView({ action: "GO_TO_VIEW_TYPE", type: "DB" });
        }
    }

    getItemHtml = (item: any, index: number) => {
        return (
            <Card key={index} style={{ marginBottom: 10, padding: 10 }}>
                <CardActionArea onClick={() => this.onItemClick(item)}>
                    <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                        {JSON.stringify(item, undefined, 2)}
                    </pre>
                </CardActionArea>
            </Card>
        )
    }

    onItemClick = (item: any) => {
        const menuItem: IMenuItem = { name: item.name ?? item._id, type: "ITEM" };
        this.props.showView({ action: "NEXT_VIEW", menuItem, item });
    }

    onPaginationAction = (data: any) => {
        switch (data.action) {
            case "CHANGE_PAGE":
                this.page = data.value;
                this.getItemList();
                break;
            case "CHANGE_PER_PAGE":
                this.limit = data.value;
                this.page = 0;
                this.getItemList();
                break;
        }
    }

    getPagination = () => {
        return (<TabPagination perPage={this.limit} page={this.page} count={this.count} onPaginationAction={this.onPaginationAction} />)
    }

    buttonDataList = [
        { label: "Delete collection", action: "DELETE", color: "error" }
    ];

    onMenuButtonClick = (action: string) => {
        switch (action) {
            case "DELETE":
                this.deleteCollection();
                break;
        }
    }

    render() {
        const { mode, errorMsg, itemList } = this.state;
        if (mode === ViewMode.LOADING || mode === ViewMode.SENDING) return (<div>{mode}...</div>);
        if (errorMsg) return (<FailureList failureList={[errorMsg]} />);
        return (
            <div>
                <ButtonStack buttonDataList={this.buttonDataList} onButtonClick={this.onMenuButtonClick} />
                {this.getPagination()}
                <div>
                    {itemList.map((item, index) => this.getItemHtml(item, index))}
                </div>
                {this.count > this.limit && this.getPagination()}
            </div>
        )
    }
}
