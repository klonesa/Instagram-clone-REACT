import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import "./ImageUpload.css";
import firebase from "firebase";
import { db, stroge } from "../firebase";

function ImageUpload({ username }) {
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(null);
	// const [url, setUrl] = useState("");
	const [progress, setProgress] = useState(0);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleUpload = () => {
		const uploadTask = stroge.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				//! Progress Function......
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				//! Error Function......
				console.log(error);
				alert(error.message);
			},
			() => {
				//! Complete Function.......
				stroge
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						//! Post image inside db
						db.collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption: caption,
							imageUrl: url,
							username: username,
						});
						setProgress(0);
						setCaption("");
						setImage(null);
					});
			}
		);
	};

	return (
		<div className="imageUpload">
			<Input
				type="text"
				placeholder="Caption🚀 "
				value={caption}
				onChange={(event) => setCaption(event.target.value)}
			/>
			<Input type="file" onChange={handleChange} />
			<Button variant="contained" color="primary" onClick={handleUpload}>
				Upload
			</Button>
			<progress value={progress} max="100" />
		</div>
	);
}

export default ImageUpload;
