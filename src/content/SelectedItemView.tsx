import React, { Component } from 'react'
import { DbResult } from '../model/DbResult';
import { DbService } from '../model/DbService';
import { IMenuItem } from '../model/IMenuItem';
import { ViewMode } from '../model/ViewMode';
import ButtonStack from './component/ButtonStack';
import FailureList from './component/FailureList';
import ItemFormComp from './component/ItemFormComp';

interface IProps {
    menuItemList: Array<IMenuItem>,
    item: any,
    goToViewType: Function,
}
interface IState {
    mode: string,
    errorMsg: string,
    formItem: any
}

export default class SelectedItemView extends Component<IProps, IState> {
    state = { 
        mode: this.props.item._id ? ViewMode.EDIT : ViewMode.ADD, 
        errorMsg: "", 
        formItem: JSON.parse(JSON.stringify(this.props.item)) // deep copy
    }
    dbService = new DbService();
    db = this.props.menuItemList.find(item => item.type === "DB")?.name ?? "";
    collection = this.props.menuItemList.find(item => item.type === "COLLECTION")?.name ?? "";
    fieldList = this.getFieldList();

    getFieldList() {
        const { item } = this.props;
        const keyList = Object.keys(item).filter(key => key !== "_id");
        const fieldList = keyList.map(key => { return { key, label: key, type: typeof item[key] } });
        return fieldList;
    }

    onFormButtonClick = (data: any) => {
        const { action, formItem } = data;
        switch (action) {
            case "CANCEL":
                this.props.goToViewType("COLLECTION");
                break;
            case "SAVE":
                this.save(formItem);
                break;
        }
    }

    async save (formItem: any) {
        const currMode = this.state.mode;
        this.setState({ mode: ViewMode.SENDING, errorMsg: "", formItem });
        const { db, collection } = this;
        let dbResult: DbResult;
        if (this.state.mode === ViewMode.ADD) {
            dbResult = await this.dbService.addItem(db, collection, formItem);
        } else {
            // send only changed fields
            const data = this.getObjectWithChanges(formItem);
            const query = { _id: this.props.item._id };
            dbResult = await this.dbService.updateItem(db, collection, data, query)
        }
            
        if (dbResult.errorMsg) {
            this.setState({ mode: currMode, errorMsg: dbResult.errorMsg });
        } else {
            this.props.goToViewType("COLLECTION");
        }
    }

    async deleteItem() {
        const currMode = this.state.mode;
        this.setState({ mode: ViewMode.SENDING, errorMsg: "" });
        const { db, collection } = this;
        const dbResult = await this.dbService.deleteItem(db, collection, { _id: this.props.item._id });
        if (dbResult.errorMsg) {
            this.setState({ mode: currMode, errorMsg: dbResult.errorMsg });
        } else {
            this.props.goToViewType("COLLECTION");
        }
    }


    getObjectWithChanges(formItem: any) {
        const obj: any = {};
        for (const key of Object.keys(formItem)) {
            if (this.props.item[key] !== formItem[key]) obj[key] = formItem[key];
        }
        return obj;
    }

    buttonDataList = [
        { label: "Delete item", action: "DELETE", color: "error" }
    ];

    onMenuButtonClick = (action: string) => {
        switch (action) {
            case "DELETE":
                this.deleteItem();
                break;
        }
    }

    render() {
        const { mode, errorMsg, formItem } = this.state;
        if (mode === ViewMode.SENDING) return (<div>{mode}...</div>);
        return (
            <div>
                {errorMsg && 
                    <FailureList failureList={[errorMsg]} />
                }
                <ButtonStack buttonDataList={this.buttonDataList} onButtonClick={this.onMenuButtonClick} />
                <ItemFormComp
                    viewMode={mode}
                    item={formItem}
                    fieldList={this.fieldList}
                    onFormButtonClick={this.onFormButtonClick}
                />
            </div>
        )
    }
}
