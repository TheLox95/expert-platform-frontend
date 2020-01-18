import React, { useState, useEffect } from 'react';
import { Overlay, Icon } from "@blueprintjs/core";
import ReactPlayer from 'react-player'
import { Video } from 'models';

const VideoPreview = (props: { video: Video, canClose?: boolean }) => {
    const { video, canClose } = props;
    const [ playingVideo, updateVideo ] = useState('');

    return (
        <>
        <div style={{ width: 100, height: 100, margin: 5, position: 'relative' }}>
            <img
                alt={video.name}
                key={video.id}
                src={'/play-button.png'}
                style={{ width: 100, height: 100 }}
                onClick={() => {
                    updateVideo(`http://localhost:1337${video.url}`);
                }}
            />
            {!canClose ? null: (
                <Icon icon='delete' style={{ position: 'absolute', left: 0,top: 0, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.6)'}}/>
            )} 
        </div>
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
    );

}

export default VideoPreview;