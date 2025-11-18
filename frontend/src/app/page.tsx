import HomePage from "./home/page";

export default function Page() {
  // Root page renders the HomePage component; primary routes live under their
  // own folders (e.g. /home, /about) so each page can own its folder structure.
  return <HomePage />;
}
