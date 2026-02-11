import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

const slugify = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const unslugify = (slug) => slug.replace(/-/g, " ");

const Profile = () => {
  const { userName } = useParams();
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );
  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }
  const usernameSlug = slugify(user.username);
 
  if (usernameSlug !== userName) {
    return <Navigate to={`/profile/${usernameSlug}`} replace />;
  } 
  console.log(user)

  return (
    <>
      <div className="container px-6 mx-auto min-h-[60vh]">
        <div className="profileinfo w-full py-[200px]">
          <h2>Welcome 🙏 {unslugify(userName)}</h2>
        </div>
      </div>
    </>
  );
};
export default Profile;
