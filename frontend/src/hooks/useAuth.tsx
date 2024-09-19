// hooks/useAuth.ts
import { useState } from "react";
import { signupInput, signinInput } from "@alias1623/docsync";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";

export const useAuth = (isSignIn: boolean) => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  // Form data state (kept unchanged)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign up logic (unchanged, except setting user)
  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    const validation = signupInput.safeParse({
      firstName,
      lastName,
      email,
      password,
    });

    if (!validation.success) {
      setError("Invalid input data. Please correct the fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, validation.data);
      const { token, email, name } = response.data;

      localStorage.setItem("token", token); // Store token in localStorage
      setUser({ email, name }); // Update Zustand store and persist user
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Sign in logic (unchanged, except setting user)
  const handleSignin = async () => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    const validation = signinInput.safeParse({
      email,
      password,
    });

    if (!validation.success) {
      setError("Invalid input data. Please correct the fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, validation.data);
      const { token, email, name } = response.data;

      localStorage.setItem("token", token); // Store token in localStorage
      setUser({ email, name }); // Update Zustand store and persist user
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (isSignIn) {
      handleSignin();
    } else {
      handleSignup();
    }
  };

  return {
    firstName,
    lastName,
    email,
    password,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
};