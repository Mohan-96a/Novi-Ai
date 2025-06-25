"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/support/UserContext';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useBot } from '@/support/BotContext';
import {supabase} from '../../../supabaseClient'
import { 
  IconLoader, 
  IconExclamationCircle, 
  IconProgressCheck,
  IconUser,
  IconLock,
  IconSettings,
  IconBell,
  IconCreditCard,
  IconLogout,
  IconCalendar,
  IconGenderMale,
  IconGenderFemale
} from '@tabler/icons-react';

function Profile() {
  const router = useRouter();
  const { userDetails } = useUser();
  const [session, setSession] = useState(); 
  const { selectedBotId } = useBot();
  const [text, setText] = useState("")
  const [status, setStatus] = useState("")
  const [activeTab, setActiveTab] = useState('profile')
  const [dateOfBirth, setDateOfBirth] = useState(userDetails.date_of_birth || '')
  const [gender, setGender] = useState(userDetails.gender || '')
  const [isEditing, setIsEditing] = useState(false)

  const handleLogout = async () => {
    localStorage.removeItem('userDetails');
    await supabase.auth.signOut();
    setSession(null);
    window.location.reload();
    router.push("/signup");
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          date_of_birth: dateOfBirth,
          gender: gender
        })
        .eq('id', userDetails.id)

      if (error) throw error
      
      setIsEditing(false)
      // Update local user details
      const updatedUserDetails = { ...userDetails, date_of_birth: dateOfBirth, gender: gender }
      localStorage.setItem('userDetails', JSON.stringify(updatedUserDetails))
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const renderProfileContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-orange-400/80 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg backdrop-blur-sm border border-white/20">
                {userDetails.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{userDetails.name}</h2>
              <p className="text-sm text-gray-600">{userDetails.email}</p>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800">Personal Information</h3>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <IconCalendar size={16} />
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input 
                        type="date" 
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full p-3 mt-1 rounded-lg bg-white/90 border border-gray-200 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-gray-800"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    ) : (
                      <div className="mt-1 p-3 rounded-lg bg-white/20 border border-white/20">
                        <p className="text-sm text-gray-800">
                          {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <IconGenderMale size={16} />
                      Gender
                    </label>
                    {isEditing ? (
                      <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-3 mt-1 rounded-lg bg-white/90 border border-gray-200 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-gray-800"
                      >
                        <option value="" className="text-gray-800">Select gender</option>
                        <option value="male" className="text-gray-800">Male</option>
                        <option value="female" className="text-gray-800">Female</option>
                        <option value="other" className="text-gray-800">Other</option>
                        <option value="prefer_not_to_say" className="text-gray-800">Prefer not to say</option>
                      </select>
                    ) : (
                      <div className="mt-1 p-3 rounded-lg bg-white/20 border border-white/20">
                        <p className="text-sm text-gray-800">
                          {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not set'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <Button 
                    onClick={handleUpdateProfile}
                    className="w-full mt-6 bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-orange-400/80 hover:from-purple-400/90 hover:via-pink-400/90 hover:to-orange-400/90 text-white rounded-lg shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
              <div className="p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                <h3 className="font-medium mb-2 text-gray-800">About</h3>
                <p className="text-sm text-gray-600">Member since {new Date(userDetails.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
              <h3 className="font-medium mb-4 text-gray-800">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Change Password</label>
                  <input type="password" className="w-full p-3 mt-1 rounded-lg bg-white/20 border border-white/20 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50" placeholder="New Password" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Confirm Password</label>
                  <input type="password" className="w-full p-3 mt-1 rounded-lg bg-white/20 border border-white/20 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50" placeholder="Confirm New Password" />
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-orange-400/80 hover:from-purple-400/90 hover:via-pink-400/90 hover:to-orange-400/90 text-white rounded-lg shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300">
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
              <h3 className="font-medium mb-4 text-gray-800">User Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Theme</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-400/80 peer-checked:via-pink-400/80 peer-checked:to-orange-400/80"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Language</span>
                  <select className="p-2 rounded-lg bg-white/20 border border-white/20 text-gray-600">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'subscription':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
              <h3 className="font-medium mb-4 text-gray-800">Subscription Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
                  <span className="text-sm text-gray-600">Current Plan</span>
                  <span className="text-sm font-medium text-gray-800">Free Plan</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
                  <span className="text-sm text-gray-600">Next Billing Date</span>
                  <span className="text-sm text-gray-800">-</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-orange-400/80 hover:from-purple-400/90 hover:via-pink-400/90 hover:to-orange-400/90 text-white rounded-lg shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div suppressHydrationWarning className='bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20 h-[600px] w-[600px] md:w-[800px] overflow-hidden'>
      <div className="flex flex-col md:flex-row gap-8 h-full">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-48 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'profile' 
                ? 'bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-orange-400/80 text-white shadow-lg' 
                : 'hover:bg-white/20 text-gray-600'
            }`}
          >
            <IconUser size={20} />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'security' 
                ? 'bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-orange-400/80 text-white shadow-lg' 
                : 'hover:bg-white/20 text-gray-600'
            }`}
          >
            <IconLock size={20} />
            <span>Security</span>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'preferences' 
                ? 'bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-orange-400/80 text-white shadow-lg' 
                : 'hover:bg-white/20 text-gray-600'
            }`}
          >
            <IconBell size={20} />
            <span>Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`w-full flex items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'subscription' 
                ? 'bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-orange-400/80 text-white shadow-lg' 
                : 'hover:bg-white/20 text-gray-600'
            }`}
          >
            <IconCreditCard size={20} />
            <span>Subscription</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-3 rounded-lg transition-all duration-300 hover:bg-red-500/20 text-red-500 hover:shadow-lg"
          >
            <IconLogout size={20} />
            <span>Log out</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {renderProfileContent()}
        </div>
      </div>
    </div>
  );
}

export default Profile;