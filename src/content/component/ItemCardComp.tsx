import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

interface IProps {
    item: any;
    fieldNameList: Array<string>;
    onItemCardClick: Function;
}

export default function ItemCardComp({ item, fieldNameList, onItemCardClick }: IProps) {

    return (
        <Card style={{ marginRight: 10, marginBottom: 12, width: 300 }}>
            <CardActionArea onClick={() => onItemCardClick(item)}>
                <CardContent style={{ display: "flex", flexWrap: "wrap" }}>

                    <div>
                        <Typography style={{ marginLeft: 15 }} component="span">
                            {item.name}
                        </Typography>

                        {fieldNameList.length > 0 &&
                            <div style={{ marginLeft: 15 }}>

                                {fieldNameList.map((key: string, index) => (
                                    <Typography style={{ marginRight: 10 }} key={index} variant="body2" color="textSecondary" component="span">
                                        <b>{key}:</b> {item[key]}
                                    </Typography>
                                ))}
                            </div>
                        }
                    </div>

                </CardContent>
            </CardActionArea>
        </Card>
    );
}
