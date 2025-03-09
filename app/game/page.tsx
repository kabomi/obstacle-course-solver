"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../page.css";


export default function GamePage() {
  const router = useRouter();
  const [matrixSize, setMatrixSize] = useState(2);

  return (
    <>
      <h1>Select Matrix Size</h1>
      <main>
        <article className="flex flex-col">
          <p className="flex flex-row items-center mb-4">
            <input
              type="range"
              id="matrix-range"
              name="matrix-range"
              className="flex"
              min="2"
              max="5"
              value={matrixSize}
              onChange={(e) => setMatrixSize(parseInt(e.target.value))}
              step="1" />
            <label className="flex pl-2" htmlFor="matrix-range">{matrixSize}</label>
          </p>
          
          <p className="flex self-center">
            <button onClick={() => router.push('/game/placement')}>
              Next
            </button>
          </p>
        </article>
      </main>
    </>
  );
}