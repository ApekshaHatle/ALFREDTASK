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
		<div className="max-w-screen-xl mx-auto flex h-screen px-10 bg-base-100">
			<div className="flex-1 hidden lg:flex items-center justify-center">
				<img src={logo} alt="Logo" className="lg:w-2/3" />
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
					<img src={logo} alt="Logo" className="w-24 lg:hidden" />
					<h1 className="text-4xl font-extrabold text-primary">{"Let's"} go.</h1>
					
					<label className="input input-bordered rounded flex items-center gap-2">
						< MdOutlineMail className="text-secondary" />
						<input
							type="text"
							className="grow bg-transparent outline-none text-base-content"
							placeholder="Username"
							name="username"
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className="input input-bordered rounded flex items-center gap-2">
						<MdPassword className="text-accent" />
						<input
							type="password"
							className="grow bg-transparent outline-none text-base-content"
							placeholder="Password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>

					<button className="btn rounded-full btn-accent text-white">
						{isPending ? "Loading..." : "Login"}
					</button>

					{isError && <p className="text-error">{error.message}</p>}
				</form>
				
				<div className="flex flex-col lg:w-2/3 gap-2 mt-4">
					<p className="text-lg text-primary">{"Don't"} have an account?</p>
					<Link to="/signup">
						<button className="btn rounded-full btn-outline btn-secondary w-full">
							Sign up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
