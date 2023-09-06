import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
    // 로컬스토리지로부터 초기 유저데이터를 가져온다. (로그인 상태 유지)
    // 앱이 새롭게 로드되었을 때 유저데이터를 변수에 저장했다면 초기화됨
    // 이를 막기 위해서 로컬스토리지에 동기화해야함.
    const initialUser = JSON.parse(localStorage.getItem('user'));

    // 유저 데이터 관리
    const [user, setUser] = useState(initialUser);


    // 유저 상태 감시자
    useEffect(() => {
        if (user) { // 로그인된 상태
            localStorage.setItem('user', JSON.stringify(user));
        } else { // 로그아웃한 상태
            localStorage.removeItem('user');
        }
    }, [user])
    // 유저의 상태가 변할 때 effect가 실행됨. 

    const value = { user, setUser };
    // value 객체에 AuthProvider에서 선언된 지역변수 user, setUser를 저장

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
        // 자식 컴포넌트를 Provide컴포넌트로 감싸고 있음
        // 자식 컴포넌트에서 전달한 value 객체에 접근이 가능함.
        // Provider컴포넌트의 사용 이유 = 지역변수를 자식 컴포넌트에서도 사용하기 위함

    // 이해가 안된다면 인증이 적용된 라우터 부분 다시 공부하고 살펴보기
    )
}