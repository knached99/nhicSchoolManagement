import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GridViewIcon from '@mui/icons-material/GridView';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CreateFacultyModal from '@/Components/AdminComponents/CreateFacultyModal';
import ImportStudentsModal from '@/Components/AdminComponents/ImportStudentsModal';
import SideBar from '@/Components/AdminComponents/SideBar';
import Zoom from '@mui/material/Zoom';

export default function AdminLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const profilePicPath = "http://localhost:8000/storage/profile_pics"; 
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
            {/* <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-100 fill-current text-gray-800" />
                                </Link>
                            </div>
                           
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                
                                <NavLink href={route('faculty.dash')} active={route().current('faculty.dash')}>  
                                   <Tooltip title="Dashboard Home" TransitionComponent={Zoom} >
                                    <IconButton>
                                    <GridViewIcon />
                                    </IconButton>
                                    </Tooltip>
                                </NavLink>
                                {user && (
                                (user.role === 'Admin' || (user.permissions && user.permissions.includes('can_batch_import_students'))) && (
                                    <>
                                      <ImportStudentsModal />
                                    </>
                                )
                            )}

                                {user && (
                                (user.role === 'Admin' || (user.permissions && user.permissions.includes('can_create_faculty_users'))) && (
                                    <>
                                      <CreateFacultyModal />
                                    </>
                                )
                            )}

                                
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            
                            <div className="ms-3 relative">
                                
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {!user.profile_pic ? user.name : <img src={`${profilePicPath}/${user.profile_pic}`} class="inline-block h-10 w-10 rounded-full ring-2 ring-white"/> }
                                            
                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <span className="m-3 font-semibold">Role: {user.role}</span>
                                        <Dropdown.Link href={route('faculty.profile')}><AccountCircleOutlinedIcon/> Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('faculty.logout')} method="post" as="button">
                                          <LogoutOutlinedIcon/>  Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('faculty.dash')} active={route().current('faculty.dash')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('faculty.profile')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('faculty.logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav> */}

            {/* {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )} */}
            
            {/* <SideBar/> */}
            
            <SideBar auth={user}/>

            <main>{children}</main>
        </div>
        
    );
}
