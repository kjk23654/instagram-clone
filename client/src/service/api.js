// 서버 요청 라이브러리
// postman에서 요청했던 것들을 대신 해주는 함수

// 서버주소
const server = "http://localhost:3000/api";

// 토큰을 가져오는 함수
function getBearerToken() {// 로컬스토리지에 저장된 토큰을 가져오는 함수
    const user = JSON.parse(localStorage.getItem("user"));

    return 'bearer ' + user.access_token;
}

/*  USERS */

// 1. 유저 생성 요청(회원가입 때 필요)
export async function createUser(newUser) {

    // 클라이언트에서는 fetch함수로 서버에 요청을 진행함
    // fetch(요청주소, 옵션) : 클라이언트에서 서버에 요청하는 함수

    const res = await fetch(`${server}/users`, { // 옵션은 객체형태
        method : "POST", // 요청 메서드
        headers : { 'Content-Type' : 'application/json'}, // 요청 헤더(JSON 포맷으로 전송)
        // 헤더는 요청에 대한 메타데이터가 존재(전송데이터 포맷, 토큰 등)
        body : JSON.stringify(newUser) // 요청 바디
        // 새로운 유저를 JSON포맷으로 변환하고 바디에 저장
    })

    if (!res.ok) {// 서버의 응답이 200(ok)가 아닌 경우
        throw new Error(`${res.status} ${res.statusText}`);
    }


    // 에러가 아닌 경우 응답 객체를 리턴한다.
    return await res.json();
    // json()메서드는 json포맷으로 데이터 전송하고, json()메서드는 자바스크립트
    // 객체로 변환하여 클라이언트에서 바로 사용할 수 있도록 요청에서 변환까지 진행

};

// 2. 로그인 요청
export async function signIn(email, password) {
    const res = await fetch(`${server}/users/login`, {
        method : "POST",
        headers : { "Content-Type" : "application/json "}, // 전송할 데이터 포맷
        body : JSON.stringify({ email, password })
    })

    if(!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}


/*  POSTS */

// 1. 피드 요청
export async function getFeed(limit, skip) {
    const res = await fetch(`${server}/posts/feed?limit=${limit}&skip=${skip}`, {
        // 쿼리에 limit과 skip을 같이 보냄
        // limit : 서버가 한번에 전송할 때 보내는 도큐먼트의 수
        // skip : 건너뛸 도큐먼트의 수
        headers : {
            // 메서드의 기본값 : GET (Method가 없으면 GET이 default)
            'Authorization' : getBearerToken() // 로그인 토큰
        }        
    });

    if(!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 2. 게시물 한개 가져오기 요청
export async function getPost(id) {
    const res = await fetch(`${server}/posts/${id}`, {
        headers : {
            'Authorization' : getBearerToken()
        }
    });

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 3. 게시물 생성 요청
export async function createPost(formData) {
    // 왜 formData인가? 
    const res = await fetch(`${server}/posts`, {
        method : "POST", 
        headers : {
            "Authorization" : getBearerToken()
        },
        body : formData // 파일 전송(JSON 데이터는 파일을 전송할 수 없다.)
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 4. 게시물 삭제 요청
export async function deletePost(id) {
    const res = await fetch(`${server}/posts/${id}`, {
        method : "DELETE", 
        headers : {
            'Authorization' : getBearerToken()
        }
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 5. 좋아요 요청
export async function likePost(id) {
    const res = await fetch(`${server}/posts/${id}/like`, {
        method : "POST",
        headers : {
            'Authorization' : getBearerToken()
        }
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 6. 좋아요 취소 요청
export async function unlikePost(id) {
    const res = await fetch(`${server}/posts/${id}/unlike`, {
        method : "DELETE",
        headers : {
            'Authorization' : getBearerToken()
        }
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

/* COMMENTS */

// 1. 댓글 가져오기 요청
export async function getComments(id) {
    const res = await fetch(`${server}/posts/${id}/comments`, {
        headers : {
            'Authorization' : getBearerToken()
        }
    });

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 2. 댓글 생성 요청
export async function createComment(id, content) {
    const res = await fetch(`${server}/posts/${id}/comments`, {
        method : "POST",
        headers : {
            "Authorization" : getBearerToken(),
            "Content-Type" : "application/json",
        },
        body : JSON.stringify({ content })
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 3. 댓글 삭제 요청
export async function deleteComment(id) {
    const res = await fetch(`${server}/posts/comments/${id}`, {
        method : "DELETE",
        headers : {
            'Authorization' : getBearerToken()
        }
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}


/* PROFILES */

// 1. 프로필 수정 요청
export async function updateProfile(editedProfile) {
    // 이름,자기소개(bio) 등을 수정하는 필드
    const res = await fetch(`${server}/profiles`, {
        method : "PUT",
        headers : {
            'Content-Type' : "application/json",
            'Authorization' : getBearerToken()
        },
        body : JSON.stringify(editedProfile)
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 2. 프로필 사진 수정 요청
export async function updateAvatar(formData) { // 파일이기 때문에 formData
    const res = await fetch(`${server}/profiles`, {
        method : "PUT",
        headers : {
            "Authorization" : getBearerToken()
        },
        body : formData
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 3. 프로필 리스트 가져오기 요청
export async function getProfiles(username) { 
    // 검색할 때 가져올 거기 때문에 username
    const res = await fetch(`${server}/profiles/?username=${username}`, {
        // 쿼리 안에 username이 있음
        headers : {
            'Authorization' : getBearerToken()
        }
    });

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 4. 프로필 상세보기 요청
export async function getProfile(username) {
    const res = await fetch(`${server}/profiles/${username}`, {
        // username 파라미터가 존재
        headers : {
            "Authorization" : getBearerToken()
        }
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 5. 타임라인 가져오기 요청
export async function getTimeline(username) {
    const res = await fetch(`${server}/posts/?username=${username}`, {
        // 게시물 요청에서 username 쿼리가 있으면 타임라인 
        // 쿼리가 없으면 전체 기준으로 가져오기
        headers : {
            'Authorization' : getBearerToken()
        }
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 6. 팔로워 리스트 가져오기 요청
export async function fetFollowers(username) {
    const res = await fetch(`${server}/profiles/?followers=${username}`, {
        headers : {
            'Authorization' : getBearerToken()
        }
    });

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 7. 팔로잉 리스트 가져오기 요청
export async function getFollowingUsers(username) {
    const res = await fetch(`${server}/profiles/?following=${username}`, {
        headers : {
            'Authorization' : getBearerToken()
        }
    });

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 8. 팔로우 요청
export async function follow(username) {
    const res = await(`${server}/profiles/${username}/follow`, {
        method : "POST",
        headers : {
            'Authorization' : getBearerToken()
        }
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 9. 언팔로우 요청
export async function unfollow(username) {
    const res = await fetch(`${server}/profiles/${username}/unfollow`, {
        method : "DELETE",
        headers : {
            'Authorization' : getBearerToken()
        }
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}