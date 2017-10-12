var dataModel = {
    carousels: {}
}

var carousel1 = {
    //selectedImage: {},
    carouselImages: [
        {
            imgMeta: "Image 1",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "Image 2",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "Image 3",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
        {
            imgMeta: "Image 4",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "Image 5",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "Image 6",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
        {
            imgMeta: "Image 7",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "Image 8",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "Image 9",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        }
    ],
    selectedImage: {}
}

var carousel2 = {
    //selectedImage: {},
    carouselImages: [
        {
            imgMeta: "Image 1",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "Image 2",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "Image 3",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
        {
            imgMeta: "Image 4",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "Image 5",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "Image 6",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        },
        {
            imgMeta: "Image 7",
            imgSrc: "IMG_20170528_121943718_HDR.jpg"
        },
        {
            imgMeta: "Image 8",
            imgSrc: "IMG_20170528_123943076_HDR.jpg"
        },
        {
            imgMeta: "Image 9",
            imgSrc: "IMG_20170528_124355086_HDR.jpg"
        }
    ],
    selectedImage: {}
}

dataModel.carousels = {carousel1: carousel1, carousel2: carousel2};
carousel1.selectedImage = carousel1.carouselImages[0];
carousel2.selectedImage = carousel2.carouselImages[2];


TEngine.init();
var bm = TEngine.createBindingModel(dataModel);
TEngine.bindModel(bm);