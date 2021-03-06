import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Links, Posts, PostsWrapper } from './ProfileStyle'
import { getUserPosts } from '../../services/user-data'
import UserPosts from './UserPosts'

export default function ProfilePosts({ userId }) {
    const [userPosts, setUserPosts] = useState([])
    
    useEffect(() => {
        console.log(userId)
        getUserPosts(userId).then((res) => {
            setUserPosts(res)
        })
    }, [])

    return (
        <PostsWrapper>
            <Links>
                <Link to="/:username/">POSTS</Link>
                <Link to="/:username/saved">SAVED</Link>
                <Link to="/:username/tagged">TAGGED</Link>
            </Links>
            <Posts>
                <UserPosts userPosts={userPosts} />
            </Posts>
        </PostsWrapper>
    )
}
