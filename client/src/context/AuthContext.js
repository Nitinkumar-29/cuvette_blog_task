import { useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = new createContext();

export const AuthProvider = ({ children }) => {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [passwordType, setPasswordType] = useState("password");
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");
  const host = "http://localhost:8000";
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value,
    });
  };

  // signup with photo upload
  async function Signup(formData) {
    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);
      formDataObj.append("photo", formData.photo);

      const response = await fetch(`${host}/api/auth/createUser`, {
        method: "POST",
        body: formDataObj, // No need to set content-type for FormData
      });

      if (!response.ok) {
        console.log("Could not process request");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.authToken);
      console.log(data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  // login
  async function Login() {
    try {
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginCredentials.email,
          password: loginCredentials.password,
        }),
      });
      if (!response.ok) {
        console.log("Could not process request");
        return;
      }
      const data = await response.json();
      localStorage.setItem("token", data.authToken);
      console.log(data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  // useffect to fetch currentuser data
  useEffect(() => {
    async function fetchCurrentUserData() {
      try {
        const response = await fetch(`${host}/api/auth/getUser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        if (!response.ok) {
          return console.log("could not fetch data, server error");
        }
        const data = await response.json();
        console.log(data);
        setCurrentUserData(data);
        setCurrentUserId(data.user._id);
        console.log(currentUserId);
      } catch (error) {
        console.error(error);
      }
    }

    token && fetchCurrentUserData();
  }, [token, currentUserId]);

  return (
    <AuthContext.Provider
      value={{
        loginCredentials,
        Login,
        handleOnChange,
        currentUserData,
        currentUserId,
        Signup,
        passwordType,
        setPasswordType
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
