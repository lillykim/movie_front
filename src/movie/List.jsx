import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 로그인 여부 확인
  useEffect(() => {
    const token = window.sessionStorage.getItem("access_token");
    if (!token) {
      alert("로그인 후 사용하세요.");
      navigate("/login");
    }
  }, [navigate]);

  // 영화 목록 불러오기
  useEffect(() => {
    const token = window.sessionStorage.getItem("access_token");
    if (!token) return;

    axios
      .get("http://localhost:8000/movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("영화 데이터를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h2>🎬 영화 목록</h2>
      {movies.length === 0 ? (
        <p>등록된 영화가 없습니다.</p>
      ) : (
        <ul className="movie-list">
          {movies.map((movie) => (
            <li key={movie.id} style={{ marginBottom: "20px" }}>
              <h3>
                <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
              </h3>
              {movie.poster_path && (
                <img
                  src={`http://localhost:8000/movies/download/${movie.id}?t=${Date.now()}`}
                  alt={movie.title}
                  style={{ width: "200px", borderRadius: "8px" }}
                />
              )}
              <p className="text-black-800">줄거리: {movie.story}</p>
              <p className="text-gray-800">배우: {movie.actors}</p>
              <p className="text-gray-800">평점: {movie.rating ?? '평점 없음'}</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/regist")}>영화 등록</button>
    </>
  );
};

export default MovieList;
