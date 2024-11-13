import { EmailDocument } from "../types";

const { DateTime } = require("luxon");

export class EmailCollection {
    #col: any;

    constructor(col: string, db: any) {
        try {
            this.#col = db.collection('Email');
        } catch (error) {
            console.error('Error initializing collection:', error);
            throw error;
        }
    }

    async create(email: string) {
        try {
            let obj:EmailDocument = { email };
            const doc = await this.read(obj);
            if (doc) {
                return this.update(email);
            }
            obj.dateTime = DateTime.now().toISO();
            await this.#col.insertOne(obj);
        } catch (error) {
            console.error('Error creating email document:', error);
            throw error;
        }
    }

    async read(obj: Object) {
        try {
            const doc:EmailDocument= await this.#col.findOne(obj);
            return doc;
        } catch (error) {
            console.error('Error reading email document:', error);
            throw error;
        }
    }

    async update(email: string) {
        try {
            const query = { email };
            const updateDoc = { 'dateTime': DateTime.now() };
            await this.#col.updateOne(query, updateDoc);
        } catch (error) {
            console.error('Error updating email document:', error);
            throw error;
        }
    }

    async delete(email: string) {
        try {
            const doc = { email };
            await this.#col.deleteOne(doc);
        } catch (error) {
            console.error('Error deleting email document:', error);
            throw error;
        }
    }
}
