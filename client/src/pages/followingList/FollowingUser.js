import { Link } from "react-router-dom";

export default function FollowingUser({
    username,
    name,
    avatarUrl,
    isFollowing,
    handleFollow,
    handleUnFollow
}) {

    // 팔로우 버튼
    const followButton = (
        <button
            className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
            onClick={() => handleFollow(username)}
        >
            팔로우
        </button>    
    )

    // 언팔로우 버튼
    const unfollowButton = (
        <button
            className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
            onClick={() => handleUnfollow(username)}
        >
            팔로잉
        </button>    
    )

    return (
        <div className="flex justify-between items-center mb-2">
            <Link
                to={`/profiles/${username}`}
                className="inline-flex items-center"
            >
                <img 
                    src={avatarUrl}
                    className="w-12 h-12 object-cover rounded-full border"
                />

                <div className="ml-2"    >
                    <span className="block font-semibold">
                        {username}
                    </span>
                    <span className="block text-gray-400 text-sm">
                        {name}
                    </span>
                </div>
            </Link>    

            {isFollowing ? unfollowButton : followButton}
        </div>
    )
}