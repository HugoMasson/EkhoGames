import React, { useState } from "react";
import { storage, db } from "../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

function AddGameForm() {
  const [gameName, setGameName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [studio, setStudio] = useState("");
  const [editor, setEditor] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setIsUploading] = useState(false);

  const [imgUrl, setImgUrl] = useState("no image");

  const imageRef = ref(storage, "gameImages/" + gameName.toLowerCase() + "/imageGame");

  const uploadNewGame = async () => {
    if (![gameName, description, studio, editor].includes("")) {
      let isOk = true;
      setIsUploading(true);
      try {
        await uploadImage();
        await uploadContent();
        
      } catch (error) {
        isOk = false;
        console.log(error);
        alert("ERROR during upload");
      }
      if (isOk) alert("Upload successful !");

      setIsUploading(false);
      setGameName("");
      setDescription("");
      setDate("");
      setStudio("");
      setEditor("");
      setImgUrl("no image");
      setImage(null);
    } else {
      const errorMessage =  { code : 105, message : "Invalid Form Data" };
      throw errorMessage;
    }
  };

  const uploadContent = async () => {
    let urlVar = "no image";
    urlVar = await getDownloadURL(imageRef)


    try {
        const dbRef = collection(db, "games");
        const data = {
          title: gameName.toLowerCase(),
          description: description,
          date: date,
          studio: studio,
          editor: editor,
          url: urlVar,
        };
        await addDoc(dbRef, data);
    } catch (error) {
      console.log(error);
      alert("ERROR during content upload");
    }
  };

  const uploadImage = async () => {
    if (image == null) return;
    try {
      await uploadBytes(imageRef, image);
    } catch (error) {
      console.log(error);
      alert("ERROR during image upload");
    }
  };

  return (
    <>
      <div id="login-form-wrap">
        <h2>Add Game</h2>
        <form id="login-form">
          <p>
            <input
              type="text"
              className="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Game Name"
              required
            />
          </p>
          <p>
            <input
              type="text"
              className="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Game Description"
              required
            />
          </p>
          <p>
            <input
              type="date"
              className="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </p>
          <p>
            <input
              type="text"
              className="text"
              value={studio}
              onChange={(e) => setStudio(e.target.value)}
              placeholder="Game Studio"
              required
            />
          </p>
          <p>
            <input
              type="text"
              className="text"
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              placeholder="Game Editor"
              required
            />
          </p>
          <p>
            <input
              type="file"
              accept=".png, .jpeg, .jpg"
              onChange={(e) => setImage(e.target.files[0])}
              onClick={(e) => (e.target.value = null)}
              required
            />
          </p>
          <p>
            <button type="button" onClick={() => uploadNewGame()}>
              {uploading && (
                <svg
                  className="spinner"
                  width="55px"
                  height="55px"
                  viewBox="0 0 66 66"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="path"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    cx="33"
                    cy="33"
                    r="30"
                  ></circle>
                </svg>
              )}
              {!uploading && "UPLOAD"}
            </button>
          </p>
          <br></br>
        </form>
      </div>
    </>
  );
}

export default AddGameForm;
