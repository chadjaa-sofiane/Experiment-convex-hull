// return refrence to the most bottom point
const mostBottomPoint = (points) => {
  return points.reduce((acc, point) => (point.y > acc.y ? point : acc), {
    y: -Infinity,
  });
};

// return refrence to the most top point
const mostTopPoint = (points) => {
  return points.reduce((acc, point) => (point.y < acc.y ? point : acc), {
    y: Infinity,
  });
};

const pointsContainer = (context) => {
  let points = [];
  let observers = new Set();

  const drawLine = (point1, point2) => {
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.stroke();
  };

  const drawLines = (context, canvas) => {
    points.forEach((point) => {
      if (point.next) {
        drawLine(point, point.next);
      }
    });
  };

  const setPoints = (newPoints) => {
    points = newPoints;
    drawPoints(points);
  };

  const addPoints = (newPoints) => {
    points = [...points, ...newPoints];
    drawPoints(points);
  };
  const addPoint = (point) => {
    points.push(point);
    drawPoints(points);
  };

  const add = (observer) => {
    observers.add(observer);
  };

  const remove = (observer) => {
    observers.delete(observer);
  };

  const drawPoints = (points) => {
    const leastPoint = mostBottomPoint(points);
    const mostTop = mostTopPoint(points);

    const getColor = (p) => {
      if (p === leastPoint) return "blue";
      if (p === mostTop) return "red";
      return "black";
    };

    for (const p of points) {
      context.beginPath();
      const { x, y } = p;
      const color = getColor(p);
      context.arc(x, y, 2, 0, 2 * Math.PI, true);
      // context.rect(x, y, 4, 4);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    }
  };

  const fire = () => {
    observers.forEach((observer) =>
      observer(points, { mostTopPoint, mostBottomPoint }),
    );
    drawPoints(points);
  };

  return {
    setPoints,
    addPoints,
    addPoint,
    add,
    remove,
    fire,
    drawLines,
  };
};

export default pointsContainer;
