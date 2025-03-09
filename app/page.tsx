// import Image from "next/image";
// import { useState } from "react";
"use client";
import { useRouter } from 'next/navigation'
import "./page.css"

export default function Home() {
  const router = useRouter()
  // const [gameStarted, setGameStarted] = useState(false);
  return (
    <>
      <h1>Obstacle Course Solver</h1>
      <main>
        <article>
          <p>
            <button className="startButton" onClick={() => router.push('/game')}>
              Start
            </button>
          </p>
        </article>
      </main>
    </>
  );
}
