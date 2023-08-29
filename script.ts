function main() {
    renderHTML();
    uploadImage();
    detectImage();
}

main();

function detectImage() {
    document.querySelector('.button').addEventListener('click', () => {
        drawBox();
        appendText();
    });
}
function clearAllBoxes() {
    document.querySelector('.text').textContent = '';
    const boxList = document.querySelectorAll('.draw-box');
    if (boxList.length >= 0) {
        for (let i = 0; i < boxList.length; i++) {
            boxList[i].remove();
        }
    }
}
async function appendText() {
    const img = document.querySelector('.img') as HTMLImageElement;
    const model = await mobilenet.load();
    const classification = await model.classify(img);
    console.log(classification);
    for (let i = 0; i < classification.length; i++) {
        if (classification[i].probability >= 0.2) {
            document.querySelector('.text').textContent += ': ' + classification[i].className;
            break;
        }
    }
    showUploadButton();
}
async function drawBox() {
    disableDetectButton();
    const img = document.querySelector('.img') as HTMLImageElement;
    const model = await cocoSsd.load();
    const prediction = await model.detect(img);
    console.log(prediction);
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
                document.querySelector('.text').textContent = prediction[i].class;
            }
        }
    }
}

function uploadImage() {
    const uploadInput = document.getElementById('file') as HTMLInputElement;
    uploadInput.addEventListener('change', () => {
        clearAllBoxes();
        enableDetectButton();
        if (uploadInput.files && uploadInput.files[0]) {
            const img = document.querySelector('.img') as HTMLImageElement;
            img.src = URL.createObjectURL(uploadInput.files[0]);
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            }
            hideUploadButton();
        }
    });
}
function showUploadButton() {
    const button = document.querySelector('.button') as HTMLButtonElement;
    button.style.display = 'none';
    button.textContent = 'DETECT';
    (document.querySelector('.file') as HTMLElement).style.display = 'block';
}
function disableDetectButton() {
    const button = document.querySelector('.button') as HTMLButtonElement;
    button.textContent = 'Predicting...';
    button.disabled = true;
    button.style.backgroundColor = 'lightblue';
}
function enableDetectButton() {
    const button = document.querySelector('.button') as HTMLButtonElement;
    button.style.backgroundColor = 'dodgerblue';
    button.disabled = false;
}
function hideUploadButton() {
    (document.querySelector('.file') as HTMLElement).style.display = 'none';
    (document.querySelector('.button') as HTMLButtonElement).style.display = 'block';
}
function renderHTML() {
    const ui = `
        <section class='wrapper'>
            <div class='box-img'>
                <img src='' class='img' />
            </div>
            <div class='box-text'>
                <p class='text'></p>
            </div>
            <div class='box-button'>
                <button class='button'>DETECT</button>
                <label for='file' class='file'>
                    <input type='file' id='file' accept='image/*' />
                    Upload Image
                </label>
            </div>
        </section>
    `;
    document.getElementById('root').innerHTML = ui;
}
