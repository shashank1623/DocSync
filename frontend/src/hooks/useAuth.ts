// hooks/useAuth.ts
import { useState } from "react";
import { signupInput, signinInput } from "@alias1623/docsync";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useNavigate } from "react-router-dom";

export const useAuth = (isSignIn: boolean) => {
  const navigate = useNavigate();

  // Form data state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign up logic
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
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Sign in logic
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
      alert("Login successful!");
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
