import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import Masonry from '@mui/lab/Masonry'
import Stack from '@mui/material/Stack'

import PostBanner from '../global/PostBanner'

function PostStack({item, index}) {
    const [isBanner, setIsBanner] = useState(false)

    return (
        <Stack 
            key={index} 
            style={{position: 'relative'}}
            onMouseEnter={() => setIsBanner(true)}
            onMouseLeave={() => setIsBanner(false)}
            >
                    <img
                        src={`${item.img}?w=162&auto=format`}
                        srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
                        alt={item.title}
                        loading="lazy"
                        style={{ borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4,
                            borderTopRightRadius: 4,
                            borderTopLeftRadius: 4,
                            cursor: "pointer"
                        }}
                    />
                    {isBanner && <PostBanner />}
                </Stack>
    )
}

export default function UserPosts({posts}) {
    const postLocation = useLocation().pathname.split('/').slice(-1).toString()
    let posts

    switch (postLocation) {
        case 'saved':
            posts = posts.savedPosts
            break

        case 'tagged':
            posts = posts.taggedPosts
            break

        default:
            posts = posts.myPosts
    }


    return (
        <Masonry columns={3} spacing={1}>
            {posts.map((item, index) => (
                <PostStack item={item} index={index}/>
            ))}
        </Masonry>
    )
}