import "../App.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MovieRegist() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    story: "",
    actors: "",
    rating: "",
  });

  const { title, story, actors, rating } = form;
  const [poster, setPoster] = useState(null);

  const handleChangeFile = (e) => {
    setPoster(e.target.files[0]);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("data", JSON.stringify(form));
    formData.append("poster", poster); // 👈 backend에서 UploadFile = File(...) 으로 받는 필드

    const token = window.sessionStorage.getItem("access_token");
    axios
      .post("http://localhost:8000/movies", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 201) {
          alert("🎉 영화 등록이 완료되었습니다.");
          navigate("/list");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("영화 등록에 실패했습니다.");
      });
  };

  return (
    <>
      <h2>🎬 영화 등록</h2>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={title}
          type="text"
          name="title"
          placeholder="영화 제목"
          required
        />
        <input
          onChange={handleChange}
          value={story}
          type="text"
          name="story"
          placeholder="줄거리"
          required
        />
        <input
          onChange={handleChange}
          value={actors}
          type="text"
          name="actors"
          placeholder="출연 배우"
          required
        />
        <input
          onChange={handleChange}
          value={rating}
          type="number"
          name="rating"
          placeholder="평점 (예: 4.5)"
          step="0.1"
        />
        <input
          type="file"
          name="poster"
          onChange={handleChangeFile}
          required
        />
        <button type="submit">등록</button>
      </form>
    </>
  );
}
