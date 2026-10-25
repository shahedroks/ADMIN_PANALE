import { useEffect, useMemo, useState } from "react";

import {
  inferAvatarGender,
  placeholderAvatarUrl,
  resolveUserAvatarUrl,
} from "@/lib/userAvatar";

type UserAvatarProps = {
  photoUrl?: string | null;
  seed: string;
  displayName?: string;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
};

export function UserAvatar({
  photoUrl,
  seed,
  displayName,
  width = 40,
  height = 40,
  className,
  alt = "",
}: UserAvatarProps) {
  const initialSrc = useMemo(
    () => resolveUserAvatarUrl({ photoUrl, seed, displayName }),
    [photoUrl, seed, displayName],
  );
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    setSrc(initialSrc);
  }, [initialSrc]);

  const fallback = useMemo(
    () => placeholderAvatarUrl(inferAvatarGender(seed, displayName)),
    [seed, displayName],
  );

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
