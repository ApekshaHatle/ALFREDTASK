import logo1 from "../../assets/logo1.png";

import { BiBook } from "react-icons/bi"; // Import Flashcards icon
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const {mutate:logout}=useMutation({
    mutationFn: async() => {
      try {
        const res = await fetch("/api/auth/logout",{
          method: "POST",

        });
        const data = await res.json();

        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["authUser"]});
    },
    onError: () => {
      toast.error("Logout failed");
    },
  })
  
  const {data:authUser} = useQuery({queryKey:["authUser"]})

  return (
    <div className="md:flex-[2_2_0] w-32 max-w-64 -ml-7">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-300 w-20 md:w-full bg-[#FFF9E5]"> {/* Very light yellow background */}
        {/* Logo */}
        <Link to="/" className="flex justify-center md:justify-start">
          <img
            src={logo1}
            alt="Logo"
            className="px-2 w-28 h-auto rounded-full hover:bg-[#FFF4CC] hover:scale-105 transition-transform duration-300" // Light yellow shade for hover
          />
        </Link>

        {/* Navigation Links */}
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-primary hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8 text-secondary" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-primary hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6 text-secondary" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-primary hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6 text-secondary" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
          {/* Flashcards Option */}
          <li className="flex justify-center md:justify-start">
            <Link
              to="/flashcards"
              className="flex gap-3 items-center hover:bg-primary hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <BiBook className="w-6 h-6 text-secondary" />
              <span className="text-lg hidden md:block">Flashcards</span>
            </Link>
          </li>
        </ul>

        {/* Profile Section */}
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#FDE68A] py-2 px-4 rounded-full" // Updated hover color
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-neutral font-bold text-sm truncate">{authUser?.fullName}</p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut className="w-5 h-5 text-secondary cursor-pointer" 
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
