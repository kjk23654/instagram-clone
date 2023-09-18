import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostTemplate from "./shared/PostTemplate";
import { getPost, deletePost, likePost, unlikePost } from "../service/api";
import Spinner from "./shared/Spinner";
import AuthContext from "../auth/AuthContext";


// 게시물 상세보기
export default function PostView() {
    
    const { id } = useParams(); // 요청할 게시물의 아이디
    const [post, setPost] = useState(null);  // 게시물을 저장할 변수
    const navigate = useNavigate(); // 게시물 생성하고 피드로 이동
    const { user } = useContext(AuthContext); 

    // 키 스테이트
    console.log(post);

    // 게시물 요청
    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const data = await getPost(id);

            setPost(data.post);

        } catch (error) {
            navigate('/notfound', { replace : true});
        }
    }

    // 좋아요 처리
    async function handleLike(id) {
        
        try {
            // 서버 요청
            await likePost(id)

            // post 업데이트
            const updatePost = {
                ...post,
                liked : true,
                likesCount : post.likesCount + 1
            }

            setPost(updatePost)
        } catch (error) {
            alert(error)
        }
    }

    // 좋아요 취소 처리
    async function handleUnlike(id) {
        try {
            await unlikePost(id);

            const updatedPost = {
                ...post,
                liked : false,
                likesCount : post.likesCount -1
            }

            setPost(updatedPost);
        } catch (error) {
            alert(error)
        }
    }

    // 게시물 삭제 처리
    async function handleDelete(id) {
        try {
            // 게시물 삭제 요청
            await deletePost(id);

            // 삭제 후 피드로 이동
            navigate('/', {replace : true });
            // replace : true => 현재 페이지를 대체
            // 삭제된 페이지로 가면 404에러가 발생하기 때문

        } catch (error) {
            alert(error);
        }
    }

    if (!post) {
        return <Spinner />
    }

    return (
        // 보여지는 부분 처리
        <PostTemplate
            id={post.id}
            username={post.user.username}
            avatarUrl={post.user.avatarUrl}
            photoUrls={post.photoUrls}
            caption={post.caption}
            likesCount={post.likesCount}
            commentCount={post.commentCount}
            displayDate={post.displayDate}
            liked={post.liked}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleDelete={handleDelete}
            isMaster={user.username === post.user.username}
        />    
    )
};