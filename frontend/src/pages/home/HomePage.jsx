import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import RightPanel from "../../components/common/RightPanel";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-200 min-h-screen bg-base-100">
        {/* Header */}
        <div className="flex w-full border-b border-gray-300">
          <div
            className={`flex justify-center flex-1 p-3 transition duration-300 cursor-pointer relative ${
              feedType === "forYou"
                ? "bg-accent text-base-content"
                : "hover:bg-accent hover:text-base-content"
            }`}
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className={`flex justify-center flex-1 p-3 transition duration-300 cursor-pointer relative ${
              feedType === "following"
                ? "bg-accent text-base-content"
                : "hover:bg-accent hover:text-base-content"
            }`}
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>

        {/* CREATE POST INPUT */}
        <CreatePost />

        {/* POSTS */}
        <Posts feedType={feedType}/>

        
      </div>
      <div>{/*SUGGESTED USERS*/}
      <RightPanel /></div>
    </>
  );
};

export default HomePage;
