import React, { useState, useRef, useEffect, useCallback } from "react";
import { Magic } from "magic-sdk";

import "./styles.css";

const magic = new Magic("pk_test_3F8F2B46C789AB90");

/**
 * A React hook that exposes the most basic
 * APIs for logging in/logging out users.
 */
function useMagic(userEmail) {
  const isMounted = useRef(true);
  const [userMetadata, setUserMetadata] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    magic.user.isLoggedIn().then(async (isLoggedIn) => {
      if (isMounted.current) setIsLoggedIn(isLoggedIn);

      if (isLoggedIn) {
        const metadata = await magic.user.getMetadata();
        if (isMounted.current) setUserMetadata(metadata);
      }
    });

    return () => {
      isMounted.current = false;
    }
  });

  const loginWithMagicLink = useCallback(async () => {
    await magic.auth.loginWithMagicLink({ email: userEmail });
    setIsLoggedIn(true);
  }, [userEmail]);

  const logout = useCallback(async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
  }, []);

  return { loginWithMagicLink, logout, isLoggedIn, userMetadata };
}

/**
 * A React application to render our example.
 */
export default function App() {
  const [email, setEmail] = useState("");
  const handleEmailInputChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  const { loginWithMagicLink, logout, isLoggedIn, userMetadata } = useMagic(email);

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
            value={email}
            onChange={handleEmailInputChange}
          />
          <button onClick={loginWithMagicLink}>Send</button>
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
