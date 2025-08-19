import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import useAxios from '../../hooks/useAxios';
import GetDeviceInfo from '../GetDeviceInfo/GetDeviceInfo';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import googleLogo from '../../assets/logo/google.png';
import useAuth from '../../hooks/useAuth';

const COOKIE_OPTIONS = { expires: 7, secure: true, sameSite: 'strict' };

const SocialLogIn = () => {
    const [axiosSecure, axiosError] = useAxios();
    const { signInWithGoogle} = useAuth();
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const deviceInfo = useMemo(() => ({
        ...GetDeviceInfo(),
        lastLogin: new Date().toISOString()
    }), []);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const user = await signInWithGoogle();
            console.log("Google user:", user);
            
            // Get or create device ID
            let deviceId = Cookies.get('deviceId');
            if (!deviceId) {
                deviceId = CryptoJS.lib.WordArray.random(16).toString();
                Cookies.set('deviceId', deviceId, { ...COOKIE_OPTIONS, expires: 365 });
            }

            // Call your social login endpoint
            const response = await axiosSecure.post('/api/login-social', {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'User',
                phoneNumber: user.phoneNumber || '',
                firebaseUid: user.uid,
                agree: false,
                deviceInfo: { ...deviceInfo, deviceId },
            });
            console.log(response);
            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Login failed');
            }

            localStorage.setItem('access-token', response.data.token);
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Google login error:", error);
            if (axiosError) {
                console.error("API Error:", axiosError);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-5">
            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 border border-gray-300 px-6 py-2 rounded-md hover:shadow transition duration-200 bg-white"
            >
                {(loading) ? (
                    <CircularProgress size={24} />
                ) : (
                    <>
                        <img src={googleLogo} alt="Google Logo" className="w-6 h-6" />
                        <span className="text-gray-700 font-medium">Continue with Google</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default SocialLogIn;