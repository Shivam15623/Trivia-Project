import confetti from "canvas-confetti";
type Props = {
  spread?: number;
};
export const fireConfetti = ({ spread }: Props) => {
  confetti({
    particleCount: 250,
    spread: spread ?? 70,
    origin: { y: 0.6 },
    colors: ["#fcbf49", "#e34b4b", "#ff8c42", "#ffc070", "#f29e4e"],
  });
};
