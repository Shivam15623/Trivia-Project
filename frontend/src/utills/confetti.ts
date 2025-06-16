import confetti from "canvas-confetti";

export const fireConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#fcbf49", "#e34b4b", "#ff8c42", "#ffc070", "#f29e4e"],
  });
};