// photo.js

// 显示多张照片的函数
function popPhoto(photoPaths) {
    if (!Array.isArray(photoPaths) || photoPaths.length === 0) {
        console.error("Invalid photo paths array.");
        return;
    }

    // 创建模态窗口的 HTML
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    modal.style.flexDirection = 'column';

    // 创建一个用于显示图片的容器
    const imageContainer = document.createElement('div');
    imageContainer.style.position = 'relative';
    imageContainer.style.display = 'flex';
    imageContainer.style.justifyContent = 'center';
    imageContainer.style.alignItems = 'center';
    imageContainer.style.flexDirection = 'column';

    // 创建图片元素并添加到容器
    const image = document.createElement('img');
    image.src = photoPaths[0]; // 初始显示第一张图片
    image.style.maxWidth = '90%';
    image.style.maxHeight = '90%';
    image.style.width = 'auto'; // 保证比例正确
    image.style.height = 'auto'; 

    image.style.border = '5px solid white';
    imageContainer.appendChild(image);

    // 创建图片索引文本
    const indexText = document.createElement('div');
    indexText.innerHTML = `1 / ${photoPaths.length}`;
    indexText.style.marginTop = '10px';
    indexText.style.fontSize = '18px';
    indexText.style.color = 'white';
    indexText.style.fontFamily = '"Pacifico", cursive';  // 花哨字体
    imageContainer.appendChild(indexText);

    // 创建切换图片的按钮
    const prevButton = document.createElement('button');
    prevButton.innerHTML = 'Previous';
    prevButton.style.position = 'absolute';
    prevButton.style.top = '50%';
    prevButton.style.left = '10px';
    prevButton.style.transform = 'translateY(-50%)';
    prevButton.style.backgroundColor = '#ADD8E6';  // 浅蓝色
    prevButton.style.border = 'none';
    prevButton.style.padding = '12px 24px';
    prevButton.style.color = 'white';
    prevButton.style.fontSize = '16px';
    prevButton.style.borderRadius = '12px';  // 圆角
    prevButton.style.cursor = 'pointer';
    prevButton.style.zIndex = '1001';
    prevButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    prevButton.style.fontFamily = '"Pacifico", cursive';  // 花哨字体

    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next';
    nextButton.style.position = 'absolute';
    nextButton.style.top = '50%';
    nextButton.style.right = '10px';
    nextButton.style.transform = 'translateY(-50%)';
    nextButton.style.backgroundColor = '#ADD8E6';  // 浅蓝色
    nextButton.style.border = 'none';
    nextButton.style.padding = '12px 24px';
    nextButton.style.color = 'white';
    nextButton.style.fontSize = '16px';
    nextButton.style.borderRadius = '12px';  // 圆角
    nextButton.style.cursor = 'pointer';
    nextButton.style.zIndex = '1001';
    nextButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    nextButton.style.fontFamily = '"Pacifico", cursive';  // 花哨字体

    let currentIndex = 0;

    // 显示上一张图片
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + photoPaths.length) % photoPaths.length;
        image.src = photoPaths[currentIndex];
        indexText.innerHTML = `${currentIndex + 1} / ${photoPaths.length}`;
    });

    // 显示下一张图片
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % photoPaths.length;
        image.src = photoPaths[currentIndex];
        indexText.innerHTML = `${currentIndex + 1} / ${photoPaths.length}`;
    });

    // 将按钮加入容器
    imageContainer.appendChild(prevButton);
    imageContainer.appendChild(nextButton);

    // 将容器加入模态窗口
    modal.appendChild(imageContainer);

    // 添加模态窗口到页面
    document.body.appendChild(modal);

    // 点击模态窗口关闭
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}
