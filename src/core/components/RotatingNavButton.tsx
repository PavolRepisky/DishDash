import { keyframes } from "@emotion/react";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const rotationAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

interface RotatingNavButtonProps {
  buttonText: string;
  to: string;
}

const RotatingNavButton = ({ buttonText, to }: RotatingNavButtonProps) => {
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setRotate(true);

      setTimeout(() => {
        setRotate(false);
      }, 500);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [rotate]);

  return (
    <Button
      component={RouterLink}
      to={to}
      sx={{
        maxWidth: "fit-content",
        animation: rotate ? `${rotationAnimation} 0.5s ease-in-out` : "none",
      }}
      variant="contained"
    >
      {buttonText}
    </Button>
  );
};

export default RotatingNavButton;
