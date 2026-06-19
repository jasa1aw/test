import { AuthTabs } from "@/components/AuthTabs"

export default function AuthPage() {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
			<div
				className="pointer-events-none fixed inset-0 flex items-center justify-center"
				aria-hidden="true"
			>
				<div
					className="h-[700px] w-[700px] rounded-full"
					style={{ background: "radial-gradient(ellipse at center, var(--auth-glow) 0%, transparent 65%)" }}
				/>
			</div>

			<div className="relative z-10 w-full max-w-[400px]">
				<div
					className="rounded-[12px] border border-border bg-card p-10"
					style={{ boxShadow: "var(--auth-card-shadow)" }}
				>
					<p className="text-[22px] font-bold tracking-[-0.4px] text-card-foreground">
						CRM
					</p>
					<p className="mb-7 mt-1 text-[13px] leading-snug text-muted-foreground">
						Совместная работа в реальном времени
					</p>
					<AuthTabs />
				</div>
			</div>
		</div>
	)
}