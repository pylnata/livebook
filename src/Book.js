import React, { useState } from "react";
import { useSprings, useSpring, animated, interpolate, config } from "react-spring";
import { useGesture, useDrag, addV, subV } from "react-use-gesture";
import { bookWidth, bookHeight } from "./config";
import { calculate } from "./calculate";

import "./book.scss";

const pages = ["red", "blue", "green", "orange", "orangered", "yellow"];

const html = {
0: '<img src="https://m.media-amazon.com/images/I/71x62yntQML._SX700_.jpg" />',
1: '<img src="https://m.media-amazon.com/images/I/81vcBETkdZL._SX700_.jpg" />',
2: '<img src="https://m.media-amazon.com/images/I/817YBrgmxUL._SX700_.jpg" />',
}


let pageWidth = bookWidth / 2;

const getX = i => {
  //return 0;
  return pageWidth;
  if (i === 0) return pageWidth;
  if (i === 1) return pageWidth;
  if (i % 2 === 0) return pageWidth;
  //else return bookWidth;
};

const from = i => ({
  x: getX(i),
  y: 0,
  x1: 0,
  y1: 0,
  x2: pageWidth,
  y2: 0,
  x3: pageWidth,
  y3: bookHeight,
  x4: 0,
  y4: bookHeight,
  x5: 0,
  y5: bookHeight,
  z: i === 0 ? 2 : i >= 2 ? 0 : 1,
  display: i <= 2 ? "block" : "none",
  bgPos: 0,
  r: 0,
  scaleX: 1
});

const to = from;

