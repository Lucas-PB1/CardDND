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
            <div className="flex h-64 w-full items-center justify-center rounded-xl border border-white/10 bg-gray-900/50">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full rounded-xl border border-white/10 bg-gray-900/50 p-8 text-center text-gray-400">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-white/10 shadow-xl">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-white/10 bg-gray-800/80 text-gray-300">
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`p-4 text-sm font-semibold tracking-wide uppercase ${col.className || ""}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-gray-900/50">
                    {data.map((item) => (
                        <tr key={keyExtractor(item)} className="transition-colors hover:bg-white/5">
                            {columns.map((col, index) => (
                                <td
                                    key={index}
                                    className={`p-4 text-sm text-gray-300 ${col.className || ""}`}
                                >
                                    {col.render
                                        ? col.render(item)
                                        : col.key
                                          ? String(item[col.key])
                                          : ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
