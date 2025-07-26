import { useEffect, useState } from "react";

export default function useGetAdmin() {
    const [admin, setAdmin] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await fetch("/api/admin");
                if (!response.ok) {
                    throw new Error("Failed to fetch admin");
                }
                const data = await response.json();
                setAdmin(data);
            } catch (error) {
                setError(error as string);
            } finally {
                setIsLoading(false);
            }
        }   
        fetchAdmin();
    }, []);

    return { admin, error, isLoading };
}