import { useState, useContext, useEffect} from "react";
import { Link } from "react-router-dom"; 
import { updateProfile, updateAvatar } from "../service/api"; 
import AuthContext from "../auth/AuthContext";


// 프로필 수정
export default function ProfileEdit() {
    const { user, setUser } = useContext(AuthContext); 
    const [newName, setNewName] = useState(user.name); 
    const [newBio, setNewBio] = useState(user.bio); 

    // 키 스테이트
    console.log(user); // 로컬 스토리지에 저장된 user

    // 폼 제출버튼 disabled 처리용 객체
    const isEqual = { // 수정을 했을 때 제출버튼이 활성화 된다.
        name : user.name === newName, // 로그인 유저의 정보와 변수값을 비교.
        bio : user.bio === newBio
        // 폼을 제출하지 않는 이상 user.name와 user.bio는 바뀌지 않음
    }

    // 폼 제출처리 (이름이랑 자기소개 수정을 처리하는 함수)
    async function handleSubmit(e) {
        try {
            e.preventDefault(); 

            // 수정한 프로필 정보
            const editedProfile =  {
                name : newName,
                bio : newBio
            };

            // 서버 요청
            const { user } = await updateProfile(editedProfile);

            // 유저 업데이트
            setUser(user);

            // 성공 메시지
            alert('수정되었습니다');

        } catch (error) {
            alert(error);
        }
    } 

    // 파일 처리
    async function handleFile(e) {
        try {
            // 유저가 선택한 파일
            const file = e.target.files[0]; // event.target = input
            // 클라이언트가 선택한 파일은 files라는 객체 안에 저장됨

            // 폼 데이터 타입 : 서버에 파일을 전송할 때 사용함
            // 파일은 JSON으로 못보냄
            const formData = new FormData(); // 인스턴스
            
            // 폼데이터에 유저가 선택한 파일을 저장한다
            // append(첫번째, 두번째)
            // 첫번째 : 파일의 이름(서버는 이름을 가지고 데이터를 구분)
            // 두번째 : 선언한 변수 이름(유저가 선택한 파일이 저장되어 있음)
            formData.append("avatar", file);

            // 서버 요청
            const { user } = await updateAvatar(formData);
            // 응답 객체를 user라는 변수에 담고 있음

            //  유저 업데이트
            setUser(user);

            // 성공 메시지
            alert("수정되었습니다");

        } catch (error) {
            alert(error)
        }
        // handleFile 함수는 input 파일의 상태가 변경되었을 때 실행
    }

    // 타이틀 업데이트
    useEffect(() => {
        document.title = "프로필 수정 - Instagram";
    }, [])

    return (
        <div className="mt-8 px-4">
            {/* 아바타 이미지, 아바타 업데이트 버튼 */}
            <div className="flex mb-4">
                <img 
                    src={user.avatarUrl}
                    className="w-16 h-16 object-cover rounded-full border"
                    alt=""
                />

                <div className="flex flex-col grow items-start ml-4">
                    <h3>{user.username}</h3>    

                    <label className="text-sm font-semibold text-blue-500 cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFile}
                            accept="image/png, image/jpg, image/jpeg"
                        />
                        사진 업데이트    
                    </label>
                </div>    
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit}>
                {/* 이름 입력란 */}
                <div className="mb-2">
                    <label htmlFor="name" className="block font-semibold">이름</label>
                    <input 
                        type="text"
                        id="name"
                        name="name"
                        className="border px-2 py-1 rounded w-full"
                        value={newName}
                        onChange={({ target }) => setNewName(target.value)}
                    />    
                </div>

                {/* 자기소개 입력란 */}
                <div className="mb-2">
                    <label htmlFor="bio" className="block font-semibold">자기소개</label>
                    <textarea
                        id="bio"
                        rows="3"
                        name="bio"
                        className="border px-2 py-1 rounded w-full resize-none"
                        value={newBio}
                        onChange={({ target }) => setNewBio(target.value)}
                    />    
                </div>
                {/* Bio textarea에 hello bunny가 안나옴. */}

                {/* 제출 및 취소 버튼 */}
                <div className="flex">
                    <button 
                        type="submit"
                        className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2
                        disabled:opacity-[0.2]"
                        disabled={isEqual.name && isEqual.bio}
                    >
                        저장 
                    </button>    

                    <Link 
                        to={`/profiles/${user.username}`}
                        className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 ml-2"
                    >
                        취소
                    </Link>    
                </div>
            </form> 
        </div>
    )
};