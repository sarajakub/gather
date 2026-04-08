import MessagesPage from '@/components/MessagesPage';

export default async function MessagesRoute({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const resolved = await searchParams;
	return <MessagesPage searchParams={resolved} />;
}
