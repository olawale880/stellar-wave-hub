"use client";

import {useState} from "react";
import {useAuth} from "@/context/AuthContext";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function LoginPage() {
	const {login} = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await login(email, password);
			router.push("/explore");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		}
		setLoading(false);
	};

	return (
		<div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
			<div className="w-full max-w-md">
				<div className="text-center mb-8 animate-in">
					<div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-nova to-plasma flex items-center justify-center">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
							<polyline points="10 17 15 12 10 7" />
							<line x1="15" y1="12" x2="3" y2="12" />
						</svg>
					</div>
					<h1 className="font-display font-bold text-3xl text-starlight">
						Welcome back
					</h1>
					<p className="text-ash mt-2">
						Sign in to your Stellar Wave Hub account
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="glass rounded-2xl p-8 space-y-5 animate-in animate-in-delay-1"
				>
					{error && (
						<div className="bg-supernova/10 border border-supernova/20 text-supernova rounded-xl px-4 py-3 text-sm">
							{error}
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-moonlight mb-2">
							Email
						</label>
						<input
							type="email"
							required
							className="input-field"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-moonlight mb-2">
							Password
						</label>
						<input
							type="password"
							required
							className="input-field"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="btn-nova w-full !py-3 text-center disabled:opacity-50"
					>
						{loading ? "Signing in..." : "Sign In"}
					</button>

					<p className="text-center text-sm text-ash">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="text-nova-bright hover:underline font-medium"
						>
							Create one
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
