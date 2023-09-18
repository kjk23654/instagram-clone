import { useState } from "react";

export default function Form({ handleAddComment}) {
    // 댓글 내용을 관리하는 변수
    const [content, setContent] = useState("");

    // 폼 제출처리
    async function handleSubmit(e) {
        try {
            e.preventDefault();

            await handleAddComment(content);

            // 댓글 창 비우기
            setContent("");

        } catch (error) {
            alert(error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <textarea
                rows="2"
                className="border w-full px-2 py-1 rounded resize-none"
                value={content}
                onChange={({ target }) => setContent(target.value)}
            />
            <button
                type="submit"
                className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg
                disabled:opacity-[0.2]"    
                disabled={!content.trim()}
                // 댓글에 내용이 없을 경우 disabled = true
            >
                댓글 달기    
            </button>    
        </form>
    )
}