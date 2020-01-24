import React, { useState } from 'react';
import { VideoPreview, HoverIcon} from 'tools';
import { WrappedComponent, wrapper } from 'state';
import { User } from 'models';
import MediaForm from './mediaForm';
import ImageGallery from 'tools/ImagesGallery';

const Info: WrappedComponent<{user: User | null }> = ({ user }) => {
    const [ openForm, updateOpenForm ] = useState(false);

    return (
        <div style={{ display: 'flex'}}>
            {!openForm ? null : (
                <>
                    {user ? <MediaForm user={user} close={() => {updateOpenForm(false)}}/> : null}
                </>
            )}
            <HoverIcon style={{ alignSelf: 'center' }} icon="add" color='green' onClick={() => updateOpenForm(true)} size={38}/>
            <ImageGallery images={user ? user.photos : []} />
            {user ? user.videos.map((video, idx) => <VideoPreview video={video} key={idx}/>) : null}

        </div>
      )
}

export default wrapper(Info);