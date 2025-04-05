import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="cursor-pointer" onClick={handleProfileClick}>
      <img
        src={user?.imageUrl}
        alt={user?.fullName}
        className="w-10 h-10 rounded-full border-2 border-white"
      />
    </div>
  );
};

export default ProfileDropdown;
