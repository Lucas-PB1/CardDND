import { auth } from "@/lib/firebase";

export abstract class BaseApiService {
    protected async getAuthHeaders(): Promise<HeadersInit> {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");
        const token = await user.getIdToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    protected async get<T>(url: string): Promise<T> {
        const headers = await this.getAuthHeaders();
        const res = await fetch(url, { headers });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || `Failed to fetch ${url}`);
        }
        return res.json();
    }

    protected async post<T, B>(url: string, body: B): Promise<T> {
        const headers = await this.getAuthHeaders();
        const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || `Failed to post to ${url}`);
        }
        return res.json();
    }

    protected async patch<T, B>(url: string, body: B): Promise<T> {
        const headers = await this.getAuthHeaders();
        const res = await fetch(url, {
            method: "PATCH",
            headers,
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || `Failed to patch ${url}`);
        }
        return res.json();
    }

    protected async put<T, B>(url: string, body: B): Promise<T> {
        const headers = await this.getAuthHeaders();
        const res = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || `Failed to put ${url}`);
        }
        return res.json();
    }

    protected async delete<T>(url: string): Promise<T> {
        const headers = await this.getAuthHeaders();
        const res = await fetch(url, {
            method: "DELETE",
            headers,
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || `Failed to delete ${url}`);
        }
        return res.json();
    }
}
