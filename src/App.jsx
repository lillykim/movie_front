import { BrowserRouter, Route, Routes, Link, Outlet, useNavigate } from "react-router-dom";
import List from "./movie/List";
import Regist from "./movie/Regist";
import Detail from "./movie/Detail";
import Login from "./user/Login";
import Signup from "./user/Signup";
import Edit from "./movie/Edit";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserTimes } from "react-icons/fa";



function Layout() {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        window.sessionStorage.removeItem("access_token");
        setIsLogin(false);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("정말 탈퇴하시겠습니까?")) {
            const token = sessionStorage.getItem("access_token");
            axios
                .delete("http://localhost:8000/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((res) => {
                    alert(res.data.message);
                    sessionStorage.removeItem("access_token");
                    setIsLogin(false);
                    navigate("/login");
                })
                .catch((err) => {
                    alert("회원탈퇴에 실패했습니다.");
                    console.error(err);
                });
        }
    };


    useEffect(() => {
        const token = window.sessionStorage.getItem("access_token");
        if (token) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    });

    useEffect(() => {
        if (isLogin) {
            navigate("/list");
        } else {
            navigate("/login");
        }
    }, [isLogin]);


    return (
            
        <>
            <h1>Setflix</h1>

            <header style={{ display: "none" }}></header>

            <main>
                <div className="top-icons">
                    {isLogin ? (
                        <>
                            <button onClick={handleLogout} className="nav-icon" title="로그아웃">
                                <FaSignOutAlt />
                            </button>
                            <button onClick={handleDeleteAccount} className="nav-icon" title="회원탈퇴">
                                <FaUserTimes />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-icon" title="로그인">
                                <FaSignInAlt />
                            </Link>
                            <Link to="/signup" className="nav-icon" title="회원가입">
                                <FaUserPlus />
                            </Link>
                        </>
                    )}
                </div>

                <Outlet />
            </main>

            <footer>
                <p>영화 정보 관리 웹 애플리케이션 프로젝트 © 2025</p>
            </footer>
        </>
    );
}

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/regist" element={<Regist />} />
                        <Route path="/list" element={<List />} />
                        <Route path="/movies/:movie_id" element={<Detail />} />
                        <Route path="/movies/:movie_id/edit" element={<Edit />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;