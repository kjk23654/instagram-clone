import { useContext } from "react";
import {Navigate} from "react-router-dom";
import AuthContext from "./AuthContext";

export default function AuthRequired({ children }) {

    // AuthProvider에서 전달한 user 데이터에 접근
    const { user } = useContext(AuthContext);

    // user가 없을 경우 로그인 페이지로 이동시킨다.
    if (!user) {
        return <Navigate to="/accounts/login" replace={true} /> 
        // 이동시킬 때 사용하는 컴포넌트. to = 목적지, replact=true(현재 페이지를 대체한다.)
        // 즉, 유저가 요청한 페이지를 로그인 페이지로 대체한다.(유저가 요청한 페이지를 무효화)
    }

    return children; // 보호받는 컴포넌트

}