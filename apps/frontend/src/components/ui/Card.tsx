import { motion } from "framer-motion";
import type React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "stone" | "wood";
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  hover = false,
}) => {
  const baseClasses = "rounded-lg shadow-lg minecraft-border";

  const variantClasses = {
    default: "bg-minecraft-stone text-white",
    stone: "bg-minecraft-stone-dark text-white",
    wood: "bg-minecraft-wood text-white",
  };

  const CardComponent = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        whileHover: { scale: 1.02 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <CardComponent
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...motionProps}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
