import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png"; 
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient();
	const { mutate: loginMutation, isPending, isError, error } = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Login Successful");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="max-w-screen-xl mx-auto flex h-screen px-10 bg-gray-50">
			{/* Logo Section */}
			<div className="flex-1 hidden lg:flex items-center justify-center bg-[#34495E] p-8 rounded-lg shadow-xl">
				<img src={logo} alt="Logo" className="lg:w-2/3" />
			</div>
			{/* Form Section */}
			<div className="flex-1 flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-8">
				<form className="lg:w-2/3 mx-auto md:mx-20 flex gap-6 flex-col" onSubmit={handleSubmit}>
					{/* Logo (Mobile) */}
					<img src={logo} alt="Logo" className="w-24 lg:hidden mb-6" />
					<h1 className="text-4xl font-extrabold text-teal-700">{"Let's"} go.</h1>
					
					{/* Input Fields */}
					<label className="input input-bordered rounded-lg flex items-center gap-2 mb-6 shadow-md border-teal-200">
						<MdOutlineMail className="text-teal-500" />
						<input
							type="text"
							className="grow bg-transparent outline-none text-gray-700"
							placeholder="Username"
							name="username"
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className="input input-bordered rounded-lg flex items-center gap-2 mb-6 shadow-md border-teal-200">
						<MdPassword className="text-teal-500" />
						<input
							type="password"
							className="grow bg-transparent outline-none text-gray-700"
							placeholder="Password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>

					{/* Login Button */}
					<button className="btn bg-teal-600 text-white rounded-full hover:bg-teal-500 focus:outline-none transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
						{isPending ? "Loading..." : "Login"}
					</button>

					{/* Error Message */}
					{isError && <p className="text-red-500 mt-2">{error.message}</p>}
				</form>
				
				{/* Sign Up Section */}
				<div className="flex flex-col lg:w-2/3 gap-2 mt-6">
					<p className="text-lg text-teal-700">{"Don't"} have an account?</p>
					<Link to="/signup">
						{/* Sign-up Button */}
						<button className="btn btn-outline border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white rounded-full w-full py-3 transition duration-300 ease-in-out transform hover:scale-105">
							Sign up
						</button>
					</Link>
				</div>

			</div>
		</div>
	);
};

export default LoginPage;
