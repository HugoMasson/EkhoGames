import React, { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AddArticleForm() {
  const [gameName, setGameName] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleText, setArticleText] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [image, setImage] = useState("");
  const [onHome, setOnHome] = useState(true);
  const [bannerTxt, setBannerTxt] = useState("");
  const [fontColor, setFontColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#000000");

  const [uploading, setIsUploading] = useState(false);

  const imageRef = ref(
    storage,"articlesImages/" + gameName + "/" + publicationDate);

  const uploadImage = async () => {
    if (image == null) return;

    try {
      await uploadBytes(imageRef, image);
    } catch (error) {
      console.log(error);
      alert("ERROR during image upload");
    }
  };

  const uploadContent = async () => {
    let urlVar = "no image";
    urlVar = await getDownloadURL(imageRef)
    try {
      const dbRef = collection(db, "articles");
      const data = {
        title: gameName,
        articleTitle: articleTitle,
        articleText: articleText,
        publicationDate: new Date(publicationDate),
        videoUrl: videoUrl,
        imageUrl: urlVar,
        onHome: onHome,
        bannerTxt: bannerTxt,
        fontColor: fontColor,
        backgroundColor: backgroundColor,
      };
      await addDoc(dbRef, data);
    } catch (error) {
      console.log(error);
      alert("ERROR during content upload");
    }
  };

  const isGameExist = async () => {
    try {
      const q = query(collection(db, "games"), where("title", "==", gameName));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 1) return true;
    } catch (error) {
      console.log(error);
      alert("ERROR during checking game name");
    }
    return false;
  };

  const uploadNewArticle = async () => {
    setIsUploading(true);
    let isOk = true;
    if (image !== "" && videoUrl !== "") {
      const errorMessage = { code: 105, message: "Invalid Form Data" };
      setIsUploading(false);
      alert("105 Invalid Form Data");
      throw errorMessage;
    }
    try {
      if (await isGameExist()) {
        //upload image
        try {
          if (image !== "") await uploadImage();
          await uploadContent();
        } catch (error) {
          alert("Error during upload");
        }
        if (isOk) alert("Upload successful !");
      } else {
        alert("Game name not valid");
      }
    } catch (error) {
      isOk = false;
      console.log(error);
      alert("ERROR during upload");
    }
    setGameName("");
    setArticleTitle("");
    setArticleText("");
    setPublicationDate("");
    setVideoUrl("");
    setImage("");
    setBannerTxt("");
    setFontColor("#000000");
    setBackgroundColor("#000000");

    setIsUploading(false);
  };

  return (
    <>
      <div id="login-form-wrap">
        <h2>Add Game Article</h2>
        <form id="login-form">
          <p>
            <input
              type="text"
              className="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Game (exact) Name"
              required
            />
          </p>
          <p>
            <input
              type="text"
              className="text"
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              placeholder="Article Title"
              required
            />
          </p>
          <p>
            <textarea
              type="textarea"
              className="areaBig"
              value={articleText}
              onChange={(e) => setArticleText(e.target.value)}
              placeholder="Article Text (full article)"
              required
            />
          </p>
          <p>
            <input
              type="date"
              className="text"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              required
            />
          </p>
          <p>
            <input
              type="text"
              className="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Video URL"
            />
          </p>
          <p>OR</p>
          <p>
            <input
              type="file"
              accept=".png, .jpeg, .jpg"
              onChange={(e) => setImage(e.target.files[0])}
              onClick={(e) => (e.target.value = null)}
            />
          </p>
          <small>
            <h6>On Home Page ?</h6>{" "}
          </small>
          <p>
            <input
              type="checkbox"
              name="checkBox"
              defaultChecked={true}
              onChange={(e) => setOnHome(e.target.checked)}
            />
          </p>
          <p>
            <input
              type="text"
              className="text"
              value={bannerTxt}
              onChange={(e) => setBannerTxt(e.target.value)}
              placeholder="Banner text"
            />
          </p>
          <p>
            <label>Text color</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
            />
          </p>
          <p>
            <label>Background color</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </p>
          <p>
            <button type="button" onClick={() => uploadNewArticle()}>
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

export default AddArticleForm;
