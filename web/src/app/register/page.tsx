"use client";

import {useState} from "react";
import {useAuth} from "@/context/AuthContext";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function RegisterPage() {
	const {register} = useAuth();
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await register(username, email, password);
			router.push("/explore");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Registration failed",
			);
		}
		setLoading(false);
	};

	return (
		<div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
			<div className="w-full max-w-md">
				<div className="text-center mb-8 animate-in">
					<div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-plasma to-aurora flex items-center justify-center">
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
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<line x1="19" y1="8" x2="19" y2="14" />
							<line x1="22" y1="11" x2="16" y2="11" />
						</svg>
					</div>
					<h1 className="font-display font-bold text-3xl text-starlight">
						Join the Wave
					</h1>
					<p className="text-ash mt-2">
						Create your account to submit and rate projects
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
							Username
						</label>
						<input
							type="text"
							required
							className="input-field"
							placeholder="stellarbuilder"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

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
							minLength={6}
							className="input-field"
							placeholder="At least 6 characters"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="btn-nova w-full !py-3 text-center disabled:opacity-50"
					>
						{loading ? "Creating account..." : "Create Account"}
					</button>

					<p className="text-center text-sm text-ash">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-nova-bright hover:underline font-medium"
						>
							Sign in
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
