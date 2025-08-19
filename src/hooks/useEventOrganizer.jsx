import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useEventOrganizer = () => {
    const { user, loading } = useAuth();
    const [axiosSecure] = useAxios();

    const email = user?.email;

    const {
        data: isEventOrganizer = false,
        isLoading: isEventOrganizerLoading,
        refetch: reloadEventOrganizerState,
    } = useQuery({
        queryKey: ['isEventOrganizer', email],
        enabled: !loading && !!email, // Ensure query only runs when ready
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/verify/event-organizer/${email}`);
            return res.data;
        },
        select: data => data?.Event_Organizer || false, // Only return boolean
        retry: 1,                              // One retry on failure
        staleTime: 0,
        cacheTime: 10 * 60 * 1000,             // 10 minutes in cache
        refetchOnWindowFocus: false,           // Less aggressive refetch
        refetchOnMount: false,                 // Skip on remount
        refetchOnReconnect: true,              // Refetch only if connection drops
    });

    return [isEventOrganizer, isEventOrganizerLoading, reloadEventOrganizerState];
};

export default useEventOrganizer;