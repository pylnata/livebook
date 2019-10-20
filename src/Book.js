import React, { useState } from "react";
import {
  useSprings,
  useSpring,
  animated,
  interpolate,
  config
} from "react-spring";
import { useGesture, useScroll, useDrag, addV, subV } from "react-use-gesture";
import { bookWidth, bookHeight } from "./config";
import { calculate } from "./calculate";

import { disablePageScroll, enablePageScroll } from "scroll-lock";

import "./book.scss";
import { anyTypeAnnotation } from "@babel/types";

const pages = ["red", "blue", "green", "orange", "orangered", "yellow"];

const html = {
  0: '<img src="https://m.media-amazon.com/images/I/71x62yntQML._SX700_.jpg" />',
  1: '<img src="https://m.media-amazon.com/images/I/81vcBETkdZL._SX700_.jpg" />',
  2: '<img src="https://m.media-amazon.com/images/I/817YBrgmxUL._SX700_.jpg" />'
};

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
  bgPosY: 0,
  bgRad: 0,
  bgHeight: bookHeight,
  bgDisplay: 'none',
  bgY2: 0,
  r: 0,
  scaleX: 1,
  index: 0
});

const to = from;

const Book = () => {
  // this will add a scroll listener to the window
  //const bind2 = useScroll(state => {return false}, { domTarget: window })
  //React.useEffect(bind2, [bind2])

  React.useEffect(() => {
    disablePageScroll();
    return () => {
      enablePageScroll();
    };
  }, []);

  const [previousWasFinished, setPreviousWasFinished] = useState(true);

  const [props, set] = useSprings(pages.length, i => ({
    ...to(i),
    from: from(i)
  }));

  const onDragHandler = ({
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
    first,
    last,
    xy
  }) => {
    //if (!previousWasFinished) return;

    if (distance === 0) return;
    if (first) {
      console.log("start");
    }
    if (last) {
      console.log("last");
    }

    //const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
    //if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

    let bgPos = 0;
    let bgRad = 0;
    let bgDisplay = 'none';
    let bgPosY = 0;
    let bgY2 = 0;
    let bgHeight = bookHeight;
    const customConfig = {
      friction: 0,
      tension: down ? 0 : 1,
      clamp: true,
      precision: 0
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
      bgPosY: 0,
      bgRad: 0,
      bgY2: 0,
      bgHeight: bookHeight,
      bgDisplay: 'none',
      display: "none",
      config: customConfig,
      onRest: null,
      immediate: false,
      r: 0,
      scaleX: 1,
      index
    };

    /*
      if (i === index + 1 && Math.abs(movement[0]) > 75  ) {
        isGone = true;
      }
      */

    //if (!previousWasFinished && down) return;

    let side;
    let offsetLeft = document.getElementById("book-container").offsetLeft;
    if (initial[0] - offsetLeft <= pageWidth) side = "left";
    else if (initial[0] - offsetLeft > pageWidth) side = "right";
    else if (dir === -1) side = "right";
    else side = "left";

    const needFinishTurn =
      !down &&
      ((movement[0] > 1000 && side === "left") ||
        (movement[0] < -1000 && side === "right"));

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
            immediate: true
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
            x: 0,
            z: 0,
            display: "block",
            immediate: true
          };
        return { ...to, z: 0, display: "none", immediate: true };
      });

      console.log("finished-right");
      setPreviousWasFinished(true);
    };


    const onFinishBackRight = () => {
      set(i => {
        if (i === index)
          return {
            ...to,
            z: 1,
            display: "block",
            immediate: true
          };
        if (i === index + 1)
          return {
            ...to,
            z: 2,
            display: "none",
            immediate: true
          };
        if (i === index + 2)
          return {
            ...to,
            z: 0,
            display: "none",
            immediate: true
          };
return;
        //  return { ...to, z: 0, display: "none", immediate: true };
      });

      console.log("finished-back-right");
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
            immediate: true
          };
        if (i === index - 2)
          return {
            ...to,
            x: 0,
            z: 1,
            display: "block",
            immediate: true
          };
        return { ...to, z: 0, display: "none", immediate: true };
      });
      console.log("finished-left");
      setPreviousWasFinished(true);
    };

    const onRestFnLeft = newX => {
      if (newX === pageWidth && !down) onFinishTurnFromLeft();
      else if (!needFinishTurn && !down) setPreviousWasFinished(true);
      else setPreviousWasFinished(true);
    };

    const onRestFnRight = (newX) => {
      if (newX === 0 && !down) {
        onFinishTurnFromRight();
      }
      if(!down && !needFinishTurn) { // TODO set another flag
        //onFinishBackRight();
      }
    };

    let rotationParams = calculate(
      side,
      xy[0],
      xy[1],
      initial,
      down,
      needFinishTurn,
      movement
    );

    set(i => {
      if (side === "left") {
        if (i === index - 1) {
          return {
            ...to,
            display: "block",
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
            scaleX: 1,
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
            };
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
            x5: pageWidth + newX3,
            y5: newY3
          };
        } else if (i === index - 2) {
          return { ...to, x: 0, display: "block" };
        }
        else if (i === index + 1) {
          return {bgDisplay: 'none'}
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

          let setBg = false;

          if (rotationParams.z1 === 1) { // top corner
            newX2 = rotationParams.z0x - pageWidth;
            newX3 = rotationParams.z1x - pageWidth;
            newY3 = rotationParams.z1y;
            newX4 = pageWidth;
            newY4 = bookHeight;
            newX5 = 0;
            newY5 = bookHeight;

            if (!down && !needFinishTurn) {
              newX2 = pageWidth;
              newY2 = 0;
              newX3 = pageWidth;
              newY3 = 0;
              newX4 = pageWidth;
              newY4 = bookHeight;
              newX5 = 0;
              newY5 = bookHeight;
            }


            const b = Math.abs(pageWidth-newX2);
            const a = Math.abs(bookHeight-newY3);
            bgRad = -(Math.atan(b/a) * 180/Math.PI);
            bgHeight = Math.sqrt(a*a  + b*b);
            bgPosY = bgHeight-bookHeight;
            setBg = true;
          } else if (rotationParams.z0 === 1) { // bottom corner
            newX2 = pageWidth;
            newY2 = 0;
            newX3 = rotationParams.z0x - pageWidth;
            newY3 = rotationParams.z0y;
            newX4 = rotationParams.z1x - pageWidth;
            newY4 = rotationParams.z1y;
            newX5 = 0;
            newY5 = bookHeight;

            if (!down && !needFinishTurn) {
              newX3 = pageWidth;
              newY3 = bookHeight;
              newX4 = pageWidth;
              newY4 = bookHeight;
              newX5 = 0;
              newY5 = bookHeight;
            }


          } else { // normal
            newX2 = rotationParams.z0x - pageWidth;
            newX3 = rotationParams.z1x - pageWidth;
            newY3 = rotationParams.z1y;
            newY4 = bookHeight;
            newX5 = newX4;
            newY5 = newY4;

            if (!down && !needFinishTurn) {
              newX2 = pageWidth;
              newY2 = 0;
              newX3 = pageWidth;
              newY3 = bookHeight;
              newX4 = 0;
              newY4 = bookHeight;
              newX5 = 0;
              newY5 = bookHeight;
            }

          }

          if (!setBg) {
            const b = Math.abs(newX2 - newX3);
            const a = bookHeight;
            bgRad = -90+(Math.atan(a/b) * 180/Math.PI);
            bgHeight = Math.sqrt(a*a  + b*b);
            bgPosY = bgHeight-bookHeight;
          }

          return {
            ...to,
            display: "block",
            x: pageWidth,
            x2: newX2,
            y2: newY2,
            x3: newX3,
            y3: newY3,
            x4: newX4,
            y4: newY4,
            x5: newX5,
            y5: newY5
          };
        } else if (i === index + 1) {

          const {newX, newY, newX1,newY1, newX2, newY2, newX3, newY3, newX4, newY4, r} = rotationParams;

          //bgPosY = rotationParams.newY;


          if (rotationParams.newX3 > rotationParams.newX2) bgRad = -bgRad;
          bgPos = pageWidth-rotationParams.newX2;
          bgDisplay = 'block';

          //bgRad = rotationParams.r * 180/ Math.PI;

          return {
            ...to,
            display: "block",
            z: 1,
            x: index === 0 && 0 ? pageWidth + movement[0] : newX,
            y: newY,
            x1: newX1,
            x2: newX2,
            x3: newX3,
            x4: newX4,
            y1: newY1,
            y2: newY2,
            y3: newY3,
            y4: newY4,
            r,
            onRest: () => onRestFnRight(newX)
          };
        } else if (i === index + 2) {
          return {
            index,
            bgPos,
            bgPosY,
            bgRad,
            bgHeight,
            bgDisplay,
            bgY2,
            display: "block",
            immediate: true,
            x: index === 0 && 0 ? -movement[0] : pageWidth
          };
        }
      } else return {index, onRest: null, display: "none", immediate: true };
    });

    //if (!down && gone.size === pages.length)
    //setTimeout(() => gone.clear() || set(i => to(i)), bookWidth);
  };

  const bind = useGesture({
    onDrag: onDragHandler, // fires on drag
    onScroll: state => {
      console.log("scroll");
      return state;
    } // fires on scroll
    //onHover: state => {console.log('hover') },    // fires on mouse enter, mouse leave
    //onMove: state => {console.log('move') },     // fires on mouse move over the element
  });

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
        bgPosY,
        bgRad,
        bgHeight,
        bgDisplay,
        bgY2,
        display,
        r,
        scaleX,
        index
      },
      i
    ) => {


      return (
      <>
      <animated.div
        key={i}
        style={{
          display,
          zIndex: z,
          backgroundColor: pages[i],
          backgroundPositionX: 0,
          backgroundImage:
            i % 2 === 1
              ? interpolate([x2, bgRad], (x2, bgRad) => {
                  return `linear-gradient(to right,
         rgb(230, 230, 230) 0%,
        rgb(255,255,255) ${(x2 * 65) / pageWidth}%,
        rgb(230, 230, 230) ${(x2 * 80) / pageWidth}%,
        rgb(217, 217, 217) ${(x2 * 88) / pageWidth}%,
        rgb(255,255,255) 100%
      )`;
                }) :
               (i !== (index.value + 2)  ? `linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%,rgba(184, 184, 184, 0) 60px)` : null)
//                interpolate(
//                  [bgRad, bgPos],
//                  (bgRad, bgPos) =>
//                    `linear-gradient(${90+bgRad}deg, rgb(0, 0, 0, 0.3) 0%,rgba(184, 184, 184, 0) ${300-bgPos}px)`
//                )
,

/*WebkitClipPath: interpolate(
            [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5],
            (x1, y1, x2, y2, x3, y3, x4, y4, x5, y5) => {
              if (x5 === undefined) x5 = x4;
              if (y5 === undefined) y5 = y4;
              return `polygon(${x1}px ${y1}px, ${x2}px ${y2}px, ${x3}px ${y3}px, ${x4}px ${y4}px, ${x5}px ${y5}px )`;
            }
          ),

*/
          transformOrigin: i % 2 === 0 ? pageWidth + "px 0px" : "0px 0px",
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
{/*
        <div
          className="img"
          dangerouslySetInnerHTML={{ __html: html[i] }}
        ></div>
*/}
        It has survived not only five centuries, but also the leap into
        electronic typesetting, remaining essentially unchanged. It was
        popularised in the 1960s with the release of Letraset sheets containing
        Lorem Ipsum passages, and more recently with desktop publishing software
        like Aldus PageMaker including versions of Lorem Ipsum.



      </animated.div>


     {false && i===(index.value + 2) &&  <animated.div className="shadow" style={{
        height: bgHeight,
        display: bgDisplay,
        left: pageWidth,
        WebkitClipPath: interpolate(
          [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, bgHeight, bgY2],
          (x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, bgHeight, bgY2) => {
            y3 = y4 = y5 = bgHeight;
            y2 = bgY2;
            if (x5 === undefined) x5 = x4;
            if (y5 === undefined) y5 = y4;
            return `polygon(${x1}px ${y1}px, ${x2}px ${y2}px, ${x3}px ${y3}px, ${x4}px ${y4}px, ${x5}px ${y5}px )`;
          }
        ),
        transform: interpolate([bgRad, bgPos, bgPosY], (bgRad, bgPos, bgPosY) => `rotate(${bgRad}deg) translateX(${bgPos}px) translateY(${bgPosY}px)`)
        }}></animated.div>}
</>
    )
  });

  console.log("render", previousWasFinished);

  return (
    <>
      <div id="book-container" style={{ width: bookWidth, height: bookHeight }}>
        {content}
      </div>
    </>
  );
};

export default Book;
