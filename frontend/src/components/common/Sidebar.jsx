import logo2 from "../../assets/logo2.png";
import { BiBook, BiLogOut } from "react-icons/bi";
import { MdQuestionAnswer } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="md:flex-[2_2_0] w-32 max-w-64 -ml-7 pl-6">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-200 w-20 md:w-full bg-[#2C3E50] shadow-lg"> {/* Dark background */}
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center pr-8">
          <img
            src={logo2}
            alt="Logo"
            className="w-36 h-32 rounded-full transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Navigation Links */}
        <ul className="flex flex-col gap-4 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-[#34495E] text-white transition-all rounded-lg duration-300 py-2 pl-3 pr-5 max-w-fit cursor-pointer"
            >
              <BiBook className="w-6 h-6 text-blue-200" /> {/* Light blue */}
              <span className="text-lg hidden md:block">Flashcards</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-[#34495E] text-white transition-all rounded-lg duration-300 py-2 pl-3 pr-5 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6 text-orange-200" /> {/* Light orange */}
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-[#34495E] text-white transition-all rounded-lg duration-300 py-2 pl-3 pr-5 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6 text-green-200" /> {/* Light green */}
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to="/doubt-forum"
              className="flex gap-3 items-center hover:bg-[#34495E] text-white transition-all rounded-lg duration-300 py-2 pl-3 pr-5 max-w-fit cursor-pointer"
            >
              <MdQuestionAnswer className="w-6 h-6 text-purple-200" /> {/* Light purple */}
              <span className="text-lg hidden md:block">Doubt Forum</span>
            </Link>
          </li>
        </ul>

        {/* Profile Section */}
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-center transition-all duration-300 hover:bg-[#3E5360] py-2 px-4 rounded-lg shadow-sm"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm truncate">{authUser?.fullName}</p>
                <p className="text-gray-400 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 text-red-300 cursor-pointer"  // Light red
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
