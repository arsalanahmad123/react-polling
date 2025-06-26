import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    Vote,
    Home,
    List,
    Plus,
    User,
    LogOut,
    LogIn,
    UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supbase';

export const Header = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navigationItems = [
        { name: 'Home', href: '/', icon: Home, public: true },
        { name: 'Browse Polls', href: '/polls', icon: List, public: true },
        { name: 'Create Poll', href: '/create', icon: Plus, public: false },
    ];

    const isActivePath = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                            <Vote className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Poll
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-1">
                        {navigationItems.map((item) => {
                            if (!item.public && !user) return null;
                            const Icon = item.icon;
                            const isActive = isActivePath(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button
                                        variant="ghost"
                                        
                                        className="flex items-center space-x-2"
                                    >
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage
                                                src={
                                                    user.user_metadata
                                                        ?.avatar_url ||
                                                    '/placeholder.svg'
                                                }
                                            />
                                            <AvatarFallback>
                                                {user.email
                                                    ?.charAt(0)
                                                    .toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium text-gray-700">
                                            {user.email?.split('@')[0]}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="start"
                                    className="w-56"
                                >
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile" className="w-full">
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="cursor-pointer text-red-600"
                                    >
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <Link
                                        to="/login"
                                        className="flex items-center space-x-2"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    <Link
                                        to="/register"
                                        className="flex items-center space-x-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigationItems.map((item) => {
                                if (!item.public && !user) return null;
                                const Icon = item.icon;
                                const isActive = isActivePath(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}

                            {/* Mobile Auth Section */}
                            <div className="pt-4 border-t border-gray-200 mt-4">
                                {user ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-3 px-3 py-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage
                                                    src={
                                                        user.user_metadata
                                                            ?.avatar_url ||
                                                        '/placeholder.svg'
                                                    }
                                                />
                                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                                                    {user.email
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user.user_metadata
                                                        ?.full_name || 'User'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={closeMobileMenu}
                                            className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                        >
                                            <User className="w-5 h-5" />
                                            <span>Profile</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                closeMobileMenu();
                                            }}
                                            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-left"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <Link
                                            to="/login"
                                            onClick={closeMobileMenu}
                                            className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            <span>Sign In</span>
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={closeMobileMenu}
                                            className="flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                            <span>Sign Up</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
