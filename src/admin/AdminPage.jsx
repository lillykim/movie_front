import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function AdminPage() {
    const [users, setUsers] = useState([]);

    // 탈퇴 사용자 목록 가져오기
    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        axios
            .get("http://localhost:8000/admin/", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setUsers(res.data))
            .catch(err => {
                alert("사용자 목록 조회 실패");
                console.error(err);
            });
    }, []);

    // 복구 버튼 클릭 시 confirm → 복구 API 요청
    const handleRestore = (userId, username, useremail) => {
        const confirmed = window.confirm(`${useremail} 계정을 복구하시겠습니까?`);
        if (!confirmed) return;

        const token = sessionStorage.getItem("access_token");
        axios
            .put(`http://localhost:8000/admin/${userId}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                alert(res.data.message);
                setUsers(users.filter(user => user.id !== userId));
            })
            .catch(err => {
                alert("복구 실패");
                console.error(err);
            });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>탈퇴한 사용자 목록</h2>

            {users.length === 0 ? (
                <p>탈퇴한 사용자가 없습니다.</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>이메일</th>
                            <th>이름</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>
                                    <button onClick={() => handleRestore(user.id, user.username, user.email)}>
                                        복구하기
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}