import React, { useState } from 'react';
// @ts-ignore
import ImgsViewer from 'react-images-viewer'
import { Photo } from 'models';


const ImageGallery: React.FunctionComponent<{ images: Photo[] }> = ({ images }) => {

    const [ currentImgIdx, updateCurrentImg ] = useState(0);

    return (
        <>
        {images.map((img, idx) => {
                return <img
                    alt={img.name}
                    key={img.url}
                    src={`http://localhost:1337/${img.url}`}
                    style={{ width: 100, height: 100, margin: 5 }}
                    onClick={() => {
                        updateCurrentImg(idx)
                    }}
                />
            })}

            <ImgsViewer
                imgs={images.map(i => ({ ...i, src: `http://localhost:1337/${i.url}`}))}
                currImg={currentImgIdx}
                isOpen={currentImgIdx !== 0}
                onClickPrev={() => updateCurrentImg(currentImgIdx - 1)}
                onClickNext={() => updateCurrentImg(currentImgIdx + 1)}
                onClose={() => {updateCurrentImg(0)}}
            />
        </>
    );
}

export default ImageGallery;