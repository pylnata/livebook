import React, { useState } from "react";
import {
  useSprings,
  animated,
  interpolate
} from "react-spring";
import { useGesture } from "react-use-gesture";
import { bookWidth, bookHeight } from "./config";
import { calculate } from "./calculate";

import { disablePageScroll, enablePageScroll } from "scroll-lock";

import "./book.scss";

const pages = ["brown", "white", "white", "white", "white", "white", "white", "brown"];

const html = {
  0: "<div class=\"title\"><h1>Halloween's stories</h1><img src='https://raw.githubusercontent.com/pylnata/livebook/master/public/images/0.png' /></div>",
  1: `<p class="number">1</p>

  <h3>The Legend of Bride's Head Bridge</h3>

  <p>There's a bridge near Hanover in Germany called 'Der Kopf der Braut', which means bride's head.  A 15th century legend has it that Reichsgraf von Kesselstatt and his bride Gretchen were approaching the bridge in their horse and carriage when their way was blocked by an elderly crone.</p><p>The Reichsgraf or 'Count' ordered the old lady to get off the bridge instantly and make way for their carriage.  But it was dark, and the old lady had difficulty in herding her sheep off the bridge.</p>
  <p>Because the old witch was moving none to fast, Reichsgraf von Kesselstatt took his whip and have her
  a sound thrashing. </p>
  `,
  2: `<p class="number right">2</p>
  <p> Bleeding, and cowering in a ditch, the old witch put a curse on the carriage.  Consequently when the bridal party eventually crossed the bridge, one of the horses shied and the other reared up.  </p>
    <p><img src='https://raw.githubusercontent.com/pylnata/livebook/master/public/images/1.jpg' /></p>
  <p>
  The upshot was that Gretchen was thrown from the carriage into the river below. It seems certain that she drowned as the river was in torrent and Gretchen was never seen again.
  </p>
  `,
  3: `<p class="number">3</p>
  <p>However, it is said by Hanoverian wicca that at Halloween you can see a headless bride standing on rocks in the middle of the river.  Some say she is looking for her lost head, while other say she is looking for her beloved Reichsgraf von Kesselstatt.</p>


  <p><img src='https://raw.githubusercontent.com/pylnata/livebook/master/public/images/5.png' /></p>


  `,
  4: `
    <p class="number right">4</p>

    <h3>Uncle John's Halloween Story</h3>
    <p>
    When I was a boy, each year as the nights began to draw in, my uncle John would tell we kids this Halloween story.  It was a tale about a trick that he played in a graveyard.  One night Uncle John spotted his great friend Eddie weaving his way home from the village pub.  As John watched, he saw Eddie open the church's litch gate and take the shortcut through the graveyard.
    </p>

    <p>
  There was no doubt that Eddie was the worse for wear, and appeared disoriented, really he should have taken the longer route home via the round ring.  But then he cried out to nobody in particular, 'Where am I?'
</p>
  `,
  5: `
  <p class="number">5</p>
  <p>
  John replied instantly, 'Amongst the living'.
  </p><p>
  'Where are you?' cried Eddie'; to which John replied in his most sepulchral voice, 'Amongst the dead'.
  </p>

  <p>
  Eddie sobered up instantly, rushed back the way he came, and took the long way around the churchyard.  This time he preferring to go passed the round ring, rather than stay a minute longer amongst the spirits of the gravestones.
    </p>`,
  6: `
  <p class="number right">6</p>
  <p>Stories are from <a href="https://www.funny-jokes.com">https://www.funny-jokes.com</a></p>
  `,
  7: `<center style="margin: 60px auto; color: #fff;">&copy; 2019 <a style="color:#fff;" href="http://github.com/pylnata">github.com/pylnata</a></center>`
};

let pageWidth = bookWidth / 2;

const from = i => ({
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
  z: i === 0 ? 2 : i >= 2 ? 0 : 1,
  display: i <= 2 ? "block" : "none",
  bgPos: 0,
  bgPosY: 0,
  bgRad: 0,
  bgHeight: bookHeight,
  bgDisplay: "none",
  bgY2: 0,
  r: 0,
  scaleX: 1,
  index: 0
});

const to = from;

