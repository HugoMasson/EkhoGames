import React, { useState } from "react";
import { storage, db } from "../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
//import { v4 } from "uuid";

function AddGameForm() {
  const [gameName, setGameName] = useState("");
  const [plateform, setPlateform] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setIsUploading] = useState(false);
  const [bannerTxt, setBannerTxt] = useState("");
  const [fontColor, setFontColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#000000");

  const imageRef = ref(storage, "gamePromoImages/" + gameName + "/promoImage");

  const uploadNewGame = async () => {
    if (![gameName, plateform, endDate].includes("")) {
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
      setPlateform("");
      setEndDate("");
      setImage(null);
      setBannerTxt("");
      setFontColor("#000000");
      setBackgroundColor("#000000");
    } else {
      const errorMessage =  { code : 105, message : "Invalid Form Data" };
      throw errorMessage;
    }
  };

  const uploadContent = async () => {
    let urlVar = "no image";
    urlVar = await getDownloadURL(imageRef)

    try {
        const dbRef = collection(db, "gamesPromo");
        const data = {
          title: gameName,
          plateform: plateform,
          endDate: endDate,
          url: urlVar,
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
        <h2>Add Game Promo</h2>
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
              value={plateform}
              onChange={(e) => setPlateform(e.target.value)}
              placeholder="Game Plateform"
              required
            />
          </p>
          <p>
            <input
              type="date"
              className="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
