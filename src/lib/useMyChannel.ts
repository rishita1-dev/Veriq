import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { fetchCreatorByHandle } from "./youtube";
import type { CreatorProfile } from "./types";

export function useMyChannel() {
  const { creatorHandle } = useApp();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCreatorByHandle(creatorHandle)
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [creatorHandle]);

  return { profile, loading };
}
