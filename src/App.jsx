import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import List from "./event/List";
import Regist from "./event/Regist";
import Detail from "./event/Detail";
import Login from "./user/Login";

function App() {
    return (
        <>
            <BrowserRouter>
                <ul>
                    <li><Link to="/login">로그인</Link></li>
                    <li><Link to="/regist">등록</Link></li>
                    <li><Link to="/list">목록조회</Link></li>
                </ul>

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/regist" element={<Regist />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/detail/:event_id" element={<Detail />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;