import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFollowers, follow, unfollow} from "../../service/api";
import Follower from "./Follower";
import Spinner from "../shared/Spinner";

export default function FollowerList() {
    const { username } = useParams();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [followers, setFollowers] = useState([]);

    // 키 스테이트
    console.log(followers);

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const data = await getFollowers(username);

            setFollowers([...followers, ...data.profiles]);
        } catch (error) {
            setError(error)
        } finally {
            setIsLoaded(true)
        }
    }

    // 팔로우 처리
    async function handleFollow(username) {
        try {
            // 서버 요청
            await follow(username)

            // 팔로워 리스트 업데이트
            const updatedFollowers = followers.map(follower => {
                if (follower.username === username) {
                    return { ...follower, isFollowing : true }
                }

                return follower;
            })

            setFollowers(updatedFollowers);

        } catch (error) {
            alert(error)
        }
    }

    // 언팔로우 처리
    async function handleUnfollow(username) {
        try {
            // 서버 요청
            await unfollow(username);


            // 팔로워 리스트 업데이트
            const updatedFollowers = followers.map(follower => {
                if (follower.username === username) {
                    return { ...follower, isFollowing : false }
                }

                return follower;
            })

        } catch (error) {
            alert(error)
        }
    }

    // 팔로우 리스트
    const followerList = followers.map(follower => (

        // 각각의 프로필
        <Follower
            key={follower.id}
            username={follower.username}
            name={follower.name}
            avatarUrl={follower.avatarUrl}
            isFollowing={follower.isFollowing}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
        />    
    ))

    return (
        <div className="px-2">
            <h3 className="text-lg my-4 font-semibold">{username}의 팔로워</h3>

            {followerList.length > 0 ? (
                <ul>
                    {followerList}
                </ul>
            ) : (
                <p>팔로워가 없습니다</p>
            )}

            {!isLoaded && <Spinner />}

            {error && <p className="text-red-500">{error.message}</p>}
        </div>
    )
};