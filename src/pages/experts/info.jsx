import React, { useState } from 'react';
import ImgsViewer from 'react-images-viewer'
import VideoPreview from 'tools/VideoPreview';

export default function Info(props){
    const { user } = props
    const [ currentImgIdx, updateCurrentImg ] = useState(0);
    const [ open, updateOpen ] = useState(false);

    const images = user.photos.map(p => ({ src: `http://localhost:1337/${p.url}`}));

    return (
        <>
            {images.map((img, idx) => {
                return <img
                    alt={img.name}
                    key={img.src}
                    src={img.src}
                    style={{ width: 100, height: 100, margin: 5 }}
                    onClick={() => {
                        updateCurrentImg(idx)
                        updateOpen(true)
                    }}
                />
            })}
            {user.videos.map((video, idx) => <VideoPreview video={video} key={idx}/>)}
            <ImgsViewer
                imgs={images}
                currImg={currentImgIdx}
                isOpen={open}
                onClickPrev={() => updateCurrentImg(currentImgIdx - 1)}
                onClickNext={() => updateCurrentImg(currentImgIdx + 1)}
                onClose={() => {updateCurrentImg(0); updateOpen(false)}}
            />
        </>
      )
}