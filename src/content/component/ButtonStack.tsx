import React, { Component } from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface IProps {
    buttonDataList: Array<any>,
    onButtonClick: Function,
    buttonSize?: string,
}

export default class ButtonStack extends Component<IProps> {

    getButton = (item: any, index: number) => {
        const color = item.color ?? "success";
        const variant = "outlined";
        const size: any = this.props.buttonSize ?? "small";
        return (
            <Button key={index} color={color} variant={variant} size={size} onClick={() => this.props.onButtonClick(item.action)}>
                {item.label}
            </Button>
        );
    }

    render() {
        return (
            <Stack direction="row" spacing={2}>
                {this.props.buttonDataList.map((item, index) =>
                    this.getButton(item, index)
                )}
            </Stack>
        )
    }
}
