export default function AdamPreviewPage() {
	return (
		<section className="h-screen w-full bg-black overflow-hidden">
			<iframe
				src="https://adam-demo-frontend.vercel.app/"
				title="ADAM Demo"
				className="h-full w-full border-0"
				allow="clipboard-read; clipboard-write; microphone; camera; fullscreen"
				allowFullScreen
			/>
		</section>
	);
}