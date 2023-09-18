import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getComments, createComment, deleteComment } from "../../service/api";
import Form from "./Form";
import Comment from './Comment';
import Spinner from "../shared/Spinner";

export default function Comments() {
    const { id } = useParams(); // 댓글을 가져올 게시물의 id
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); // 대기 상태
    const [comments, setComments] = useState([]);

    // 키 스테이트
    console.log(comments);

    // 댓글 가져오기 요청
    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            // 서버 요청
            const data = await getComments(id); // 게시물의 아이디 전달

            // comments 업데이트
            setComments([...comments, ...data.comments]);

        } catch (error) {
            setError(error)
        } finally {
            setIsLoaded(true);
        }
    }

    // 댓글 추가
    async function handleAddComment(content) {

        // 서버 요청(댓글생성요청)
        const data = await createComment(id, content);
        // id : 게시물의 id

        // 댓글 목록 업데이트
        const updatedComments = [data.comment, ...comments];
        setComments(updatedComments);
    }

    // 댓글 삭제
    async function handleDelete(id) {
        
    }

    // 댓글 목록
    const commentList = comments.map(comment => (
        // Comment 컴포넌트를 재사용
        // Comment 컴포넌트 = 각각의 댓글
        <Comment
            key={comment.id}
            id={comment.id}
            username={comment.user.username}
            avatarUrl={comment.user.avatarUrl}
            content={comment.content}
            displayDate={comment.displayDate}
            handleDelete={handleDelete}
        />    
    ))


    return (
        <div className="px-4">
            <h3 className="text-lg font-semibold my-4">댓글</h3>


            {/* 댓글 입력창 */}
            <Form handleAddComment={handleAddComment} />

            {commentList.length > 0 ? (
                <ul>
                    {commentList}
                </ul>
            ) : (
                <p className="text-center">댓글이 없습니다</p>
            )}

            {!isLoaded && <Spinner />}

            {error && <p className="text-red-500">{error.message}</p>}
        </div>
    )
};