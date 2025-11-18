import Image from 'next/image';

export default function NavIcon({
  src,
  alt = '',
}: {
  src: string;
  alt?: string;
}) {
  return (
    <Image src={src} width={100} height={100} alt={alt} className="size-12" />
  );
}
