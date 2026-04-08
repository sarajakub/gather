import PersonProfilePage from '@/components/PersonProfilePage';

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PersonProfilePage slug={slug} />;
}
