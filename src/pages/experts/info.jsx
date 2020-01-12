import React, { useState } from 'react';
import ImgsViewer from 'react-images-viewer'
import ReactPlayer from 'react-player'
import { Overlay } from "@blueprintjs/core";

export default function Info(props){
    const { user } = props
    const [ currentImgIdx, updateCurrentImg ] = useState(0);
    const [ open, updateOpen ] = useState(false);
    const [ playingVideo, updateVideo ] = useState('');

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
            {user.videos.map((video, idx) => {
                return <img
                    alt={'video'}
                    key={video.url}
                    src={'/play-button.png'}
                    style={{ width: 100, height: 100, margin: 5 }}
                    onClick={() => {
                        updateVideo(`http://localhost:1337${video.url}`)
                    }}
                />
            })}
            <ImgsViewer
                imgs={images}
                currImg={currentImgIdx}
                isOpen={open}
                onClickPrev={() => updateCurrentImg(currentImgIdx - 1)}
                onClickNext={() => updateCurrentImg(currentImgIdx + 1)}
                onClose={() => {updateCurrentImg(0); updateOpen(false)}}
            />
            <Overlay isOpen={playingVideo !== ''} onClose={() => updateVideo('')}>
                <ReactPlayer
                    style={{
                        marginLeft: '25%',
                        marginTop: '10%',
                    }}
                    controls={true}
                    url={playingVideo}
                >
                </ReactPlayer>
            </Overlay>
        </>
      )
}