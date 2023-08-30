const button = document.querySelector('.button') as HTMLButtonElement;
const text = document.querySelector('.text') as HTMLElement;
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
async function laodMobilenetLoad() {
    const model = await mobilenet.load();
    const classification = await model.classify(img);
    console.log(classification);
    return classification;
}
function appendText(classification) {
    for (let i = 0; i < classification.length; i++) {
        if (classification[i].probability >= 0.2) {
            text.textContent += ': ' + classification[i].className;
            break;
        }
    }
}
async function showText() {
    const classification = await laodMobilenetLoad();
    appendText(classification);
    showUploadButton();
}
async function loadCocoModel() {
    const model = await cocoSsd.load();
    const prediction = await model.detect(img);
    return prediction;
}
function box(prediction) {
    const [x, y, width, height] = prediction.bbox;
    const div = document.createElement('div');
    div.className = 'draw-box';
    div.style.position = 'absolute';
    div.style.border = '5px solid green';
    div.style.left = x.toFixed() + 'px';
    div.style.top = y.toFixed() + 'px';
    div.style.width = width.toFixed() + 'px';
    div.style.height = height.toFixed() + 'px';
    return div;
}
function drawBoxes(prediction) {
    for (let i = 0; i < prediction.length; i++) {
        if (prediction[i]) {
            const div = box(prediction[i]);
            document.querySelector('.box-img').appendChild(div);
            if (prediction[i].score >= 0.85) { text.textContent += ' ' + prediction[i].class; }
        }
    }
}
async function showBoxes() {
    disableDetectButtonWhenPredicting();
    const prediction = await loadCocoModel();
    console.log(prediction);
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
