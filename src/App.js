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
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

function App() {
  const [userList, setUserList] = useState([""]);
  const [postList, setPostList] = useState([""]);
  const [albumList, setAlbumList] = useState([""]);
  const [currentUser, setCurrentUser] = useState("");
  const [hasError, setError] = useState("");
  const [commentBox, setCommentBox] = useState(true);

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
        setPostList(response.data);
      })
      .catch((err) => {
        console.log("Catched error: " + err.message);
      });

    return () => {
      source.cancel("Component got unmounted");
    };
  }, []); // Or [] if effect doesn't need props or state

  // useEffect(async () => {
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20% 80%",
                gridTemplateRows: "auto 10%",
              }}
            >
              <List component="nav" aria-label="main mailbox folders">
                {userList.map((user, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => setCurrentUser(user)}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItemText primary={user.name} secondary={user.email} />
                  </ListItem>
                ))}
              </List>

              <div hidden={!currentUser} className="info">
                <img style={{ height: "150px", width: "150px" }} src=""></img>
                <h2>{currentUser.name}</h2>
                <h5>{currentUser.username}</h5>
                <div>{currentUser.email}</div>
                <div>
                  {currentUser.phone}{" "}
                  <a href={currentUser.website}>{currentUser.website}</a>
                </div>
                <List>
                  {albumList[0]
                    ? albumList
                        .filter((album) => album.userId === currentUser.id)
                        .map((album, index) => (
                          <ListItem
                            style={{ width: "33.3%", display: "inline-block" }}
                          >
                            <ListItemIcon>
                              <PhotoLibraryIcon/>
                            </ListItemIcon>
                            <h5>{album.title}</h5>
                          </ListItem>
                        ))
                    : null}
                </List>
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
            {postList
              .filter((post) => post.id < 11)
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
                        ? userList.find((user) => user.id === post.userId).name
                        : null}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {post.body}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">
                      <ListItemIcon style={{ minWidth: "0px", padding: "2px" }}>
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
                </Card>
              ))}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
