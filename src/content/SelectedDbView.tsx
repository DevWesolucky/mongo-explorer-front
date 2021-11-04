import React, { Component } from 'react'
import { DbService } from '../model/DbService';
import ItemFormComp from './component/ItemFormComp';
import ItemCardComp from './component/ItemCardComp';
import ButtonStack from './component/ButtonStack';
import { IMenuItem } from '../model/IMenuItem';
import FailureList from './component/FailureList';
import { ViewMode } from '../model/ViewMode';

interface IProps {
    menuItemList: Array<IMenuItem>,
    showNextView: Function
}
interface IState {
    mode: string,
    itemList: Array<any>,
    errorMsg: string,
    formItem: any,
}

export default class SelectedDbView extends Component<IProps, IState> {
    state = { mode: ViewMode.LOADING, itemList: [], errorMsg: "", formItem: undefined }
    dbService = new DbService();
    db = this.props.menuItemList[1].name;
    formFieldList = [
        { key: "name", label: "Collection name", width: 300 },
    ];
    fileInputRef: React.RefObject<HTMLInputElement> = React.createRef();

    componentDidMount() {
        this.getItemList();
    }

    async getItemList() {
        this.setState({ mode: ViewMode.LOADING, errorMsg: "", formItem: undefined });
        const dbResult = await this.dbService.getCollectionList(this.db);
        const { errorMsg, data } = dbResult;
        this.setState({ mode: ViewMode.DATA, errorMsg, itemList: data ?? [] });
    }

    onItemCardClick = (item: any) => {
        this.props.showNextView({ name: item.name, type: "COLLECTION" });
    }

    onFormButtonClick = (data: any) => {
        const { action, formItem } = data;
        switch (action) {
            case "CANCEL":
                this.setState({ mode: ViewMode.DATA, errorMsg: "" });
                break;
            case "SAVE":
                this.createCollection(formItem);
                break;
        }
    }

    selectFiles = async (selectedFileList: FileList | Array<File> | null) => {
        if (!selectedFileList) return;
        this.setState({ mode: ViewMode.SENDING, errorMsg: "" });
        const file = selectedFileList[0];
        const content = await file.text();
        const collection = file.name.toLowerCase().replace(".json", "");
        const dbResult = await this.dbService.addItemsFromJson(this.db, collection, content, true);
        if (dbResult.errorMsg) {
            this.setState({ mode: ViewMode.DATA, errorMsg: dbResult.errorMsg });
        } else {
            this.getItemList();
        }
    }

    async createCollection(formItem: any) {
        this.setState({ mode: ViewMode.SENDING, errorMsg: "" });
        const dbResult = await this.dbService.createCollection(this.db, formItem.name);
        if (dbResult.errorMsg) {
            this.setState({ mode: ViewMode.EDIT, errorMsg: dbResult.errorMsg, formItem });
        } else {
            this.getItemList();
        }
    }

    buttonDataList = [
        { label: "Add empty collection", action: "ADD_ITEM" },
        { label: "Export collection from json", action: "EXPORT_FROM_JSON" }
    ];

    onMenuButtonClick = (action: string) => {
        switch (action) {
            case "ADD_ITEM":
                this.setState({ mode: ViewMode.ADD });
                break;
            case "EXPORT_FROM_JSON":
                this.fileInputRef.current?.click();
                break;
        }
    }

    render() {
        const { mode, itemList, errorMsg, formItem } = this.state;
        if (mode === ViewMode.LOADING) return(<div>{mode}...</div>);
        return (
            <div>
                <b>[DB] {this.db}</b>
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
                                    fieldNameList={["count", "size"]} 
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

                <input
                    type="file"
                    accept={"application/JSON"}
                    multiple={true}
                    style={{ display: "none" }}
                    ref={this.fileInputRef}
                    onChange={(e) => this.selectFiles(e.target.files)}
                />
            </div>
        )
    }
}
