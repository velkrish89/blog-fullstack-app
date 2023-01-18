import { MongoClient} from 'mongodb';

let db;

async function connectToDb(cb) {

    const client = new MongoClient(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@cluster0.rgrvecx.mongodb.net/?retryWrites=true&w=majority`);
    await client.connect();

    db = client.db('react-blog-db');
    cb();
}

export {
    db, 
    connectToDb
}