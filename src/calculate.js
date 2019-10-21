import { bookWidth, bookHeight } from "./config";

export function calculate(
  side,
  clientX,
  clientY,
  initial,
  down,
  needFinishTurn,
  movement
) {
  const offsetLeft = document.getElementById("book-container").offsetLeft;
  const offsetTop = document.getElementById("book-container").offsetTop;
  const result = {};
  const pageWidth = bookWidth / 2;

  const movementStartX = initial[0] - offsetLeft;
  const movementStartY = initial[1] - offsetTop;

  let cursorX = clientX - offsetLeft;
  let cursorY = clientY - offsetTop;

  if (cursorX > bookWidth) {
    cursorX = bookWidth;
  } else if (cursorX < 0) {
    cursorX = 0;
  }
  if (cursorY > bookHeight) {
    cursorY = bookHeight;
  } else if (cursorY < 0) {
    cursorY = 0;
  }

  let startX = side === "right" ? bookWidth : 0;
  let startY = movementStartY;
  let l = side === "right" ? bookWidth - movementStartX : movementStartX;

  if (l > movementStartY) {
    startX = movementStartX;
    startY = 0;
    l = movementStartY;
  }
  if (l > bookHeight - movementStartY) {
    startX = movementStartX;
    startY = bookHeight;
  }
  if (startX > bookWidth) {
    startX = bookWidth;
  } else if (startX < 0) {
    startX = 0;
  }
  if (side === "right" && cursorX > startX) {
    startX = cursorX + 1;
  } else if (side === "left" && cursorX < startX) {
    startX = cursorX - 1;
  }

  const slope = (cursorX - startX) / (startY - cursorY);

  const mx = (cursorX + startX) / 2;
  const my = (cursorY + startY) / 2;
  let z0x = -my / slope + mx;
  let z0y = 0;
  let z0 = 0;

  if (side === "right") {
    if (z0x > bookWidth) {
      z0x = bookWidth;
      z0y = slope * (bookWidth - mx) + my;
      z0 = 1;
    }

    if (z0x < pageWidth) {
      z0x = pageWidth;
    }
  } else if (side === "left") {
    if (z0x < 0) {
      z0x = 0;
      z0y = -slope * mx + my;
      z0 = 1;
    }

    if (z0x > pageWidth) {
      z0x = pageWidth;
    }
  }

  let z1x = (bookHeight - my) / slope + mx;
  let z1y = bookHeight;
  let z1 = 0;

  if (side === "right") {
    if (z1x > bookWidth) {
      z1x = bookWidth;
      z1y = slope * (bookWidth - mx) + my;
      z1 = 1;
    }
    if (z1x < pageWidth) {
      z1x = pageWidth;
    }
  } else if (side === "left") {
    if (z1x < 0) {
      z1x = 0;
      z1y = -slope * mx + my;
      z1 = 1;
    }
    if (z1x > pageWidth) {
      z1x = pageWidth;
    }
  }

  const A = z1y - z0y;
  const B = z0x - z1x;
  const C = -(A * z0x + B * z0y);

  //http://www.sdmath.com/math/geometry/reflection_across_line.html
  function reflectX(x, y) {
    return ((B * B - A * A) * x - 2 * A * B * y - 2 * A * C) / (A * A + B * B);
  }

  function reflectY(x, y) {
    return ((A * A - B * B) * y - 2 * A * B * x - 2 * B * C) / (A * A + B * B);
  }

  let u0x = reflectX(side === "right" ? bookWidth : 0, 0);
  let u0y = reflectY(side === "right" ? bookWidth : 0, 0);
  let u1x = reflectX(side === "right" ? bookWidth : 0, bookHeight);
  let u1y = reflectY(side === "right" ? bookWidth : 0, bookHeight);

  result.z0x = z0x;
  result.z0y = z0y;
  result.z1x = z1x;
  result.z1y = z1y;

  let angle = Math.atan2(u1y - u0y, u1x - u0x) - Math.PI / 2;

  const d1 = dist(z0x, z0y, u0x, u0y);
  const d2 = dist(z1x, z1y, u1x, u1y);

  result.x = side === "right" ? u0x : u0x - pageWidth;
  result.y = u0y;

  result.r = angle;
  result.display = "block";

  result.z0 = z0;
  result.z1 = z1;

  if (z0 === 0 && z1 === 0) {
    if (side === "right") {
      result.x1 = 0;
      result.y1 = 0;
      result.x2 = d1;
      result.y2 = 0;
      result.x3 = d2;
      result.y3 = bookHeight;
      result.x4 = 0;
      result.y4 = bookHeight;
    } else {
      result.x1 = pageWidth - d1;
      result.y1 = 0;
      result.x2 = pageWidth;
      result.y2 = 0;
      result.x3 = pageWidth;
      result.y3 = bookHeight;
      result.x4 = pageWidth - d2;
      result.y4 = bookHeight;
    }
  } else if (z0 === 1) {
    if (side === "right") {
      result.x1 = 0;
      result.y1 = d1;
      result.x2 = d2;
      result.y2 = bookHeight;
      result.x3 = 0;
      result.y3 = bookHeight;
      result.x4 = result.x3;
      result.y4 = result.y3;
    } else {
      result.x1 = pageWidth;
      result.y1 = d1;
      result.x2 = pageWidth - d2;
      result.y2 = bookHeight;
      result.x3 = pageWidth;
      result.y3 = bookHeight;
      result.x4 = result.x3;
      result.y4 = result.y3;
    }
  } else if (z1 === 1) {
    if (side === "right") {
      result.x1 = 0;
      result.y1 = 0;
      result.x2 = d1;
      result.y2 = 0;
      result.x3 = 0;
      result.y3 = bookHeight - d2;
      result.x4 = result.x3;
      result.y4 = result.x3;
    } else {
      result.x1 = pageWidth;
      result.y1 = 0;
      result.x2 = pageWidth - d1;
      result.y2 = 0;
      result.x3 = pageWidth;
      result.y3 = bookHeight - d2;
      result.x4 = result.x3;
      result.y4 = result.x3;
    }
  }

  if (!down) {
    if (needFinishTurn) {
      if (side === "right") {
        result.x = 0;
        result.x1 = 0;
        result.x2 = pageWidth;
        result.x3 = pageWidth;
        result.x4 = 0;
        result.y = 0;
        result.y1 = 0;
        result.y2 = 0;
        result.y3 = bookHeight;
        result.y4 = bookHeight;
        result.r = 0;
        result.z0x = pageWidth;
        result.z0y = 0;
        result.z1x = pageWidth;
        result.z1y = bookHeight;
      } else {
        result.x = pageWidth;
        result.x1 = 0;
        result.x2 = pageWidth;
        result.x3 = pageWidth;
        result.x4 = 0;
        result.y = 0;
        result.y1 = 0;
        result.y2 = 0;
        result.y3 = bookHeight;
        result.y4 = bookHeight;
        result.r = 0;
        result.z0x = pageWidth;
        result.z0y = 0;
        result.z1x = pageWidth;
        result.z1y = bookHeight;
      }
    } else {
      // back
      if (side === "right") {
        if (z1 === 1) {
          // top corner
          result.y = 0;
          result.x = bookWidth;
          result.x2 = 0;
          result.x3 = 0;
          result.x4 = 0;
          result.y1 = 0;
          result.y2 = 0;
          result.y3 = 0;
          result.z0x = 0;
          result.z0y = 0;
          result.z1x = 0;
          result.z1y = 0;
        } else if (z0 === 1) {
          result.x = bookWidth + u0x - u1x;
          result.y = bookHeight + u0y - u1y;
          result.x1 = 0;
          result.y1 = bookHeight;
          result.x2 = 0;
          result.y2 = bookHeight;
          result.x3 = result.x2;
          result.x4 = result.x2;
          result.y3 = result.y2;
          result.y4 = result.y2;
          result.z0x = 0;
          result.z0y = 0;
          result.z1x = 0;
          result.z1y = 0;
        } else {
          result.r = 0;
          result.y = 0;
          result.x = bookWidth;
          result.x1 = 0;
          result.x2 = 0;
          result.x3 = 0;
          result.x4 = 0;
          result.y1 = 0;
          result.y2 = 0;
          result.y3 = bookHeight;
          result.y4 = bookHeight;
          result.z0x = 0;
          result.z0y = 0;
          result.z1x = 0;
          result.z1y = 0;
        }
      } else {
        if (z1 === 1) {
          // top corner
          result.x = -pageWidth;
          result.y = 0;

          result.x1 = pageWidth;
          result.x2 = pageWidth;
          result.x3 = pageWidth;
          result.x4 = pageWidth;
          result.x5 = pageWidth;

          result.y1 = 0;
          result.y2 = 0;
          result.y3 = 0;
          result.y4 = 0;
          result.y5 = 0;

          result.z0x = 0;
          result.z0y = 0;
          result.z1x = 0;
          result.z1y = 0;
        } else if (z0 === 1) {
          // bottom corner
          result.x = -pageWidth;
          result.x1 = pageWidth;
          result.x2 = pageWidth;
          result.x3 = pageWidth;
          result.x4 = pageWidth;
          result.x5 = pageWidth;

          result.y = bookHeight;
          result.y1 = 0;
          result.y2 = 0;
          result.y3 = 0;
          result.y4 = 0;
          result.y5 = 0;

          result.z0x = 0;
          result.z0y = bookHeight;
          result.z1x = 0;
          result.z1y = bookHeight;
        } else {
          result.r = 0;
          result.y = 0;
          result.x = -pageWidth;
          result.x1 = pageWidth;
          result.x2 = pageWidth;
          result.x3 = pageWidth;
          result.x4 = pageWidth;
          result.y1 = 0;
          result.y2 = 0;
          result.y3 = bookHeight;
          result.y4 = bookHeight;

          result.z0x = 0;
          result.z0y = 0;
          result.z1x = 0;
          result.z1y = bookHeight;
        }
      }
    }
  }

  return result;
}

function dist(x1, y1, x2, y2) {
  const x = x1 - x2;
  const y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}
