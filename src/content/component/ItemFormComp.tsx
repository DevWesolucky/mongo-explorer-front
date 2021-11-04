import { TextField } from '@mui/material';
import * as React from 'react';
import { ViewMode } from '../../model/ViewMode';
import ButtonStack from './ButtonStack';

interface IProps {
    viewMode: string,
    item: any,
    fieldList: Array<any>,
    onFormButtonClick: Function,
}

export default class ItemFormComp extends React.Component<IProps> {

    formItem: any = this.initFormItem();
    dataTypeMap: Map<string, string> = this.getDataTypeMap();

    initFormItem() {
        const formItem: any = {};
        for (const field of this.props.fieldList) {
            if (!this.props.item.hasOwnProperty(field.key) && this.props.viewMode === ViewMode.EDIT) {
                formItem[field.key] = `Invalid field key: "${field.key}"`;
                continue;
            }
            formItem[field.key] = this.props.item[field.key] ?? "";
        }
        return formItem;
    }

    getDataTypeMap() {
        const dataTypeMap: Map<string, string> = new Map();
        for (const item of this.props.fieldList) dataTypeMap.set(item.key, item.type ?? "string");
        return dataTypeMap;
    }

    onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        this.formItem[id] = this.dataTypeMap.get(id) === "number" ? parseFloat(value) : value;
    }

    getInputs() {
        return (
            <div style={{ marginTop: 30, marginBottom: 20 }}>
                {this.props.fieldList.map((item, index) =>
                    <div key={index} style={{ marginTop: 20 }}>
                        <TextField
                            id={item.key}
                            label={item.label}
                            style={ item.width ? { width: item.width } : { width: 400 }}
                            defaultValue={this.formItem[item.key]}
                            onChange={this.onInputChange}
                        />
                    </div>
                )}
            </div>
        )
    }

    buttonDataList = [
        { label: "Save", action: "SAVE" },
        { label: "Cancel", action: "CANCEL", color: "warning" }
    ];

    onMenuButtonClick = (action: string) => {
        this.props.onFormButtonClick({ action, formItem: this.formItem });
    }

    render() {
        const { viewMode } = this.props;
        if (viewMode === ViewMode.SENDING) return (<div>{viewMode}...</div>);
        return (
            <div>
                {this.getInputs()}
                <ButtonStack buttonDataList={this.buttonDataList} onButtonClick={this.onMenuButtonClick} />
            </div>
        );
    }

}
