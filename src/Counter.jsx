import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);
    const plusOne = () => setCount(count+1);
    
    return (
        <>
            <h1>{count}</h1>
            <button onClick={plusOne}>+1</button>        
        </>
    );
}
export default Counter;