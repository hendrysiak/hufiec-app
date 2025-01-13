import Team from "legacy/Team/Team";

export default async function Page({
  params,
}: {
  params: Promise<{ team: string }>;
}) {
  const slug = (await params).team;
  return <Team currentTeam={slug} />;
}
