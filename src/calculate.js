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

  if (!down && 0) {
    // CANCEL
    let i0 = initial[0];
    let i1 = initial[1];
    initial[0] = clientX;
    initial[1] = clientY;
    clientX = offsetLeft + bookWidth;
    clientY = offsetTop;
    console.log(initial, clientX, clientY);
  }

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

  let u0x = reflectX(side === "right" ? bookWidth : 0, 0, A, B, C);
  let u0y = reflectY(side === "right" ? bookWidth : 0, 0, A, B, C);
  let u1x = reflectX(side === "right" ? bookWidth : 0, bookHeight, A, B, C);
  let u1y = reflectY(side === "right" ? bookWidth : 0, bookHeight, A, B, C);

  /*
      dot1Style.display = "block";
      dot1Style.backgroundColor = "blue";
      dot1Style.transform = "translate(" + cursorX + "px, " + cursorY + "px)";

      dot2Style.display = "block";
      dot2Style.backgroundColor = "yellow";
      dot2Style.transform = "translate(" + startX + "px, " + startY + "px)";

      dot3Style.display = "block";
      dot3Style.backgroundColor = "green";
      dot3Style.transform = "translate(" + z0x + "px, " + z0y + "px)";

      dot4Style.display = "block";
      dot4Style.backgroundColor = "purple";
      dot4Style.transform = "translate(" + z1x + "px, " + z1y + "px)";

      dot5Style.display = "block";
      dot5Style.backgroundColor = "orange";
      dot5Style.transform = "translate(" + u0x + "px, " + u0y + "px)";

      dot6Style.display = "block";
      dot6Style.backgroundColor = "cyan";
      dot6Style.transform = "translate(" + u1x + "px, " + u1y + "px)";
*/

  result.z0x = z0x;
  result.z0y = z0y;
  result.z1x = z1x;
  result.z1y = z1y;

  let angle = Math.atan2(u1y - u0y, u1x - u0x) - Math.PI / 2;

  const d1 = dist(z0x, z0y, u0x, u0y, movement);
  const d2 = dist(z1x, z1y, u1x, u1y, movement);

  result.newX = side === "right" ? u0x : u0x - pageWidth;
  result.newY = u0y;

  result.r = angle;
  result.display = "block"; ////////////////////////////////////

  console.log(result); //style.transformOrigin = "0px 0px";

  // right
  /*
    style.transform = "translate(" + u0x + "px, " + u0y + "px) " +
    "rotate(" + angle + "rad) scaleX(-1) ";
*/

  result.z0 = z0;
  result.z1 = z1;

  if (z0 === 0 && z1 === 0) {
    if (side === "right") {
      result.newX1 = 0;
      result.newY1 = 0;
      result.newX2 = d1;
      result.newY2 = 0;
      result.newX3 = d2;
      result.newY3 = bookHeight;
      result.newX4 = 0;
      result.newY4 = bookHeight;
    } else {
      result.newX1 = pageWidth - d1;
      result.newY1 = 0;
      result.newX2 = pageWidth;
      result.newY2 = 0;
      result.newX3 = pageWidth;
      result.newY3 = bookHeight;
      result.newX4 = pageWidth - d2;
      result.newY4 = bookHeight;
    }
  } else if (z0 === 1) {
    if (side === "right") {
      result.newX1 = 0;
      result.newY1 = d1;
      result.newX2 = d2;
      result.newY2 = bookHeight;
      result.newX3 = 0;
      result.newY3 = bookHeight;
      result.newX4 = result.newX3;
      result.newY4 = result.newY3;
    } else {
      result.newX1 = pageWidth;
      result.newY1 = d1;
      result.newX2 = pageWidth - d2;
      result.newY2 = bookHeight;
      result.newX3 = pageWidth;
      result.newY3 = bookHeight;
      result.newX4 = result.newX3;
      result.newY4 = result.newY3;
    }
  } else if (z1 === 1) {
    if (side === "right") {
      result.newX1 = 0;
      result.newY1 = 0;
      result.newX2 = d1;
      result.newY2 = 0;
      result.newX3 = 0;
      result.newY3 = bookHeight - d2;
      result.newX4 = result.newX3;
      result.newY4 = result.newX3;
    } else {
      result.newX1 = pageWidth;
      result.newY1 = 0;
      result.newX2 = pageWidth - d1;
      result.newY2 = 0;
      result.newX3 = pageWidth;
      result.newY3 = bookHeight - d2;
      result.newX4 = result.newX3;
      result.newY4 = result.newX3;
    }
  }

  if (!down) {
    if (needFinishTurn) {
      if (side === "right") {
        result.newX = 0;
        result.newX1 = 0;
        result.newX2 = pageWidth;
        result.newX3 = pageWidth;
        result.newX4 = 0;
        result.newY = 0;
        result.newY1 = 0;
        result.newY2 = 0;
        result.newY3 = bookHeight;
        result.newY4 = bookHeight;
        result.r = 0;
        result.z0x = pageWidth;
        result.z0y = 0;
        result.z1x = pageWidth;
        result.z1y = bookHeight;
      } else {
        result.newX = pageWidth;
        result.newX1 = 0;
        result.newX2 = pageWidth;
        result.newX3 = pageWidth;
        result.newX4 = 0;
        result.newY = 0;
        result.newY1 = 0;
        result.newY2 = 0;
        result.newY3 = bookHeight;
        result.newY4 = bookHeight;
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
          result.newY = 0;
          result.newX = bookWidth;
          result.newX2 = 0;
          result.newX3 = 0;
          result.newX4 = 0;
          result.newY1 = 0;
          result.newY2 = 0;
          result.newY3 = 0;
        } else if (z0 === 1) {
          // bottom corner
          //u1y - u0y, u1x - u0x
          result.newX = bookWidth + u0x - u1x;
          result.newY = bookHeight + u0y - u1y;
          result.newX1 = 0;
          result.newY1 = bookHeight;
          result.newX2 = 0;
          result.newY2 = bookHeight;
          result.newX3 = result.newX2;
          result.newX4 = result.newX2;
          result.newY3 = result.newY2;
          result.newY4 = result.newY2;
        }
        else {
result.r=0;
          result.newY = 0;
          result.newX = bookWidth;
          result.newX1 = 0;
          result.newX2 = 0;
          result.newX3 = 0;
          result.newX4 = 0;
          result.newY1 = 0;
          result.newY2 = 0;
          result.newY3 = bookHeight;
          result.newY4 = bookHeight;
        }
      } else {
        result.newX = -pageWidth;
        result.newX1 = 0;
        result.newX2 = 0;
        result.newX3 = 0;
        result.newX4 = 0;
        result.newY = 0;
        result.newY1 = 0;
        result.newY2 = 0;
        result.newY3 = bookHeight;
        result.newY4 = bookHeight;
        result.r = 0;
        result.z0x = pageWidth;
        result.z0y = bookHeight;
        result.z1x = pageWidth;
        result.z1y = bookHeight;
      }
    }
  }

  //console.log(result);

  //for (let key in result) {
  // if (key === "display") continue;
  //result[key] = Math.round(result[key] * 100) / 100
  //}
  return result;
}

//http://www.sdmath.com/math/geometry/reflection_across_line.html
function reflectX(x, y, A, B, C) {
  return ((B * B - A * A) * x - 2 * A * B * y - 2 * A * C) / (A * A + B * B);
}

function reflectY(x, y, A, B, C) {
  return ((A * A - B * B) * y - 2 * A * B * x - 2 * B * C) / (A * A + B * B);
}

function dist(x1, y1, x2, y2, movement) {
  const x = x1 - x2;
  const y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}
