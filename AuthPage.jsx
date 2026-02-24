import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgType, setOrgType] = useState("student"); // default can be student
  const [message, setMessage] = useState("");



  const routeAfterAuth = () => {
    const selected = String(orgType || "").trim().toLowerCase();

    if (selected === "student") {
        navigate("/enrol", { replace: true });
        return true;
    }

    if (selected === "public" || selected === "community") {
        navigate("/library", { replace: true });
        return true;
    }

    return false;
};

  const register = async () => {
  setMessage("");
  try {
   await createUserWithEmailAndPassword(auth, email, password);

// ✅ save the chosen type for this account
saveAccountType(email, orgType);

// ✅ route based on stored type
if (routeByType(orgType)) return;

setMessage(`Successfully Registered as ${orgType}`);
  } catch (err) {
    setMessage("Registration failed: " + (err?.message || "Unknown error"));
  }
};

  const login = async () => {
  setMessage("");
  try {
    await signInWithEmailAndPassword(auth, email, password);

// ✅ load saved type for this account
const savedType = loadAccountType(email);

// if not found (old users), fall back to current dropdown & save it
const finalType = savedType || String(orgType || "").trim().toLowerCase();
if (!savedType) saveAccountType(email, finalType);

// ✅ route based on finalType
if (routeByType(finalType)) return;

setMessage("Logged in successfully");
  } catch (err) {
    setMessage("Login failed: " + (err?.message || "Unknown error"));
  }
};

  const typeKey = (email) => `komodoHub.accountType.${String(email || "").trim().toLowerCase()}`;

const saveAccountType = (email, type) => {
  localStorage.setItem(typeKey(email), String(type || "").trim().toLowerCase());
};

const loadAccountType = (email) => {
  return localStorage.getItem(typeKey(email)); // returns null if not saved
};

const routeByType = (type) => {
  const t = String(type || "").trim().toLowerCase();
  if (t === "student") {
    navigate("/enrol", { replace: true });
    return true;
  }
  if (t === "public" || t === "community") {
    navigate("/library", { replace: true });
    return true;
  }
  return false;
};

  const inputStyle = {
    width: "100%",
    display: "block",
    boxSizing: "border-box",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #cfd8dc",
    outline: "none",
    background: "#fff",
    color: "#111",
    marginBottom: 10,
  };


  return (
    <div
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    boxSizing: "border-box",
    background: "transparent", //
  }}
>
      <div
        style={{
          width: "min(420px, 92vw)",
          padding: 25,
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2E7D32", marginTop: 0 }}>
          Komodo Hub
        </h2>

        {message && (
          <div
            style={{
              background: "#e6ffe6",
              padding: 10,
              marginBottom: 12,
              border: "1px solid green",
              borderRadius: 8,
              color: "#111",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
            disabled={mode === "login"}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cfd8dc",
              background: mode === "login" ? "#2E7D32" : "#fff",
              color: mode === "login" ? "#fff" : "#111",
              cursor: mode === "login" ? "default" : "pointer",
              fontWeight: 600,
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setMessage("");
            }}
            disabled={mode === "register"}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cfd8dc",
              background: mode === "register" ? "#2E7D32" : "#fff",
              color: mode === "register" ? "#fff" : "#111",
              cursor: mode === "register" ? "default" : "pointer",
              fontWeight: 600,
            }}
          >
            Register
          </button>
        </div>

        <input
          style={inputStyle}
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage("");
          }}
        />

        {/* dropdown visible in login + register */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6, color: "#111" }}>
            Account type:
          </label>

          <select
            value={orgType}
            onChange={(e) => {
              setOrgType(e.target.value);
              setMessage("");
            }}
            style={{
              width: "100%",
              display: "block",
              boxSizing: "border-box",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #cfd8dc",
              background: "#fff",
              color: "#111",
              fontSize: 16,
            }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="principal">Principal</option>
            <option value="admin">Admin</option>
            <option value="chairman">Chairman</option>
            <option value="public">Public visitors and users</option>
            <option value="community">Other communities</option>
          </select>
        </div>

        {mode === "register" ? (
          <button
            type="button"
            onClick={register}
            style={{
              width: "100%",
              padding: 12,
              background: "#2E7D32",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Create account
          </button>
        ) : (
          <button
            type="button"
            onClick={login}
            style={{
              width: "100%",
              padding: 12,
              background: "#2E7D32",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}