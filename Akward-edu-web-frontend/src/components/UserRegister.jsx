import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { registerUser } from "../services/auth";

const UserRegister = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      registerUser({
        clerkId: user.id,
        username: user.username,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.profileImageUrl,
      }).then((res) => console.log("User registered:", res));
    }
  }, [user]);

  return <div>Loading...</div>;
};

export default UserRegister;