const Book = () => {
  const [previousWasFinished, setPreviousWasFinished] = useState(true);

  const [props, set] = useSprings(pages.length, i => ({
    ...to(i),
    from: from(i)
  }));

  const bind = useDrag(
    ({
      args: [index],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      movement,
      velocity,
      event,
      initial,
      cancel,
      canceled,
      active,
      last,
      xy
    }) => {
      //const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      //if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

      let bgPos = 0;
      const customConfig = {
        friction: 0,
        tension: down ? 0 : 20,
        clamp: true,
        precision: 0,
        //duration: down? 0 : 500
      };

      const to = {
        x: pageWidth,
        y: 0,
        x1: 0,
        y1: 0,
        x2: pageWidth,
        y2: 0,
        x3: pageWidth,
        y3: bookHeight,
        x4: 0,
        y4: bookHeight,
        x5: 0,
        y5: bookHeight,
        z: 1,
        bgPos: 0,
        display: "none",
        config: customConfig,
        onRest: null,
        immediate: false,
        r: 0,
        scaleX: 1
      };

      /*
      if (i === index + 1 && Math.abs(movement[0]) > 75  ) {
        isGone = true;
      }
      */

      if (!previousWasFinished && down) return;

      let side;
      let offsetLeft = document.getElementById("book-container").offsetLeft;
      if (initial[0] - offsetLeft <= pageWidth) side = "left";
      else if (initial[0] - offsetLeft > pageWidth) side = "right";
      else if (dir === -1) side = "right";
      else side = "left";

      const needFinishTurn =
        !down &&
        ((movement[0] > 100 && side === "left") ||
          (movement[0] < -100 && side === "right"));

      //if (index === 0) side = "right"


      // FOR TEST
      //setPreviousWasFinished(true); //!!!!!!!!!!!1
      //if (!down) return; //!!!!!!!!!!!!11
      //_________

      setPreviousWasFinished(false);

      const onFinishTurnFromRight = () => {
        set(i => {
          if (i === index)
            return {
              ...to,
              z: 2,
              display: "none",
              x: 0,
              immediate: true,
            };
          if (i === index + 1)
            return {
              ...to,
              z: 1,
              x: 0,
              display: "block",
              immediate: true
            };
          if (i === index + 2)
            return {
              ...to,
              z: 1,
              display: "block",
              immediate: true
            };
          if (i === index - 1)
            return {
              ...to,
              x:0,
              z: 0,
              display: "block",
              immediate: true
            };
          return {...to, z: 0, display: "none", immediate: true };
        });


        console.log("finished-right");
        setPreviousWasFinished(true);
      };

      const onFinishTurnFromLeft = () => {
          set(i => {
            if (i === index)
              return {
                ...to,
                z: 2,
                x: pageWidth,
                immediate: true,
                display: "none"
              };
            if (i === index - 1)
              return {
                ...to,
                z: 1,
                x: pageWidth,
                display: "block",
                immediate: true,
              };
            if (i === index - 2)
              return {
                ...to,
                x:0,
                z: 1,
                display: "block",
                immediate: true
              };
            return {...to, z: 0, display: "none", immediate: true };
          });
        console.log("finished-left");
        setPreviousWasFinished(true);
      };

      const onRestFnLeft = newX => {
        if (newX === pageWidth && !down) onFinishTurnFromLeft();
        else if (!needFinishTurn && !down) setPreviousWasFinished(true);
        else setPreviousWasFinished(true);
      };

      const onRestFnRight = newX => {
        if (newX === 0 && !down) onFinishTurnFromRight();
        else if (!needFinishTurn && !down) setPreviousWasFinished(true);
        else setPreviousWasFinished(true);
      };

      let rotationParams = calculate(side, xy[0], xy[1], initial, down, needFinishTurn, movement);

      set(i => {
        if (side === "left") {
          if (i === index - 1) {
            return {
              ...to,
              display: 'block',
              z: 2,
              x: rotationParams.newX,
              y: rotationParams.newY,
              x1: rotationParams.newX1,
              x2: rotationParams.newX2,
              x3: rotationParams.newX3,
              x4: rotationParams.newX4,
              y1: rotationParams.newY1,
              y2: rotationParams.newY2,
              y3: rotationParams.newY3,
              y4: rotationParams.newY4,
              x5: rotationParams.newX4, //
              y5: rotationParams.newY4, //
              r: rotationParams.r,
              bgPos: rotationParams.newX1,
              scaleX: down ? 1 : 1,
              onRest: () => onRestFnLeft(rotationParams.newX)
            };

          } else if (index === i) {

            let newX2 = 0;
            let newY2 = 0;
            let newX3 = 0;
            let newY3 = 0;
            let newX4 = 0;
            let newY4 = 0;
            let newX5 = 0;
            let newY5 = 0;
            if (rotationParams.z0y === 0) {
              newX2 = rotationParams.z0x - pageWidth;
              newX3 = rotationParams.z1x - pageWidth;
              newY3 = rotationParams.z1y;
              newY4 = bookHeight;
              newX5 = newX4;
              newY5 = newY4;
              if (newX3 === pageWidth && newY3 < bookHeight) {
                newX4 = pageWidth;
                newY4 = bookHeight;
                newX5 = 0;
                newY5 = bookHeight;
              }
            } else {
              return {
                ...to,
                display: "block",
                x: 0,
                x1: 0,
                y1: 0,
                x2: pageWidth,
                y2: 0,
                x3: pageWidth,
                y3: bookHeight,
                x4: rotationParams.z1x,
                y4: bookHeight,
                x5: 0,
                y5: rotationParams.z0y
              }
//              newX3 = rotationParams.z0x - pageWidth;
//              newY3 = rotationParams.z0y;
//              newX4 = rotationParams.z1x - pageWidth;
//              newY4 = rotationParams.z1y;
//              newX5 = 0;
//              newY5 = bookHeight;
            }
            return {
              ...to,
              display: "block",
              x: 0,
              x1: pageWidth + newX2,
              y1: newY2,
              x2: pageWidth,
              y2: 0,
              x3: pageWidth,
              y3: bookHeight,
              x4: 0,
              y4: bookHeight,
              x5: pageWidth+newX3,
              y5: newY3
            };

          } else if (i === index -2) {
            return {...to, x: 0, display: 'block'}
          }
          else return;
        }
        // WORK ON RIGHT SIDE
        else if (side === "right") {
          //if (!down) movement[0] = needFinishTurn ? -bookWidth : 0;

          if (index === i) {
            let newX2 = 0;
            let newY2 = 0;
            let newX3 = 0;
            let newY3 = 0;
            let newX4 = 0;
            let newY4 = 0;
            let newX5 = 0;
            let newY5 = 0;
            if (rotationParams.z0y === 0) {
              newX2 = rotationParams.z0x - pageWidth;
              newX3 = rotationParams.z1x - pageWidth;
              newY3 = rotationParams.z1y;
              newY4 = bookHeight;
              newX5 = newX4;
              newY5 = newY4;
              if (newX3 === pageWidth && newY3 < bookHeight) {
                newX4 = pageWidth;
                newY4 = bookHeight;
                newX5 = 0;
                newY5 = bookHeight;
              }
            } else {
              newX2 = pageWidth;
              newY2 = 0;
              newX3 = rotationParams.z0x - pageWidth;
              newY3 = rotationParams.z0y;
              newX4 = rotationParams.z1x - pageWidth;
              newY4 = rotationParams.z1y;
              newX5 = 0;
              newY5 = bookHeight;
            }
            return {
              ...to,
              display: "block",
              x: index === 0 && 0 ? -movement[0] : pageWidth,
              x2: index === 0 && 0? -newX2 : newX2,
              y2: newY2,
              x3: newX3,
              y3: newY3,
              x4: newX4,
              y4: newY4,
              x5: newX5,
              y5: newY5
            };
          } else if (i === index + 1) {
            if (rotationParams.newX > bookWidth && 0)
              return {
                x: bookWidth,
                y: 0,
                r: rotationParams.r
              };
            return {
              ...to,
              display: 'block',
              z: 1,
              x: index === 0 && 0 ? pageWidth+movement[0] : rotationParams.newX,
              y: rotationParams.newY,
              x1: rotationParams.newX1,
              x2: rotationParams.newX2,
              x3: rotationParams.newX3,
              x4: rotationParams.newX4,
              y1: rotationParams.newY1,
              y2: rotationParams.newY2,
              y3: rotationParams.newY3,
              y4: rotationParams.newY4,
              r: rotationParams.r,
              onRest: () => onRestFnRight(rotationParams.newX)
            };
          }
          else if (i === index + 2) {
            return { bgPos, display: "block", immediate: true, x: index===0 && 0 ? -movement[0] : pageWidth };
          }
        } else return {onRest: null, display: 'none', immediate: true };
      });

      //if (!down && gone.size === pages.length)
      //setTimeout(() => gone.clear() || set(i => to(i)), bookWidth);
    },
    //{ enabled: previousWasFinished,  dragDelay: 500 }
    //{dragDelay: 500}
  );

  const content = props.map(
    (
      {
        x,
        y,
        x1,
        y1,
        x2,
        y2,
        x3,
        y3,
        x4,
        y4,
        x5,
        y5,
        z,
        bgPos,
        display,
        r,
        scaleX
      },
      i
    ) => (
      <animated.div
        key={i}
        style={{
          display,
          zIndex: z,
          //backgroundColor: pages[i],
          backgroundPositionX: bgPos,
          backgroundImage:
            i % 2 === 1
              ? interpolate([x2], x2 => {
                  return `linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%,
        rgba(255,255,255, 1) ${(x2 * 65) / pageWidth}%,
        rgba(0, 0, 0, 0.1) ${(x2 * 80) / pageWidth}%,
        rgba(0, 0, 0, 0.15) ${(x2 * 88) / pageWidth}%,
        rgba(255,255,255,1) 100%)`;
                })
              : "linear-gradient(to right,rgb(0, 0, 0, 0.3) 0%,rgba(184, 184, 184, 0) 12%)",
          WebkitClipPath: interpolate(
            [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5],
            (x1, y1, x2, y2, x3, y3, x4, y4, x5, y5) => {
              if (x5 === undefined) x5 = x4;
              if (y5 === undefined) y5 = y4;
              return `polygon(${x1}px ${y1}px, ${x2}px ${y2}px, ${x3}px ${y3}px, ${x4}px ${y4}px, ${x5}px ${y5}px )`;
            }
          ),
          transform: interpolate(
            [x, y, r, scaleX],
            (x, y, r, scaleX) =>
              `translateX(${x}px) translateY(${y}px) rotate(${r}rad) scaleX(${scaleX})`
          )
        }}
        className={`page page--${i} `}
        {...bind(i)}
      >
        <h4>{i}</h4> Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum has been the industry's standard dummy
        text ever since the 1500s, when an unknown printer took a galley of type
        and scrambled it to make a type specimen book.


        <div className="img" dangerouslySetInnerHTML={{__html: html[i]}}></div>


        It has survived not only
        five centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </animated.div>
    )
  );

  console.log("render", previousWasFinished);

  return (
    <div id="book-container" style={{width: bookWidth, height: bookHeight}}>
      {content}
    </div>
  );
};

export default Book;
