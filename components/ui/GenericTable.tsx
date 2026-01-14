import { ReactNode } from "react";

export interface ColumnConfig<T> {
    header: string;
    key?: keyof T;
    render?: (item: T) => ReactNode;
    className?: string;
}

interface GenericTableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
    loading?: boolean;
}

export function GenericTable<T>({
    data,
    columns,
    keyExtractor,
    emptyMessage = "No data available.",
    loading = false,
}: GenericTableProps<T>) {
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-gray-900/50 rounded-xl border border-white/10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full p-8 text-center bg-gray-900/50 rounded-xl border border-white/10 text-gray-400">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-white/10 shadow-xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-800/80 text-gray-300 border-b border-white/10">
                        {columns.map((col, index) => (
                            <th key={index} className={`p-4 font-semibold text-sm uppercase tracking-wide ${col.className || ""}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-gray-900/50">
                    {data.map((item) => (
                        <tr key={keyExtractor(item)} className="hover:bg-white/5 transition-colors">
                            {columns.map((col, index) => (
                                <td key={index} className={`p-4 text-sm text-gray-300 ${col.className || ""}`}>
                                    {col.render ? col.render(item) : (col.key ? String(item[col.key]) : "")}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
