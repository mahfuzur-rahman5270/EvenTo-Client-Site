import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useAdmin = () => {
    const { user, loading } = useAuth();
    const [axiosSecure] = useAxios();

    const email = user?.email;

    const {
        data: isAdmin = false,
        isLoading: isAdminLoading,
        refetch,
    } = useQuery({
        queryKey: ['isAdmin', email],
        enabled: !loading && !!email, // Ensure query only runs when ready
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/verify/admin-users/${email}`);
            return res.data;
        },
        select: data => data?.Admin || false, // Only return boolean
        retry: 1,                              // One retry on failure
        staleTime: 0,
        cacheTime: 10 * 60 * 1000,             // 10 minutes in cache
        refetchOnWindowFocus: false,           // Less aggressive refetch
        refetchOnMount: false,                 // Skip on remount
        refetchOnReconnect: true,              // Refetch only if connection drops
    });

    return [isAdmin, isAdminLoading, refetch];
};

export default useAdmin;
