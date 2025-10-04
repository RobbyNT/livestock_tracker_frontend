export interface LoadingState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
}