import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, TextField } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 380,
		backgroundColor: theme.palette.background.paper,
		border: "1px solid #fafafa",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);

	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);
	const [openSignIn, setOpenSignIn] = useState(false);
	const [openUploadModal, setOpenUploadModal] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				//! user has logged in....

				setUser(authUser);

				if (authUser.displayName) {
					//! dont update username
				} else {
					//! if we just created someone
					return authUser.updateProfile({ displayName: username });
				}
			} else {
				//! user has logged out....
				setUser(null);
			}
		});
		return () => {
			//perform some cleanup actions
			unsubscribe();
		};
	}, [user, username]);

	useEffect(() => {
		// ! this is where code runs
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				setPosts(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						post: doc.data(),
					}))
				);
			});
	}, []);

	const signUp = (event) => {
		event.preventDefault();

		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((err) => alert(err.message));
		setOpen(false);
	};
	const signIn = (event) => {
		event.preventDefault();
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((err) => alert(err.message));
		setOpenSignIn(false);
	};
	return (
		<div className="app">
			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form>
						<center className="app__modal">
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt="Instagram"
							/>
							<TextField
								type="email"
								value={email}
								label="Email"
								onChange={(event) => setEmail(event.target.value)}
								required
							/>
							<TextField
								type="text"
								value={username}
								label="Username"
								onChange={(event) => setUsername(event.target.value)}
								required
							/>
							<TextField
								type="password"
								value={password}
								label="Password"
								onChange={(event) => setPassword(event.target.value)}
								required
							/>

							<Button
								type="submit"
								variant="contained"
								color="secondary"
								onClick={signUp}
							>
								Sign Up
							</Button>
						</center>
					</form>
				</div>
			</Modal>
			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form>
						<center className="app__modal">
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt="Instagram"
							/>
							<TextField
								type="email"
								value={email}
								label="Email"
								onChange={(event) => setEmail(event.target.value)}
								required
							/>

							<TextField
								type="password"
								value={password}
								label="Password"
								onChange={(event) => setPassword(event.target.value)}
								required
							/>

							<Button
								type="submit"
								variant="contained"
								color="secondary"
								onClick={signIn}
							>
								Sign In
							</Button>
						</center>
					</form>
				</div>
			</Modal>
			{/* ****************************************************** */}
			<Modal open={openUploadModal} onClose={() => setOpenUploadModal(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form>
						<center className="app__modal">
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt="Instagram"
							/>
							{user?.displayName ? (
								<ImageUpload username={user.displayName} />
							) : (
								<h3>Sorry you need to login to upload</h3>
							)}
						</center>
					</form>
				</div>
			</Modal>
			{/* ********************************************************* */}

			<div className="app__header">
				<a href="/">
					<img
						className="app__headerImage"
						src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
						alt="Instagram"
					/>
				</a>
				{user ? (
					<div className="app__userContainer">
						<h3>
							Welcome <strong>{user?.displayName}</strong>
						</h3>
						<Button
							variant="contained"
							color="secondary"
							type="submit"
							onClick={() => auth.signOut()}
						>
							Logout
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={() => setOpenUploadModal(true)}
						>
							Add Post
						</Button>
					</div>
				) : (
					<div className="app__loginContainer">
						<Button
							variant="contained"
							color="secondary"
							onClick={() => setOpenSignIn(true)}
						>
							Sign In
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={() => setOpen(true)}
						>
							Sign Up
						</Button>
					</div>
				)}
			</div>

			<div className="posts">
				{posts.map(({ id, post }) => (
					<Post
						key={id}
						postId={id}
						user={user}
						username={post.username}
						caption={post.caption}
						imageUrl={post.imageUrl}
					/>
				))}
			</div>
		</div>
	);
}

export default App;
