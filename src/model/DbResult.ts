export class DbResult {
    errorMsg: string = "";
    data: any;

    constructor(rawObj: any) {
        this.errorMsg = rawObj.errorMsg ?? "";
        this.data = rawObj.data;
    }
}