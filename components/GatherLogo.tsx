import Image from "next/image";

type GatherLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function GatherLogo({
  className = "",
  priority = false,
}: GatherLogoProps) {
  const imageClassName = ["brand-logo-image", className].filter(Boolean).join(" ");

  return (
    <Image
      src="/gather-logo-mark.png"
      alt=""
      aria-hidden="true"
      width={79}
      height={79}
      priority={priority}
      className={imageClassName}
    />
  );
}
