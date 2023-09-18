// 게시물 생성 페이지

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../service/api";

// 게시물은 모달로 구현되고, 게시물 생성이 완료되면 피드로 이동
export default function PostCreate({ setModalOpen }) {
    const navigate = useNavigate();
    const [caption, setCaption] = useState(""); // 게시물의 내용을 저장
    const [files, setFiles] = useState([]); // 게시물의 사진

    // 폼 제출처리
    async function handleSubmit(e) {
        try {
            e.preventDefault();

            // 폼 데이터
            const formData = new FormData();

            // 폼데이터에 유저가 업로드한 파일을 저장한다.
            files.forEach(file => {
                formData.append('photos', file);
            })

            // 폼데이터에 유저가 입력한 사진 설명을 저장한다.
            formData.append('caption', caption);

            // 서버 요청
            await createPost(formData); // api에 선언한 메서드

            // 피드로 이동
            navigate('/');

        } catch (error) {
            alert(error);
        }
    }

    // 모달 닫기 처리
    function handleOverlay(e) {
        // 오버레이 부분을 클릭했을 때(모달 제외)
        if (e.target === e.currentTarget) {
            // e.currentTarget = 오버레이
            setModalOpen(false);
        }
    }

    // 사진 미리보기
    const photoPreviewList = files.map(file => (
        <li key={file.name} className="pt-[100%] relative">
            <img
                className="absolute inset-0 w-full h-full object-cover"
                // URL.createObjectURL(blob객체) : blob객체에 접근 가능한 URL을 생성한다
                src={URL.createObjectURL(file)}
                alt={file.name}
            />    
        </li>
    ))

    return (
        <div
            className="fixed inset-0 bg-black/[0.2] z-10"
            onClick={handleOverlay}
        >
            {/* 폼 */}
            <form
                className="bg-white max-w-xs mt-20 mx-auto rounded-2xl"
                onSubmit={handleSubmit}
            >
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-center">게시물 업로드</h3>
                </div>

                <div className="p-4">
                    <label className="inline-block mb-2 font-semibold text-sm px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            onChange={({ target }) => setFiles(Array.from(target.files))}
                            multiple={true}
                            // 게시물이니까 사진을 여러개 업로드할 수 있음
                            accept="image/png, image/jpg, image/jpeg"
                            // accept = 클라이언트 측 파일 포맷 필터링
                        />
                        사진 선택    
                    </label>

                    {/* 사진 미리보기 */}
                    {files.length > 0 && (
                        <ul className="grid grid-cols-3 mb-2">
                            {photoPreviewList}
                        </ul>
                    )}

                    {/* 게시물 내용 */}
                    <div className="mb-2">
                        <label
                            htmlFor="caption"
                            className="block font-semibold"
                        >
                            사진 설명    
                        </label>    
                        <textarea
                            rows="2"
                            id="caption"
                            className="block w-full px-2 py-1 rounded border resize-none"
                            onChange={({ target }) => setCaption(target.value)}
                            value={caption}
                        />    
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold bg-blue-500 rounded-lg text-white disabled:opacity-[0.2]"
                        disabled={files.length < 1}
                    >
                        업로드    
                    </button> 

                </div>
            </form>    
        </div>    
    )
}