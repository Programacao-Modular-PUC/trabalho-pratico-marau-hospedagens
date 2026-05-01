type MetricCardProps = {
    label: string;
    value: string;
    sub: string;
    borderColor: string;
    valueColor: string;
};

export default function MetricCard({ label, value, sub, borderColor, valueColor }: MetricCardProps) {
    return (
        <div
            className="bg-white rounded-2xl shadow-sm px-6 py-5 flex flex-col gap-1 border-l-4"
            style={{ borderColor }}
        >
      <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
        {label}
      </span>
            <span className="text-4xl font-bold leading-tight" style={{ color: valueColor }}>
        {value}
      </span>
            <span className="text-sm text-gray-500">{sub}</span>
        </div>
    );
}