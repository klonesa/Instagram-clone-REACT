import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from "firebase";

function Post({ user, postId, username, caption, imageUrl }) {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");

	useEffect(() => {
		let unsubscribe;
		if (postId) {
			unsubscribe = db
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) => {
					setComments(
						snapshot.docs.map((doc) => ({
							id: doc.id,
							comment: doc.data(),
						}))
					);
				});
		}
		return () => {
			unsubscribe();
		};
	}, [postId]);

	const postComment = (e) => {
		e.preventDefault();
		db.collection("posts").doc(postId).collection("comments").add({
			text: comment,
			username: user.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});
		setComment("");
	};

	return (
		<div className="post">
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt={username}
					src="/static/images/avatar.jpg"
				/>
				<h3>{username}</h3>
			</div>

			<img className="post__image" src={imageUrl} alt="" />
			<h4 className="post__text">
				<strong>{username} </strong>
				{caption}
			</h4>

			<div className="post__comments">
				{comments.map((comment) => (
					<p key={comment.id} className="post__comment">
						<strong>{comment.comment.username} </strong>
						{comment.comment.text}
					</p>
				))}
			</div>
			{user && (
				<form className="post__commentBox">
					<input
						className="post__input"
						type="text"
						placeholder="Type a comment.."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button
						disabled={!comment}
						className="post__button"
						type="submit"
						onClick={postComment}
					>
						Post
					</button>
				</form>
			)}
		</div>
	);
}

export default Post;
