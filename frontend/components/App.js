import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios, { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { 
    /* ✨ implement */ 
    navigate('/');
  }
  const redirectToArticles = () => { 
    /* ✨ implement */ 
    navigate('/articles')
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    const token = localStorage.getItem('token');
    if(token !== null) localStorage.setItem('token', null);
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage('Goodbye!');
    // In any case, we should redirect the browser back to the login screen, using the helper above.
    redirectToLogin();
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);
    // and launch a request to the proper endpoint.
    const result = await axios.post(loginUrl, { username, password})
    // On success, we should set the token to local storage in a 'token' key,
    const { token, message } = result.data;
    localStorage.setItem('token', token);
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage(message);
    setSpinnerOn(false);
    redirectToArticles();
  }

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);

    // and launch an authenticated request to the proper endpoint.
    const result = await axiosWithAuth.get(articlesUrl);
    const { articles, message } = (await result.json())
    // On success, we should set the articles in their proper state and
    setArticles(articles);
    // put the server success message in its proper state.
    setMessage(message);
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(false);
  }

  const postArticle = async (newArticle) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.

    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);

    // and launch an authenticated request to the proper endpoint.
    const result = await axiosWithAuth.post(articlesUrl, newArticle);
    const { article, message } = (await result.json())
    // On success, we should set the articles in their proper state and
    setArticles([...articles, article]);
    // put the server success message in its proper state.
    setMessage(message);
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(false);
  }

  const updateArticle = async ({ article_id, newArticle }) => {
    // ✨ implement
    // You got this!

    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);

    // and launch an authenticated request to the proper endpoint.
    const result = await axiosWithAuth.put(`${articlesUrl}/${article_id}`, newArticle);
    const { article, message } = (await result.json())
    // On success, we should set the articles in their proper state and
    setArticles([...articles.filter(art => art.article_id !== article_id), article]);
    // put the server success message in its proper state.
    setMessage(message);
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(false);
  }

  const deleteArticle = async (article_id) => {
    // ✨ implement

    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);

    // and launch an authenticated request to the proper endpoint.
    const result = await axiosWithAuth.delete(`${articlesUrl}/${article_id}`);
    const { message } = (await result.json())
    // On success, we should set the articles in their proper state and
    setArticles([...articles.filter(art => art.article_id !== article_id)]);
    // put the server success message in its proper state.
    setMessage(message);
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(false);
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner />
      <Message {...{message}} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm {...{login}} />} />
          <Route path="articles" element={
            <>
              <ArticleForm {...{postArticle, updateArticle, setCurrentArticleId}}/>
              <Articles {...{setCurrentArticleId, currentArticleId, getArticles, deleteArticle}}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
