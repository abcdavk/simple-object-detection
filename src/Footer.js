"use client";

import React from "react";
import {
  FaGithub,
} from "react-icons/fa6";

const YEAR = new Date().getFullYear();

function SocialLink({ href, icon: Icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Icon />
    </a>
  );
}

export default function Footer() {
  return (
    <small className="block lg:mt-16 mt-8 text-[#1C1C1C] dark:text-[#D4D4D4]">
      <time>© {YEAR}</time>{" "}
      <a
        className="no-underline"
        href="https://github.com/abcdavk/simple-object-detection"
        target="_blank"
        rel="noopener noreferrer"
      >
        by abcdave
      </a>
      <style jsx>{`
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
      <div className="flex text-lg float-right transition-opacity duration-300 hover:opacity-90">
        <SocialLink href="https://github.com/abcdavk/simple-object-detection" icon={FaGithub} /> 
        <p className="">Source Code</p>
      </div>
    </small>
  );
}
