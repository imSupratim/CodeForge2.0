// import React from "react"

// const ShootingStars = () => {
//   const stars = Array.from({ length: 30 })

//   return (
//     <div className="shooting-stars">
//       {stars.map((_, i) => {
//         const style = {
//           top: `-${Math.random() * 100}px`, // ⬅ start ABOVE screen
//           left: `${Math.random() * 190}%`,  // spread horizontally
//           animationDelay: `${Math.random() * 5}s`,
//           animationDuration: `${3 + Math.random() * 3}s`,
//         }

//         return <span key={i} className="shooting-star" style={style} />
//       })}
//     </div>
//   )
// }

// export default ShootingStars


import React from "react"

// This runs only once when the app loads
const STATIC_STARS = Array.from({ length: 30 }).map(() => ({
  top: `-${Math.random() * 100}px`,
  left: `${Math.random() * 160}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${3 + Math.random() * 3}s`,
}));

const ShootingStars = () => {
  return (
    <div className="shooting-stars">
      {STATIC_STARS.map((star, i) => (
        <span
          key={i}
          className="shooting-star"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  )
}

export default ShootingStars