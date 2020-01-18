import React, { useState } from 'react';
import { Overlay, Icon } from "@blueprintjs/core";
import ReactPlayer from 'react-player'
import { Video } from 'models';
import { WrappedComponent, wrapper } from 'state';

const VideoPreview: WrappedComponent<{ video: Video, canDelete?: boolean }> = (props) => {
    const { video, canDelete, requests } = props;
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
            {!canDelete ? null: (
                <Icon
                    icon='delete'
                    style={{ position: 'absolute', left: 0,top: 0, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.6)'}}
                    onClick={() => {
                        requests.file.delete(video.id)
                    }}
                />
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

export default wrapper(VideoPreview);