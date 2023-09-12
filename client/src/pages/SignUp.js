import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../service/api";
import { isEmail, isUsername, isPassword } from "../utils/validator";


// 회원가입
export default function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // 폼 제출처리 함수
    async function handleSubmit(e) {
        try {
            e.preventDefault();

            const newUser = { email, name, username, password };

            // 유저 생성 요청
            await createUser(newUser);

            // 가입 환영 인사
            alert(`안녕하세요 ${name}님!`);

            // 로그인 페이지로 이동시킨다.
            navigate('/');

        } catch (error) {
            setError(error)
        }
    };

    // 타이틀 업데이트
    useEffect(() => {
        document.title = "가입 - Instagram"
    }, [])

    return (
        <form onSubmit={handleSubmit} className="max-w-xs mx-auto p-4 mt-16">
            {/* 로고이미지 */}
            <div className="mt-4 mb-4 flex justify-center">
                <img src="/images/logo.png" className="w-36" alt=""/>
            </div>

            {/* 이메일 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input
                        type="text"
                        name="email"
                        className="border px-2 py-1 rounded w-full"
                        onChange={({ target }) => setEmail(target.value)}
                        placeholder="이메일"
                    />    
                </label>
            </div>


            {/* 이름 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input
                        type="text"
                        name="name"
                        className="border rounded px-2 py-1 w-full"
                        onChange={({ target}) => setName(target.value)}
                        placeholder="이름"
                    />    
                </label>
            </div>

            {/* 아이디 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input 
                        type="text"
                        name="username"
                        className="border px-2 py-1 rounded w-full"
                        onChange={({ target }) => setUsername(target.value)}
                        placeholder="아이디"
                    />    
                </label>
            </div>

            {/* 비밀번호 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input 
                        type="password"
                        name="password"
                        className="border rounded px-2 py-1 w-full"
                        onChange={({ target }) => setPassword(target.value)}
                        placeholder="비밀번호"
                        autoComplete="new-password"
                    />    
                </label>
            </div>

            {/* 제출 버튼 */}
            <div className="mb-2">
                <button 
                    type="submit"
                    className="bg-blue-500 rounded-lg text-sm font-semibold px-4 py-2
                    text-white w-full disabled:opacity-[0.5]"
                    disabled={!isEmail(email) || !isUsername(username) || !isPassword(password)}
                >
                    가입하기    
                </button>
                {error && <p className="text-red-500 text-center my-4">{error.message}</p>}    
            </div>

            <p className="text-center mt-4">
                계정이 있으신가요 ? {" "}
                <Link to="/accounts/login" className="text-blue-500 font-semibold">
                    로그인
                </Link>
            </p>
        </form>
    )
};