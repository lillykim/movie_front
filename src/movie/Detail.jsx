import "../App.css";
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
  const { movie_id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    axios.get(`http://localhost:8000/movies/${movie_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      setMovie(response.data);
      setLoading(false);
    })
    .catch((err) => {
      setError('영화 정보를 불러오는 데 실패했습니다.');
      setLoading(false);
    });
  }, [movie_id]);

  const handleDelete = () => {
    const confirm = window.confirm("정말 이 영화를 삭제하시겠습니까?");
    if (!confirm) return;

    const token = sessionStorage.getItem("access_token");
    axios.delete(`http://localhost:8000/movies/${movie_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert("영화가 삭제되었습니다.");
      navigate("/list");
    })
    .catch((err) => {
      console.error(err);
      if (err.response && err.response.status === 403) {
        alert("삭제 권한이 없습니다. 본인이 등록한 영화만 삭제할 수 있습니다.");
      } else {
        alert("삭제 중 오류가 발생했습니다.");
      }
    });
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>영화 정보가 없습니다.</p>;

  return (
    <div className="movie-detail" style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 16px rgba(25,118,210,0.08)", color: "#222", textAlign: "center" }}>
      <h2>{movie.title}</h2>
      {movie.poster_path && (
        <img
          src={`http://localhost:8000/movies/download/${movie.id}?t=${Date.now()}`}
          alt={movie.title}
          style={{ width: '300px', borderRadius: '10px', display: "block", margin: "0 auto 24px auto" }}
        />
      )}
      <p style={{ textAlign: "left", margin: "16px 0" }}><strong>줄거리:</strong> {movie.story}</p>
      <p style={{ textAlign: "left" }}><strong>배우:</strong> {movie.actors}</p>
      <p style={{ textAlign: "left" }}><strong>평점:</strong> {movie.rating ?? '평점 없음'}</p>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <Link to={`/movies/${movie.id}/edit`}>
          <button>수정하기</button>
        </Link>
        <button onClick={handleDelete} style={{ color: "white", backgroundColor: "red" }}>
          삭제하기
        </button>
        {movie.poster_path && (
          <a
            href={`http://localhost:8000/movies/download/${movie.id}?t=${Date.now()}`}
            download={movie.poster_path}
            style={{ textDecoration: "none" }}
          >
            <button style={{ backgroundColor: "#bde47a", color: "#222" }}>
              포스터 다운로드
            </button>
          </a>
        )}
      </div>
    </div>
  );
};

export default Detail;
