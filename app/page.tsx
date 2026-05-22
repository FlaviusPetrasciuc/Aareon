import dynamic from "next/dynamic";

const HomeContent = dynamic(
  () => import("./HomeContent").then((m) => ({ default: m.HomeContent })),
  { ssr: false }
);

export default function Home() {
  return <HomeContent />;
}
