import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // 검색어 상태 추가
  const [expanded, setExpanded] = useState({}); // 각 영화의 더보기 상태

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

  // 검색 필터링
  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase()) ||
      movie.actors.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h2>🎬 영화 목록</h2>
      {/* 검색 입력창 */}
      <input
        type="text"
        className="movie-search"
        placeholder="영화 제목 또는 배우로 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredMovies.length === 0 ? (
        <p>등록된 영화가 없습니다.</p>
      ) : (
        <ul className="movie-list">
          {filteredMovies.map((movie) => {
            const isLong = movie.story && movie.story.length > 80; // 80자 이상이면 더보기
            const showAll = expanded[movie.id];
            return (
              <li
                key={movie.id}
                style={{ marginBottom: "20px", cursor: "pointer" }}
                onClick={() => navigate(`/movies/${movie.id}`)}
              >
                <h3>
                  <span style={{ color: "#66bb6a", textDecoration: "underline" }}>
                    {movie.title}
                  </span>
                </h3>
                {movie.poster_path && (
                  <img
                    src={`http://localhost:8000/movies/download/${movie.id}?t=${Date.now()}`}
                    alt={movie.title}
                    style={{ width: "200px", borderRadius: "8px", display: "block", margin: "16px auto" }}
                  />
                )}
                <p
                  className={`movie-story${!showAll && isLong ? " clamp" : ""}`}
                  onClick={e => e.stopPropagation()} // 카드 클릭 방지
                >
                  <span className="movie-label">줄거리:</span>{" "}
                  {showAll || !isLong
                    ? movie.story
                    : movie.story.slice(0, 80) + "..."}
                  {isLong && (
                    <button
                      className="more-btn"
                      onClick={() => handleToggle(movie.id)}
                    >
                      {showAll ? "접기" : "더보기"}
                    </button>
                  )}
                </p>
                <p className="movie-actors">
                  <span className="movie-label">배우:</span> {movie.actors}
                </p>
                <p className="movie-rating">
                  <span className="movie-label">평점:</span> {movie.rating ?? '평점 없음'}
                </p>
              </li>
            );
          })}
        </ul>
      )}
      <button className="long-btn" onClick={() => navigate("/regist")}>영화 등록</button>
    </>
  );
};

export default MovieList;
