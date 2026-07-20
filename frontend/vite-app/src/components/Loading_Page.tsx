import { Spinner } from "@/components/ui/spinner";

export default function LoadingPage() {
  return (
      <div className="flex items-center justify-center h-[calc(100vh-69px)]">
        <Spinner className="size-8" />
      </div>
  );
}
