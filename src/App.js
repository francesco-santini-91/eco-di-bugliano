import React, {Component} from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import ProtectedRoute from './components/protectedRoutes/protectedRoutes';
import Header from './components/header/header';
import Homepage from './components/homepage/homepage';
import Articles from './components/articles/articles';
import ArticlesByCategory from './components/articles/articlesByCategory';
import FullArticleContainer from './components/fullArticle/fullArticleContainer';
import ArticlesByAuthor from './components/users/articlesByAuthor';
import EditArticle from './components/users/editArticle';
import NewArticle from './components/fullArticle/newArticle';
import AllArticles from './components/users/allArticles';
import Login from './components/login/login';
import Users from './components/users/users';
import UserDetail from './components/users/userDetail';
import NewUser from './components/users/newUser';
import Footer from './components/footer/footer';
import './App.css';

class App extends Component {

  render() {
      return(
        <div className="App">
            <Header />
            <BrowserRouter>
              <Route exact path="/" component={Homepage}></Route>
              <Route exact path="/articles" component={Articles}></Route>
              <Route exact path="/articles/:id" component={FullArticleContainer}></Route>
              <Route exact path="/category/:category" component={ArticlesByCategory}></Route>
              <Route exact path="/login" component={Login}></Route>
              <ProtectedRoute exact path="/users" component={Users}></ProtectedRoute>
              <ProtectedRoute exact path="/users/:userId" component={UserDetail}></ProtectedRoute>
              <ProtectedRoute exact path="/user/new" component={NewUser}></ProtectedRoute>
              <ProtectedRoute exact path="/users/:userId/articles" component={ArticlesByAuthor}></ProtectedRoute>
              <ProtectedRoute exact path="/users/:userId/edit/:title" component={EditArticle}></ProtectedRoute>
              <ProtectedRoute exact path="/article/new" component={NewArticle}></ProtectedRoute>
              <ProtectedRoute exact path="/allArticles" component={AllArticles}></ProtectedRoute>
            </BrowserRouter>
            <Footer />
        </div>
  );
}
}


export default App;
