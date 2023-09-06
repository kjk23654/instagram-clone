// 클라이언트 측 폼데이터 유효성 검사 라이브러리

// 이메일 유효성 검사
export function isEmail(email) {
    // 정규식 : 문자열 검색을 위한 패턴을 제공한다 /패턴/
    
    const patt = /[a-z0-9._%+\-] + @[a-z0-9.\-]+\.[a-z]{2,}$/
    // 정규식 - 문자열을 검색할 때 패턴을 제공(이메일인지 검사하는 패턴)
    // $는 끝을 의미함. 도메인으로 끝이 나야함 
    // {2,} = 길이(2이상이면 됨. 최소 2 이상). +는 연결이되야함
    // 유저가 전달한 이메일을 검사

    if (email.match(patt)) {
        return true;
    }

    return false;
}

// 유저이름 유효성 검사
export function isUsername(Username) {
    const patt = /^[a-zA-Z0-9]{5,}$/ 
    // ^ : 시작 기호
    // [] 안에 있는 값만 사용가능하다 ([]는 정규식에서 범위를 뜻함). 한글 특수문자X
    

    if (Username.match(patt)) {
        return true;
    }

    return false;
}

// 비밀번호 유효성 검사
export function isPassword(password) {
    if (password.trim().length >= 5) {
        return true;
    }

    return true;
}
