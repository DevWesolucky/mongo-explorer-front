import axios from "axios";
import { DbConfig } from "./DbConfig";
import { DbResult } from "./DbResult";

export class DbService {

    async getDbList(): Promise<DbResult> {
        const req = { method: "GET", type: "DB_LIST" };
        return await this.sendRequest(req);
    }

    async createDb(db: string): Promise<DbResult> {
        const req = { method: "POST", db,  type: "CREATE_DB" };
        return await this.sendRequest(req);
    }

    async getCollectionList(db: string): Promise<DbResult> {
        const req = { method: "GET", db, type: "COLLECTION_LIST" };
        return await this.sendRequest(req);
    }

    async createCollection(db: string, collection: string): Promise<DbResult> {
        const req = { method: "POST", db, collection, type: "CREATE_COLLECTION" };
        return await this.sendRequest(req);
    }

    async addItemsFromJson(db: string, collection: string, content: string, isNewCollection = false): Promise<DbResult> {
        // if should be new collection
        if (isNewCollection) {
            const collectionExists = await this.checkCollectionExists(db, collection);
            if (collectionExists) {
                let errorMsg = `Collection '${collection}' already exists.`;
                errorMsg += " To add item from json file import items from collection view.";
                return new DbResult({ errorMsg });
            }
        }
        try {
            const data = JSON.parse(content);
            if (!Array.isArray(data)) return new DbResult({ errorMsg: "Collection in json file should be array of object" });
            const req = { method: "POST", db, collection, data };
            return await this.sendRequest(req);
        } catch (error) {
            return new DbResult({ errorMsg: (error as Error).message });
        }
    }
    
    async checkCollectionExists(db: string, collection: string): Promise<boolean> {
        const dbResult = await this.getCollectionList(db);
        const itemList = dbResult.data ?? [];
        if (itemList.find((item: any) => collection === item.name)) return true;
        return false;
    }

    async deleteCollection(db: string, collection: string): Promise<DbResult> {
        const req = { method: "DELETE", db, collection, type: "DELETE_COLLECTION" };
        return await this.sendRequest(req);
    }
    
    async findItems(db: string, collection: string, limit: number, page: number, query: any): Promise<DbResult> {
        const dbRequest = { method: "GET", db, collection, limit, page, query };
        return await this.sendRequest(dbRequest);
    }

    async addItem(db: string, collection: string, data: any): Promise<DbResult> {
        const dbRequest: any = { method: "POST", db, collection, data };
        return await this.sendRequest(dbRequest);
    }

    async updateItem(db: string, collection: string, data: any, query: any): Promise<DbResult> {
        const dbRequest: any = { method: "PATCH", db, collection, data, query };
        return await this.sendRequest(dbRequest);
    }

    async deleteItem(db: string, collection: string, query: any): Promise<DbResult> {
        const dbRequest: any = { method: "DELETE", db, collection, query };
        return await this.sendRequest(dbRequest);
    }

    private async sendRequest(req: any): Promise<DbResult> {
        try {
            const res = await axios.post(DbConfig.mongoMiddlewareUrl, req);
            return new DbResult(res.data);
        } catch (error: any) {
            // axios.isAxiosError(error) ? console.log(`axios error: `, error.message) : console.log(`axios UNEXPECTED error: `, error);
            return new DbResult({ errorMsg: `axios error: ${error.message}` });
        }
    }
    
}