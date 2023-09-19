import { useRef, useEffect } from 'react';

export default function Form({ search }) {

    // useRef = 실제 엘리먼트에 접근할 수 있다.
    const inputEl = useRef(null);

    // 페이지 처음 접속시 입력란에 포커스
    useEffect(() => {
        inputEl.current.focus();
    })

    // 포커스 기능은 실제 엘리먼트에 접근해야하기 때문에 useRef Hook을 사용
    // useRef Hook은 current라는 속성이 있고, 거기에 실제 엘리먼트를 저장
    // 비동기적으로 input에 접근하는 이유?
    // virtual dom이 실제 문서에 주입되고 난 뒤에 접근하기 때문에.

    return (
        <label className='block mb-4'>
            <input 
                type='text'
                className="border px-2 py-1 rounded w-full outline-none"
                onChange={({ target }) => search(target.value)} 
                // input의 값이 변할 때 search()가 실행
                placeholder='검색'
                ref={inputEl}
            />    
        </label>
    )
};