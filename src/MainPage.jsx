import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setFadeIn(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={styles.container}>

            <section style={styles.hero}>
                <h1 style={{
                    ...styles.title,
                    opacity: fadeIn ? 1 : 0,
                    transform: fadeIn ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.8s ease, transform 0.8s ease"
                }}>
                    나만의 영화 기록, 지금 시작해보세요
                </h1>
                <p style={{
                    ...styles.subtitle,
                    opacity: fadeIn ? 1 : 0,
                    transition: "opacity 1.2s ease"
                }}>
                    보고 싶은 영화, 본 영화까지 한 곳에서 간편하게 관리하세요.
                </p>
                <Link to="/list" className="cta-button" style={{
                    ...styles.ctaButton,
                    opacity: fadeIn ? 1 : 0,
                    transition: "opacity 1.5s ease"
                }}>
                    영화 보러 가기
                </Link>
            </section>


            <section style={styles.cardRow}>
                <div style={styles.card}>
                    <h2>영화 탐색</h2>
                    <p>현재 상영작부터 기대작까지 다양한 영화 정보를 확인할 수 있습니다.</p>
                </div>
                <div style={styles.card}>
                    <h2>영화 등록</h2>
                    <p>보고 싶은 영화나 감상 후기를 간편하게 등록해보세요.</p>
                </div>
                <div style={styles.card}>
                    <h2>나의 리스트</h2>
                    <p>등록한 영화들을 리스트로 정리하고 나만의 영화 컬렉션을 만들어보세요.</p>
                </div>
            </section>

            <p style={styles.footer}>
                Setflix는 당신의 영화 취향을 기록하는 공간입니다.
            </p>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
        textAlign: "center",
        color: "#f5f5f5"
    },
    hero: {
        marginBottom: "30px",
        background: "#2a2a40",
        padding: "40px 30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
    },
    title: {
        fontSize: "32px",
        marginBottom: "16px",
        color: "#BDE47A"
    },
    subtitle: {
        fontSize: "16px",
        color: "#ccc",
        marginBottom: "20px"
    },
    ctaButton: {
        display: "inline-block",
        padding: "12px 26px",
        backgroundColor: "#BDE47A",
        color: "#1e1e2f",
        fontWeight: "bold",
        borderRadius: "6px",
        textDecoration: "none",
        fontSize: "16px",
        transition: "all 0.3s ease",
    },
    cardRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        marginBottom: "40px"
    },
    card: {
        backgroundColor: "#2f2f47",
        borderRadius: "10px",
        padding: "24px 20px",
        flex: "1",
        textAlign: "left",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        transition: "transform 0.2s ease"
    },
    footer: {
        marginTop: "40px",
        fontSize: "16px",
        fontWeight: "500",
        color: "#ccc"
    }
};
