import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.scss";

import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  
  const navigate = useNavigate();
  const [checking, setIsChecking] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);

  const logInWithEmailAndPassword = async (em, pa) => {
    setIsChecking(true);
    try {
      await signInWithEmailAndPassword(auth, em, pa);
    } catch (error) {
      console.log(error);
      alert("ERROR");
    }
    setIsChecking(false);
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/addGame");
    // eslint-disable-next-line
  }, [user, loading]);

  return (
    <>
      {checking && (
        <div className="loaderWrapper">
          
        </div>
      )}
      <div className="sep"></div>
      <div id="login-form-wrap">
        <h2>Login</h2>
        <form id="login-form">
          <p>
            <input
              type="email"
              className="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
            <i className="validation">
              <span></span>
              <span></span>
            </i>
          </p>
          <p>
            <input
              type="password"
              className="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <i className="validation">
              <span></span>
              <span></span>
            </i>
          </p>
          <p>
            <button
              type="button"
              onClick={() => logInWithEmailAndPassword(email, password)}
            >
              {checking && (
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
              {!checking && "Login"}
            </button>
          </p>
        </form>
        <div id="create-account-wrap">
          <p>
            Not a member? <a href="/whatttt">Create Account</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
