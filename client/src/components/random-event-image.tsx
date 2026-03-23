interface RandomEventImageProps {
  seed?: string;
  alt?: string;
  className?: string;
}

const selectImageIndex = (seed = "default") => {
  const hash = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (hash % 4) + 1;
};

const RandomEventImage: React.FC<RandomEventImageProps> = ({
  seed,
  alt = "Event crowd",
  className = "h-full w-full object-cover",
}) => {
  const imageSrc = `/event-image-${selectImageIndex(seed)}.webp`;

  return <img src={imageSrc} alt={alt} className={className} />;
};

export default RandomEventImage;
