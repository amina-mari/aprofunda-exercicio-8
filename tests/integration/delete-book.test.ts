import supertest from 'supertest'
import app from '../../src/interface'
import mongoose from 'mongoose'
import { Book } from '../../src/domain/book';
import dotenv from 'dotenv'
dotenv.config();

const request = supertest(app);

describe("DeleteBookE2E", () => {
    beforeEach(async () => {
        await mongoose.connect(process.env.MONGODB_URI as string);
    });
    
    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should return an empty list when a list of one item receive a delete request", async ()=>{
        const book = {
            title: "The Pragmatic Programmer",
            author: "Andrew Hunt",
            isbn: "978-0201616224",
            publisher: "Addison-Wesley",
            category: "Programming",
            status: "read",
        } as Book

        await request.post("/books").send(book);

        const bookSaved :any = await request.get("/books");

        const idBook = bookSaved[0]["id"]

        const response = await request.delete(`/book/${idBook}`)

        expect(response.body).toMatchObject({
            message: `Livro com ${idBook} deletado com sucesso`,
            booksFiltered: [],
        })
    })
})