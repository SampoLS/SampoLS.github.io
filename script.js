var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function main() {
    renderHTML();
    uploadImage();
    detectImage();
}
main();
function detectImage() {
    document.querySelector('.button').addEventListener('click', function () {
        drawBox();
        appendText();
    });
}
function clearAllBoxes() {
    document.querySelector('.text').textContent = '';
    var boxList = document.querySelectorAll('.draw-box');
    if (boxList.length >= 0) {
        for (var i = 0; i < boxList.length; i++) {
            boxList[i].remove();
        }
    }
}
function appendText() {
    return __awaiter(this, void 0, void 0, function () {
        var img, model, classification, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    img = document.querySelector('.img');
                    return [4 /*yield*/, mobilenet.load()];
                case 1:
                    model = _a.sent();
                    return [4 /*yield*/, model.classify(img)];
                case 2:
                    classification = _a.sent();
                    console.log(classification);
                    for (i = 0; i < classification.length; i++) {
                        if (classification[i].probability >= 0.2) {
                            document.querySelector('.text').textContent += ': ' + classification[i].className;
                            break;
                        }
                    }
                    showUploadButton();
                    return [2 /*return*/];
            }
        });
    });
}
function drawBox() {
    return __awaiter(this, void 0, void 0, function () {
        var img, model, prediction, i, _a, x, y, width, height, box;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    disableDetectButton();
                    img = document.querySelector('.img');
                    return [4 /*yield*/, cocoSsd.load()];
                case 1:
                    model = _b.sent();
                    return [4 /*yield*/, model.detect(img)];
                case 2:
                    prediction = _b.sent();
                    console.log(prediction);
                    for (i = 0; i < prediction.length; i++) {
                        if (prediction[i]) {
                            _a = prediction[i].bbox, x = _a[0], y = _a[1], width = _a[2], height = _a[3];
                            box = document.createElement('div');
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
                    return [2 /*return*/];
            }
        });
    });
}
function uploadImage() {
    var uploadInput = document.getElementById('file');
    uploadInput.addEventListener('change', function () {
        clearAllBoxes();
        enableDetectButton();
        if (uploadInput.files && uploadInput.files[0]) {
            var img_1 = document.querySelector('.img');
            img_1.src = URL.createObjectURL(uploadInput.files[0]);
            img_1.onload = function () {
                URL.revokeObjectURL(img_1.src);
            };
            hideUploadButton();
        }
    });
}
function showUploadButton() {
    document.querySelector('.file').style.display = 'block';
    document.querySelector('.button').style.display = 'none';
    document.querySelector('.button').textContent = 'DETECT';
}
function disableDetectButton() {
    var button = document.querySelector('.button');
    button.textContent = 'Predicting...';
    button.disabled = true;
    button.style.backgroundColor = 'lightblue';
}
function enableDetectButton() {
    var button = document.querySelector('.button');
    button.style.backgroundColor = 'dodgerblue';
    button.disabled = false;
}
function hideUploadButton() {
    document.querySelector('.file').style.display = 'none';
    document.querySelector('.button').style.display = 'block';
}
function renderHTML() {
    var ui = "\n        <section class='wrapper'>\n            <div class='box-img'>\n                <img src='' class='img' />\n            </div>\n            <div class='box-text'>\n                <p class='text'></p>\n            </div>\n            <div class='box-button'>\n                <button class='button'>DETECT</button>\n                <label for='file' class='file'>\n                    <input type='file' id='file' accept='image/*' />\n                    Upload Image\n                </label>\n            </div>\n        </section>\n    ";
    document.getElementById('root').innerHTML = ui;
}
