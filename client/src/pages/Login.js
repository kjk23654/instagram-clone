import { useState, useContext, useEffect } from "react"; // 리액트 Hook
import { Link, isRouteErrorResponse, useNavigate } from "react-router-dom";
// react-router-dom : 리액트 라우터 기능을 지원하는 패키지
import AuthContext from "../auth/AuthContext"; 
// AuthProvider에서 전달하는 Value 객체에 접근할 때 사용
import { signIn } from "../service/api";
// 서버 요청 라이브러리로, 로그인 처리하는 함수
import { isEmail, isPassword} from "../utils/validator";
// 클라이언트 측에서 폼데이터 유효성 검사할 때 사용

export default function Login() {
    const { setUser } = useContext(AuthContext); 
    // user를 업데이트. 로그인 하면 서버가 전송해준 응답객체로 user 업데이트
    const navigate = useNavigate();
    // 페이지를 이동할 때 사용하는 Hook
    // Hook = 리액트나 라이브러리가 제공하는 특별한 함수
    const [ error, setError ] = useState(null);
    const [ email, setEmail ] = useState(localStorage.getItem("email") || "");
    // 로그인 성공하면 로그인할 때 이메일을 자동으로 입력
    const [ password, setPassword ] = useState("");
    const [ showPassword, setShowPassword ] = useState(false); // 숨기기

    // 폼 제출처리
    async function handleSubmit(e) {
        try {
          e.preventDefault(); 

          setError(null);

          // 로그인에 성공한 유저 데이터(user) 저장
          const { user } = await signIn(email, password); 
          // signIn() : 서버에 로그인을 요청하는 함수
          // 로그인에 성공하면 유저 객체를 리턴

          // 유저 업데이트
          setUser(user)

          // 로그인에 성공한 이메일을 로컬스토리지에 저장한다.
          // 최초 로그인 성공 후 이메일을 자동완성하기 위함
          localStorage.setItem('email', email);

          // 피드 페이지로 이동한다.
          setTimeout(() => { // 유저 데이터 처리가 시간이 좀 걸림.
            navigate('/');
          }, 500);

        } catch (error) {
            setError(error)
        }
    };

    // 타이틀 업데이트
    useEffect(() => {
        document.title = "로그인 - Instagram" // Tab 제목
    }, [])

    // 비밀번호 토글 버튼
    const passwordToggleButton =  (
        <button 
            type="button"
            className="absolute right-0 h-full px-4 py-2 text-sm font-semibold"
            onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
        </button>    
    )

    return (
        <form onSubmit={handleSubmit} className="max-w-xs p-4 mt-16 mx-auto">
            {/* 로고 */}
            <div className="mt-4 mb-4 flex justify-center">
                <img src="/images/logo.png" className="w-36" alt="" />
            </div>

            {/* 이메일 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input
                        type="text"
                        className="border px-2 py-1 w-full rounded"
                        value={email}
                        placeholder="E-mail"
                        onChange={({ target }) => setEmail(target.value)}
                    />    
                </label>
            </div>

            {/* 비밀번호 입력란 */}
            <div className="mb-2">
                <label className="block relative">
                    <input 
                        type={showPassword ? "text" : "password"}
                        className="border px-2 py-1 w-full rounded"
                        value={password}
                        placeholder="password"
                        autoComplete="new-password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    {password.trim().length > 0 && passwordToggleButton} 
                    {/* 조건부 렌더링 */}
                </label>
            </div>

        {/* 제출 버튼 */}
        <button 
            type="submit"
            className="bg-blue-500 text-sm text-white font-semibold rounded-lg px-4 py-2
            w-full disabled:opacity-[0.5]"
            disabled={!isEmail(email) || !isPassword(password)}
        >
            로그인    
        </button> 

        {/* 에러 메시지 */}
        {error && <p className="my-4 text-center text-red-500">{error.message}</p>}

        <p className="text-center my-4">
            계정이 없으신가요 ? {" "}
            <Link to="/accounts/signup" className="text-blue-500 font-semibold">가입하기
            </Link>
        </p>
        </form>
    )
};

