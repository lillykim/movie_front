import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";


export default function Signup() {
    const navigate = useNavigate();
    const inputRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState(
        "비밀번호는 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.");

    const changeEmail = e => setEmail(e.target.value);
    // const changePassword = e => setPassword(e.target.value);
    const changeUsername = e => setUsername(e.target.value);
    const changePassword = e => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
    };


    // 비밀번호 유효성 검사 함수 추가
    const validatePassword = (value) => {
        const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!pattern.test(value)) {
            setPasswordValid(false);
            setPasswordMessage("비밀번호는 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.");
        } else {
            setPasswordValid(true);
            setPasswordMessage("사용 가능한 비밀번호입니다.");
        }
    };

    const handleSubmit = e => {
        e.preventDefault();

        axios
            .post("http://localhost:8000/users/signup", {
                email,
                password,
                username
            })
            .then(res => {
                alert(res.data.message);
                navigate("/login");
            })
            .catch(err => {
                if (err.response?.status === 409) {
                    alert("이미 가입된 이메일 주소입니다. 다른 이메일을 사용해 주세요.");
                } else if (err.response?.status === 403) {
                    alert("해당 이메일은 탈퇴한 계정입니다. 관리자에게 문의해주세요.");
                } else if (err.response?.status === 422) {
                    alert(err.response.data.detail);
                } else {
                    alert("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
                }
                setEmail('');
                setPassword('');
                setUsername('');
                inputRef.current.focus();
            });
    };

    return (
        <>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={changeEmail}
                    placeholder="이메일을 입력하세요"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={changePassword}
                    placeholder="비밀번호를 입력하세요"
                    required
                />
                <p
                    style={{
                        color: passwordValid ? "green" : "red",
                        fontSize: "0.9em",
                        marginTop: "-5px",
                        minHeight: "1.2em"
                    }}
                >
                    {passwordMessage}
                </p>

                <input
                    type="text"
                    value={username}
                    onChange={changeUsername}
                    placeholder="이름을 입력하세요"
                    required
                />
                <button type="submit">회원가입</button>
            </form>
        </>
    );
}
