import React, { Component } from 'react'
import { DbConfig } from '../model/DbConfig';
import { DbService } from '../model/DbService';
import ItemFormComp from './component/ItemFormComp';
import ItemCardComp from './component/ItemCardComp';
import ButtonStack from './component/ButtonStack';
import { ViewMode } from '../model/ViewMode';
import FailureList from './component/FailureList';

interface IProps {
    showNextView: Function
}
interface IState {
    mode: string,
    itemList: Array<any>,
    errorMsg: string,
    formItem: any,
}

export default class MongoView extends Component<IProps, IState> {
    state = { mode: ViewMode.LOADING, itemList: [], errorMsg: "", formItem: undefined }
    dbService = new DbService();
    formFieldList = [
        { key: "name", label: "DB name" },
    ]

    componentDidMount() {
        this.getItemList();
    }

    async getItemList() {
        const dbResult = await this.dbService.getDbList();
        this.setState({ mode: ViewMode.DATA, errorMsg: dbResult.errorMsg, itemList: dbResult.data ?? [] });
    }

    onItemCardClick = (item: any) => {
        this.props.showNextView({ name: item.name, type: "DB" });
    }

    onFormButtonClick = (data: any) => {
        const { action, formItem } = data;
        switch (action) {
            case "CANCEL":
                this.setState({ mode: ViewMode.DATA, errorMsg: "" });
                break;
            case "SAVE":
                this.createDb(formItem);
                break;
        }
    }

    async createDb(formItem: any) {
        this.setState({ mode: ViewMode.SENDING, errorMsg: "" });
        const dbResult = await this.dbService.createDb(formItem.name);
        if (dbResult.errorMsg) {
            this.setState({ mode: ViewMode.EDIT, errorMsg: dbResult.errorMsg, formItem });
        } else {
            this.props.showNextView({ name: formItem.name, type: "DB" });
        }
    }

    buttonDataList = [ { label: "Add DB", action: "ADD_ITEM" } ];

    onMenuButtonClick = (action: string) => {
        if (action === "ADD_ITEM") this.setState({ mode: ViewMode.ADD });
    }

    render() {
        const { mode, itemList, errorMsg, formItem } = this.state;
        if (mode === ViewMode.LOADING) return(<div>{mode}...</div>);
        return (
            <div>
                <b>Mongo middleware URI: </b>{DbConfig.mongoMiddlewareUrl}
                {errorMsg &&
                    <FailureList failureList={[errorMsg]} />
                }
                {mode === ViewMode.DATA &&
                    <div style={{ marginTop: 20 }}>

                        <ButtonStack buttonDataList={this.buttonDataList} onButtonClick={this.onMenuButtonClick} />

                        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20 }}>
                            {itemList.map((item, index) =>
                                <ItemCardComp 
                                    key={index} 
                                    item={item} 
                                    fieldNameList={["collections", "dataSize"]} 
                                    onItemCardClick={this.onItemCardClick} 
                                />
                            )}
                        </div>

                    </div>
                }
                {(mode === ViewMode.ADD || mode === ViewMode.EDIT || mode === ViewMode.SENDING) &&
                    <ItemFormComp
                        viewMode={mode}
                        item={formItem ?? {}}
                        fieldList={this.formFieldList}
                        onFormButtonClick={this.onFormButtonClick}
                    />
                }
            </div>
        )
    }

}
