import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import ProfileInfo from '../../components/profile/ProfileInfo'
import ProfilePosts from '../../components/profile/ProfilePosts'
import { Profile } from '../../components/profile/ProfileStyle.jsx'
import { getUserByUsername } from '../../services/user-data'
import { loadingUser } from '../../store/user'

export default function ProfilePage() {
    const { username } = useParams()
    const [user, setUser] = useState({ ...loadingUser })

    useEffect(() => {
        getUserByUsername(username).then((res) => setUser(res))
    }, [username])
    console.log(user);
    return (
        <Profile>
            <ProfileInfo user={user} usernameParam={username}/>
            <ProfilePosts userId={user._id} />
        </Profile>
    )
}
