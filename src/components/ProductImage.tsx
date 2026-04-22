import { BraceletPreview } from "./BraceletPreview";

type Props = {
  imageUrl?: string;
  colors: string[];
  size?: number;
  alt?: string;
  className?: string;
  animate?: boolean;
};

export function ProductImage({
  imageUrl,
  colors,
  size = 200,
  alt = "Bracelet",
  className = "",
  animate = false,
}: Props) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-cover rounded-2xl ${className}`}
        loading="lazy"
      />
    );
  }
  return (
    <BraceletPreview
      colors={colors}
      size={size}
      className={className}
      animate={animate}
    />
  );
}
