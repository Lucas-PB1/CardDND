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
            <div className="flex h-64 w-full items-center justify-center rounded-xl border border-border bg-muted/10">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-dnd-azure"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full rounded-xl border border-border bg-muted/10 p-8 text-center text-muted-foreground">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border shadow-xl">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-border bg-muted/50 text-muted-foreground">
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
                <tbody className="divide-y divide-border bg-dnd-card">
                    {data.map((item) => (
                        <tr key={keyExtractor(item)} className="transition-colors hover:bg-muted/20">
                            {columns.map((col, index) => (
                                <td
                                    key={index}
                                    className={`p-4 text-sm text-dnd-fg ${col.className || ""}`}
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
