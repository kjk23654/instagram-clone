import { useState, useEffect, useContext, useRef} from "react";
import { useParam, useNavigate, Link} from "react-router-dom";
import AuthContext from "../../auth/AuthContext";
import ProfileInfo from "./ProfileInfo"; // 프로필 페이지를 구성하는 컴포넌트
import Thumbnail from "./Thumbnail"; // 프로필 페이지를 구성하는 컴포넌트
import PostCreate from "../PostCreate"; // 게시물 생성 페이지
import { getProfile, getTimeline, follow, unfollow } from "../../service/api";
// 서버 요청 라이브러리. 프로필페이지에서 필요한 요청을 import
import Spinner from "../shared/Spinner";

export default function Profile() {
    const { username } = useParams();
    // App.js : <Route path="profiles/:username">를 useParams를 통해 접근
    const { user, setUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    // 서버에서 전송해준 프로필 데이터를 담을 변수
    const [posts, setPosts] = useState([]); // 유저의 타임라인을 담을 변수
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    // 프로필 요청을 실패했을 때 404 페이지에서 이동시킴(=유저의 위치를 이동)

    // 키 스테이트 추적
    console.log(profile);
    console.log(posts); 

    // 서버에 데이터 요청
    useEffect(() => {
        fetchData()
    }, [username]);

    // 서버에 데이터 요청하는 함수
    async function fetchData() {
        try {
            setProfile(null);

            const profileData = await getProfile(username);
            // api에서 import 해옴
            const timelineData = await getTimeline(username);
            // api에서 import 해옴

            setProfile(profileData.profile);
            setPosts(timelineData.posts);

        } catch (error) {
            navigate("/notfound", { replace : true });
            // 에러 발생시 404페이지로 이동.(에러를 따로 처리하지 않음)
            // 404페이지는 에러처리 페이지
        }
    }

    // 팔로우 처리
    async function handleFollow() {};

    // 언팔로우 처리
    async function handleUnfollow() {};

    // 로그아웃
    async function handleSignOut() {
        const confirmed = window.confirm('로그아웃하시겠습니까?');

        if (confirmed) {
            setUser(null);
        }
    };

    // 타이틀 업데이트
    useEffect(() => {
        document.title = `${username} - Instagram`
    }, [])

    // 타임라인
    const postList = posts.map(post => {
        <Thumbnail
            key={post.id}
            id={post.id}
            ThumbnailUrl={post.photoUrls[0]}
            likesCount={post.likesCount}
            commentCount={post.commentCount}
        />
    })

    if (!profile) {
        return <Spinner />
    }

    return (
        <>
            <ProfileInfo
              username={profile.username}
              name={profile.name}
              avatarUrl={profile.avatarUrl}
              bio={profile.bio}
              postCount={profile.postCount}
              followerCount={profile.followerCount}
              followingCount={profile.followingCount}
              isFollowing={profile.isFollowing}
              handleSignOut={handleSignOut}
              handleFollow={handleFollow}
              handleUnfollow={handleUnfollow}
              isMaster={user.username === username}
                // 로그인유저의 username과 프로필 유저 username을 비교.
                // 본인 프로필은 참. 아니면 거짓
            />
            {/* 프로필 정보 표시 */}

            {/* 타임 라인 */}
            <div className="border-t my-4"></div>

            {postList.length > 0 ? (
                <ul className="grid grid-cols-3 gap-2 mb-2">
                    {postList}
                </ul>
            ) : (
                <p className="text-center">게시물이 없습니다</p>
            )}

            {/* 게시물 생성 버튼 */}
            <svg
                className="opacity-40 w-12 fixed right-8 bottom-8 hover:opacity-80 cursor-pointer z-10"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                onClick={() => setModalOpen(true)}
            >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
            </svg>

            {/* 게시물 생성 모달 */}
            {modalOpen && <PostCreate setModalOpen={setModalOpen} />}
        </>
    )
}