import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useUser = () => {
    const { user, loading } = useAuth();
    const [axiosSecure] = useAxios();

    const email = user?.email;

    const {
        data: isUser = false,
        isLoading: isUserLoading,
        refetch: reloadUserState,
    } = useQuery({
        queryKey: ['isUser', email],
        enabled: !loading && !!email, // Ensure query only runs when ready
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/verify/normal-users/${email}`);
            return res.data;
        },
        select: data => data?.User || false, // Only return boolean
        retry: 1,                              // One retry on failure
        staleTime: 0,
        cacheTime: 10 * 60 * 1000,             // 10 minutes in cache
        refetchOnWindowFocus: false,           // Less aggressive refetch
        refetchOnMount: false,                 // Skip on remount
        refetchOnReconnect: true,              // Refetch only if connection drops
    });

    return [isUser, isUserLoading, reloadUserState];
};

export default useUser;