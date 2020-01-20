import React, { useState } from 'react';
// @ts-ignore
import ImgsViewer from 'react-images-viewer'
import VideoPreview from 'tools/VideoPreview';
import HoverIcon from 'tools/HoverIcon';
import { WrappedComponent, wrapper } from 'state';
import { User } from 'models';
import MediaForm from './mediaForm';

const Info: WrappedComponent<{user: User}> = (props) => {
    const { user } = props
    const [ currentImgIdx, updateCurrentImg ] = useState(0);
    const [ open, updateOpen ] = useState(false);

    const [ openForm, updateOpenForm ] = useState(false);


    const images = user.photos.map(p => ({ src: `http://localhost:1337/${p.url}`, name: p.name }));

    return (
        <div style={{ display: 'flex'}}>
            {!openForm ? null : (
                <MediaForm user={user} close={() => {updateOpenForm(false)}}/>
            )}
            <HoverIcon style={{ alignSelf: 'center' }} icon="add" color='green' onClick={() => updateOpenForm(true)} size={38}/>
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
        </div>
      )
}

export default wrapper(Info);