import React, { useState } from 'react';
// @ts-ignore
import ImgsViewer from 'react-images-viewer'
import { Photo } from 'models';


const ImageGallery: React.FunctionComponent<{ images: Photo[] }> = ({ images }) => {

    const [ currentImgIdx, updateCurrentImg ] = useState(-1);

    return (
        <>
        {images.map((img, idx) => {
                return <img
                    alt={img.name}
                    key={img.url}
                    src={`${process.env.REACT_APP_BACKEND_URL}/${img.url}`}
                    style={{ width: 100, height: 100, margin: 5 }}
                    onClick={() => {
                        console.log(idx)
                        updateCurrentImg(idx)
                    }}
                />
            })}

            <ImgsViewer
                imgs={images.map(i => ({ ...i, src: `${process.env.REACT_APP_BACKEND_URL}/${i.url}`}))}
                currImg={currentImgIdx}
                isOpen={currentImgIdx !== -1}
                onClickPrev={() => updateCurrentImg(currentImgIdx - 1)}
                onClickNext={() => updateCurrentImg(currentImgIdx + 1)}
                onClose={() => {updateCurrentImg(-1)}}
            />
        </>
    );
}

export default ImageGallery;