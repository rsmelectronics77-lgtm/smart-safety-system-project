export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start justify-center min-h-[300px] gap-2 border border-dashed border-border rounded-[14px] p-8 animate-fadeSlideIn">
      <div className="text-[17px] font-bold">{title}</div>
      <p className="text-text-muted text-[13.5px] max-w-[420px] leading-relaxed m-0">
        This section isn&apos;t built yet. The dashboard view is fully wired to the mock sensor
        service — once your API is live, this page will follow the same data layer.
      </p>
    </div>
  );
}
