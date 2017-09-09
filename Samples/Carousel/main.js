var dataModel = {
    carousels: {}
}

var carousel1 = {
    carouselImages: [
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
    ],
    selectedImage: {}
}

var carousel2 = {
    carouselImages: [
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "An Image",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
    ],
    selectedImage: {}
}

dataModel.carousels = {carousel1: carousel1, carousel2: carousel2};
carousel1.selectedImage = carousel1.carouselImages[0];
carousel2.selectedImage = carousel2.carouselImages[2];


TEngine.init();
var bm = TEngine.createBindingModel(dataModel);
TEngine.bindModel(bm);

// var carousel1 = bm.carousels().carousel1();
// for(var i = 0; i < carousel1.carouselImages().length; i++) {
//     carousel1.carouselImages()[i];
// }

//var carouselBm = bm.carousel();
//bm.currentImage(bm.carouselImages()[0]());

function selectThumbnail(tEngineObj) {
    var path = tEngineObj();
    //carouselBm.currentImage(path);
}

// function runCarousel() {
//     var curIndex = carousel.carouselImages.indexOf(carousel.currentImage);
//     if(curIndex == -1)
//         carouselBm.currentImage(carousel.carouselImages[0]);
//     else {
//         var nextIndex = (curIndex + 1) % carousel.carouselImages.length;
//         carouselBm.currentImage(carousel.carouselImages[nextIndex]);
//     }

//     setTimeout(function() {
//         runCarousel();
//     }, 5000);
// }

// runCarousel();