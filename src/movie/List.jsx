import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState(""); // 입력창 상태
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색 기준
  const [expanded, setExpanded] = useState({}); // 더보기 상태

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

  // 검색 버튼 클릭 시
  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  // 검색된 영화 필터링
  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.actors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 더보기 토글
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

      {/* 검색창 + 버튼 묶음 */}
      <div className="search-container">
        <input
          type="text"
          className="movie-search"
          placeholder="영화 제목 또는 배우로 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>검색</button>
        <button className="long-btn" onClick={() => navigate("/regist")}>영화 등록</button>
      </div>

      {filteredMovies.length === 0 ? (
        <p>등록된 영화가 없습니다.</p>
      ) : (
        <ul className="movie-list">
          {filteredMovies.map((movie) => {
            const isLong = movie.story && movie.story.length > 80;
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
                  onClick={e => e.stopPropagation()}
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
    </>
  );
};

export default MovieList;
