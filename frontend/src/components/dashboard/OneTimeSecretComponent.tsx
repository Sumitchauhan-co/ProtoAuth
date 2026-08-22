import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Icons from '@/utils/Icons';

interface OneTimeSecretProps {
	data: {
		clientId: string;
		clientSecret: string;
		name: string;
	};
	onClose: () => void;
}

const OneTimeSecretComponent: React.FC<OneTimeSecretProps> = ({
	data,
	onClose,
}) => {
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const copyToClipboard = (text: string, label: string, key: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(key);
		toast.success(`${label} copied to clipboard`);

		setTimeout(() => {
			setCopiedId(null);
		}, 2000);
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
			<Card className="w-full max-w-lg border-amber-200 dark:border-amber-900/50 shadow-xl bg-white dark:bg-neutral-950">
				<CardHeader className="border-b border-neutral-100 dark:border-neutral-900 py-4 px-5">
					<CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-500">
						<Icons.Key size={18} />
						Save Your Client Secret
					</CardTitle>
				</CardHeader>
				<CardContent className="p-5 space-y-5">
					<p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
						Client secrets are <strong>only revealed once</strong> upon
						creation. Make sure to copy and store your secret in a secure
						location right now.
					</p>

					<div className="space-y-3">
						{/* Application Name */}
						<div className="space-y-1">
							<label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
								Application Name
							</label>
							<div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
								{data.name}
							</div>
						</div>

						{/* Client ID */}
						<div className="space-y-1">
							<label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
								Client ID
							</label>
							<div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-md font-mono text-xs text-neutral-700 dark:text-neutral-300">
								<span className="truncate mr-2">{data.clientId}</span>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() =>
										copyToClipboard(data.clientId, 'Client ID', 'cid')
									}
									className="h-7 px-2 text-xs gap-1 text-neutral-500 hover:text-black dark:hover:text-white"
								>
									{copiedId === 'cid' ? (
										<Icons.Check
											size={14}
											className="text-emerald-500"
										/>
									) : (
										<Icons.Copy size={14} />
									)}
								</Button>
							</div>
						</div>

						{/* Client Secret */}
						<div className="space-y-1">
							<label className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
								Client Secret (One-Time Display)
							</label>
							<div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-2.5 rounded-md font-mono text-xs text-amber-900 dark:text-amber-200">
								<span className="break-all mr-2">{data.clientSecret}</span>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() =>
										copyToClipboard(
											data.clientSecret,
											'Client Secret',
											'secret',
										)
									}
									className="h-7 px-2 text-xs gap-1 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
								>
									{copiedId === 'secret' ? (
										<Icons.Check
											size={14}
											className="text-emerald-500"
										/>
									) : (
										<Icons.Copy size={14} />
									)}
								</Button>
							</div>
						</div>
					</div>

					<div className="pt-2 flex justify-end">
						<Button
							type="button"
							onClick={onClose}
							className="bg-black dark:bg-white text-white dark:text-black font-semibold text-xs px-6"
						>
							I have saved my secret
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default OneTimeSecretComponent;
