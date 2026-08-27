import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

const Docs = () => {
	const navigate = useNavigate();
	const docsRedirectUrl = import.meta.env.VITE_DOCS_URL;
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!docsRedirectUrl) {
			console.error('Redirection failed: VITE_DOCS_URL is not defined.');
			setError('Documentation URL configuration is missing.');
			return;
		}

		const timer = setTimeout(() => {
			window.location.href = docsRedirectUrl;
		}, 600);

		return () => clearTimeout(timer);
	}, [docsRedirectUrl]);

	return (
		<div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 antialiased font-sans select-none">
			<div className="w-full max-w-md text-center space-y-6 px-4">
				<div className="flex justify-center">
					<div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl">
						<BookOpen
							className={`h-5 w-5 ${
								error ? 'text-red-400' : 'text-zinc-400 animate-pulse'
							}`}
						/>

						{!error && (
							<span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300"></span>
							</span>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-medium tracking-tight text-zinc-100">
						{error ? 'Redirection Failed' : 'Redirecting to docs'}
					</h1>
					<p className="text-sm text-zinc-400 font-normal">
						{error ? error : 'Taking you straight to our documentation page.'}
					</p>
				</div>

				<div
					className="w-32 mx-auto pt-2"
					role="progressbar"
					aria-label="Loading destination"
				>
					{error ? (
						<div className="text-xs text-red-400 font-mono bg-red-950/30 border border-red-900/50 py-1 px-2 rounded">
							ERR_ENV_MISSING
						</div>
					) : (
						<div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden relative">
							<div className="absolute inset-0 bg-zinc-400 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
						</div>
					)}
				</div>

				{/* Redirect Button */}
				<div className="pt-4">
					<button
						onClick={() => navigate('/')}
						className="inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Home</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Docs;
