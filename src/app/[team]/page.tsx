export default async function Page({
  params,
}: {
  params: Promise<{ team: string }>;
}) {
  const slug = (await params).team;
  return <div>My Post: {slug}</div>;
}