const Book = () => {

  //const bind2 = useScroll(state => {return false}, { domTarget: window })
  //React.useEffect(bind2, [bind2])

  React.useEffect(() => {
    disablePageScroll();
    return () => {
      enablePageScroll();
    };
  }, []);

  // TODO: disable drag until previous action is'nt finshed
  const [previousWasFinished, setPreviousWasFinished] = useState(true);

  const [props, set] = useSprings(pages.length, i => ({
    ...to(i),
    from: from(i)
  }));

// TODO: on hover make bottom corner of first page flipping
  const onHoverHandler = ({ hovering, down }) => {
    return false;
    if (hovering) {
      if (down) return false;
    }
  };

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
    xy,
    memo
  }) => {
    //if (!previousWasFinished) return;

    if (distance === 0) return;
    const dir = xDir < 0 ? -1 : 1;

    let bgPos = 0;
    let bgRad = 0;
    let bgDisplay = "none";
    let bgPosY = 0;
    let bgY2 = 0;
    let bgHeight = bookHeight;
    const customConfig = {
      friction: 0,
      tension: down ? 0 : 100, // TODO find optimal params
      clamp: true,
      precision: 0,
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
      bgDisplay: "none",
      display: "none",
      config: customConfig,
      onRest: null,
      immediate: false,
      r: 0,
      scaleX: 1,
      index
    };

    //if (!previousWasFinished && down) return;

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

    // FOR TEST
    //setPreviousWasFinished(true);
    //if (!down) return;

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

          if(i === index+4) {
            return {
              ...to,
              x: pageWidth,
              z: 0,
              display: "block",
              immediate: true
            };
          }
        return { ...to, z: 0, display: "none", immediate: true };
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
          if(i === index+1) {
            return {
              ...to,
              x: pageWidth,
              z: 0,
              display: "block",
              immediate: true
            };
          }
        return { ...to, z: 0, display: "none", immediate: true };
      });
      console.log("finished-left");
      setPreviousWasFinished(true);
    };

    const onRestFnLeft = () => {
      if (!down && needFinishTurn) onFinishTurnFromLeft();
      else if (!needFinishTurn && !down) setPreviousWasFinished(true);
    };

    const onRestFnRight = x => {
      if (!down && needFinishTurn) {
        onFinishTurnFromRight();
      }
      else if (!down && !needFinishTurn) {
        setPreviousWasFinished(true);
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

    let memoRotationParams = rotationParams;

    //if (down) console.log(rotationParams);

    set(i => {
      let x1 = 0;
      let y1 = 0;
      let x2 = 0;
      let y2 = 0;
      let x3 = 0;
      let y3 = 0;
      let x4 = 0;
      let y4 = 0;
      let x5 = 0;
      let y5 = 0;

      if (side === "left") {
        if (i === index - 1) {
          rotationParams.x5 = rotationParams.x4;
          rotationParams.y5 = rotationParams.y4;

          let result2 = {
            ...to,
            display: "block",
            z: 2,
            ...rotationParams,
            bgPos: rotationParams.x1,
            scaleX: 1,
            onRest: () => {
              onRestFnLeft(rotationParams.x);
            }
          };

          if (!down && needFinishTurn) {
            let dist = memo.z0x;
            if (rotationParams.z0 === 1) dist = memo.z1x;

            if (rotationParams.z1 === 1 || rotationParams.z0 === 1) {
              return {
                r: 0,
                x: -pageWidth + dist * 2,
                y: 0,
                x1: pageWidth - dist,
                y1: 0,
                x2: pageWidth,
                y2: 0,
                x3: pageWidth,
                y3: bookHeight,
                x4: pageWidth - dist,
                y4: bookHeight,
                x5: pageWidth - dist,
                y5: bookHeight,
                immediate: true,
                onRest: () => {
                  set(i => {
                    if (i === index) {
                      dist = pageWidth; // hack
                      return {
                        x1: dist,
                        y1: 0,
                        x2: pageWidth,
                        y2: 0,
                        x3: pageWidth,
                        y3: bookHeight,
                        x4: dist,
                        y4: bookHeight,
                        x5: dist,
                        y5: bookHeight,
                        immediate: true,
                        onRest: () => {
                          set(i => {
                            if (i === index) {
                              return {
                                x: bookWidth,
                                display: "none",
                                immediate: false,
                                config: customConfig,
                                x1: pageWidth,
                                x2: pageWidth,
                                x3: pageWidth,
                                x4: pageWidth,
                                x5: pageWidth
                              };
                            }
                            if (i === index - 1) {
                              let r = result2;
                              r.onRest = () => onFinishTurnFromLeft();
                              return r;
                            }
                          });
                        }
                      };
                    } else return;
                  });
                }
              };
            } else return result2;
          } else return result2;
        } else if (index === i) {
          if (rotationParams.z1 === 1) {
            // top corner
            x1 = rotationParams.z0x;
            x2 = pageWidth;
            x3 = pageWidth;
            y3 = bookHeight;
            y4 = bookHeight;
            x5 = rotationParams.z1x;
            y5 = rotationParams.z1y;

            if (!down && !needFinishTurn) {
              x1 = 0;
              x5 = 0;
              y5 = 0;
            }
          } else if (rotationParams.z0 === 1) {
            // bottom corner
            x2 = pageWidth;
            x3 = pageWidth;
            y3 = bookHeight;
            x4 = rotationParams.z1x;
            y4 = bookHeight;
            x5 = 0;
            y5 = rotationParams.z0y;
          } else {
            // normal
            x1 = rotationParams.z0x;
            x2 = pageWidth;
            x3 = pageWidth;
            y3 = bookHeight;
            x4 = rotationParams.z1x;
            y4 = bookHeight;
            x5 = rotationParams.z1x;
            y5 = bookHeight;
          }

          let result = {
            ...to,
            display: "block",
            x: 0,
            x1,
            y1,
            x2,
            y2,
            x3,
            y3,
            x4,
            y4,
            x5,
            y5
          };

          if (
            !down &&
            needFinishTurn &&
            (rotationParams.z1 === 1 || rotationParams.z0 === 1)
          ) {
            //            let dist = memo.z0x;
            //            if (rotationParams.z0 === 1) dist = memo.z1x;
            let dist = pageWidth; // hack
            return {
              r: 0,
              x: 0,
              y: 0,
              x1: dist,
              x4: dist,
              y1: 0,
              x2: pageWidth,
              y2: 0,
              x3: pageWidth,
              y3: bookHeight,
              y4: bookHeight,
              x5: dist,
              y5: bookHeight,
              immediate: true
              //              onRest: () => {
              //                onFinishTurnFromLeft()
              //              }
            };
          } else return result;
        } else if (i === index - 2) {
          return { ...to, x: 0, display: "block" };
        } else if (i === index + 1) {
          return { bgDisplay: "none" };
        } else return;
      }
      // WORK ON RIGHT SIDE
      else if (side === "right") {
        if (index === i) {
          let setBg = false;
          if (rotationParams.z1 === 1) {
            // top corner
            x2 = rotationParams.z0x - pageWidth;
            x3 = rotationParams.z1x - pageWidth;
            y3 = rotationParams.z1y;
            x4 = pageWidth;
            y4 = bookHeight;
            x5 = 0;
            y5 = bookHeight;

            if (!down && !needFinishTurn) {
              x2 = pageWidth;
              y2 = 0;
              x3 = pageWidth;
              y3 = 0;
              x4 = pageWidth;
              y4 = bookHeight;
              x5 = 0;
              y5 = bookHeight;
            }

            const b = Math.abs(pageWidth - x2);
            const a = Math.abs(bookHeight - y3);
            bgRad = -((Math.atan(b / a) * 180) / Math.PI);
            bgHeight = Math.sqrt(a * a + b * b);
            bgPosY = bgHeight - bookHeight;
            setBg = true;
          } else if (rotationParams.z0 === 1) {
            // bottom corner
            x2 = pageWidth;
            y2 = 0;
            x3 = rotationParams.z0x - pageWidth;
            y3 = rotationParams.z0y;
            x4 = rotationParams.z1x - pageWidth;
            y4 = rotationParams.z1y;
            x5 = 0;
            y5 = bookHeight;

            if (!down && !needFinishTurn) {
              x3 = pageWidth;
              y3 = bookHeight;
              x4 = pageWidth;
              y4 = bookHeight;
              x5 = 0;
              y5 = bookHeight;
            }
          } else {
            // normal
            x2 = rotationParams.z0x - pageWidth;
            x3 = rotationParams.z1x - pageWidth;
            y3 = rotationParams.z1y;
            y4 = bookHeight;
            x5 = x4;
            y5 = y4;

            if (!down && !needFinishTurn) {
              x2 = pageWidth;
              y2 = 0;
              x3 = pageWidth;
              y3 = bookHeight;
              x4 = 0;
              y4 = bookHeight;
              x5 = 0;
              y5 = bookHeight;
            }
          }

          if (!setBg) {
            const b = Math.abs(x2 - x3);
            const a = bookHeight;
            bgRad = -90 + (Math.atan(a / b) * 180) / Math.PI;
            bgHeight = Math.sqrt(a * a + b * b);
            bgPosY = bgHeight - bookHeight;
          }

          let result = {
            ...to,
            display: "block",
            x: pageWidth,
            x2,
            y2,
            x3,
            y3,
            x4,
            y4,
            x5,
            y5
          };

          if (
            !down &&
            needFinishTurn &&
            (rotationParams.z1 === 1 || rotationParams.z0 === 1)
          ) {
            return {
              r: 0,
              x: pageWidth,
              y: 0,
              x1: 0,
              y1: 0,
              x2: pageWidth - memo.x2,
              y2: 0,
              x3: pageWidth - memo.x2,
              y3: bookHeight,
              x4: 0,
              y4: bookHeight,
              x5: 0,
              y5: bookHeight,
              immediate: true
            };
          } else return result;
        } else if (i === index + 1) {
          if (rotationParams.x3 > rotationParams.x2) bgRad = -bgRad;
          bgPos = pageWidth - rotationParams.x2;
          bgDisplay = "block";

          let result = {
            ...to,
            display: "block",
            z: 1,
            ...rotationParams,
            onRest: () => onRestFnRight(rotationParams.x)
          };

          //if(down)
          //          console.log("to",result);

          if (!down && needFinishTurn) {
            if (rotationParams.z1 === 1 || rotationParams.z0 === 1) {
              return {
                r: 0,
                x: bookWidth - memo.x2 * 2,
                y: 0,
                x1: 0,
                y1: 0,
                x2: memo.x2,
                y2: 0,
                x3: memo.x2,
                y3: bookHeight,
                x4: 0,
                y4: bookHeight,
                x5: 0,
                y5: bookHeight,
                immediate: true,
                onRest: () => {
                  set(i => {
                    if (i === index) {
                      return {
                        x2: pageWidth - memo.x2,
                        x3: pageWidth - memo.x2,
                        immediate: true,
                        onRest: () => {
                          set(i => {
                            if (i === index) {
                              return {
                                immediate: false,
                                config: customConfig,
                                x2: 0,
                                x3: 0
                              };
                            }
                          });
                        }
                      };
                    }
                    if (i === index + 1) {
                      return result;
                    }
                  });
                }
              };
            } else return result;
          } else return result;
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
      } else return { index, onRest: null, display: "none", immediate: true };
    });

    if (down) {
      return memoRotationParams;
    }

  };

  const bind = useGesture(
    {
      onDrag: onDragHandler, // fires on drag
      onScroll: state => {
        return state;
      }, // fires on scroll
      onHover: onHoverHandler
      //onMove: state => {console.log('move') },     // fires on mouse move over the element
    },
    {
      //enabled: previousWasFinished
    }
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
        <div key={i}>
          <animated.div
            key={i}
            style={{
              display,
              zIndex: z,
              backgroundColor: pages[i],
              backgroundPositionX: 0,
              backgroundImage:
                (i % 2 === 1 && i !== props.length-1)
                  ? interpolate([x2, bgRad], (x2, bgRad) => {
                      return `linear-gradient(to right,
         rgb(230, 230, 230) 0%,
        rgb(255,255,255) ${(x2 * 65) / pageWidth}%,
        rgb(230, 230, 230) ${(x2 * 80) / pageWidth}%,
        rgb(217, 217, 217) ${(x2 * 88) / pageWidth}%,
        rgb(255,255,255) 100%
      )`;
                    })
                  : i !== index.value + 2 || true // TODO shadow move
                  ? `linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%,rgba(184, 184, 184, 0) 60px)`
                  : null,
              //                interpolate(
              //                  [bgRad, bgPos],
              //                  (bgRad, bgPos) =>
              //                    `linear-gradient(${90+bgRad}deg, rgb(0, 0, 0, 0.3) 0%,rgba(184, 184, 184, 0) ${300-bgPos}px)`
              //                )
              WebkitClipPath: interpolate(
                [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5],
                (x1, y1, x2, y2, x3, y3, x4, y4, x5, y5) => {
                  if (x5 === undefined) x5 = x4;
                  if (y5 === undefined) y5 = y4;
                  return `polygon(${x1}px ${y1}px, ${x2}px ${y2}px, ${x3}px ${y3}px, ${x4}px ${y4}px, ${x5}px ${y5}px )`;
                }
              ),

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
            <div
              dangerouslySetInnerHTML={{ __html: html[i] }}
            ></div>
          </animated.div>
          {false && i === index.value + 2 && (
            <animated.div
              className="shadow"
              style={{
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
                transform: interpolate(
                  [bgRad, bgPos, bgPosY],
                  (bgRad, bgPos, bgPosY) =>
                    `rotate(${bgRad}deg) translateX(${bgPos}px) translateY(${bgPosY}px)`
                )
              }}
            ></animated.div>
          )}
        </div>
      );
    }
  );
  return (
    <>
      <div id="book-container" style={{ width: bookWidth, height: bookHeight }}>
        {content}
      </div>
      <div className="copy">
      Drag page to flip
      </div>
    </>
  );
};
export default Book;
