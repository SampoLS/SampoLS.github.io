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
var button = document.querySelector('.button');
var text = document.querySelector('.text');
var img = document.querySelector('.img');
var fileLabel = document.querySelector('.file');
function main() {
    uploadImage();
    detectImage();
}
main();
function detectImage() {
    button.addEventListener('click', function () {
        showBoxes();
        showText();
    });
}
function clearAllText() {
    text.textContent = '';
}
function clearAllBoxes() {
    var boxList = document.querySelectorAll('.draw-box');
    if (boxList.length >= 0) {
        for (var i = 0; i < boxList.length; i++) {
            boxList[i].remove();
        }
    }
}
function clear() {
    clearAllText();
    clearAllBoxes();
}
function laodMobilenetLoad() {
    return __awaiter(this, void 0, void 0, function () {
        var model, classification;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mobilenet.load()];
                case 1:
                    model = _a.sent();
                    return [4 /*yield*/, model.classify(img)];
                case 2:
                    classification = _a.sent();
                    console.log(classification);
                    return [2 /*return*/, classification];
            }
        });
    });
}
function appendText(classification) {
    for (var i = 0; i < classification.length; i++) {
        if (classification[i].probability >= 0.2) {
            text.textContent += ': ' + classification[i].className;
            break;
        }
    }
}
function showText() {
    return __awaiter(this, void 0, void 0, function () {
        var classification;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, laodMobilenetLoad()];
                case 1:
                    classification = _a.sent();
                    appendText(classification);
                    showUploadButton();
                    return [2 /*return*/];
            }
        });
    });
}
function loadCocoModel() {
    return __awaiter(this, void 0, void 0, function () {
        var model, prediction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cocoSsd.load()];
                case 1:
                    model = _a.sent();
                    return [4 /*yield*/, model.detect(img)];
                case 2:
                    prediction = _a.sent();
                    return [2 /*return*/, prediction];
            }
        });
    });
}
function box(prediction) {
    var _a = prediction.bbox, x = _a[0], y = _a[1], width = _a[2], height = _a[3];
    var div = document.createElement('div');
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
    for (var i = 0; i < prediction.length; i++) {
        if (prediction[i]) {
            var div = box(prediction[i]);
            document.querySelector('.box-img').appendChild(div);
            if (prediction[i].score >= 0.85) {
                text.textContent += ' ' + prediction[i].class;
            }
        }
    }
}
function showBoxes() {
    return __awaiter(this, void 0, void 0, function () {
        var prediction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    disableDetectButtonWhenPredicting();
                    return [4 /*yield*/, loadCocoModel()];
                case 1:
                    prediction = _a.sent();
                    console.log(prediction);
                    drawBoxes(prediction);
                    return [2 /*return*/];
            }
        });
    });
}
function uploadImage() {
    var uploadInput = document.getElementById('file');
    uploadInput.addEventListener('change', function () {
        if (uploadInput.files && uploadInput.files[0]) {
            img.src = URL.createObjectURL(uploadInput.files[0]);
            img.onload = function () { URL.revokeObjectURL(img.src); };
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
