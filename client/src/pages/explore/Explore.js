import { useState } from "react";
import { getProfiles } from "../../service/api";
import Form from "./Form";
import Profile from "./Profile";
import Spinner from "../shared/Spinner";

export default function Explore() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [profiles, setProfiles] = useState([]); // 프로필 목록

    // 키 스테이트
    console.log(profiles);

    // 검색 처리
    async function search(username) { // 서버 : 특정 단어가 포함된 프로필 리스트
        try {
            if (!username) {
                return setProfiles([]);
            }

            setError(null);
            setIsLoaded(false);
            // 요청하기 전에는 사용자에게 대기 상태(스피너로 표현)를 보여주고
            // 요청 완료 후 대기 상태를 해제

            // 서버 요청
            const { profiles } = await getProfiles(username);

            // 프로필 리스트 업데이트
            setProfiles(profiles);

            //
            setIsLoaded(true);

        } catch (error) {
            setError(error);
        }
    }

    // 프로필 목록
    const profileList = profiles.map(profile => (
        // 각각의 프로필을 처리하는 컴포넌트
        <Profile
            key={profile.id}
            id={profile.id}
            username={profile.username}
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            isFollowing={profile.isFollowing}
        />    
    ))

    return (
        <div className="px-4">
            <h3 className="text-lg font-semibold my-4">검색</h3>

            {/* 검색어 입력란 */}
            <Form search={search} />

            <ul>
                {profileList}
            </ul>

            {!isLoaded && <Spinner />}

            {error && <p className="text-red-500">{error.message}</p>}
        </div>

    )
};