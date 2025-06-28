import React from "react";
import { motion } from "framer-motion";
import "./PageTransition.css";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <>
      <motion.div
        className="slide-in"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for a smoother feel
        }}
      />
      <div className="page-content">{children}</div>
      <motion.div
        className="slide-out"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 0 }}
        transition={{
          duration: 1,
          ease: [0.43, 0.13, 0.23, 0.96], // Matching ease for consistency
        }}
      />
    </>
  );
};

export default PageTransition; 