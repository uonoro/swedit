// MediaView.tsx
export const MediaView = ({ url }: { url: string }) => (
  <div className="flex justify-content-center align-items-center h-full bg-black-alpha-10 border-round">
    <img
      src={url}
      alt="Preview"
      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      className="shadow-4"
    />
  </div>
);
