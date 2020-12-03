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
import { Grid } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Tooltip } from "@material-ui/core";

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
  const [feedbackList, setFeedbackList] = useState([""]);

  const [modal, showModal] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const handleClose = () => showModal(false);
  const handleShow = () => showModal(true);

  const handleEditClose = () => showEditModal(false);
  const handleEditShow = () => showEditModal(true);

  const [feedbackId, setFeedbackId] = useState("");
  const [feedbackUser, setFeedbackUser] = useState("");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackDesc, setFeedbackDesc] = useState("");
  const [rating, setRating] = useState(0);

  const [saveDisabled, setSaveDisabled] = useState(true);

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

  function createPost() {
    const userPost = document.getElementById("status").value;
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "New User Post",
        body: userPost,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        posts.unshift(json);
        document.getElementById("status").value = "";
        setPostList(Array.from(posts).slice(0, postList.length + 1));
      });
  }

  useEffect(() => {
    if (isBottom) {
      addItems();
    }
  }, [isBottom]);

  function addItems() {
    console.log("Adding items");
    setPostList(Array.from(posts).slice(0, postList.length + 10));
    setIsBottom(false);
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
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function fetchFeedback() {
      const result = await axios.get("http://localhost:8080/feedback", {
        cancelToken: source.token,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      setFeedbackList(result.data);
      console.log(result.data);
      return () => {
        source.cancel();
      };
    }
    fetchFeedback();
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
        setPostList(
          Array.from(response.data)
            .sort((a, b) => a.id - b.id)
            .slice(0, 10)
        );
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

  function createFeedback() {
    axios
      .post("http://localhost:8080/feedback", {
        user: feedbackUser,
        title: feedbackTitle,
        description: feedbackDesc,
        rating: rating,
      })
      .then(function (response) {
        axios
          .get("http://localhost:8080/feedback")
          .then(function (feedbackresponse) {
            setFeedbackList(feedbackresponse.data);
          });
      });
  }

  function updateFeedback(id) {
    axios
      .put("http://localhost:8080/feedback/" + id, {
        user: feedbackUser,
        title: feedbackTitle,
        description: feedbackDesc,
        rating: rating,
      })
      .then(function (response) {
        axios
          .get("http://localhost:8080/feedback")
          .then(function (feedbackresponse) {
            setFeedbackList(feedbackresponse.data);
          });
      });
  }

  function newFeedback() {
    handleShow();
    setFeedbackId("");
    setFeedbackUser("");
    setFeedbackTitle("");
    setFeedbackDesc("");
    setRating(0);
  }

  const handleCreateFeedback = () => {
    handleClose();
    createFeedback();
  };

  function editFeedback(initialFeedback) {
    handleEditShow();
    setFeedbackUser(initialFeedback.user);
    setFeedbackId(initialFeedback.id);
    setFeedbackTitle(initialFeedback.title);
    setFeedbackDesc(initialFeedback.description);
    setRating(initialFeedback.rating);
    setSaveDisabled(false);
  }

  function handleSaveFeedback() {
    handleEditClose();
    updateFeedback(feedbackId);
  }

  function deleteFeedback(feedback) {
    axios
      .delete("http://localhost:8080/feedback/" + feedback.id)
      .then(function (response) {
        axios
          .get("http://localhost:8080/feedback")
          .then(function (feedbackresponse) {
            setFeedbackList(feedbackresponse.data);
          });
      });
  }

  return (
    <Router>
      <div>
        <nav>
          <NavigationBar />
        </nav>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/feedback">
            <Modal show={modal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Give Feedback</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form noValidate autoComplete="off">
                  <TextField
                    label="Name"
                    variant="standard"
                    value={feedbackUser}
                    onChange={(e) => setFeedbackUser(e.target.value)}
                  />
                  <TextField
                    style={{ marginTop: "0.5em", width: "100%" }}
                    id="feedbackTitle"
                    label="Title"
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                  />
                  <TextField
                    error={
                      feedbackDesc.split(" ").filter((value) => value !== "")
                        .length < 3
                    }
                    helperText="Please enter at least 3 words"
                    style={{ marginTop: "0.5em", width: "100%" }}
                    id="feedbackDesc"
                    label="Description"
                    multiline
                    rows={2}
                    variant="outlined"
                    value={feedbackDesc}
                    onChange={(e) => setFeedbackDesc(e.target.value)}
                  />
                </form>
                <Rating
                  style={{ marginTop: "0.5em" }}
                  name="simple-controlled"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <span></span>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateFeedback}
                >
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={editModal} onHide={handleEditClose}>
              <Modal.Header closeButton>
                <Modal.Title>Give Feedback</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form autoComplete="off">
                  <TextField
                    label="Name"
                    variant="standard"
                    value={feedbackUser}
                    onChange={(e) => setFeedbackUser(e.target.value)}
                  />
                  <TextField
                    style={{ marginTop: "0.5em", width: "100%" }}
                    id="feedbackTitle"
                    label="Title"
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                  />
                  <TextField
                    error={
                      feedbackDesc.split(" ").filter((value) => value !== "")
                        .length < 3
                    }
                    helperText="Please enter at least 3 words"
                    style={{ marginTop: "0.5em", width: "100%" }}
                    id="feedbackDesc"
                    label="Description"
                    multiline
                    rows={2}
                    variant="outlined"
                    value={feedbackDesc}
                    onChange={(e) => setFeedbackDesc(e.target.value)}
                  />
                </form>
                <Rating
                  style={{ marginTop: "0.5em" }}
                  name="simple-controlled"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleEditClose}
                >
                  Close
                </Button>
                <span></span>
                <Tooltip title={(!feedbackTitle || !feedbackDesc || rating === 0) ? "Fill in all fields" : "Save"}>
                  <span>
                    <Button
                      disabled={!feedbackTitle || !feedbackDesc || rating === 0}
                      variant="contained"
                      color="primary"
                      onClick={handleSaveFeedback}
                    >
                      Save
                    </Button>
                  </span>
                </Tooltip>
              </Modal.Footer>
            </Modal>
            <div>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "2em", marginTop: "1em" }}
                onClick={newFeedback}
              >
                Create Feedback
              </Button>

              <Grid container spacing={2}>
                {feedbackList.map((feedback, index) => (
                  <Grid item xs={3} zeroMinWidth key={index}>
                    <Card style={{ margin: "2em", padding: "1em" }}>
                      <CardContent>
                        <AccountCircleIcon style={{ fontSize: "1em" }} />{" "}
                        <Typography variant="caption">
                          {feedback.user}
                        </Typography>
                        <Typography variant="h5">
                          {feedback.title}{" "}
                          <Rating
                            name="read-only"
                            value={feedback.rating || 0}
                            readOnly
                          />
                        </Typography>
                        <Typography variant="body1">
                          {feedback.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button onClick={() => editFeedback(feedback)}>
                          <EditIcon></EditIcon>
                        </Button>
                        <Button onClick={() => deleteFeedback(feedback)}>
                          <DeleteIcon></DeleteIcon>
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  // <Card key={index}
                  //   style={{ width: "300px", marginTop: "2em" }}
                  // >
                  //   <CardContent>
                  //     <Typography variant="h5">{feedback.title}</Typography>
                  //     <Typography variant="body1">{feedback.description}</Typography>
                  //     <Typography variant="body2">{feedback.rating}</Typography>
                  //   </CardContent>
                  // </Card>
                ))}
              </Grid>
            </div>
          </Route>
          <Route path="/users">
            <div className="users">
              <div className="userList">
                <List component="nav" aria-label="main mailbox folders">
                  {userList.map((user, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => {
                        setCurrentUser(user);
                        setPhotoList([""]);
                      }}
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
                  <ListItemIcon
                  // style={{ width: "5%" }}
                  >
                    <Button>
                      <SendIcon
                        // style={{ paddingLeft: "0.5em" }}
                        onClick={createPost}
                      />
                    </Button>
                  </ListItemIcon>
                </div>
              </CardContent>
            </Card>
            {postList[0]
              ? postList.map((post, index) => (
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
                              .map((comment, commentIndex) => (
                                <div style={{ left: "100px" }} key={comment.id}>
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
                      <TextField id={"standard-basic" + post.id} label="" />
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
                          Send
                        </Typography>
                      </Button>
                    </CardActions>
                    <form></form>
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
