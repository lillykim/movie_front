import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Edit() {
  const navigate = useNavigate();
  const { movie_id } = useParams();

  const [form, setForm] = useState({
    title: "",
    story: "",
    actors: "",
    rating: "",
  });
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 기존 영화 데이터 불러오기
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    axios
      .get(`http://localhost:8000/movies/${movie_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm({
          title: res.data.title,
          story: res.data.story,
          actors: res.data.actors,
          rating: res.data.rating ?? "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("영화 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, [movie_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeFile = (e) => {
    setPoster(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("data", JSON.stringify(form)); // 문자열로 전송
    if (poster) {
      formData.append("poster", poster); // 파일도 있으면 추가
    }

    axios
      .put(`http://localhost:8000/movies/${movie_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        alert("영화 정보가 수정되었습니다.");
        navigate(`/movies/${movie_id}`);
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 403) {
          alert("수정 권한이 없습니다. 본인이 등록한 영화만 수정할 수 있습니다.");
          navigate(`/movies/${movie_id}`);
        } else {
          alert("수정 중 오류가 발생했습니다.");
        }
      });
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h2>🎬 영화 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={form.title}
          type="text"
          name="title"
          placeholder="제목"
          required
        />
        <input
          onChange={handleChange}
          value={form.story}
          type="text"
          name="story"
          placeholder="줄거리"
          required
        />
        <input
          onChange={handleChange}
          value={form.actors}
          type="text"
          name="actors"
          placeholder="배우"
          required
        />
        <input
          onChange={handleChange}
          value={form.rating}
          type="number"
          step="0.1"
          name="rating"
          placeholder="평점"
        />
        <input type="file" name="poster" onChange={handleChangeFile} />
        <button type="submit">수정 완료</button>
      </form>
    </>
  );
}
