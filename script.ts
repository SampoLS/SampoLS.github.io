const button = document.querySelector('.button') as HTMLButtonElement;
const text = document.querySelector('.text');
const img = document.querySelector('.img') as HTMLImageElement;
const fileLabel = document.querySelector('.file') as HTMLInputElement;

function main() {
    uploadImage();
    detectImage();
}

main();

function detectImage() {
    button.addEventListener('click', () => {
        showBoxes();
        showText();
    });
}
function clearAllText() {
    text.textContent = '';
}
function clearAllBoxes() {
    const boxList = document.querySelectorAll('.draw-box');
    if (boxList.length >= 0) {
        for (let i = 0; i < boxList.length; i++) {
            boxList[i].remove();
        }
    }
}
function clear() {
    clearAllText();
    clearAllBoxes();
}
async function loadModel() {
    const model = await mobilenet.load();
    const classification = await model.classify(img);
    return classification;
}
function appendText(classification) {
    for (let i = 0; i < classification.length; i++) {
        if (classification[i].probability >= 0.6) {
            text.textContent += ': ' + classification[i].className;
            break;
        }
    }
}
async function showText() {
    const classification = await loadModel();
    appendText(classification);
    showUploadButton();
}
async function loadMobilenetModel() {
    const model = await cocoSsd.load();
    const prediction = await model.detect(img);
    return prediction;
}
function drawBoxes(prediction) {
    for (let i = 0; i < prediction.length; i++) {
        if (prediction[i]) {
            const [x, y, width, height] = prediction[i].bbox;
            const box = document.createElement('div');
            box.className = 'draw-box';
            box.style.position = 'absolute';
            box.style.border = '5px solid green';
            box.style.left = x.toFixed() + 'px';
            box.style.top = y.toFixed() + 'px';
            box.style.width = width.toFixed() + 'px';
            box.style.height = height.toFixed() + 'px';
            document.querySelector('.box-img').appendChild(box);
            if (prediction[i].score >= 0.9) {
                text.textContent = prediction[i].class;
            }
        }
    }
}
async function showBoxes() {
    disableDetectButtonWhenPredicting();
    const prediction = await loadMobilenetModel();
    drawBoxes(prediction);
}

function uploadImage() {
    const uploadInput = document.getElementById('file') as HTMLInputElement;
    uploadInput.addEventListener('change', () => {
        if (uploadInput.files && uploadInput.files[0]) {
            img.src = URL.createObjectURL(uploadInput.files[0]);
            img.onload = () => { URL.revokeObjectURL(img.src); }
            hideUploadButton();
        }
        clear();
        enableDetectButtonAfterUploadImage();
    });
}
function showUploadButton() {
    button.style.display = 'none';
    button.textContent = 'DETECT';
    fileLabel.style.display = 'block';
}
function hideUploadButton() {
    fileLabel.style.display = 'none';
    button.style.display = 'block';
}
function disableDetectButtonWhenPredicting() {
    button.textContent = 'PREDICTING...';
    button.disabled = true;
    button.style.backgroundColor = 'lightblue';
}
function enableDetectButtonAfterUploadImage() {
    button.style.backgroundColor = 'dodgerblue';
    button.disabled = false;
}
