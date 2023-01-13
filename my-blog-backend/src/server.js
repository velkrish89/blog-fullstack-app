import express from 'express';
import { db, connectToDb } from './db.js';
import cors from 'cors';

const app = express();
app.use(express.json())

app.use(cors());

app.get('/api/articles/:name', async (req, res) => {

    const { name } = req.params;
    

    const article = await db.collection('articles').findOne({ name });

    if(article) {
        res.json(article);
    } else {
        res.sendStatus(404);
    }
})

app.put('/api/articles/:name/upvote', async (req, res) => {

    const { name } = req.params;
    
    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1} //This is will increase the upvotes by one ($inc)
    })

    const article = await db.collection('articles').findOne({ name });

    if(article) {
        res.json(article);
       
    } else {
        res.send('That article doesn\'t exists');
    }
    
})

app.post('/api/articles/:name/comments', async (req, res) => {

    const { name } = req.params;
    const { postedBy, text } = req.body;

    await db.collection('articles').updateOne({ name }, {
        $push: {comments: { postedBy, text }}
    })

    const article = await db.collection('articles').findOne({ name })

    if(article) {
        // article.comments.push({ postedBy, text });
        res.json(article);
    } else {
        res.send('That article doesn\'t exists');
    }
})

connectToDb(() => {
    console.log('Successfully connected to db!!!');
    app.listen(8000, () => {
        console.log('Listening to the request at port 8000');
    })
})
