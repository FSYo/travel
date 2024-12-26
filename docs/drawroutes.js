// 定义年份范围和颜色渐变的函数
function getRouteColor(year) {
    const maxYear = 2025; // 最大年份
    const minYear = 2020; // 最小年份
    const colorScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range(["#3B82F6", "#1E3A8A"]);
  
    return colorScale(year);
  }
  
function adjustForOtherSide(fromCoords, toCoords) {
const longitudeDiff = toCoords[1] - fromCoords[1];
if (longitudeDiff > 180) {
    fromCoords = [fromCoords[0], fromCoords[1] + 360];
} else if (longitudeDiff < -180) {
    toCoords = [toCoords[0], toCoords[1] + 360];
}
return { fromCoords, toCoords };
}

// 计算两点之间的距离（单位：千米）
function calculateDistance(fromCoords, toCoords) {
  const R = 6371; // 地球半径，单位为千米
  const lat1 = fromCoords[0] * Math.PI / 180;
  const lat2 = toCoords[0] * Math.PI / 180;
  const dlat = (toCoords[0] - fromCoords[0]) * Math.PI / 180;
  const dlng = (toCoords[1] - fromCoords[1]) * Math.PI / 180;

  const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dlng / 2) * Math.sin(dlng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 返回距离，单位：千米
}

// 获取航线偏移控制点
function getOffsetControlPoint(fromCoords, toCoords, offset) {
    const midPoint = [(fromCoords[0] + toCoords[0]) * 0.5, (fromCoords[1] + toCoords[1]) * 0.5];
    const dx = toCoords[0] - fromCoords[0];
    const dy = toCoords[1] - fromCoords[1];
    const length = Math.sqrt(dx * dx + dy * dy);
    const perpendicularUnitVector = [-dy / length, dx / length];
    const controlPoint = [
        midPoint[0] + perpendicularUnitVector[0] * offset,
        midPoint[1] + perpendicularUnitVector[1] * offset
    ];

    return controlPoint;
}

// 绘制航线
function drawRoutes(cityCoordinates, routes) {
  routes.forEach(city => {
    const fromCoords = cityCoordinates[city.from];
    const toCoords = cityCoordinates[city.to];

    // 调整终点坐标使其更接近起点
    const adjustedCoords = adjustForOtherSide(fromCoords, toCoords);
    const distance = calculateDistance(adjustedCoords.fromCoords, adjustedCoords.toCoords);
    const offset = Math.min((Math.log(distance) * 0.163) ** 8, 50);
    const color = getRouteColor(city.year);

    // 绘制曲线
    L.curve(
      ['M', adjustedCoords.fromCoords, 'Q', getOffsetControlPoint(adjustedCoords.fromCoords, adjustedCoords.toCoords, offset), adjustedCoords.toCoords],
      { color: color, weight: 0.5 + (city.year - 2021) * 0.3, opacity: 0.6 }
    ).addTo(map);

    // 在起点和终点绘制小点
    L.circleMarker(adjustedCoords.fromCoords, { color: 'red', weight: 0.2, radius: 2 }).addTo(map);
    L.circleMarker(adjustedCoords.toCoords, { color: 'red', weight: 0.2, radius: 2 }).addTo(map);
  });
}