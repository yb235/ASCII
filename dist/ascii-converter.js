"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASCIIConverter = void 0;
exports.testASCIIConversion = testASCIIConversion;
var jimp_1 = __importDefault(require("jimp"));
var path_1 = __importDefault(require("path"));
var ASCIIConverter = /** @class */ (function () {
    function ASCIIConverter(chars) {
        if (chars === void 0) { chars = ' .:-=+*#%@'; }
        this.chars = chars;
    }
    ASCIIConverter.prototype.convertImageToAscii = function (imagePath_1) {
        return __awaiter(this, arguments, void 0, function (imagePath, options) {
            var _a, width, height, _b, chars, image, aspectRatio, outputHeight, asciiArt, charArray, charCount, y, x, pixel, brightness, charIndex, error_1;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = options.width, width = _a === void 0 ? 80 : _a, height = options.height, _b = options.chars, chars = _b === void 0 ? this.chars : _b;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, jimp_1.default.read(imagePath)];
                    case 2:
                        image = _c.sent();
                        aspectRatio = image.bitmap.width / image.bitmap.height;
                        outputHeight = height || Math.floor(width / aspectRatio / 2);
                        // Resize image
                        image.resize(width, outputHeight);
                        // Convert to grayscale
                        image.greyscale();
                        asciiArt = '';
                        charArray = chars.split('');
                        charCount = charArray.length - 1;
                        for (y = 0; y < outputHeight; y++) {
                            for (x = 0; x < width; x++) {
                                pixel = jimp_1.default.intToRGBA(image.getPixelColor(x, y));
                                brightness = pixel.r;
                                charIndex = Math.floor((brightness / 255) * charCount);
                                asciiArt += charArray[charIndex];
                            }
                            asciiArt += '\n';
                        }
                        return [2 /*return*/, asciiArt];
                    case 3:
                        error_1 = _c.sent();
                        throw new Error("Failed to convert image to ASCII: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ASCIIConverter.prototype.invertColors = function (imagePath) {
        return __awaiter(this, void 0, void 0, function () {
            var image, timestamp, originalName, invertedImagePath, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, jimp_1.default.read(imagePath)];
                    case 1:
                        image = _a.sent();
                        image.invert();
                        timestamp = Date.now();
                        originalName = path_1.default.basename(imagePath, path_1.default.extname(imagePath));
                        invertedImagePath = "./inverted-".concat(originalName, "-").concat(timestamp, ".png");
                        return [4 /*yield*/, image.writeAsync(invertedImagePath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, invertedImagePath];
                    case 3:
                        error_2 = _a.sent();
                        throw new Error("Failed to invert image colors: ".concat(error_2 instanceof Error ? error_2.message : 'Unknown error'));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ASCIIConverter.prototype.enhanceContrast = function (imagePath_1) {
        return __awaiter(this, arguments, void 0, function (imagePath, level) {
            var image, timestamp, originalName, enhancedImagePath, error_3;
            if (level === void 0) { level = 0.5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, jimp_1.default.read(imagePath)];
                    case 1:
                        image = _a.sent();
                        image.contrast(level);
                        timestamp = Date.now();
                        originalName = path_1.default.basename(imagePath, path_1.default.extname(imagePath));
                        enhancedImagePath = "./enhanced-".concat(originalName, "-").concat(timestamp, ".png");
                        return [4 /*yield*/, image.writeAsync(enhancedImagePath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, enhancedImagePath];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error("Failed to enhance contrast: ".concat(error_3 instanceof Error ? error_3.message : 'Unknown error'));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ASCIIConverter.prototype.adjustBrightness = function (imagePath_1) {
        return __awaiter(this, arguments, void 0, function (imagePath, level) {
            var image, timestamp, originalName, brightImagePath, error_4;
            if (level === void 0) { level = 0.2; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, jimp_1.default.read(imagePath)];
                    case 1:
                        image = _a.sent();
                        image.brightness(level);
                        timestamp = Date.now();
                        originalName = path_1.default.basename(imagePath, path_1.default.extname(imagePath));
                        brightImagePath = "./bright-".concat(originalName, "-").concat(timestamp, ".png");
                        return [4 /*yield*/, image.writeAsync(brightImagePath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, brightImagePath];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error("Failed to adjust brightness: ".concat(error_4 instanceof Error ? error_4.message : 'Unknown error'));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ASCIIConverter;
}());
exports.ASCIIConverter = ASCIIConverter;
// Simple standalone function to test the image conversion
function testASCIIConversion() {
    return __awaiter(this, void 0, void 0, function () {
        var converter, imagePath, originalAscii, enhancedPath, enhancedAscii, invertedPath, invertedAscii, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    converter = new ASCIIConverter();
                    imagePath = './WIN_20250919_19_52_29_Pro.jpg';
                    console.log('🎨 ASCII Art Conversion Test');
                    console.log('='.repeat(60));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    // Test basic conversion
                    console.log('\n📸 Converting original image...');
                    return [4 /*yield*/, converter.convertImageToAscii(imagePath, { width: 120 })];
                case 2:
                    originalAscii = _a.sent();
                    console.log('\n✨ Original Image ASCII Art:');
                    console.log(originalAscii);
                    // Test with enhanced contrast
                    console.log('\n🔧 Enhancing contrast...');
                    return [4 /*yield*/, converter.enhanceContrast(imagePath, 0.7)];
                case 3:
                    enhancedPath = _a.sent();
                    return [4 /*yield*/, converter.convertImageToAscii(enhancedPath, { width: 120 })];
                case 4:
                    enhancedAscii = _a.sent();
                    console.log('\n🎯 Enhanced Contrast ASCII Art:');
                    console.log(enhancedAscii);
                    // Test with inverted colors
                    console.log('\n🔄 Inverting colors...');
                    return [4 /*yield*/, converter.invertColors(imagePath)];
                case 5:
                    invertedPath = _a.sent();
                    return [4 /*yield*/, converter.convertImageToAscii(invertedPath, { width: 120 })];
                case 6:
                    invertedAscii = _a.sent();
                    console.log('\n🎭 Inverted Colors ASCII Art:');
                    console.log(invertedAscii);
                    console.log('\n' + '='.repeat(60));
                    console.log('✅ ASCII art conversion completed successfully!');
                    return [3 /*break*/, 8];
                case 7:
                    error_5 = _a.sent();
                    console.error('❌ Error during conversion:', error_5);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    testASCIIConversion();
}
