import supertest from 'supertest'
import app from '../../src/interface'
import mongoose from 'mongoose'
import { Book } from '../../src/domain/book';
import dotenv from 'dotenv'
dotenv.config();

const request = supertest(app);

describe("UpdateBookE2E", () => {
    beforeEach(async () => {
        await mongoose.connect(process.env.MONGODB_URI as string);
    });
    
    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should update a book that already exists", async ()=> {
        const book = {
            title: "The Pragmatic Programmer",
            author: "Andrew Hunt",
            isbn: "978-0201616224",
            publisher: "Addison-Wesley",
            category: "Programming",
            status: "read",
        } as Book

        await request.post("/books").send(book);

        const bookSaved: any = await request.get("/books");

        const idBook = bookSaved[0]["id"]

        const fieldsToUpdate = {
            title: "My Very New Title",
            author: "Amina"
        }
        const bookUpdated = await request.patch(`/book/${idBook}`).send(fieldsToUpdate);

        expect(bookUpdated).toMatchObject({ 
            message: `Livro com ${idBook} alterado com sucesso`, 
            bookUpdated: {
                title: "My Very New Title",
                author: "Amina",
                isbn: "978-0201616224",
                publisher: "Addison-Wesley",
                category: "Programming",
                status: "read",
            } })
        
    })

})