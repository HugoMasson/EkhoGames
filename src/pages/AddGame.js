import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import AddGameForm from "../components/forms/AddGameForm";
import AddGamePromoForm from "../components/forms/AddGamePromoForm";
import AddArticleForm from "../components/forms/AddArticleForm";

function AddGame() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      alert(error.message);
    }
    navigate("/");
  };

  const getPage = () => {
    if (user) {

      return (
        <>
          <button type="button" onClick={() => logout()}>
            Logout
          </button>
          <AddGameForm/>
          <AddGamePromoForm/>
          <AddArticleForm/>
        </>
      );
    }
    return <>403 Forbidden</>;
  };

  return getPage();
}

export default AddGame;
