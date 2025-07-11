import { motion } from "framer-motion";
import type React from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "grass" | "dirt";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  onClick,
  disabled = false,
  type = "button",
}) => {
  const baseClasses =
    "font-bold transition-all duration-200 block-shadow minecraft-border";

  const variantClasses = {
    primary: "bg-minecraft-grass text-white hover:bg-minecraft-grass-dark",
    secondary: "bg-minecraft-stone text-white hover:bg-minecraft-stone-dark",
    grass: "bg-minecraft-grass text-white hover:bg-minecraft-grass-dark",
    dirt: "bg-minecraft-dirt text-white hover:bg-minecraft-dirt-dark",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
