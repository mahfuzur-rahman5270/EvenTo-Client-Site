import { useState, useEffect } from 'react';
import useAxios from './useAxios';

const useAdminData = (id) => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [axiosSecure] = useAxios();

    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const response = await axiosSecure.get(`/api/users/admin/profile/${id}`);
                setInfo(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminInfo();
    }, [axiosSecure, id]);

    return { info, loading, error };
};

export default useAdminData;
