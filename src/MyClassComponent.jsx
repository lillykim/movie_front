import { Component } from "react";

class MyClassComponent extends Component {
    render() {
        console.log(this.props);    // {name: '홍길동', age: 23}

        const { name, age } = this.props;
    
        return (
            <>
                <h1>이름은 {name}입니다.</h1>
                <h2>나이는 {age}살입니다.</h2>
            </>
        );
    }
}

export default MyClassComponent;