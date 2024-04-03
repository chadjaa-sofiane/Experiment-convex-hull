import pointsContainer from "./pointsContainer.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const randomButton = document.getElementById("random_button");
const convexHullButton = document.getElementById("convex_hull_button");
const pointsNumberInput = document.getElementById("points_number_input");
const canvasContainer = document.getElementById("canvas_container");

canvas.width = canvasContainer.offsetWidth;
canvas.height = canvasContainer.offsetHeight;

let number = pointsNumberInput.value;

// a function to generate random points
const generateRandomPoints = (number) => {
  const points = [];
  for (let i = 0; i < number; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    points.push({ x, y, next: null, prev: null });
  }
  return points;
};

const Vector = (point1, point2) => {
  return {
    x: point2.x - point1.x,
    y: point2.y - point1.y,
  };
};

// return the magnitude of a vector
const magnitude = (vector) => {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
};

// return the angle between two vectors
const getAngle = (vector1, vector2) => {
  const num = vector1.x * vector2.x + vector1.y * vector2.y;
  const don = magnitude(vector1) * magnitude(vector2);
  return (Math.acos(num / don) * 180) / Math.PI;
};

// remove an element from an array
const removeElement = (arr, elem) => arr.filter((i) => i !== elem);

const convex_hull = (points, { mostBottomPoint }) => {
  if (points.length < 3) return;
  let u = mostBottomPoint(points);
  let min = Infinity;
  let v = null;
  const x = { x: canvas.width, y: u.y };

  // find the first point to relate to u
  for (const w of points) {
    if (w === u) continue;
    const angle = getAngle(Vector(x, u), Vector(u, w));
    if (angle < min) {
      min = angle;
      v = w;
    }
  }
  v.prev = u;
  u.next = v;
  let s = [...points];
  // // loop all untill reach the start point again
  while (v !== u) {
    s = removeElement(s, v);
    let _min = Infinity;
    for (const w of s) {
      const angle = getAngle(Vector(v.prev, v), Vector(v, w));
      if (angle < _min) {
        _min = angle;
        v.next = w;
      }
    }
    const prev = v;
    v = v.next;
    v.prev = prev;
  }
};

const convexHullContainer = pointsContainer(context);

convexHullContainer.setPoints(generateRandomPoints(number));
convexHullContainer.add(convex_hull);

randomButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  convexHullContainer.setPoints(generateRandomPoints(number));
});

pointsNumberInput.addEventListener("change", (e) => {
  if (e.target.value < 0) e.target.value = 0;
  number = e.target.value;
  context.clearRect(0, 0, canvas.width, canvas.height);
  convexHullContainer.setPoints(generateRandomPoints(number));
});

document.addEventListener("mousedown", (e) => {
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  const isOutOfCanvas = x < 0 || x > canvas.width || y < 0 || y > canvas.height;
  if (isOutOfCanvas) return;
  convexHullContainer.addPoint({ x, y });
  pointsNumberInput.value++;
  number++;
});

convexHullButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  convexHullContainer.fire();
  convexHullContainer.drawLines();
});
