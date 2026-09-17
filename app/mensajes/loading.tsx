import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 sm:max-w-sm sm:flex-1" />
        <Skeleton className="h-10 sm:w-56" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    </div>
  );
}
