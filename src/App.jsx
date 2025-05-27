import { BrowserRouter, Route, Routes, Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import List from "./movie/List";
import Regist from "./movie/Regist";
import Detail from "./movie/Detail";
import Login from "./user/Login";
import Signup from "./user/Signup";
import AdminPage from "./admin/AdminPage";
import Main from "./MainPage";
import Edit from "./movie/Edit";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserTimes, FaUserCog } from "react-icons/fa";



function Layout({ isLogin, setIsLogin, isAdmin, setIsAdmin }) {

    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname;

    const handleLogout = () => {
        window.sessionStorage.removeItem("access_token");
        window.sessionStorage.removeItem("is_admin");
        setIsLogin(false);
        setIsAdmin(false);
        navigate("/login");

    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm("회원 탈퇴를 진행하시겠습니까?");
        if (!confirmed) return;

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
                sessionStorage.removeItem("is_admin");
                setIsLogin(false);
                setIsAdmin(false);
                navigate("/login");
            })
            .catch((err) => {
                alert("회원탈퇴에 실패했습니다.");
                console.error(err);
            });
    };


    useEffect(() => {
        const token = window.sessionStorage.getItem("access_token");
        const adminFlag = window.sessionStorage.getItem("is_admin") === "true";

        if (token) {
            setIsLogin(true);
            setIsAdmin(adminFlag);

        }
    });

    useEffect(() => {
        if (isLogin) {
            navigate("/list");
        }
    }, [isLogin]);


    return (
            
        <>
        
            {/* 메인페이지 이동 */}
            <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                Setflix
            </h1> 

            <header style={{ display: "none" }}></header>

            <main>
                <div className="top-icons">
                    {isLogin ? (
                        <>
                            <button onClick={handleLogout} className="nav-icon" title="로그아웃">
                                <FaSignOutAlt />
                            </button>
                            {isAdmin ? (
                                <button onClick={() => navigate("/admin")} className="nav-icon" title="관리자 페이지">
                                    <FaUserCog />
                                </button>
                            ) : (
                                <button onClick={handleDeleteAccount} className="nav-icon" title="회원탈퇴">
                                    <FaUserTimes />
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {currentPath !== "/login" && (
                                <Link to="/login" className="nav-icon" title="로그인">
                                    <FaSignInAlt />
                                </Link>
                            )}
                            {currentPath !== "/signup" && (
                                <Link to="/signup" className="nav-icon" title="회원가입">
                                    <FaUserPlus />
                                </Link>
                            )}
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
    const [isLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Layout
                        isLogin={isLogin}
                        setIsLogin={setIsLogin}
                        isAdmin={isAdmin}
                        setIsAdmin={setIsAdmin}
                    />
                }>
                    <Route path="/login" element={
                        <Login
                            setIsLogin={setIsLogin}
                            setIsAdmin={setIsAdmin}
                        />
                    } />
                    <Route index element={<Main />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/regist" element={<Regist />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/movies/:movie_id" element={<Detail />} />
                    <Route path="/movies/:movie_id/edit" element={<Edit />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App;