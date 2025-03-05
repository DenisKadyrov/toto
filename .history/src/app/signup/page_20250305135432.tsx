"use client";
import Link from "next/link";


export default function SignupPage() {
	

	return (
		<>
			<div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<p className="mx-auto h-10 w-auto flex justify-center items-center font-black text-blue-500 text-2xl">
						TodoApp
					</p>
					<h2 className="mt-5 text-center text-2xl font-medium leading-9 tracking-tight text-black">
						Sign in to your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleSubmit} noValidate>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-black"
							>
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									value={values.email}
									onChange={handleChange}
									//check the felid value is touched before make the felid touched value true
									onBlur={() => handleBlur("email")}
									placeholder="email address"
									autoComplete="email"
									required
									className={`w-full rounded-md border-5 bg-transparent/5 placeholder:text-black/30 border-gray-600 py-1.5 text-black shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
										touched.email && errors.email
											? "text-black focus:outline-none focus:border-red-600 border-2 bg-transparent border-red-600 placeholder:text-gray-400 transition-all"
											: ""
									}  `}
								/>

								{touched.email && errors.email && (
									<p className="text-red-600 mt-2 text-sm">{errors.email}</p>
								)}
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="username"
									className="block text-sm font-medium leading-6 text-black"
								>
									Username
								</label>
							</div>
							<div className="mt-2">
								<input
									id="username"
									name="username"
									type="text"
									value={values.username}
									onChange={handleChange}
									onBlur={() => handleBlur("username")}
									placeholder="username"
									required
									className={`w-full rounded-md border-5 bg-transparent/5 placeholder:text-black/30 border-gray-600 py-1.5 text-black shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
										touched.username && errors.username
											? "text-black focus:outline-none focus:border-red-600 border-2 bg-transparent border-red-600 placeholder:text-gray-400 transition-all"
											: ""
									}  `}
								/>
								{touched.username && errors.username && (
									<p className="text-red-600 mt-2 text-sm">{errors.username}</p>
								)}
							</div>
						</div>
						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 text-black"
								>
									Password
								</label>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									value={values.password}
									onChange={handleChange}
									placeholder="password"
									onBlur={() => handleBlur("password")}
									autoComplete="current-password"
									required
									className={`w-full rounded-md border-5 bg-transparent/5 placeholder:text-black/30 border-gray-600 py-1.5 text-black shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
										touched.password && errors.password
											? "text-black focus:outline-none focus:border-red-600 border-2 bg-transparent border-red-600 placeholder:text-gray-400 transition-all"
											: ""
									}  `}
								/>
								{touched.password && errors.password && (
									<p className="text-red-600 mt-2 text-sm">{errors.password}</p>
								)}
							</div>
						</div>

						<div>
							<button
								onClick={onSignup}
								type="submit"
								disabled={
									!isValid || isSubmitting || Boolean(touched.email && errors.email)
								}
								className={`${
									isValid
										? "bg-blue-600 hover:bg-blue-500 slide-in-elliptic-top-fwd"
										: "bg-red-600 cursor-not-allowed hover:bg-red-500 shake-horizontal"
								} 
                
                cursor-pointer flex items-center gap-2 w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm`}
							>
								{isSubmitting ? "Signing Up..." : "Sign Up"}
								{isLoading && <BiLoaderAlt className="text-lg animate-spin" />}
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm text-gray-500">
						already a member? &nbsp;
						<Link
							href="/login"
							className="font-semibold leading-6 text-blue-600 hover:text-blue-400"
						>
							log in now
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
