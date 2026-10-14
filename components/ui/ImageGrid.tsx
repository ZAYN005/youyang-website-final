/**
 * Optional image row added from 内容管理.
 * Renders nothing when there are no images, so the layout stays unchanged.
 */
export default function ImageGrid({
  images,
  alt,
  className = "",
}: {
  images: string[];
  alt: string;
  className?: string;
}) {

  if (images.length === 0) return null;

  const columns =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-6 ${columns} ${className}`}>
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={`w-full object-cover ${images.length === 1 ? "max-h-[520px]" : "h-64"}`}
          />
        </div>
      ))}
    </div>
  );

}
