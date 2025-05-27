import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";


export default function Login({ setIsLogin, setIsAdmin }) {
    const navigate = useNavigate();
    const emailRef = useRef();       // 이메일 입력창
    const passwordRef = useRef();    // 비밀번호 입력창


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const changeUsername = e => setUsername(e.target.value);
    const changePassword = e => setPassword(e.target.value);
    const handleSubmit = e => {
        e.preventDefault();

        axios
            .post("http://localhost:8000/users/signin/",
                { username, password },
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    // 메시지를 출력 -> 토큰을 저장 -> 이벤트 목록으로 이동
                    alert(res.data.message);
                    window.sessionStorage.setItem("access_token", res.data.access_token);
                    window.sessionStorage.setItem("is_admin", res.data.is_admin);
                    window.sessionStorage.setItem("username", res.data.username);

                    setIsLogin(true);
                    setIsAdmin(res.data.is_admin);

                    navigate("/");
                }
            })
            .catch(err => {
                console.log(err);
                if (err.response?.status === 404) {
                    alert(err.response.data.detail);
                    emailRef.current.focus();
                } else if (err.response?.status === 401) {
                    alert(err.response.data.detail);
                    passwordRef.current.focus();
                } else if (err.response?.status === 403) {
                    alert(err.response.data.detail);  // 탈퇴 계정
                    emailRef.current.focus();
                } else {
                    alert("로그인에 실패했습니다.");
                    emailRef.current.focus();
                }
            });

    };

    return (
        <>
        
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <input ref={emailRef} type="text" value={username} onChange={changeUsername} placeholder="이메일을 입력하세요." />
                <input ref={passwordRef} type="password" value={password} onChange={changePassword} placeholder="비밀번호를 입력하세요." />
                <button type="submit">로그인</button>
            </form>
        </>
    );
}