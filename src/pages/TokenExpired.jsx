import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { tokenStorage } from '@/api/apiClient';

export default function TokenExpired() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const reason = searchParams.get('reason') || 'session_expired';

    const messages = {
        token_expired: {
            title: 'Session Expired',
            description: 'Your session has expired. Please login again to continue.',
            icon: RefreshCw,
        },
        session_invalid: {
            title: 'Invalid Session',
            description: 'Your session is no longer valid. This can happen after system updates. Please login again.',
            icon: AlertTriangle,
        },
        migration_required: {
            title: 'Re-authentication Required',
            description: 'The authentication system has been updated. Please login again to get a fresh session.',
            icon: RefreshCw,
        },
    };

    const message = messages[reason] || messages.token_expired;
    const Icon = message.icon;

    useEffect(() => {
        // Clear any remaining tokens
        tokenStorage.clearTokens();
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-amber-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">{message.title}</h1>
                <p className="text-gray-600 mb-6">{message.description}</p>

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <LogIn className="w-5 h-5" />
                    Login Again
                </button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-left">
                    <p className="font-medium text-blue-900 mb-2">Why did this happen?</p>
                    <ul className="text-blue-800 space-y-1 text-xs">
                        <li>• Your session expired after being inactive</li>
                        <li>• The authentication system was recently updated</li>
                        <li>• You logged out from another device</li>
                        <li>• Security token needs to be refreshed</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
