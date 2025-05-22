import { useState } from "react";

const EventPractice = () => {
    /*
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const handleChange = e => {
        if (e.target.name === "message") {
            setMessage(e.target.value);
        } else if (e.target.name === "name") {
            setName(e.target.value);
        }
    };
    */

    const [form, setForm] = useState({
        message: '', 
        name: '', 
        age: 0
    });
    const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
    const {message, name, age} = form;

    const handleConfirm = () => alert(`메시지: ${message}\n이름: ${name}`);

    return (
        <>
            <h1>이벤트 연습</h1>
            <input type="text" name="message" onChange={handleChange} value={message} placeholder="메시지를 입력하세요." />
            <input type="text" name="name" onChange={handleChange} value={name} placeholder="이름을 입력하세요." />
            <input type="text" name="age" onChange={handleChange} value={age} placeholder="나이를 입력하세요." />

            <h2>메시지: {message}</h2>
            <h2>이름: {name}</h2>
            <h2>나이: {age}</h2>
            <button onClick={handleConfirm}>확인</button>
        </>
    );
};

export default EventPractice;