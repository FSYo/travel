// 创建地图
var map = L.map('map').setView([0, 0], 2); // 默认位置设置为(0, 0)，缩放级别为2

// 加载地图底图
L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=fe0d5c75-05be-425e-a147-61d7c4162184', {
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
  maxZoom: 20
}).addTo(map);

// 自定义标题控件
L.Control.Title = L.Control.extend({
  onAdd: function(map) {
    var div = L.DomUtil.create('div', 'map-title');
    div.innerHTML = '<h2>My Travel Map (After 2021)</h2>';
    return div;
  },
  onRemove: function(map) {
    // 没有需要移除的内容
  }
});

// 将自定义标题控件添加到地图
L.control.title = function(opts) {
  return new L.Control.Title(opts);
};

// 添加标题控件到右上角
L.control.title({ position: 'topright' }).addTo(map);

// 加载城市坐标和航线数据
async function loadCityCoordinates() {
  try {
    const response = await fetch('cities_coordinates.json');
    return await response.json();
  } catch (error) {
    console.error("无法加载城市坐标文件：", error);
    return {};
  }
}

async function loadRoutes() {
  try {
    const response = await fetch('routes.json');
    return await response.json();
  } catch (error) {
    console.error("无法加载航线数据：", error);
    return [];
  }
}

// 调用绘制航线函数
loadCityCoordinates().then(cityCoordinates => {
  loadRoutes().then(routes => {
    drawRoutes(cityCoordinates, routes);
  });
});

// 获取照片数据
function getphotoData() {
  return fetch('photo.json')
    .then(response => response.json())
    .then(data => {
      return data; // 返回所有城市的数据
    })
    .catch(error => {
      console.error('获取城市数据失败:', error);
      return {};
    });
}

// 创建自定义的红色偏粉的图钉图标，并调整大小
function createCustomMarker() {
  return L.divIcon({
    className: 'custom-icon', // 通过CSS样式应用图标
    html: '<div class="pin"></div>', // HTML元素作为图标
    iconSize: [10, 10], // 设置图标的大小（调整为更小）
    iconAnchor: [8, 20], // 设置锚点，保持标记位置在图标下方
    popupAnchor: [0, -20] // 设置弹出框的偏移
  });
}

// 初始化城市标记
function initializeCityMarkers(cityData) {
  for (let cityName in cityData) {
    const city = cityData[cityName];
    const coordinates = city.coordinates;
    const photoPath = city.photo;

    // 使用自定义的红色偏粉的图钉图标
    const customIcon = createCustomMarker();

    // 在地图上添加标记，并绑定点击事件
    L.marker(coordinates, { icon: customIcon }).addTo(map)
      .on('click', function () {
        // 调用 photo.js 中的 popPhoto 函数展示照片
        popPhoto(photoPath);
      });
  }
}

// 加载城市数据并初始化城市标记
getphotoData().then(cityData => {
  initializeCityMarkers(cityData);
});
