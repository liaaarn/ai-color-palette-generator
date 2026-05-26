"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full"
      />

      <p className="text-pink-400 text-lg">AI analyzing colors...</p>
    </div>
  );
}
