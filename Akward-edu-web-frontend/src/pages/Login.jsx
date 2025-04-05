import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState } from "react";

const Login = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">{isSigningUp ? "Sign Up" : "Sign In"}</h1>

        <SignedOut>
          {isSigningUp ? <SignUp redirectUrl="/" /> : <SignIn redirectUrl="/" />}
          <button
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="mt-4 text-blue-500 hover:underline"
          >
            {isSigningUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </SignedOut>

        <SignedIn>
          <p className="text-green-600">You are signed in!</p>
        </SignedIn>
      </div>
    </div>
  );
};

export default Login;
