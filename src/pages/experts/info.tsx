import React, { useState } from 'react';
// @ts-ignore
import ImgsViewer from 'react-images-viewer'
import { VideoPreview, HoverIcon} from 'tools';
import { WrappedComponent, wrapper } from 'state';
import { User } from 'models';
import MediaForm from './mediaForm';
import ImageGallery from 'tools/ImagesGallery';

const Info: WrappedComponent<{user: User}> = ({ user }) => {
    const [ openForm, updateOpenForm ] = useState(false);

    return (
        <div style={{ display: 'flex'}}>
            {!openForm ? null : (
                <MediaForm user={user} close={() => {updateOpenForm(false)}}/>
            )}
            <HoverIcon style={{ alignSelf: 'center' }} icon="add" color='green' onClick={() => updateOpenForm(true)} size={38}/>
            <ImageGallery images={user.photos} />
            {user.videos.map((video, idx) => <VideoPreview video={video} key={idx}/>)}

        </div>
      )
}

export default wrapper(Info);