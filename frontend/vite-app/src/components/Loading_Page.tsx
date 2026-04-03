import { Spinner } from "@/components/ui/spinner";
import Header from "./Header";

export default function LoadingPage({ user, onLogout }: any) {
  return (
    <>
      <Header user={user} onLogout={onLogout}></Header>
      <div className="flex items-center justify-center h-[calc(100vh-69px)]">
        <Spinner className="size-8" />
      </div>
    </>
  );
}
