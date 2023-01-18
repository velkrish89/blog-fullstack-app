import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useUser from '../hooks/useUser';
import axios from 'axios';
import articles from './article-content';
import NotFoundPage from './NotFoundPage';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';

const ArticlePage = () => {

    const params = useParams();
    const { articleId } = params;
    const [ articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote: false });
    const { canUpvote } = articleInfo;

    const userDetails = useUser();
    const {user, isLoading } = userDetails;
    
    useEffect(() => {
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken();
            const headers = token ? {authtoken: token} : {};
            const response = await axios.get(`http://localhost:8000/api/articles/${articleId}`, {headers});
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        if (!isLoading) {
            loadArticleInfo();
        }
        
    }, [isLoading, user]);

    const article = articles.find((article) => article.name === articleId);

    const addUpvote = async() => {
        const token = user && await user.getIdToken();
            const headers = token ? {authtoken: token} : {};
        const response = await axios.put(`/api/articles/${articleId}/upvote`, null, {headers});
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if(!article) {
        return <NotFoundPage />
    }
    return(
        <>
            <h1>{article.title}</h1>
            <div className='upvote-section'>
                { user ? 
                    <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already Upvoted'}</button> : 
                    <button >Login to upvote</button>
                }
                
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
            </div>
            {article.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
            ))}
            { user ?
                <AddCommentForm 
                articleName={articleId}
                onArticleUpdated={(updatedArticle) => setArticleInfo(updatedArticle)}/> 
                :
                <button>Login to add a comment</button>
            }
            
            <CommentsList comments={articleInfo.comments} />
        </>
    )
}

export default ArticlePage;