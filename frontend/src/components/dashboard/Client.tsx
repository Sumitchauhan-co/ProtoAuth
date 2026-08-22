import { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Icons from '@/utils/Icons';
import api from '@/api/axios';
import { isAxiosError } from 'axios';

export interface ApplicationType {
	id: string;
	name: string;
	clientId: string;
	clientSecret?: string;
	ownerId: string;
	isActive: boolean;
	redirectUris: Array<string>;
}

const ClientsPage = () => {
	const navigate = useNavigate();
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [application, setApplication] = useState<Array<ApplicationType>>([]);

	// Copy Client ID or Secret to clipboard with auto-reset state
	const copyToClipboard = (text: string, label: string, fieldId: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(fieldId);
		toast.success(`${label} copied to clipboard`);

		setTimeout(() => {
			setCopiedId(null);
		}, 2000);
	};

	// Helper to format secret: shows starting 4 characters + masked bullets
	const formatClientSecret = (secret?: string) => {
		if (!secret) return '••••••••••••••••••••••••';
		const visibleSuffix = secret.slice(-8);
		return `••••••••••••••••${visibleSuffix}`;
	};

	// Helper to handle external URI redirects on link button click
	const handleRedirect = (redirectUris: Array<string>) => {
		if (!redirectUris || redirectUris.length === 0) {
			toast.error('No redirect URI configured for this application');
			return;
		}

		let targetUrl = redirectUris[0];
		// Ensure protocol exists for valid browser navigation
		if (!/^https?:\/\//i.test(targetUrl)) {
			targetUrl = `https://${targetUrl}`;
		}

		window.open(targetUrl, '_blank', 'noopener,noreferrer');
	};

	// Delete application API call with toast notification and state cleanup
	const handleDelete = async (id: string) => {
		setDeletingId(id);

		const deletePromise = async () => {
			try {
				await api.delete(`/api/admin/application/${id}`);
				setApplication((prev) => prev.filter((app) => app.id !== id));
				return 'Application deleted successfully';
			} catch (error) {
				let message = 'Failed to delete application';
				if (isAxiosError(error)) {
					message = error.response?.data?.message || message;
				}
				throw (new Error(message), { cause: error });
			} finally {
				setDeletingId(null);
			}
		};

		toast.promise(deletePromise(), {
			loading: 'Deleting application...',
			success: (msg) => msg,
			error: (err) => `${err.message}`,
		});
	};

	// Fetch API clients on mount
	useEffect(() => {
		const applicationPromise = async () => {
			try {
				const res = await api.get('/api/admin/application');
				setApplication(res.data.data);
				return 'Clients updated';
			} catch (error) {
				let message = 'Server is unreachable';
				if (isAxiosError(error)) {
					message = error.response?.data?.message || message;
				}
				throw new Error(message, { cause: error });
			}
		};
		toast.promise(applicationPromise(), {
			loading: 'Verifying credentials...',
			success: (msg) => msg,
			error: (err) => `${err.message}`,
		});
	}, []);

	return (
		<section className="p-4 md:p-6 mx-auto space-y-6">
			{/* Header Area */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">API Clients</h1>
					<p className="text-sm text-neutral-500">
						Manage your app credentials and secrets.
					</p>
				</div>
				<Button
					onClick={() => navigate('/dashboard/apps')}
					className="bg-black dark:bg-white text-white dark:text-black gap-2"
				>
					<Icons.Add size={18} />
					Create New Client
				</Button>
			</div>

			{/* Main Content */}
			<Card className="border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
				<CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
					<CardTitle className="text-sm font-semibold flex items-center gap-2">
						<Icons.Key
							size={18}
							className="text-neutral-400"
						/>
						Active Credentials
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent border-neutral-200 dark:border-neutral-800">
								<TableHead className="w-[200px] pl-6 text-xs uppercase font-bold text-neutral-400">
									Application
								</TableHead>
								<TableHead className="text-xs uppercase font-bold text-neutral-400">
									Client ID
								</TableHead>
								<TableHead className="text-xs uppercase font-bold text-neutral-400">
									Client Secret
								</TableHead>
								<TableHead className="text-right pr-6 text-xs uppercase font-bold text-neutral-400">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{application?.map((client) => (
								<TableRow
									key={client.id}
									className="border-neutral-200 dark:border-neutral-800"
								>
									<TableCell className="pl-6 font-medium">
										<div className="flex flex-col">
											<span className="text-sm">{client.name}</span>
											<span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">
												● {client.isActive ? 'Active' : 'Inactive'}
											</span>
										</div>
									</TableCell>

									{/* Client ID Column */}
									<TableCell>
										<div className="flex items-center gap-2">
											<code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
												{client.clientId}
											</code>
											<button
												title="client id"
												onClick={() =>
													copyToClipboard(
														client.clientId,
														'Client ID',
														`${client.id}-id`,
													)
												}
												className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
											>
												{copiedId === `${client.id}-id` ? (
													<Icons.Check
														size={14}
														className="text-emerald-500"
													/>
												) : (
													<Icons.Copy size={14} />
												)}
											</button>
										</div>
									</TableCell>

									{/* Client Secret Mask Column (Shows first 4 characters) */}
									<TableCell>
										<div className="flex items-center gap-2">
											<code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-[11px] font-mono text-neutral-600 dark:text-neutral-300 select-none">
												{formatClientSecret(client.clientSecret)}
											</code>
										</div>
									</TableCell>

									{/* Actions */}
									<TableCell className="text-right pr-6">
										<div className="flex justify-end gap-2">
											{/* Link Button: Redirects to configured Redirect URI */}
											<Button
												variant="ghost"
												size="icon"
												title="Open Redirect URI"
												onClick={() => handleRedirect(client.redirectUris)}
												className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
											>
												<Icons.Link size={16} />
											</Button>

											{/* Delete Confirmation Alert Dialog */}
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														disabled={deletingId === client.id}
														className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
													>
														<Icons.Trash size={16} />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															Delete application?
														</AlertDialogTitle>
														<AlertDialogDescription>
															Are you sure you want to delete{' '}
															<strong className="text-neutral-900 dark:text-neutral-100">
																{client.name}
															</strong>
															? This action cannot be undone and will revoke all
															associated API keys.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => handleDelete(client.id)}
															className="bg-red-600 hover:bg-red-700 text-white"
														>
															Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Warning Footer */}
			<div className="flex items-start gap-3 p-4 rounded-lg border border-amber-100 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5">
				<div className="p-1 bg-amber-100 dark:bg-amber-500/20 rounded text-amber-600 dark:text-amber-400">
					<Icons.Key size={16} />
				</div>
				<div className="space-y-1">
					<p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
						Security Warning
					</p>
					<p className="text-[11px] text-amber-700 dark:text-amber-500/80 leading-relaxed">
						Client secrets grant significant access to your resources. Secrets
						are shown once upon creation and cannot be retrieved later. If lost
						or compromised, generate a new client.
					</p>
				</div>
			</div>
		</section>
	);
};

export default ClientsPage;
