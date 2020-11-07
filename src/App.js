import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import NavigationBar from "./NavigationBar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TextField from "@material-ui/core/TextField";

function App() {
  const [userList, setUserList] = useState([""]);
  const [posts, setPosts] = useState([""]);
  const [postList, setPostList] = useState([""]);
  const [albumList, setAlbumList] = useState([""]);
  const [photoList, setPhotoList] = useState([""]);
  const [currentUser, setCurrentUser] = useState("");
  const [commentBox, setCommentBox] = useState(true);
  const [commentList, setCommentList] = useState([""]);
  const [isBottom, setIsBottom] = useState(false);

  //Infinite scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleScroll() {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    if (scrollTop + window.innerHeight + 50 >= scrollHeight) {
      setIsBottom(true);
    }
  }

  useEffect(() => {
    if (isBottom) {
      addItems();
    }
  }, [isBottom]);

  function addItems() {
    console.log("Adding items");
    setPostList(Array.from(posts).slice(0, postList.length + 10));
    setIsBottom(false)
  }

  const openAlbum = (albumId) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function fetchPhotos() {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/photos?albumId=" + albumId,
        {
          cancelToken: source.token,
        }
      );
      setPhotoList(result.data);
      return () => {
        source.cancel();
      };
    }
    fetchPhotos();
    console.log(photoList);
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function fetchUsers() {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/users",
        {
          cancelToken: source.token,
        }
      );
      setUserList(result.data);
      return () => {
        source.cancel();
      };
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    axios
      .get("https://jsonplaceholder.typicode.com/posts", {
        cancelToken: source.token,
      })
      .then((response) => {
        setPosts(response.data);
        console.log(posts);
        setPostList(Array.from(response.data).slice(0, 10));
      })
      .catch((err) => {
        console.log("Catched error: " + err.message);
      });

    return () => {
      source.cancel("Component got unmounted");
    };
  }, []); // Or [] if effect doesn't need props or state

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function fetchComments() {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/comments",
        {
          cancelToken: source.token,
        }
      );
      setCommentList(result.data);
      console.log(commentList);
      return () => {
        source.cancel();
      };
    }
    fetchComments();
  }, []);

  const scrollHeight =
    (document.documentElement && document.documentElement.scrollHeight) ||
    document.body.scrollHeight; // useEffect(async () => {
  //   await fetch("https://jsonplaceholder.typicode.com/posts")
  //     .then((response) => response.json())
  //     .then((data) => setPostList(data))
  //     .catch((err) => setError(err));
  // }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    axios
      .get("https://jsonplaceholder.typicode.com/albums", {
        cancelToken: source.token,
      })
      .then((response) => {
        setAlbumList(response.data);
      })
      .catch((err) => {
        console.log("Catched error: " + err.message);
      });

    return () => {
      source.cancel("Component got unmounted");
    };
  }, []); // Or [] if effect doesn't need props or state

  return (
    <Router>
      <div>
        <nav>
          <NavigationBar />
        </nav>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/users">
            <div className="users">
              <div className="userList">
                <List component="nav" aria-label="main mailbox folders">
                  {userList.map((user, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => (setCurrentUser(user), setPhotoList([""]))}
                    >
                      <ListItemIcon>
                        <AccountCircleIcon fontSize="large" />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.name}
                        secondary={user.email}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>

              <div hidden={!currentUser} className="info">
                <ListItemIcon>
                  <AccountCircleIcon style={{ fontSize: "10em" }} />
                </ListItemIcon>
                <h2>{currentUser.name}</h2>
                <h5>{currentUser.username}</h5>
                <div>{currentUser.email}</div>
                <div>
                  {currentUser.phone}{" "}
                  <a href={currentUser.website}>{currentUser.website}</a>
                </div>
                <div className="userAlbums">
                  {albumList[0] && !photoList[0]
                    ? albumList
                        .filter((album) => album.userId === currentUser.id)
                        .map((album, index) => (
                          <div
                            key={album.id + index}
                            onClick={() => openAlbum(album.id)}
                            className="photoAlbum"
                          >
                            <ListItemIcon style={{ minWidth: "0" }}>
                              <PhotoLibraryIcon style={{ fontSize: "3em" }} />
                            </ListItemIcon>
                            <h5
                              style={{
                                textOverflow: "hidden",
                                maxHeight: "3em",
                              }}
                            >
                              {album.title}
                            </h5>
                          </div>
                        ))
                    : null}
                </div>
                <div
                  style={{ margin: "2em", float: "left" }}
                  hidden={!photoList}
                >
                  <ListItemIcon style={{ float: "left" }}>
                    <ArrowBackIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => setPhotoList([""])}
                    />
                  </ListItemIcon>
                  <div style={{ margin: "2em", float: "left" }}>
                    {photoList.map((photo, index) => (
                      <div
                        key={index}
                        style={{ display: "inline", float: "left" }}
                      >
                        <a href={photo.url}>
                          <img src={photo.thumbnailUrl}></img>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Route>
          <Route path="/">
            <Card
              style={{
                maxWidth: "700px",
                margin: "auto",
                marginTop: "2em",
              }}
            >
              <CardContent>
                <div>
                  <Typography variant="h3" style={{ display: "inline" }}>
                    Hi User!
                  </Typography>
                </div>
                <div>
                  <ListItemIcon style={{ width: "5%" }}>
                    <AccountCircleIcon style={{ fontSize: "3em" }} />
                  </ListItemIcon>
                  <FormControl style={{ width: "80%" }}>
                    <InputLabel htmlFor="standard-adornment-amount">
                      What do you want to share?
                    </InputLabel>
                    <Input id="status" />
                  </FormControl>
                  <ListItemIcon style={{ width: "5%" }}>
                    <SendIcon style={{ paddingLeft: "1em" }} />
                  </ListItemIcon>
                </div>
              </CardContent>
            </Card>
            {postList[0]
              ? postList
                  .filter((post) => post.id === post.id)
                  .map((post, index) => (
                    <Card
                      key={index}
                      style={{
                        maxWidth: "500px",
                        margin: "auto",
                        marginTop: "2em",
                      }}
                    >
                      <CardContent>
                        <ListItemIcon style={{ display: "inline" }}>
                          <AccountCircleIcon
                            style={{ fontSize: "2em", paddingRight: "0.3em" }}
                          />
                        </ListItemIcon>
                        <Typography
                          variant="h5"
                          component="h2"
                          style={{ display: "inline", verticalAlign: "top" }}
                        >
                          {userList[0]
                            ? userList.find((user) => user.id === post.userId)
                                .name
                            : null}
                        </Typography>
                        <Typography gutterBottom>{post.body}</Typography>
                        <Typography variant="body1">Comments</Typography>
                        <List>
                          {commentList
                            ? commentList
                                .filter((comm) => comm.postId === post.id)
                                .map((comment, index) => (
                                  <div
                                    style={{ left: "100px" }}
                                    key={comment.id}
                                  >
                                    <Typography variant="subtitle2">
                                      {comment.name}
                                    </Typography>
                                    <Typography variant="caption">
                                      {comment.body}
                                    </Typography>
                                  </div>
                                ))
                            : null}
                        </List>
                      </CardContent>
                      <CardActions>
                        <Button size="small">
                          <ListItemIcon
                            style={{ minWidth: "0px", padding: "2px" }}
                          >
                            <ChatBubbleOutlineIcon />
                          </ListItemIcon>
                          <Typography
                            onClick={() => setCommentBox(!commentBox)}
                            style={{ textTransform: "initial" }}
                          >
                            Comment
                          </Typography>
                        </Button>
                      </CardActions>
                      <form>
                        <TextField id={"standard-basic" + post.id} label="" />
                      </form>
                    </Card>
                  ))
              : null}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
