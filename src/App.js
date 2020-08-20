import React, { useState, useEffect, useCallback } from "react";
import { Magic } from "magic-sdk";

import "./styles.css";

const magic = new Magic("pk_test_3F8F2B46C789AB90");

export default function App() {
  const [email, setEmail] = useState("");
  const [setPublicAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});

  useEffect(() => {
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      setIsLoggedIn(magicIsLoggedIn);
      if (magicIsLoggedIn) {
        const metadata = await magic.user.getMetadata()
        setPublicAddress(metadata.publicAddress);
        setUserMetadata(metadata);
      }
    });
  }, [isLoggedIn]);

  const handleEmailInputChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  const login = useCallback(async () => {
    await magic.auth.loginWithMagicLink({ email });
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
  }, []);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="container">
          <h1>Please sign up or login</h1>
          <input
            type="email"
            name="email"
            required="required"
            placeholder="Enter your email"
            onChange={handleEmailInputChange}
          />
          <button onClick={login}>Send</button>
        </div>
      ) : (
        <div className="container">
          <h1>Current user: ${userMetadata.email}</h1>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
