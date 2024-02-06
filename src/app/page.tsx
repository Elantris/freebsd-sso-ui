"use client";

import { ory } from "@/utils/ory";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        router.push("/settings");
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  return (
    <div className="page">
      <div className="container">Loading...</div>
    </div>
  );
}
