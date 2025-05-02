"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "#/lib/providers/trpc-provider";

export default function ProductPage() {
  const trpc = useTRPC();
  const { isPending, error, data } = useQuery(trpc.projects.queryOptions());

  if (isPending) return "Loading...";

  if (error) return `An error has occurred: ${error.message}`;

  return (
    <div className="p-4">
      <h1>Product Page</h1>
      {data.map((item) => (
        <p>{item.name}</p>
      ))}
    </div>
  );
}
