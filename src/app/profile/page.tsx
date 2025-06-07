'use client';

import { UserProfile } from '@clerk/nextjs';

const ProfilePage = () => (
  <div className="flex justify-center items-center py-8">
    <UserProfile path="/profile" routing="path" />
  </div>
);

export default ProfilePage;
