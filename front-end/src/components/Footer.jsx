import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Footer = () => {
  return (
    <footer
      className="bg-gray-900 text-gray-300"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">
            Nike Shoes
          </h2>
          <p className="leading-relaxed text-sm text-gray-400">
            Step into the future of performance and style. Explore our premium
            range designed to push your limits and elevate your game.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm">
            {["Home", "Shop", "About Us", "Contact"].map((link, idx) => (
              <li
                key={idx}
                className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer"
              >
                {link}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Customer Service */}
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">
            Customer Service
          </h2>
          <ul className="space-y-2 text-sm">
            {["FAQ", "Shipping & Returns", "Size Guide", "Track Order"].map(
              (link, idx) => (
                <li
                  key={idx}
                  className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer"
                >
                  {link}
                </li>
              )
            )}
          </ul>
        </motion.div>

        {/* Follow Us */}
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">
            Follow Us
          </h2>
          <div className="flex gap-6 text-lg">
            {[FaFacebook, FaSquareXTwitter, FaInstagram, FaYoutube].map(
              (Icon, idx) => (
                <a
                  key={idx}
                  className="hover:text-white hover:scale-110 transition-transform duration-300 cursor-pointer"
                  href="#"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-800 text-center py-5 text-sm tracking-wide border-t border-gray-700">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} Nike Shoes | Designed by{" "}
          <span className="text-white font-semibold">
            Davis Miler
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
